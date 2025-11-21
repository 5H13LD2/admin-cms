import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BookOpen, Users, Award, TrendingUp, GraduationCap } from "lucide-react";
import { useDashboardStats, useAllChartsData } from "@/hooks/useDashboardData";
import { useMemo } from "react";

export default function Dashboard() {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { chartsData, loading: chartsLoading } = useAllChartsData();

  // Transform chart data for recharts format
  const usersCreatedData = useMemo(() => {
    if (!chartsData?.usersCreated) return [];
    return chartsData.usersCreated.labels.map((label, index) => ({
      month: label,
      users: chartsData.usersCreated.datasets[0].data[index]
    }));
  }, [chartsData]);

  const leaderboardData = useMemo(() => {
    if (!chartsData?.leaderboard) return [];
    return chartsData.leaderboard.labels.map((label, index) => ({
      username: label,
      score: chartsData.leaderboard.datasets[0].data[index]
    }));
  }, [chartsData]);

  const quizAnalyticsData = useMemo(() => {
    if (!chartsData?.quizAnalytics) return [];
    return chartsData.quizAnalytics.labels.map((label, index) => ({
      course: label,
      passRate: chartsData.quizAnalytics.datasets[0].data[index]
    }));
  }, [chartsData]);

  const courseProgressData = useMemo(() => {
    if (!chartsData?.courseProgress) return [];
    return chartsData.courseProgress.labels.map((label, index) => ({
      month: label,
      completionRate: chartsData.courseProgress.datasets[0].data[index]
    }));
  }, [chartsData]);

  const achievementsData = useMemo(() => {
    if (!chartsData?.achievements) return [];
    return chartsData.achievements.labels.map((label, index) => ({
      name: label,
      value: chartsData.achievements.datasets[0].data[index]
    }));
  }, [chartsData]);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.users.total || 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Courses",
      value: stats?.courses.total || 0,
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Enrollments",
      value: stats?.enrollments.active || 0,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Quizzes",
      value: stats?.quizzes.active || 0,
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Lessons",
      value: stats?.lessons.total || 0,
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (statsLoading || chartsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here's an overview of your platform.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`h-10 w-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Users Created Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Users Created (Last 12 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usersCreatedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  name="New Users"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leaderboard Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Users (Leaderboard)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leaderboardData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="username"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="score"
                  name="User Score"
                  fill="hsl(var(--secondary))"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quiz Analytics Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Pass Rates by Course</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quizAnalyticsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis
                  type="category"
                  dataKey="course"
                  width={120}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="passRate"
                  name="Pass Rate (%)"
                  fill="#22c55e"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Course Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Course Completion Rate (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={courseProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  name="Completion Rate (%)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Achievement Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={achievementsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {achievementsData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
