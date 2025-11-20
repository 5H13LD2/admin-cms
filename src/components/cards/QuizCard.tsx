import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Award } from "lucide-react";
import { Link } from "react-router-dom";

interface QuizCardProps {
  id: string;
  lessonId: string;
  title: string;
  questionsCount: number;
}

export function QuizCard({ id, lessonId, title, questionsCount }: QuizCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{questionsCount} Questions</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Link to={`/quizzes/${id}`}>
          <Button className="w-full">Start Quiz</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
