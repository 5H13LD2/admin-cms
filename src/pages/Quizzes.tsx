import { QuizCard } from "@/components/cards/QuizCard";
import { quizzes } from "@/data/dummyData";

export default function Quizzes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <p className="mt-1 text-muted-foreground">
          Test your knowledge and track your progress
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            id={quiz.id}
            lessonId={quiz.lessonId}
            title={quiz.title}
            questionsCount={quiz.questions.length}
          />
        ))}
      </div>
    </div>
  );
}
