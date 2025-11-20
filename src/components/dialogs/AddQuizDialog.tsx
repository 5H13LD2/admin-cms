import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { modules } from "@/data/dummyData";
import type { DetailedQuiz, DifficultyLevel } from "@/data/dummyData";

interface AddQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (quiz: Omit<DetailedQuiz, "id" | "createdAt">) => void;
}

export function AddQuizDialog({ open, onOpenChange, onAdd }: AddQuizDialogProps) {
  const [formData, setFormData] = useState({
    question: "",
    moduleId: "",
    difficulty: "" as DifficultyLevel | "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "" as "A" | "B" | "C" | "D" | "",
    explanation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.question ||
      !formData.moduleId ||
      !formData.difficulty ||
      !formData.optionA ||
      !formData.optionB ||
      !formData.optionC ||
      !formData.optionD ||
      !formData.correctAnswer
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const correctIndex = formData.correctAnswer.charCodeAt(0) - 65;

    const newQuiz: Omit<DetailedQuiz, "id" | "createdAt"> = {
      question: formData.question,
      moduleId: formData.moduleId,
      difficulty: formData.difficulty as DifficultyLevel,
      options: [
        formData.optionA,
        formData.optionB,
        formData.optionC,
        formData.optionD,
      ] as [string, string, string, string],
      correctOptionIndex: correctIndex as 0 | 1 | 2 | 3,
      explanation: formData.explanation || undefined,
    };

    onAdd(newQuiz);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      question: "",
      moduleId: "",
      difficulty: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      explanation: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Quiz Question</DialogTitle>
          <DialogDescription>
            Create a new quiz question for your course modules
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">
              Question <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="question"
              placeholder="Enter your question here..."
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              required
              rows={3}
            />
          </div>

          {/* Difficulty and Module Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">
                Difficulty <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  setFormData({ ...formData, difficulty: value as DifficultyLevel })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="module">
                Module <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.moduleId}
                onValueChange={(value) =>
                  setFormData({ ...formData, moduleId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
            <h3 className="font-semibold">Answer Options</h3>

            <div className="space-y-2">
              <Label htmlFor="optionA">
                Option A <span className="text-red-500">*</span>
              </Label>
              <Input
                id="optionA"
                placeholder="Enter option A"
                value={formData.optionA}
                onChange={(e) =>
                  setFormData({ ...formData, optionA: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="optionB">
                Option B <span className="text-red-500">*</span>
              </Label>
              <Input
                id="optionB"
                placeholder="Enter option B"
                value={formData.optionB}
                onChange={(e) =>
                  setFormData({ ...formData, optionB: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="optionC">
                Option C <span className="text-red-500">*</span>
              </Label>
              <Input
                id="optionC"
                placeholder="Enter option C"
                value={formData.optionC}
                onChange={(e) =>
                  setFormData({ ...formData, optionC: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="optionD">
                Option D <span className="text-red-500">*</span>
              </Label>
              <Input
                id="optionD"
                placeholder="Enter option D"
                value={formData.optionD}
                onChange={(e) =>
                  setFormData({ ...formData, optionD: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correctAnswer">
                Correct Answer <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.correctAnswer}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    correctAnswer: value as "A" | "B" | "C" | "D",
                  })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Correct Answer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Option A</SelectItem>
                  <SelectItem value="B">Option B</SelectItem>
                  <SelectItem value="C">Option C</SelectItem>
                  <SelectItem value="D">Option D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation (Optional)</Label>
            <Textarea
              id="explanation"
              placeholder="Explain why this is the correct answer..."
              value={formData.explanation}
              onChange={(e) =>
                setFormData({ ...formData, explanation: e.target.value })
              }
              rows={2}
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Add Question</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
