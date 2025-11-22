import { LessonCard } from "@/components/cards/LessonCard";
import { useLessonsPage } from "@/hooks/useLessonData";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, RefreshCcw, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Lessons() {
  const {
    courses,
    coursesLoading,
    modules,
    modulesLoading,
    lessons,
    lessonsLoading,
    lessonsError,
    refetch,
    selectedCourseId,
    setSelectedCourseId,
    selectedModuleId,
    setSelectedModuleId,
    searchTerm,
    setSearchTerm,
    totalLessons,
    totalDuration,
    completedLessons,
  } = useLessonsPage();

  const loading = coursesLoading || modulesLoading || lessonsLoading;

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourseId(e.target.value);
    setSelectedModuleId(''); // Reset module when course changes
  };

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModuleId(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-content-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lesson Management</h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage course lessons
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch && selectedCourseId && selectedModuleId && refetch(selectedCourseId, selectedModuleId)}
          disabled={!selectedCourseId || !selectedModuleId}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters (matching techlaunch) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          className="form-select w-full rounded-md border border-input bg-background px-3 py-2"
          value={selectedCourseId}
          onChange={handleCourseChange}
          disabled={coursesLoading}
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title || course.courseName}
            </option>
          ))}
        </select>

        <select
          className="form-select w-full rounded-md border border-input bg-background px-3 py-2"
          value={selectedModuleId}
          onChange={handleModuleChange}
          disabled={!selectedCourseId || modulesLoading}
        >
          <option value="">All Modules</option>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.title}
            </option>
          ))}
        </select>

        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Statistics Cards (matching techlaunch) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLessons}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDuration} mins</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedLessons}</div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading lessons...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {lessonsError && !loading && (
        <div className="rounded-lg border-2 border-dashed border-destructive p-12 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-xl font-semibold text-destructive mb-2">
              Error loading lessons
            </h3>
            <p className="text-sm text-muted-foreground">{lessonsError}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !lessonsError && lessons.length === 0 && (
        <div className="rounded-lg border-2 border-dashed p-12 text-center">
          <div className="mx-auto max-w-md">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              {!selectedCourseId || !selectedModuleId
                ? 'Select a course and module'
                : 'No lessons found'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {!selectedCourseId || !selectedModuleId
                ? 'Please select a course and module to view lessons'
                : searchTerm
                ? 'Try adjusting your search criteria'
                : 'No lessons available for this module'}
            </p>
          </div>
        </div>
      )}

      {/* Lessons List */}
      {!loading && !lessonsError && lessons.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            All Lessons ({lessons.length})
          </h2>
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              id={lesson.id}
              title={lesson.title}
              description={lesson.content || lesson.description || ''}
              duration={lesson.estimatedMinutes || lesson.duration}
              completed={lesson.completed || false}
              moduleId={lesson.moduleId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
