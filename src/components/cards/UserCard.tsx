import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Activity,
  TrendingUp,
} from "lucide-react";
import type { UserProgress } from "@/hooks/useUserProgressData";

interface UserCardProps {
  user: UserProgress;
}

export function UserCard({ user }: UserCardProps) {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";

    let date: Date;
    if (timestamp._seconds) {
      date = new Date(timestamp._seconds * 1000);
    } else if (timestamp.toDate) {
      date = timestamp.toDate();
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLastLoginText = (lastLogin?: any) => {
    if (!lastLogin) return "Never";

    let lastLoginDate: Date;
    if (lastLogin._seconds) {
      lastLoginDate = new Date(lastLogin._seconds * 1000);
    } else if (lastLogin.toDate) {
      lastLoginDate = lastLogin.toDate();
    } else {
      lastLoginDate = new Date(lastLogin);
    }

    const now = new Date();
    const diffMs = now.getTime() - lastLoginDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 15) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user.username}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`h-2 w-2 rounded-full ${
                    user.status === "online"
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-400"
                  }`}
                />
                <span className="text-xs text-muted-foreground">
                  {user.status === "online" ? "Online" : getLastLoginText(user.lastLogin)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* User Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t">
          <div className="text-center p-2 bg-muted/50 rounded-md">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BookOpen className="h-3 w-3 text-primary" />
              <span className="text-xs text-muted-foreground">Courses</span>
            </div>
            <div className="text-lg font-bold">
              {user.coursesEnrolled || user.coursesTaken?.length || 0}
            </div>
          </div>

          <div className="text-center p-2 bg-muted/50 rounded-md">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Activity className="h-3 w-3 text-primary" />
              <span className="text-xs text-muted-foreground">Activities</span>
            </div>
            <div className="text-lg font-bold">{user.totalActivities}</div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="pt-3 border-t space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Coding Challenges</span>
            <Badge
              variant="outline"
              className={`${
                user.codingChallenges.passRate >= 80
                  ? "bg-green-100 text-green-700 border-green-300"
                  : user.codingChallenges.passRate >= 60
                  ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                  : "bg-red-100 text-red-700 border-red-300"
              }`}
            >
              {user.codingChallenges.passRate}%
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Quiz Performance</span>
            <Badge
              variant="outline"
              className={`${
                user.quizzes.passRate >= 80
                  ? "bg-green-100 text-green-700 border-green-300"
                  : user.quizzes.passRate >= 60
                  ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                  : "bg-red-100 text-red-700 border-red-300"
              }`}
            >
              {user.quizzes.passRate}%
            </Badge>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Overall Pass Rate</span>
            </div>
            <Badge
              className={`${
                user.overallPassRate >= 80
                  ? "bg-green-500 hover:bg-green-600"
                  : user.overallPassRate >= 60
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {user.overallPassRate}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
