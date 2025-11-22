import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Module Data Types
export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order?: number;
  estimatedMinutes?: number;
  totalLessons?: number;
  status?: 'active' | 'inactive';
  createdAt?: any;
  updatedAt?: any;
}

export interface ModuleFormData {
  title: string;
  description: string;
  courseId: string;
  order?: number;
  estimatedMinutes?: number;
  status?: 'active' | 'inactive';
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
  const [modules, setModules] = useState<Module[]>([]);
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

// Hook for fetching all modules
export function useAllModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch modules from all courses
      const coursesResponse = await fetch(`${API_BASE_URL}/courses`);
      const coursesResult = await coursesResponse.json();

      if (!coursesResult.success) {
        throw new Error(coursesResult.message || 'Failed to fetch courses');
      }

      const courses = coursesResult.data || [];
      const allModules: Module[] = [];

      // Fetch modules for each course
      for (const course of courses) {
        const modulesResponse = await fetch(`${API_BASE_URL}/courses/${course.id}/modules`);
        const modulesResult = await modulesResponse.json();

        if (modulesResult.success) {
          const courseModules = (modulesResult.data || []).map((mod: any) => ({
            ...mod,
            courseId: course.id,
            courseName: course.title || course.courseName,
          }));
          allModules.push(...courseModules);
        }
      }

      setModules(allModules);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return { modules, loading, error, refetch: fetchModules };
}

// Hook for creating a module
export function useCreateModule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createModule = useCallback(async (moduleData: ModuleFormData): Promise<Module | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/courses/${moduleData.courseId}/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moduleData),
      });

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to create module');
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

  return { createModule, loading, error };
}

// Hook for updating a module
export function useUpdateModule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateModule = useCallback(async (moduleId: string, courseId: string, moduleData: Partial<ModuleFormData>): Promise<Module | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/modules/${moduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moduleData),
      });

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to update module');
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

  return { updateModule, loading, error };
}

// Hook for deleting a module
export function useDeleteModule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteModule = useCallback(async (moduleId: string, courseId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/modules/${moduleId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        return true;
      } else {
        setError(result.message || 'Failed to delete module');
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

  return { deleteModule, loading, error };
}

// Combined hook for modules page with filters
export function useModulesPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { modules: allModules, loading: allModulesLoading, error: allModulesError, refetch: refetchAll } = useAllModules();
  const { modules: courseModules, loading: courseModulesLoading, error: courseModulesError, refetch: refetchCourse } = useModulesByCourse(
    selectedCourseId || null
  );

  const { createModule, loading: createLoading, error: createError } = useCreateModule();
  const { updateModule, loading: updateLoading, error: updateError } = useUpdateModule();
  const { deleteModule, loading: deleteLoading, error: deleteError } = useDeleteModule();

  // Use filtered modules if course is selected, otherwise all modules
  const modules = selectedCourseId ? courseModules : allModules;
  const modulesLoading = selectedCourseId ? courseModulesLoading : allModulesLoading;
  const modulesError = selectedCourseId ? courseModulesError : allModulesError;

  const handleCreateModule = useCallback(async (moduleData: ModuleFormData) => {
    const result = await createModule(moduleData);
    if (result) {
      await refetchAll();
      if (selectedCourseId) {
        await refetchCourse(selectedCourseId);
      }
    }
    return result;
  }, [createModule, refetchAll, refetchCourse, selectedCourseId]);

  const handleUpdateModule = useCallback(async (moduleId: string, courseId: string, moduleData: Partial<ModuleFormData>) => {
    const result = await updateModule(moduleId, courseId, moduleData);
    if (result) {
      await refetchAll();
      if (selectedCourseId) {
        await refetchCourse(selectedCourseId);
      }
    }
    return result;
  }, [updateModule, refetchAll, refetchCourse, selectedCourseId]);

  const handleDeleteModule = useCallback(async (moduleId: string, courseId: string) => {
    const result = await deleteModule(moduleId, courseId);
    if (result) {
      await refetchAll();
      if (selectedCourseId) {
        await refetchCourse(selectedCourseId);
      }
    }
    return result;
  }, [deleteModule, refetchAll, refetchCourse, selectedCourseId]);

  // Calculate statistics
  const totalModules = modules.length;
  const activeModules = modules.filter((m) => m.status === 'active').length;
  const totalLessons = modules.reduce((acc, mod) => acc + (mod.totalLessons || 0), 0);
  const totalDuration = modules.reduce((acc, mod) => acc + (mod.estimatedMinutes || 0), 0);

  return {
    courses,
    coursesLoading,
    coursesError,
    modules,
    modulesLoading,
    modulesError,
    selectedCourseId,
    setSelectedCourseId,
    handleCreateModule,
    createLoading,
    createError,
    handleUpdateModule,
    updateLoading,
    updateError,
    handleDeleteModule,
    deleteLoading,
    deleteError,
    totalModules,
    activeModules,
    totalLessons,
    totalDuration,
  };
}
