import { useState, useMemo } from "react";
import { QuizCard } from "@/components/cards/QuizCard";
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
import { Plus } from "lucide-react";
import { detailedQuizzes, modules } from "@/data/dummyData";
import type { DetailedQuiz } from "@/data/dummyData";

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<DetailedQuiz[]>(detailedQuizzes);
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<DetailedQuiz | null>(null);

  // Filter quizzes by selected module
  const filteredQuizzes = useMemo(() => {
    if (selectedModule === "all") {
      return quizzes;
    }
    return quizzes.filter((quiz) => quiz.moduleId === selectedModule);
  }, [quizzes, selectedModule]);

  const handleAddQuiz = (newQuiz: Omit<DetailedQuiz, "id" | "createdAt">) => {
    const quiz: DetailedQuiz = {
      ...newQuiz,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setQuizzes([...quizzes, quiz]);
  };

  const handleEditQuiz = (updatedQuiz: DetailedQuiz) => {
    setQuizzes(
      quizzes.map((quiz) => (quiz.id === updatedQuiz.id ? updatedQuiz : quiz))
    );
    setEditingQuiz(null);
  };

  const handleDeleteQuiz = (id: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
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
          <Select value={selectedModule} onValueChange={setSelectedModule}>
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

          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Quiz Cards Grid */}
      {filteredQuizzes.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed p-12 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No quiz questions found
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedModule === "all"
                ? "Start by adding your first quiz question"
                : "No questions found for this module"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz) => (
            <DetailedQuizCard
              key={quiz.id}
              quiz={quiz}
              onEdit={() => setEditingQuiz(quiz)}
              onDelete={() => handleDeleteQuiz(quiz.id)}
            />
          ))}
        </div>
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
