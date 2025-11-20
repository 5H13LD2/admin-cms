import { LessonCard } from "@/components/cards/LessonCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lessons } from "@/data/dummyData";

export default function Lessons() {
  const completedLessons = lessons.filter((l) => l.completed);
  const inProgressLessons = lessons.filter((l) => !l.completed);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Lessons</h1>
        <p className="mt-1 text-muted-foreground">
          Track your progress and continue learning
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Lessons</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-4">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} {...lesson} />
          ))}
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6 space-y-4">
          {inProgressLessons.map((lesson) => (
            <LessonCard key={lesson.id} {...lesson} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="mt-6 space-y-4">
          {completedLessons.map((lesson) => (
            <LessonCard key={lesson.id} {...lesson} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
