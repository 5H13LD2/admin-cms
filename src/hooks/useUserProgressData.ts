import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// User Progress Data Types (matching the backend structure)
export interface UserProgress {
  userId: string;
  username: string;
  email: string;
  status?: "online" | "offline";
  lastLogin?: any;
  coursesEnrolled?: number;
  coursesTaken?: string[];
  totalActivities: number;
  totalAttempts: number;
  overallPassRate: number;
  codingChallenges: {
    total: number;
    passed: number;
    passRate: number;
    attempts: number;
  };
  quizzes: {
    total: number;
    passed: number;
    passRate: number;
    averageScore: number;
  };
  createdAt: any;
}

export interface CodingChallenge {
  id: string;
  moduleId: string;
  challengeTitle: string;
  passed: boolean;
  bestScore: number;
  attempts: number;
  lastAttemptDate: any;
  statusText?: string;
  formattedLastAttemptDate?: string;
}

export interface QuizPerformance {
  id: string;
  quizId: string;
  courseName: string;
  averagePercentage: number;
  averageScore: number;
  highestPercentage: number;
  highestScore: number;
  latestPercentage: number;
  latestScore: number;
  totalAttempts: number;
  performanceLevel: "Excellent" | "Very Good" | "Good" | "Average" | "Needs Improvement";
  trend: "improving" | "declining" | "stable";
  latestPassed: boolean;
  lastAttemptTimestamp?: number;
}

export interface UserDashboardData {
  user: UserProgress;
  overallStats: {
    totalActivities: number;
    totalAttempts: number;
    overallPassRate: number;
    codingChallenges: {
      total: number;
      passed: number;
      passRate: number;
    };
    quizzes: {
      total: number;
      passed: number;
      passRate: number;
    };
  };
  codingChallenges: {
    data: CodingChallenge[];
    count: number;
    totalAttempts: number;
    passedChallenges: number;
  };
  quizPerformance: {
    data: QuizPerformance[];
    count: number;
    totalAttempts: number;
    passRate: number;
    averageScore: number;
  };
}

// Hook for fetching all users
export function useAllUsers() {
  const [users, setUsers] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/users`);
      const result = await response.json();

      if (result.success) {
        setUsers(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}

// Hook for searching a specific user
export function useSearchUser() {
  const [user, setUser] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUser = useCallback(async (query: string) => {
    if (!query || !query.trim()) {
      setError('Search query is required');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      setUser(null);

      const response = await fetch(
        `${API_BASE_URL}/users/search?query=${encodeURIComponent(query.trim())}`
      );
      const result = await response.json();

      if (result.success) {
        setUser(result.data);
        return result.data;
      } else {
        setError(result.message || 'User not found');
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

  const clearUser = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  return { user, loading, error, searchUser, clearUser };
}

// Hook for fetching user dashboard data
export function useUserDashboard(userId: string | null) {
  const [dashboard, setDashboard] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/users/${id}/dashboard`);
      const result = await response.json();

      if (result.success) {
        setDashboard(result.data);
      } else {
        setError(result.message || 'Failed to fetch user dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchDashboard(userId);
    } else {
      setDashboard(null);
    }
  }, [userId, fetchDashboard]);

  const clearDashboard = useCallback(() => {
    setDashboard(null);
    setError(null);
  }, []);

  return { dashboard, loading, error, refetch: fetchDashboard, clearDashboard };
}

// Combined hook for user progress page
export function useUserProgressPage() {
  const { users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useAllUsers();
  const { user: searchedUser, loading: searchLoading, error: searchError, searchUser, clearUser } = useSearchUser();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { dashboard, loading: dashboardLoading, error: dashboardError, clearDashboard } = useUserDashboard(selectedUserId);

  const handleSearch = useCallback(async (query: string) => {
    const foundUser = await searchUser(query);
    if (foundUser) {
      setSelectedUserId(foundUser.userId || foundUser.id);
    }
  }, [searchUser]);

  const handleClearSearch = useCallback(() => {
    clearUser();
    setSelectedUserId(null);
    clearDashboard();
  }, [clearUser, clearDashboard]);

  return {
    users,
    usersLoading,
    usersError,
    refetchUsers,
    searchedUser,
    searchLoading,
    searchError,
    handleSearch,
    handleClearSearch,
    selectedUserId,
    dashboard,
    dashboardLoading,
    dashboardError,
  };
}
