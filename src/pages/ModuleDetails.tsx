import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LessonCard } from "@/components/cards/LessonCard";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { modules, lessons } from "@/data/dummyData";

export default function ModuleDetails() {
  const { id } = useParams();
  const module = modules.find((m) => m.id === id);
  const moduleLessons = lessons.filter((l) => l.moduleId === id);

  if (!module) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Module not found</h1>
        <Link to="/modules">
          <Button className="mt-4">Back to Modules</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/modules">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Modules
          </Button>
        </Link>

        <div className="relative h-64 overflow-hidden rounded-lg">
          <img
            src={module.image}
            alt={module.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="text-3xl font-bold">{module.title}</h1>
            <p className="mt-2 text-lg">{module.description}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lessons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {moduleLessons.length > 0 ? (
                moduleLessons.map((lesson) => (
                  <LessonCard key={lesson.id} {...lesson} />
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No lessons available yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="font-medium">{module.progress}%</span>
                </div>
                <Progress value={module.progress} className="mt-2" />
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{module.lessons} Lessons</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{module.duration}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">Continue Learning</Button>
              <Button variant="outline" className="w-full">
                View Certificate
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
