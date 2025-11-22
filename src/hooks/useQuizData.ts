import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Quiz Data Types (matching techlaunch structure)
export interface Quiz {
  id: string;
  courseId?: string;
  module_id: string;
  moduleId?: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  difficulty?: 'EASY' | 'NORMAL' | 'HARD';
  explanation?: string;
  order?: number;
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

// Hook for fetching quizzes by course ID (with optional module filter)
export function useQuizzesByCourse(courseId: string | null, moduleId: string | null) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzes = useCallback(async (cId: string, mId: string | null = null) => {
    try {
      setLoading(true);
      setError(null);

      // Build URL with optional module filter
      const url = mId && mId !== 'all'
        ? `${API_BASE_URL}/courses/${cId}/quizzes?module=${mId}`
        : `${API_BASE_URL}/courses/${cId}/quizzes`;

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setQuizzes(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch quizzes');
        setQuizzes([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchQuizzes(courseId, moduleId);
    } else {
      setQuizzes([]);
      setError(null);
    }
  }, [courseId, moduleId, fetchQuizzes]);

  return { quizzes, loading, error, refetch: fetchQuizzes };
}

// Hook for creating a quiz
export function useCreateQuiz() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createQuiz = useCallback(async (courseId: string, quizData: Omit<Quiz, 'id' | 'createdAt'>): Promise<Quiz | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to create quiz');
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

  return { createQuiz, loading, error };
}

// Hook for updating a quiz
export function useUpdateQuiz() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateQuiz = useCallback(async (courseId: string, quizId: string, quizData: Partial<Quiz>): Promise<Quiz | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/quizzes/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to update quiz');
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

  return { updateQuiz, loading, error };
}

// Hook for deleting a quiz
export function useDeleteQuiz() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteQuiz = useCallback(async (courseId: string, quizId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/quizzes/${quizId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        return true;
      } else {
        setError(result.message || 'Failed to delete quiz');
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

  return { deleteQuiz, loading, error };
}

// Combined hook for quizzes page with filters
export function useQuizzesPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('all');

  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { modules, loading: modulesLoading, error: modulesError } = useModulesByCourse(
    selectedCourseId || null
  );
  const { quizzes, loading: quizzesLoading, error: quizzesError, refetch } = useQuizzesByCourse(
    selectedCourseId || null,
    selectedModuleId
  );

  // Filter quizzes by module (client-side filtering as fallback)
  const filteredQuizzes = quizzes.filter((quiz) => {
    if (!selectedModuleId || selectedModuleId === 'all') return true;
    return quiz.module_id === selectedModuleId || quiz.moduleId === selectedModuleId;
  });

  // Calculate statistics
  const totalQuizzes = filteredQuizzes.length;
  const easyQuizzes = filteredQuizzes.filter((q) => q.difficulty === 'EASY').length;
  const normalQuizzes = filteredQuizzes.filter((q) => q.difficulty === 'NORMAL').length;
  const hardQuizzes = filteredQuizzes.filter((q) => q.difficulty === 'HARD').length;

  return {
    courses,
    coursesLoading,
    coursesError,
    modules,
    modulesLoading,
    modulesError,
    quizzes: filteredQuizzes,
    allQuizzes: quizzes,
    quizzesLoading,
    quizzesError,
    refetch,
    selectedCourseId,
    setSelectedCourseId,
    selectedModuleId,
    setSelectedModuleId,
    totalQuizzes,
    easyQuizzes,
    normalQuizzes,
    hardQuizzes,
  };
}
