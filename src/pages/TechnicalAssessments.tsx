import { useState, useMemo } from "react";
import { DetailedAssessmentCard } from "@/components/cards/DetailedAssessmentCard";
import { AddAssessmentDialog } from "@/components/dialogs/AddAssessmentDialog";
import { EditAssessmentDialog } from "@/components/dialogs/EditAssessmentDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { technicalAssessments, modules } from "@/data/dummyData";
import type { TechnicalAssessment } from "@/data/dummyData";

export default function TechnicalAssessments() {
  const [assessments, setAssessments] = useState<TechnicalAssessment[]>(technicalAssessments);
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<TechnicalAssessment | null>(null);

  // Filter assessments by selected module
  const filteredAssessments = useMemo(() => {
    if (selectedModule === "all") {
      return assessments;
    }
    return assessments.filter((assessment) => assessment.moduleId === selectedModule);
  }, [assessments, selectedModule]);

  const handleAddAssessment = (newAssessment: Omit<TechnicalAssessment, "id" | "createdAt">) => {
    const assessment: TechnicalAssessment = {
      ...newAssessment,
      id: `ta${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAssessments([...assessments, assessment]);
  };

  const handleEditAssessment = (updatedAssessment: TechnicalAssessment) => {
    setAssessments(
      assessments.map((assessment) =>
        assessment.id === updatedAssessment.id ? updatedAssessment : assessment
      )
    );
    setEditingAssessment(null);
  };

  const handleDeleteAssessment = (id: string) => {
    if (confirm("Are you sure you want to delete this assessment?")) {
      setAssessments(assessments.filter((assessment) => assessment.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setAssessments(
      assessments.map((assessment) =>
        assessment.id === id
          ? { ...assessment, isActive: !assessment.isActive }
          : assessment
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Technical Assessments</h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage technical assessments for each module
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
            Add Assessment
          </Button>
        </div>
      </div>

      {/* Assessment Cards Grid */}
      {filteredAssessments.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed p-12 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No assessments found
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedModule === "all"
                ? "Start by adding your first technical assessment"
                : "No assessments found for this module"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssessments.map((assessment) => (
            <DetailedAssessmentCard
              key={assessment.id}
              assessment={assessment}
              onEdit={() => setEditingAssessment(assessment)}
              onDelete={() => handleDeleteAssessment(assessment.id)}
              onToggleActive={() => handleToggleActive(assessment.id)}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <AddAssessmentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddAssessment}
      />

      {editingAssessment && (
        <EditAssessmentDialog
          open={!!editingAssessment}
          onOpenChange={(open) => !open && setEditingAssessment(null)}
          assessment={editingAssessment}
          onEdit={handleEditAssessment}
        />
      )}
    </div>
  );
}
