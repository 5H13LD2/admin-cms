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
import type { TechnicalAssessment, AssessmentDifficulty, AssessmentType } from "@/data/dummyData";

interface AddAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (assessment: Omit<TechnicalAssessment, "id" | "createdAt">) => void;
}

export function AddAssessmentDialog({
  open,
  onOpenChange,
  onAdd,
}: AddAssessmentDialogProps) {
  const [formData, setFormData] = useState({
    type: "code_fix" as AssessmentType,
    courseId: "",
    category: "",
    title: "",
    description: "",
    topic: "",
    difficulty: "" as AssessmentDifficulty | "",
    status: "active" as const,
    author: "",
    brokenCode: "",
    correctOutput: "",
    hint: "",
    expected_query: "",
    tags: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.courseId || !formData.difficulty || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    const tagsArray = formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [];

    const newAssessment: Omit<TechnicalAssessment, "id" | "createdAt"> = {
      type: formData.type,
      courseId: formData.courseId,
      category: formData.category,
      title: formData.title,
      description: formData.description || undefined,
      topic: formData.topic || undefined,
      difficulty: formData.difficulty as AssessmentDifficulty,
      status: formData.status,
      author: formData.author || undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
      updatedAt: new Date().toISOString(),
      ...(formData.type === "code_fix" && {
        brokenCode: formData.brokenCode || undefined,
        correctOutput: formData.correctOutput || undefined,
        hint: formData.hint || undefined,
      }),
      ...(formData.type === "sql_query" && {
        expected_query: formData.expected_query || undefined,
      }),
    };

    onAdd(newAssessment);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      type: "code_fix",
      courseId: "",
      category: "",
      title: "",
      description: "",
      topic: "",
      difficulty: "",
      status: "active",
      author: "",
      brokenCode: "",
      correctOutput: "",
      hint: "",
      expected_query: "",
      tags: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Technical Assessment</DialogTitle>
          <DialogDescription>
            Create a new code fix or SQL query assessment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">
                Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: AssessmentType) =>
                  setFormData({ ...formData, type: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="code_fix">Code Fix</SelectItem>
                  <SelectItem value="sql_query">SQL Query</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">
                Difficulty <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: AssessmentDifficulty) =>
                  setFormData({ ...formData, difficulty: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseId">
                Course ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="courseId"
                placeholder="e.g., python_101"
                value={formData.courseId}
                onChange={(e) =>
                  setFormData({ ...formData, courseId: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category"
                placeholder="e.g., Python, JavaScript"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter assessment title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter assessment description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Loops, Functions"
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="Author name"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="e.g., Python, Loops, Syntax"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />
          </div>

          {/* Code Fix Fields */}
          {formData.type === "code_fix" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="brokenCode">Broken Code</Label>
                <Textarea
                  id="brokenCode"
                  placeholder="Enter the broken code here..."
                  value={formData.brokenCode}
                  onChange={(e) =>
                    setFormData({ ...formData, brokenCode: e.target.value })
                  }
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="correctOutput">Expected Output</Label>
                <Input
                  id="correctOutput"
                  placeholder="Expected output"
                  value={formData.correctOutput}
                  onChange={(e) =>
                    setFormData({ ...formData, correctOutput: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hint">Hint</Label>
                <Input
                  id="hint"
                  placeholder="Hint for students"
                  value={formData.hint}
                  onChange={(e) =>
                    setFormData({ ...formData, hint: e.target.value })
                  }
                />
              </div>
            </>
          )}

          {/* SQL Query Fields */}
          {formData.type === "sql_query" && (
            <div className="space-y-2">
              <Label htmlFor="expected_query">Expected SQL Query</Label>
              <Textarea
                id="expected_query"
                placeholder="Enter the expected SQL query..."
                value={formData.expected_query}
                onChange={(e) =>
                  setFormData({ ...formData, expected_query: e.target.value })
                }
                rows={3}
                className="font-mono text-sm"
              />
            </div>
          )}

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
            <Button type="submit">Add Assessment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
