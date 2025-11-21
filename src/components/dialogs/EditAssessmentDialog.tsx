import { useState, useEffect } from "react";
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
import type { TechnicalAssessment } from "@/data/dummyData";

interface EditAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: TechnicalAssessment;
  onEdit: (assessment: TechnicalAssessment) => void;
}

export function EditAssessmentDialog({
  open,
  onOpenChange,
  assessment,
  onEdit,
}: EditAssessmentDialogProps) {
  const [formData, setFormData] = useState(assessment);

  useEffect(() => {
    setFormData(assessment);
  }, [assessment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onEdit({
      ...formData,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Assessment</DialogTitle>
          <DialogDescription>Update the assessment details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          {formData.type === "code_fix" && (
            <div className="space-y-2">
              <Label>Broken Code</Label>
              <Textarea
                value={formData.brokenCode || ""}
                onChange={(e) => setFormData({ ...formData, brokenCode: e.target.value })}
                rows={4}
                className="font-mono text-sm"
              />
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Assessment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
