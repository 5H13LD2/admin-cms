import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Course Data Types (matching the backend and techlaunch structure)
export interface Course {
  id: string;
  title?: string;
  courseName?: string;
  description: string;
  difficulty?: string;
  language?: string;
  duration?: number;
  thumbnail?: string | null;
  status?: 'draft' | 'published' | 'active';
  enrolledUsers?: string[];
  enrolledStudents?: number;
  rating?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes?: number;
  totalLessons?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface CourseFormData {
  title?: string;
  courseName?: string;
  description: string;
  difficulty?: string;
  language?: string;
  duration?: number;
  thumbnail?: string;
  status?: 'draft' | 'published' | 'active';
}

// Hook for fetching all courses
export function useAllCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
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

// Hook for fetching a single course
export function useCourse(courseId: string | null) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/courses/${id}`);
      const result = await response.json();

      if (result.success) {
        setCourse(result.data);
      } else {
        setError(result.message || 'Failed to fetch course');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId);
    } else {
      setCourse(null);
    }
  }, [courseId, fetchCourse]);

  return { course, loading, error, refetch: fetchCourse };
}

// Hook for creating a course
export function useCreateCourse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCourse = useCallback(async (courseData: CourseFormData): Promise<Course | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to create course');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createCourse, loading, error };
}

// Hook for updating a course
export function useUpdateCourse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCourse = useCallback(async (courseId: string, courseData: Partial<CourseFormData>): Promise<Course | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to update course');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateCourse, loading, error };
}

// Hook for deleting a course
export function useDeleteCourse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCourse = useCallback(async (courseId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        return true;
      } else {
        setError(result.message || 'Failed to delete course');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteCourse, loading, error };
}

// Hook for fetching course modules
export function useCourseModules(courseId: string | null) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/courses/${id}/modules`);
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
    }
  }, [courseId, fetchModules]);

  return { modules, loading, error, refetch: fetchModules };
}

// Combined hook for courses page
export function useCoursesPage() {
  const { courses, loading: coursesLoading, error: coursesError, refetch } = useAllCourses();
  const { createCourse, loading: createLoading, error: createError } = useCreateCourse();
  const { updateCourse, loading: updateLoading, error: updateError } = useUpdateCourse();
  const { deleteCourse, loading: deleteLoading, error: deleteError } = useDeleteCourse();

  const handleCreateCourse = useCallback(async (courseData: CourseFormData) => {
    const result = await createCourse(courseData);
    if (result) {
      await refetch();
    }
    return result;
  }, [createCourse, refetch]);

  const handleUpdateCourse = useCallback(async (courseId: string, courseData: Partial<CourseFormData>) => {
    const result = await updateCourse(courseId, courseData);
    if (result) {
      await refetch();
    }
    return result;
  }, [updateCourse, refetch]);

  const handleDeleteCourse = useCallback(async (courseId: string) => {
    const result = await deleteCourse(courseId);
    if (result) {
      await refetch();
    }
    return result;
  }, [deleteCourse, refetch]);

  return {
    courses,
    coursesLoading,
    coursesError,
    refetch,
    handleCreateCourse,
    createLoading,
    createError,
    handleUpdateCourse,
    updateLoading,
    updateError,
    handleDeleteCourse,
    deleteLoading,
    deleteError,
  };
}
