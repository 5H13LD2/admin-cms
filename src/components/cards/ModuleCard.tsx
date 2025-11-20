import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  progress: number;
  image: string;
}

export function ModuleCard({
  id,
  title,
  description,
  lessons,
  duration,
  progress,
  image,
}: ModuleCardProps) {
  return (
    <Link to={`/modules/${id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <Progress value={progress} className="h-2" />
            <p className="mt-1 text-xs font-medium text-white">
              {progress}% Complete
            </p>
          </div>
        </div>
        
        <CardHeader>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{lessons} Lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
