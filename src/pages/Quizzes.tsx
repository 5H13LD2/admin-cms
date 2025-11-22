import { useState, useMemo } from "react";
import { DetailedQuizCard } from "@/components/cards/DetailedQuizCard";
import { AddQuizDialog } from "@/components/dialogs/AddQuizDialog";
import { EditQuizDialog } from "@/components/dialogs/EditQuizDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuizzesPage } from "@/hooks/useQuizData";
import type { Quiz } from "@/hooks/useQuizData";
import type { DetailedQuiz, DifficultyLevel } from "@/data/dummyData";

// Helper function to convert Firebase Quiz to DetailedQuiz
const convertToDetailedQuiz = (quiz: Quiz): DetailedQuiz => {
  return {
    id: quiz.id,
    moduleId: quiz.module_id || quiz.moduleId || '',
    question: quiz.question,
    options: [
      quiz.options[0] || '',
      quiz.options[1] || '',
      quiz.options[2] || '',
      quiz.options[3] || '',
    ] as [string, string, string, string],
    correctOptionIndex: quiz.correctOptionIndex as 0 | 1 | 2 | 3,
    difficulty: (quiz.difficulty || 'NORMAL') as DifficultyLevel,
    explanation: quiz.explanation,
    createdAt: quiz.createdAt || new Date().toISOString(),
  };
};

export default function Quizzes() {
  const {
    courses,
    coursesLoading,
    modules,
    modulesLoading,
    quizzes: firebaseQuizzes,
    pagination,
    quizzesLoading,
    quizzesError,
    selectedCourseId,
    setSelectedCourseId,
    selectedModuleId,
    setSelectedModuleId,
    currentPage,
    setCurrentPage,
    totalQuizzes,
    easyQuizzes,
    normalQuizzes,
    hardQuizzes,
  } = useQuizzesPage();

  // Convert Firebase quizzes to DetailedQuiz format
  const quizzes = useMemo(
    () => firebaseQuizzes.map(convertToDetailedQuiz),
    [firebaseQuizzes]
  );

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<DetailedQuiz | null>(null);

  const loading = coursesLoading || modulesLoading || quizzesLoading;

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value);
    setSelectedModuleId('all'); // Reset module when course changes
  };

  const handleAddQuiz = (newQuiz: Omit<DetailedQuiz, "id" | "createdAt">) => {
    // TODO: Implement with Firebase
    const quiz: DetailedQuiz = {
      ...newQuiz,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    // Will be handled by Firebase in future implementation
  };

  const handleEditQuiz = (updatedQuiz: DetailedQuiz) => {
    // TODO: Implement with Firebase
    setEditingQuiz(null);
  };

  const handleDeleteQuiz = (id: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      // TODO: Implement with Firebase
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quizzes</h1>
          <p className="mt-1 text-muted-foreground">
            Add and edit quiz questions for each course lessons
          </p>
        </div>

        {/* Header Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={selectedCourseId} onValueChange={handleCourseChange} disabled={coursesLoading}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title || course.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedModuleId} onValueChange={setSelectedModuleId} disabled={!selectedCourseId || modulesLoading}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Modules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {modules.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={() => setIsAddDialogOpen(true)} disabled={!selectedCourseId}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading quizzes...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {quizzesError && !loading && (
        <div className="rounded-lg border-2 border-dashed border-destructive p-12 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-xl font-semibold text-destructive mb-2">
              Error loading quizzes
            </h3>
            <p className="text-sm text-muted-foreground">{quizzesError}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !quizzesError && quizzes.length === 0 && (
        <div className="rounded-lg border-2 border-dashed p-12 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              {!selectedCourseId
                ? 'Select a course'
                : 'No quiz questions found'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {!selectedCourseId
                ? 'Please select a course to view quizzes'
                : selectedModuleId !== 'all'
                ? 'No questions found for this module'
                : 'Start by adding your first quiz question'}
            </p>
          </div>
        </div>
      )}

      {/* Quiz Cards Grid */}
      {!loading && !quizzesError && quizzes.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <DetailedQuizCard
                key={quiz.id}
                quiz={quiz}
                onEdit={() => setEditingQuiz(quiz)}
                onDelete={() => handleDeleteQuiz(quiz.id)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({pagination.totalCount} total quizzes)
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Dialogs */}
      <AddQuizDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddQuiz}
      />

      {editingQuiz && (
        <EditQuizDialog
          open={!!editingQuiz}
          onOpenChange={(open) => !open && setEditingQuiz(null)}
          quiz={editingQuiz}
          onEdit={handleEditQuiz}
        />
      )}
    </div>
  );
}
