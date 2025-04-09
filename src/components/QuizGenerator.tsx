
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { InfoIcon, FilePlus2, BookOpen, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface QuizGeneratorProps {
  code: string;
  language: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ code, language }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    if (code.trim()) {
      generateQuiz();
    } else {
      setQuestions([]);
      setAnswers({});
      setShowResults(false);
    }
  }, [code, language]);

  const generateQuiz = () => {
    setLoading(true);
    setAnswers({});
    setShowResults(false);
    
    // Simulate API call to generate quiz questions
    setTimeout(() => {
      const mockQuestions: QuizQuestion[] = [
        {
          id: "q1",
          question: "What is the primary purpose of the code?",
          options: [
            "Data processing",
            "User interface rendering",
            "Network communication",
            "File manipulation"
          ],
          correctAnswer: 1,
          explanation: "The code primarily focuses on rendering user interface components, as evidenced by the use of JSX syntax and component structure."
        },
        {
          id: "q2",
          question: "Which programming pattern is demonstrated in this code?",
          options: [
            "Procedural programming",
            "Object-oriented programming",
            "Functional programming",
            "Event-driven programming"
          ],
          correctAnswer: 3,
          explanation: "The code follows an event-driven programming pattern, with handlers responding to user interactions."
        },
        {
          id: "q3",
          question: "What would happen if you removed the useEffect hook from this code?",
          options: [
            "Nothing, it's not necessary",
            "The component would crash",
            "Updates wouldn't be reflected in the UI",
            "The code would run faster"
          ],
          correctAnswer: 2,
          explanation: "Without the useEffect hook, the component wouldn't respond to changes in its dependencies, and updates wouldn't be reflected in the UI."
        }
      ];
      
      setQuestions(mockQuestions);
      setLoading(false);
    }, 1200);
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const handleGenerateNew = () => {
    generateQuiz();
  };

  const getScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return `${correct}/${questions.length}`;
  };

  if (!code.trim()) {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>No Code for Quiz</AlertTitle>
        <AlertDescription>
          Enter some code in the editor and click "Analyze Code" to generate quiz questions.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return <div className="p-4 text-center">Generating quiz questions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Code Comprehension Quiz
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGenerateNew}
          className="flex items-center gap-1"
        >
          <FilePlus2 className="h-4 w-4" />
          Regenerate Quiz
        </Button>
      </div>

      {showResults ? (
        <div className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Quiz Results</AlertTitle>
            <AlertDescription>
              You scored {getScore()} correct answers!
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {questions.map((question, qIndex) => {
              const isCorrect = answers[question.id] === question.correctAnswer;
              
              return (
                <Card key={question.id} className={
                  isCorrect ? "border-green-200" : "border-red-200"
                }>
                  <CardHeader>
                    <CardTitle className="text-base flex items-start gap-2">
                      <span className="font-medium">Q{qIndex + 1}:</span> 
                      <span>{question.question}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={answers[question.id]?.toString()}>
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className={`flex items-start space-x-2 p-2 rounded ${
                          oIndex === question.correctAnswer 
                            ? "bg-green-50" 
                            : answers[question.id] === oIndex && oIndex !== question.correctAnswer
                              ? "bg-red-50"
                              : ""
                        }`}>
                          <RadioGroupItem 
                            value={oIndex.toString()} 
                            id={`q${qIndex}-o${oIndex}`} 
                            disabled 
                            checked={answers[question.id] === oIndex}
                          />
                          <Label 
                            htmlFor={`q${qIndex}-o${oIndex}`}
                            className={
                              oIndex === question.correctAnswer 
                                ? "text-green-700" 
                                : answers[question.id] === oIndex && oIndex !== question.correctAnswer
                                  ? "text-red-700"
                                  : ""
                            }
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                  <CardFooter className="bg-muted/30 flex gap-2">
                    <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm">{question.explanation}</p>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, qIndex) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-base flex gap-2">
                  <span className="font-medium">Q{qIndex + 1}:</span> 
                  <span>{question.question}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={answers[question.id]?.toString()} 
                  onValueChange={(value) => handleAnswerSelect(question.id, parseInt(value))}
                >
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-start space-x-2 p-2">
                      <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                      <Label htmlFor={`q${qIndex}-o${oIndex}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          <Separator />
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmitQuiz}
              disabled={Object.keys(answers).length !== questions.length}
            >
              Submit Answers
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;
