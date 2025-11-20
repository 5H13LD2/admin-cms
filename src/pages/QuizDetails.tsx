import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { quizzes } from "@/data/dummyData";
import { toast } from "sonner";

export default function QuizDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = quizzes.find((q) => q.id === id);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  if (!quiz) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Quiz not found</h1>
        <Link to="/quizzes">
          <Button className="mt-4">Back to Quizzes</Button>
        </Link>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const correctAnswers = quiz.questions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    toast.success(`Quiz completed! You scored ${score}%`);
    setShowResults(true);
  };

  if (showResults) {
    const correctAnswers = quiz.questions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{score}%</div>
              <p className="mt-2 text-muted-foreground">
                {correctAnswers} out of {quiz.questions.length} correct
              </p>
            </div>

            <div className="space-y-4">
              {quiz.questions.map((q, idx) => {
                const isCorrect = answers[q.id] === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle className="mt-1 h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="mt-1 h-5 w-5 text-destructive" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">
                          {idx + 1}. {q.question}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Correct answer: {q.options[q.correctAnswer]}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <Button onClick={() => navigate("/quizzes")} className="flex-1">
                Back to Quizzes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers({});
                  setShowResults(false);
                }}
                className="flex-1"
              >
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link to="/quizzes">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <CardTitle className="mb-4">{currentQ.question}</CardTitle>
            <RadioGroup
              value={answers[currentQ.id]?.toString()}
              onValueChange={(value) =>
                handleAnswer(currentQ.id, parseInt(value))
              }
            >
              {currentQ.options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={answers[currentQ.id] === undefined}
            >
              {currentQuestion === quiz.questions.length - 1 ? "Submit" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
