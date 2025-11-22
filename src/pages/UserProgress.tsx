import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
 Search,
  X,
  Users,
  TrendingUp,
  FileDown,
} from "lucide-react";
import { useAllUsers, useUserDashboard } from "@/hooks/useUserProgressData";
import type { UserProgress as UserProgressType } from "@/hooks/useUserProgressData";
import { UserCard } from "@/components/cards/UserCard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";

export default function UserProgressPage() {
  const { users, loading: usersLoading, error: usersError } = useAllUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userSearchInput, setUserSearchInput] = useState("");

  const {
    dashboard,
    loading: dashboardLoading,
    error: dashboardError
  } = useUserDashboard(selectedUserId);

  // Filter users for the user list
  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.userId.toLowerCase().includes(search)
    );
  });

  // Handle search in Admin Dashboard tab
  const handleDashboardSearch = () => {
    const query = userSearchInput.trim().toLowerCase();
    if (!query) return;

    const user = users.find(
      (u) =>
        u.username.toLowerCase() === query || u.userId.toLowerCase() === query
    );

    if (user) {
      setSelectedUserId(user.userId);
    } else {
      alert("User not found");
    }
  };

  const handleClearSearch = () => {
    setUserSearchInput("");
    setSelectedUserId(null);
  };

  const selectedUser = dashboard?.user || null;
  const selectedUserChallenges = dashboard?.codingChallenges?.data || [];
  const selectedUserQuizzes = dashboard?.quizPerformance?.data || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage user progress and performance
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="user-list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="user-list">
            <Users className="mr-2 h-4 w-4" />
            User List
          </TabsTrigger>
          <TabsTrigger value="admin-dashboard">
            <TrendingUp className="mr-2 h-4 w-4" />
            Admin Dashboard
          </TabsTrigger>
        </TabsList>

        {/* User List Tab */}
        <TabsContent value="user-list" className="space-y-6">
          {/* Search Box */}
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Loading State */}
          {usersLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            </div>
          ) : usersError ? (
            <div className="rounded-lg border-2 border-dashed border-destructive p-12 text-center">
              <div className="mx-auto max-w-md">
                <h3 className="text-xl font-semibold text-destructive mb-2">
                  Error loading users
                </h3>
                <p className="text-sm text-muted-foreground">
                  {usersError}
                </p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed p-12 text-center">
              <div className="mx-auto max-w-md">
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  No users found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search criteria
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <UserCard key={user.userId} user={user} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Admin Dashboard Tab */}
        <TabsContent value="admin-dashboard" className="space-y-6">
          {/* Search Section */}
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search User Dashboard
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Search by username or user ID to view comprehensive dashboard
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDashboardSearch();
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Input
                placeholder="Enter username or UID..."
                value={userSearchInput}
                onChange={(e) => setUserSearchInput(e.target.value)}
                className="flex-1"
                required
              />
              <div className="flex gap-2">
                <Button type="submit">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearSearch}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </form>
          </div>

          {/* User Dashboard Display */}
          {dashboardLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading user dashboard...</p>
              </div>
            </div>
          ) : dashboardError ? (
            <div className="rounded-lg border-2 border-dashed border-destructive p-12 text-center">
              <div className="mx-auto max-w-md">
                <h3 className="text-xl font-semibold text-destructive mb-2">
                  Error loading dashboard
                </h3>
                <p className="text-sm text-muted-foreground">
                  {dashboardError}
                </p>
              </div>
            </div>
          ) : selectedUser ? (
            <UserDashboard
              user={selectedUser}
              codingChallenges={selectedUserChallenges}
              quizPerformance={selectedUserQuizzes}
            />
          ) : (
            <div className="rounded-lg border-2 border-dashed p-12 text-center">
              <div className="mx-auto max-w-md">
                <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  No user selected
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use the search above to find and view a user's dashboard
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
