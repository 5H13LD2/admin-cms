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

// Pagination info type
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Hook for fetching quizzes by course ID (with optional module filter and pagination)
export function useQuizzesByCourse(courseId: string | null, moduleId: string | null, limit: number = 10, page: number = 1) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzes = useCallback(async (cId: string, mId: string | null = null, lmt: number = 10, pg: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Build URL with optional module filter and pagination
      const params = new URLSearchParams();
      if (mId && mId !== 'all') {
        params.append('module', mId);
      }
      params.append('limit', String(lmt));
      params.append('page', String(pg));

      const url = `${API_BASE_URL}/courses/${cId}/quizzes?${params.toString()}`;

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setQuizzes(result.data || []);
        setPagination(result.pagination || null);
      } else {
        setError(result.message || 'Failed to fetch quizzes');
        setQuizzes([]);
        setPagination(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setQuizzes([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchQuizzes(courseId, moduleId, limit, page);
    } else {
      setQuizzes([]);
      setPagination(null);
      setError(null);
    }
  }, [courseId, moduleId, limit, page, fetchQuizzes]);

  return { quizzes, pagination, loading, error, refetch: fetchQuizzes };
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

// Combined hook for quizzes page with filters and pagination
export function useQuizzesPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageLimit] = useState<number>(10); // Fixed at 10 per page

  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { modules, loading: modulesLoading, error: modulesError } = useModulesByCourse(
    selectedCourseId || null
  );
  const { quizzes, pagination, loading: quizzesLoading, error: quizzesError, refetch } = useQuizzesByCourse(
    selectedCourseId || null,
    selectedModuleId,
    pageLimit,
    currentPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCourseId, selectedModuleId]);

  // Calculate statistics from current page (since we're paginating on server)
  const totalQuizzes = pagination?.totalCount || quizzes.length;
  const easyQuizzes = quizzes.filter((q) => q.difficulty === 'EASY').length;
  const normalQuizzes = quizzes.filter((q) => q.difficulty === 'NORMAL').length;
  const hardQuizzes = quizzes.filter((q) => q.difficulty === 'HARD').length;

  return {
    courses,
    coursesLoading,
    coursesError,
    modules,
    modulesLoading,
    modulesError,
    quizzes,
    pagination,
    quizzesLoading,
    quizzesError,
    refetch,
    selectedCourseId,
    setSelectedCourseId,
    selectedModuleId,
    setSelectedModuleId,
    currentPage,
    setCurrentPage,
    totalQuizzes,
    easyQuizzes,
    normalQuizzes,
    hardQuizzes,
  };
}
