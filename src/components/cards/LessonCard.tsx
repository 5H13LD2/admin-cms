import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, Circle } from "lucide-react";
import { Link } from "react-router-dom";

interface LessonCardProps {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  duration: string;
  completed: boolean;
}

export function LessonCard({
  id,
  moduleId,
  title,
  content,
  duration,
  completed,
}: LessonCardProps) {
  return (
    <Link to={`/lessons/${id}`}>
      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{content}</p>
            </div>
            {completed ? (
              <CheckCircle2 className="h-6 w-6 text-success" />
            ) : (
              <Circle className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
            <Badge variant={completed ? "default" : "secondary"}>
              {completed ? "Completed" : "In Progress"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
