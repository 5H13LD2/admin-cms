import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Cache duration: 12 hours in milliseconds
const CACHE_DURATION = 12 * 60 * 60 * 1000;

// Local storage keys
const CACHE_KEYS = {
  STATS: 'dashboard_stats_cache',
  STATS_TIMESTAMP: 'dashboard_stats_timestamp',
  CHARTS: 'dashboard_charts_cache',
  CHARTS_TIMESTAMP: 'dashboard_charts_timestamp',
};

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
  technicalAssessments: {
    total: number;
    active: number;
    codeFixType: number;
    sqlQueryType: number;
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

// Helper function to check if cache is still valid
function isCacheValid(timestampKey: string): boolean {
  const timestamp = localStorage.getItem(timestampKey);
  if (!timestamp) return false;

  const cacheTime = parseInt(timestamp, 10);
  const now = Date.now();
  const timeDiff = now - cacheTime;

  return timeDiff < CACHE_DURATION;
}

// Helper function to get cached data
function getCachedData<T>(cacheKey: string, timestampKey: string): T | null {
  if (!isCacheValid(timestampKey)) return null;

  const cachedData = localStorage.getItem(cacheKey);
  if (!cachedData) return null;

  try {
    return JSON.parse(cachedData) as T;
  } catch {
    return null;
  }
}

// Helper function to save data to cache
function saveToCache<T>(cacheKey: string, timestampKey: string, data: T): void {
  try {
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(timestampKey, Date.now().toString());
  } catch (error) {
    console.error('Failed to save to cache:', error);
  }
}

// Helper function to get cache timestamp
function getCacheTimestamp(timestampKey: string): Date | null {
  const timestamp = localStorage.getItem(timestampKey);
  if (!timestamp) return null;
  return new Date(parseInt(timestamp, 10));
}

export function useDashboardStats(autoRefresh = false, refreshInterval = 30000) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [usingCache, setUsingCache] = useState(false);

  const fetchStats = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setUsingCache(false);

      // Check cache first unless force refresh
      if (!forceRefresh) {
        const cachedStats = getCachedData<DashboardStats>(
          CACHE_KEYS.STATS,
          CACHE_KEYS.STATS_TIMESTAMP
        );

        if (cachedStats) {
          setStats(cachedStats);
          setLastUpdated(getCacheTimestamp(CACHE_KEYS.STATS_TIMESTAMP));
          setUsingCache(true);
          setLoading(false);
          return;
        }
      }

      // Fetch from API
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
        setError(null);

        // Save to cache
        saveToCache(CACHE_KEYS.STATS, CACHE_KEYS.STATS_TIMESTAMP, result.data);
        setLastUpdated(new Date());
      } else {
        setError(result.message || 'Failed to fetch stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');

      // Try to use cached data even if expired on error
      const cachedStats = localStorage.getItem(CACHE_KEYS.STATS);
      if (cachedStats) {
        try {
          setStats(JSON.parse(cachedStats));
          setUsingCache(true);
        } catch {
          // Ignore parse errors
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Set up auto-refresh if enabled
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Only auto-refresh if cache is invalid
        if (!isCacheValid(CACHE_KEYS.STATS_TIMESTAMP)) {
          fetchStats();
        }
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [fetchStats, autoRefresh, refreshInterval]);

  const forceRefresh = useCallback(async () => {
    await fetchStats(true);
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
    forceRefresh,
    lastUpdated,
    usingCache
  };
}

export function useChartData(chartType: 'users-created' | 'leaderboard' | 'quiz-analytics' | 'course-progress' | 'achievements') {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = useCallback(async () => {
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
  }, [chartType]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  return { chartData, loading, error, refetch: fetchChartData };
}

export function useAllChartsData(autoRefresh = false, refreshInterval = 30000) {
  const [chartsData, setChartsData] = useState<AllChartsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [usingCache, setUsingCache] = useState(false);

  const fetchAllCharts = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setUsingCache(false);

      // Check cache first unless force refresh
      if (!forceRefresh) {
        const cachedCharts = getCachedData<AllChartsData>(
          CACHE_KEYS.CHARTS,
          CACHE_KEYS.CHARTS_TIMESTAMP
        );

        if (cachedCharts) {
          setChartsData(cachedCharts);
          setLastUpdated(getCacheTimestamp(CACHE_KEYS.CHARTS_TIMESTAMP));
          setUsingCache(true);
          setLoading(false);
          return;
        }
      }

      // Fetch from API
      const response = await fetch(`${API_BASE_URL}/dashboard/charts/all`);
      const result = await response.json();

      if (result.success) {
        setChartsData(result.data);
        setError(null);

        // Save to cache
        saveToCache(CACHE_KEYS.CHARTS, CACHE_KEYS.CHARTS_TIMESTAMP, result.data);
        setLastUpdated(new Date());
      } else {
        setError(result.message || 'Failed to fetch chart data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');

      // Try to use cached data even if expired on error
      const cachedCharts = localStorage.getItem(CACHE_KEYS.CHARTS);
      if (cachedCharts) {
        try {
          setChartsData(JSON.parse(cachedCharts));
          setUsingCache(true);
        } catch {
          // Ignore parse errors
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchAllCharts();

    // Set up auto-refresh if enabled
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Only auto-refresh if cache is invalid
        if (!isCacheValid(CACHE_KEYS.CHARTS_TIMESTAMP)) {
          fetchAllCharts();
        }
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [fetchAllCharts, autoRefresh, refreshInterval]);

  const forceRefresh = useCallback(async () => {
    await fetchAllCharts(true);
  }, [fetchAllCharts]);

  return {
    chartsData,
    loading,
    error,
    refetch: fetchAllCharts,
    forceRefresh,
    lastUpdated,
    usingCache
  };
}

// Utility function to manually clear all dashboard cache
export function clearDashboardCache(): void {
  localStorage.removeItem(CACHE_KEYS.STATS);
  localStorage.removeItem(CACHE_KEYS.STATS_TIMESTAMP);
  localStorage.removeItem(CACHE_KEYS.CHARTS);
  localStorage.removeItem(CACHE_KEYS.CHARTS_TIMESTAMP);
}

// Utility function to get cache info
export function getCacheInfo() {
  const statsTimestamp = getCacheTimestamp(CACHE_KEYS.STATS_TIMESTAMP);
  const chartsTimestamp = getCacheTimestamp(CACHE_KEYS.CHARTS_TIMESTAMP);

  return {
    stats: {
      cached: !!statsTimestamp,
      timestamp: statsTimestamp,
      valid: isCacheValid(CACHE_KEYS.STATS_TIMESTAMP),
    },
    charts: {
      cached: !!chartsTimestamp,
      timestamp: chartsTimestamp,
      valid: isCacheValid(CACHE_KEYS.CHARTS_TIMESTAMP),
    },
  };
}
