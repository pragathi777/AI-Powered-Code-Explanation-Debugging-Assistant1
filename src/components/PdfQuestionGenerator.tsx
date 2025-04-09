import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { InfoIcon, BookOpen, CheckCircle2, Lightbulb, RefreshCw, Trophy, ThumbsUp, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  TooltipProvider, 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent 
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";

interface PdfQuestionGeneratorProps {
  pdfContent: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const PdfQuestionGenerator: React.FC<PdfQuestionGeneratorProps> = ({ pdfContent }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  useEffect(() => {
    if (pdfContent) {
      generateQuestions();
    } else {
      setQuestions([]);
      setAnswers({});
      setShowResults(false);
      setShowFeedback(false);
    }
  }, [pdfContent]);

  const generateQuestions = () => {
    setLoading(true);
    setAnswers({});
    setShowResults(false);
    setShowFeedback(false);
    
    setTimeout(() => {
      const generatedQuestions: Question[] = [
        {
          id: "q1",
          question: "What is an algorithm?",
          options: [
            "A programming language",
            "A step-by-step procedure for solving problems",
            "A type of computer hardware",
            "A mathematical equation"
          ],
          correctAnswer: 1,
          explanation: "An algorithm is a step-by-step procedure for solving problems, as mentioned in the introduction section of the PDF."
        },
        {
          id: "q2",
          question: "Which of the following is NOT a type of algorithm mentioned in the PDF?",
          options: [
            "Sorting Algorithms",
            "Search Algorithms", 
            "Encryption Algorithms",
            "Graph Algorithms"
          ],
          correctAnswer: 2,
          explanation: "The PDF mentions Sorting, Search, and Graph Algorithms, but not Encryption Algorithms."
        },
        {
          id: "q3",
          question: "What is time complexity a measure of?",
          options: [
            "The amount of memory an algorithm uses",
            "The amount of time an algorithm takes to complete",
            "The number of errors in an algorithm",
            "The efficiency of the code syntax"
          ],
          correctAnswer: 1,
          explanation: "Time complexity is a measure of the amount of time an algorithm takes to complete as a function of the length of the input."
        },
        {
          id: "q4",
          question: "Which time complexity is considered the most efficient for large inputs?",
          options: [
            "O(n²)",
            "O(n)",
            "O(1)",
            "O(2^n)"
          ],
          correctAnswer: 2,
          explanation: "O(1) represents constant time complexity, which is the most efficient as it doesn't increase with input size."
        }
      ];
      
      setQuestions(generatedQuestions);
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
    
    const score = getScore();
    const [correct, total] = score.split('/').map(num => parseInt(num));
    
    if (correct / total >= 0.75) {
      setShowFeedback(true);
      toast({
        title: "Great job!",
        description: `You scored ${score} - that's excellent performance!`,
      });
    }
  };

  const handleGenerateNew = () => {
    generateQuestions();
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

  const getFeedbackMessage = () => {
    const [correct, total] = getScore().split('/').map(num => parseInt(num));
    const percentage = (correct / total) * 100;
    
    if (percentage === 100) {
      return "Perfect score! You've mastered this material completely!";
    } else if (percentage >= 90) {
      return "Excellent work! You have a very strong understanding of the concepts!";
    } else if (percentage >= 75) {
      return "Great job! You're showing solid comprehension of the material!";
    } else {
      return "";
    }
  };

  if (!pdfContent) {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>No PDF Content</AlertTitle>
        <AlertDescription>
          Upload a PDF document to generate questions.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p>Generating questions from PDF content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Generated Questions
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGenerateNew}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Regenerate Questions
        </Button>
      </div>

      {showResults ? (
        <div className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Quiz Results</AlertTitle>
            <AlertDescription className="flex justify-between items-center">
              <span>You scored {getScore()} correct answers!</span>
              
              {showFeedback && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="ml-2 bg-green-100 hover:bg-green-200 border-green-300">
                            <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                            View Feedback
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4 bg-green-50 border-green-200">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-green-700 font-medium">
                              <Star className="h-5 w-5 text-yellow-500" />
                              <h4>Excellent Performance!</h4>
                            </div>
                            <p className="text-sm text-green-700">{getFeedbackMessage()}</p>
                            <div className="flex gap-2 pt-2">
                              <ThumbsUp className="h-5 w-5 text-green-600" />
                              <p className="text-sm text-green-700">Your understanding of these concepts will be valuable for advanced topics.</p>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click for detailed feedback!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
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

          {questions.length > 0 && (
            <>
              <Separator />
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(answers).length !== questions.length}
                >
                  Submit Answers
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PdfQuestionGenerator;
