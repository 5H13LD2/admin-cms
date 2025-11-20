import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle2 } from "lucide-react";
import { lessons, modules } from "@/data/dummyData";

export default function LessonDetails() {
  const { id } = useParams();
  const lesson = lessons.find((l) => l.id === id);
  const module = lesson ? modules.find((m) => m.id === lesson.moduleId) : null;

  if (!lesson) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Lesson not found</h1>
        <Link to="/lessons">
          <Button className="mt-4">Back to Lessons</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link to="/lessons">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lessons
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <Badge variant="secondary" className="mb-2">
              {module?.title}
            </Badge>
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
          </div>
          {lesson.completed && (
            <CheckCircle2 className="h-8 w-8 text-success" />
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Content</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{lesson.duration}</span>
          </div>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>{lesson.content}</p>
          
          <h3>Key Concepts</h3>
          <ul>
            <li>Understanding the fundamentals</li>
            <li>Practical applications and examples</li>
            <li>Best practices and common patterns</li>
            <li>Hands-on exercises</li>
          </ul>

          <h3>Learning Objectives</h3>
          <ul>
            <li>Master the core concepts covered in this lesson</li>
            <li>Apply learned techniques to real-world scenarios</li>
            <li>Build confidence through practical exercises</li>
          </ul>

          <div className="not-prose mt-8 flex gap-4">
            <Button disabled={lesson.completed}>
              {lesson.completed ? "Completed" : "Mark as Complete"}
            </Button>
            <Link to={`/quizzes/${lesson.id}`}>
              <Button variant="outline">Take Quiz</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
