import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import type { DetailedQuiz } from "@/data/dummyData";
import { modules } from "@/data/dummyData";

interface DetailedQuizCardProps {
  quiz: DetailedQuiz;
  onEdit: () => void;
  onDelete: () => void;
}

const difficultyColors = {
  EASY: "bg-green-100 text-green-700 border-green-300 hover:bg-green-200",
  NORMAL: "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200",
  HARD: "bg-red-100 text-red-700 border-red-300 hover:bg-red-200",
};

const difficultyBorderColors = {
  EASY: "border-l-green-500",
  NORMAL: "border-l-yellow-500",
  HARD: "border-l-red-500",
};

export function DetailedQuizCard({ quiz, onEdit, onDelete }: DetailedQuizCardProps) {
  // Handle both moduleId and module_id fields
  const moduleId = (quiz as any).module_id || quiz.moduleId;
  const module = modules.find((m) => m.id === moduleId);
  const correctOption = String.fromCharCode(65 + quiz.correctOptionIndex);

  return (
    <Card
      className={`transition-all hover:shadow-lg border-l-4 ${
        difficultyBorderColors[quiz.difficulty]
      } relative overflow-hidden`}
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-current to-transparent opacity-70" />

      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <Badge variant="outline" className="mb-2 text-xs font-semibold">
              {module?.title || "Unknown Module"}
            </Badge>
            <Badge
              className={`${difficultyColors[quiz.difficulty]} ml-2`}
              variant="outline"
            >
              {quiz.difficulty}
            </Badge>
          </div>
        </div>

        <h3 className="text-base font-semibold mt-3 leading-snug text-foreground">
          {quiz.question}
        </h3>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Options */}
        <div className="space-y-2">
          {quiz.options.map((option, index) => {
            const isCorrect = index === quiz.correctOptionIndex;
            const optionLabel = String.fromCharCode(65 + index);

            return (
              <div
                key={index}
                className={`flex items-start gap-2 p-2 rounded-md text-sm transition-colors ${
                  isCorrect
                    ? "bg-green-50 border border-green-200"
                    : "bg-muted/50 hover:bg-muted"
                }`}
              >
                <span
                  className={`font-bold min-w-[20px] ${
                    isCorrect ? "text-green-600" : "text-primary"
                  }`}
                >
                  {optionLabel}.
                </span>
                <span className="flex-1">{option}</span>
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {quiz.explanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
            <span className="font-semibold text-blue-900">Explanation:</span>{" "}
            <span className="text-blue-800">{quiz.explanation}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-yellow-700 border-yellow-300 hover:bg-yellow-50 hover:text-yellow-800"
            onClick={onEdit}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-700 border-red-300 hover:bg-red-50 hover:text-red-800"
            onClick={onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
