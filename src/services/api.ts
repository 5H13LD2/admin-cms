// API Configuration and Service
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Generic API error class
export class APIError extends Error {
  constructor(public message: string, public status?: number, public data?: any) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.message || 'An error occurred',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Network error occurred');
  }
}

// Course Types
export interface Course {
  id: string;
  courseId?: string;
  title: string;
  courseName?: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  duration: number;
  thumbnail?: string | null;
  enrolledUsers?: string[];
  enrolledStudents?: number;
  rating?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Module {
  id: string;
  moduleId?: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  totalLessons: number;
  isUnlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  difficulty?: string;
  language?: string;
  duration?: number;
  thumbnail?: string;
  status?: string;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {}

// Course API Service
export const courseAPI = {
  // Get all courses
  getAllCourses: async (): Promise<{ success: boolean; data: Course[]; count: number }> => {
    return fetchAPI('/courses');
  },

  // Get course by ID
  getCourseById: async (id: string): Promise<{ success: boolean; data: Course }> => {
    return fetchAPI(`/courses/${id}`);
  },

  // Create new course
  createCourse: async (courseData: CreateCourseData): Promise<{ success: boolean; message: string; data: Course }> => {
    return fetchAPI('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  // Update course
  updateCourse: async (id: string, updateData: UpdateCourseData): Promise<{ success: boolean; message: string; data: Course }> => {
    return fetchAPI(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete course
  deleteCourse: async (id: string): Promise<{ success: boolean; message: string }> => {
    return fetchAPI(`/courses/${id}`, {
      method: 'DELETE',
    });
  },

  // Get course modules
  getCourseModules: async (id: string): Promise<{ success: boolean; data: Module[] }> => {
    return fetchAPI(`/courses/${id}/modules`);
  },
};

// Module API Service
export const moduleAPI = {
  // Get all modules
  getAllModules: async (): Promise<{ success: boolean; data: Module[] }> => {
    return fetchAPI('/modules');
  },

  // Get module by ID
  getModuleById: async (id: string): Promise<{ success: boolean; data: Module }> => {
    return fetchAPI(`/modules/${id}`);
  },

  // Create new module
  createModule: async (moduleData: Partial<Module>): Promise<{ success: boolean; message: string; data: Module }> => {
    return fetchAPI('/modules', {
      method: 'POST',
      body: JSON.stringify(moduleData),
    });
  },

  // Update module
  updateModule: async (id: string, updateData: Partial<Module>): Promise<{ success: boolean; message: string; data: Module }> => {
    return fetchAPI(`/modules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete module
  deleteModule: async (id: string): Promise<{ success: boolean; message: string }> => {
    return fetchAPI(`/modules/${id}`, {
      method: 'DELETE',
    });
  },
};

// Export all
export default {
  courseAPI,
  moduleAPI,
};
