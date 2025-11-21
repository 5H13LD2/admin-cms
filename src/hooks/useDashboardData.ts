import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
  };
  courses: {
    total: number;
    published: number;
    draft: number;
  };
  enrollments: {
    total: number;
    active: number;
    completed: number;
  };
  modules: {
    total: number;
  };
  lessons: {
    total: number;
  };
  quizzes: {
    total: number;
    active: number;
  };
}

export interface ChartDataset {
  label: string;
  data: number[];
  details?: any[];
  total?: number;
  growth?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface AllChartsData {
  usersCreated: ChartData;
  leaderboard: ChartData;
  quizAnalytics: ChartData;
  courseProgress: ChartData;
  achievements: ChartData;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
        const result = await response.json();

        if (result.success) {
          setStats(result.data);
          setError(null);
        } else {
          setError(result.message || 'Failed to fetch stats');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useChartData(chartType: 'users-created' | 'leaderboard' | 'quiz-analytics' | 'course-progress' | 'achievements') {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/dashboard/charts/${chartType}`);
        const result = await response.json();

        if (result.success) {
          setChartData(result.data);
          setError(null);
        } else {
          setError(result.message || 'Failed to fetch chart data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [chartType]);

  return { chartData, loading, error };
}

export function useAllChartsData() {
  const [chartsData, setChartsData] = useState<AllChartsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllCharts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/dashboard/charts/all`);
        const result = await response.json();

        if (result.success) {
          setChartsData(result.data);
          setError(null);
        } else {
          setError(result.message || 'Failed to fetch chart data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAllCharts();
  }, []);

  return { chartsData, loading, error };
}
