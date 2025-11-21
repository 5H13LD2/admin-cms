import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Power, PowerOff } from "lucide-react";
import type { TechnicalAssessment } from "@/data/dummyData";

interface DetailedAssessmentCardProps {
  assessment: TechnicalAssessment;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

const difficultyColors = {
  Easy: "bg-green-100 text-green-700 border-green-300 hover:bg-green-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200",
  Hard: "bg-red-100 text-red-700 border-red-300 hover:bg-red-200",
};

const difficultyBorderColors = {
  Easy: "border-l-green-500",
  Medium: "border-l-yellow-500",
  Hard: "border-l-red-500",
};

const typeLabels = {
  code_fix: "Code Fix",
  sql_query: "SQL Query",
};

const typeBadgeColors = {
  code_fix: "bg-blue-100 text-blue-700 border-blue-300",
  sql_query: "bg-purple-100 text-purple-700 border-purple-300",
};

export function DetailedAssessmentCard({
  assessment,
  onEdit,
  onDelete,
  onToggleActive,
}: DetailedAssessmentCardProps) {
  return (
    <Card
      className={`transition-all hover:shadow-lg border-l-4 ${
        difficultyBorderColors[assessment.difficulty]
      } relative overflow-hidden ${
        assessment.status !== "active" ? "opacity-60" : ""
      }`}
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-current to-transparent opacity-70" />

      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={typeBadgeColors[assessment.type]}>
                {typeLabels[assessment.type]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {assessment.category}
              </Badge>
              <Badge
                variant="outline"
                className={difficultyColors[assessment.difficulty]}
              >
                {assessment.difficulty}
              </Badge>
            </div>
            <h3 className="text-base font-semibold leading-snug text-foreground">
              {assessment.title}
            </h3>
            {assessment.topic && (
              <p className="text-xs text-muted-foreground mt-1">
                {assessment.topic}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {assessment.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {assessment.description}
          </p>
        )}

        {/* Tags */}
        {assessment.tags && assessment.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {assessment.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-0"
              >
                {tag}
              </Badge>
            ))}
            {assessment.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0">
                +{assessment.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Code Preview for code_fix type */}
        {assessment.type === "code_fix" && assessment.brokenCode && (
          <div className="bg-muted/50 rounded-md p-2">
            <code className="text-xs block overflow-hidden text-ellipsis whitespace-nowrap">
              {assessment.brokenCode.split("\n")[0]}...
            </code>
          </div>
        )}

        {/* SQL Info for sql_query type */}
        {assessment.type === "sql_query" && assessment.sample_table && (
          <div className="bg-muted/50 rounded-md p-2 text-xs">
            <span className="font-semibold">Table:</span>{" "}
            {assessment.sample_table.name} (
            {assessment.sample_table.rows.length} rows)
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t">
          <div>
            <span className="font-semibold">Course:</span>{" "}
            {assessment.courseId}
          </div>
          {assessment.author && (
            <div>
              <span className="font-semibold">By:</span> {assessment.author}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-blue-700 border-blue-300 hover:bg-blue-50"
            onClick={onEdit}
          >
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 ${
              assessment.status === "active"
                ? "text-gray-700 border-gray-300 hover:bg-gray-50"
                : "text-green-700 border-green-300 hover:bg-green-50"
            }`}
            onClick={onToggleActive}
          >
            {assessment.status === "active" ? (
              <>
                <PowerOff className="mr-1 h-3 w-3" />
                Deactivate
              </>
            ) : (
              <>
                <Power className="mr-1 h-3 w-3" />
                Activate
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-700 border-red-300 hover:bg-red-50"
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
