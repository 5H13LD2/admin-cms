import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  IdCard,
  Calendar,
  BookOpen,
  FileDown,
  Code,
  GraduationCap,
  Trophy,
  Activity,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { UserProgress, CodingChallenge, QuizPerformance } from "@/data/dummyData";

interface UserDashboardProps {
  user: UserProgress;
  codingChallenges: CodingChallenge[];
  quizPerformance: QuizPerformance[];
}

export function UserDashboard({
  user,
  codingChallenges,
  quizPerformance,
}: UserDashboardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTrendIcon = (trend: "improving" | "declining" | "stable") => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPerformanceColor = (level: string) => {
    switch (level) {
      case "Excellent":
        return "bg-green-100 text-green-700 border-green-300";
      case "Very Good":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Good":
        return "bg-cyan-100 text-cyan-700 border-cyan-300";
      case "Average":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-red-100 text-red-700 border-red-300";
    }
  };

  const exportToJSON = () => {
    const data = {
      user,
      codingChallenges,
      quizPerformance,
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `user_dashboard_${user.userId}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    let csv = "Course Name,Quiz ID,Average %,Highest %,Latest %,Total Attempts,Performance Level,Trend\n";
    quizPerformance.forEach((quiz) => {
      csv += `"${quiz.courseName}","${quiz.quizId}",${quiz.averagePercentage.toFixed(1)},${quiz.highestPercentage.toFixed(1)},${quiz.latestPercentage.toFixed(1)},${quiz.totalAttempts},"${quiz.performanceLevel}","${quiz.trend}"\n`;
    });

    const dataBlob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `user_quiz_performance_${user.userId}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{user.username}</CardTitle>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IdCard className="h-4 w-4" />
                    <span>UID: {user.userId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <span className="text-sm text-muted-foreground">Joined</span>
              <div className="font-semibold">{formatDate(user.createdAt)}</div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Courses Enrolled</span>
              <div className="font-semibold">{user.coursesEnrolled}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Overall Statistics
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{user.totalActivities}</div>
                  <div className="text-xs text-muted-foreground">Total Activities</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-3">
                  <RotateCcw className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{user.totalAttempts}</div>
                  <div className="text-xs text-muted-foreground">Total Attempts</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-3">
                  <Code className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{user.codingChallenges.passRate}%</div>
                  <div className="text-xs text-muted-foreground">Coding Pass Rate</div>
                  <div className="text-xs text-muted-foreground">
                    {user.codingChallenges.passed}/{user.codingChallenges.total} passed
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-yellow-100 p-3">
                  <GraduationCap className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{user.quizzes.passRate}%</div>
                  <div className="text-xs text-muted-foreground">Quiz Pass Rate</div>
                  <div className="text-xs text-muted-foreground">
                    {user.quizzes.passed}/{user.quizzes.total} passed
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/20 p-3">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{user.overallPassRate}%</div>
                  <div className="text-xs opacity-90">Overall Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Coding Challenges */}
      <div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Coding Challenges
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">{codingChallenges.length} Challenges</Badge>
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  {codingChallenges.filter((c) => c.passed).length} Passed
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {codingChallenges.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No coding challenges attempted yet
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {codingChallenges.map((challenge) => (
                  <Card key={challenge.id} className="border-l-4" style={{
                    borderLeftColor: challenge.passed ? "#22c55e" : "#ef4444"
                  }}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{challenge.challengeTitle}</CardTitle>
                        {challenge.passed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-muted rounded p-2">
                          <div className="text-sm font-bold">{challenge.bestScore}</div>
                          <div className="text-xs text-muted-foreground">Best Score</div>
                        </div>
                        <div className="bg-muted rounded p-2">
                          <div className="text-sm font-bold">{challenge.attempts}</div>
                          <div className="text-xs text-muted-foreground">Attempts</div>
                        </div>
                        <div className="bg-muted rounded p-2">
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDate(challenge.lastAttemptDate)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quiz Performance */}
      <div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Quiz Performance
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportToJSON}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export JSON
                </Button>
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {quizPerformance.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No quizzes attempted yet
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-3 text-left text-sm font-semibold">Course</th>
                        <th className="p-3 text-left text-sm font-semibold">Quiz ID</th>
                        <th className="p-3 text-center text-sm font-semibold">Avg Score</th>
                        <th className="p-3 text-center text-sm font-semibold">Highest</th>
                        <th className="p-3 text-center text-sm font-semibold">Latest</th>
                        <th className="p-3 text-center text-sm font-semibold">Attempts</th>
                        <th className="p-3 text-left text-sm font-semibold">Performance</th>
                        <th className="p-3 text-center text-sm font-semibold">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {quizPerformance.map((quiz) => (
                        <tr key={quiz.id} className="hover:bg-muted/30">
                          <td className="p-3">{quiz.courseName}</td>
                          <td className="p-3">
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {quiz.quizId}
                            </code>
                          </td>
                          <td className="p-3 text-center font-semibold">
                            {quiz.averagePercentage.toFixed(1)}%
                          </td>
                          <td className="p-3 text-center">{quiz.highestPercentage.toFixed(1)}%</td>
                          <td className="p-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span>{quiz.latestPercentage.toFixed(1)}%</span>
                              <Badge
                                variant="outline"
                                className={
                                  quiz.latestPassed
                                    ? "bg-green-100 text-green-700 border-green-300"
                                    : "bg-red-100 text-red-700 border-red-300"
                                }
                              >
                                {quiz.latestPassed ? "Passed" : "Failed"}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-3 text-center">{quiz.totalAttempts}</td>
                          <td className="p-3">
                            <Badge variant="outline" className={getPerformanceColor(quiz.performanceLevel)}>
                              {quiz.performanceLevel}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center">{getTrendIcon(quiz.trend)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
