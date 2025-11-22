import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Lesson Data Types (matching techlaunch structure)
export interface Lesson {
  id: string;
  moduleId: string;
  courseId?: string;
  title: string;
  content?: string;
  description?: string;
  estimatedMinutes?: number;
  duration?: number;
  order?: number;
  videoUrl?: string;
  completed?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

// Hook for fetching courses (for course filter)
export function useCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/courses`);
      const result = await response.json();

      if (result.success) {
        setCourses(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch courses');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, error, refetch: fetchCourses };
}

// Hook for fetching modules by course ID
export function useModulesByCourse(courseId: string | null) {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = useCallback(async (cId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/courses/${cId}/modules`);
      const result = await response.json();

      if (result.success) {
        setModules(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch modules');
        setModules([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setModules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchModules(courseId);
    } else {
      setModules([]);
      setError(null);
    }
  }, [courseId, fetchModules]);

  return { modules, loading, error, refetch: fetchModules };
}

// Hook for fetching lessons by module ID
export function useLessonsByModule(courseId: string | null, moduleId: string | null) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = useCallback(async (cId: string, mId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/courses/${cId}/modules/${mId}/lessons`);
      const result = await response.json();

      if (result.success) {
        setLessons(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch lessons');
        setLessons([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (courseId && moduleId) {
      fetchLessons(courseId, moduleId);
    } else {
      setLessons([]);
      setError(null);
    }
  }, [courseId, moduleId, fetchLessons]);

  return { lessons, loading, error, refetch: fetchLessons };
}

// Hook for fetching a single lesson by ID
export function useLesson(lessonId: string | null) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLesson = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/lessons/${id}`);
      const result = await response.json();

      if (result.success) {
        setLesson(result.data);
      } else {
        setError(result.message || 'Failed to fetch lesson');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (lessonId) {
      fetchLesson(lessonId);
    } else {
      setLesson(null);
    }
  }, [lessonId, fetchLesson]);

  return { lesson, loading, error, refetch: fetchLesson };
}

// Combined hook for lessons page with filters
export function useLessonsPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { modules, loading: modulesLoading, error: modulesError } = useModulesByCourse(
    selectedCourseId || null
  );
  const { lessons, loading: lessonsLoading, error: lessonsError, refetch } = useLessonsByModule(
    selectedCourseId || null,
    selectedModuleId || null
  );

  // Filter lessons by search term
  const filteredLessons = lessons.filter((lesson) => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    return (
      lesson.title.toLowerCase().includes(search) ||
      (lesson.content && lesson.content.toLowerCase().includes(search)) ||
      (lesson.description && lesson.description.toLowerCase().includes(search))
    );
  });

  // Calculate statistics
  const totalLessons = filteredLessons.length;
  const totalDuration = filteredLessons.reduce(
    (acc, lesson) => acc + (lesson.estimatedMinutes || lesson.duration || 0),
    0
  );
  const completedLessons = filteredLessons.filter((l) => l.completed).length;

  return {
    courses,
    coursesLoading,
    coursesError,
    modules,
    modulesLoading,
    modulesError,
    lessons: filteredLessons,
    allLessons: lessons,
    lessonsLoading,
    lessonsError,
    refetch,
    selectedCourseId,
    setSelectedCourseId,
    selectedModuleId,
    setSelectedModuleId,
    searchTerm,
    setSearchTerm,
    totalLessons,
    totalDuration,
    completedLessons,
  };
}
