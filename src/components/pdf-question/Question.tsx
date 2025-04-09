
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

interface QuestionProps {
  question: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  index: number;
  selectedAnswer?: number;
  showResults: boolean;
  onAnswerSelect?: (questionId: string, answerIndex: number) => void;
}

const Question: React.FC<QuestionProps> = ({
  question,
  index,
  selectedAnswer,
  showResults,
  onAnswerSelect,
}) => {
  const isCorrect = selectedAnswer === question.correctAnswer;

  if (showResults) {
    return (
      <Card className={isCorrect ? "border-green-200" : "border-red-200"}>
        <CardHeader>
          <CardTitle className="text-base flex items-start gap-2">
            <span className="font-medium">Q{index + 1}:</span> 
            <span>{question.question}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswer?.toString()}>
            {question.options.map((option, oIndex) => (
              <div key={oIndex} className={`flex items-start space-x-2 p-2 rounded ${
                oIndex === question.correctAnswer 
                  ? "bg-green-50" 
                  : selectedAnswer === oIndex && oIndex !== question.correctAnswer
                    ? "bg-red-50"
                    : ""
              }`}>
                <RadioGroupItem 
                  value={oIndex.toString()} 
                  id={`q${index}-o${oIndex}`} 
                  disabled 
                  checked={selectedAnswer === oIndex}
                />
                <Label 
                  htmlFor={`q${index}-o${oIndex}`}
                  className={
                    oIndex === question.correctAnswer 
                      ? "text-green-700" 
                      : selectedAnswer === oIndex && oIndex !== question.correctAnswer
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
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex gap-2">
          <span className="font-medium">Q{index + 1}:</span> 
          <span>{question.question}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedAnswer?.toString()} 
          onValueChange={(value) => onAnswerSelect?.(question.id, parseInt(value))}
        >
          {question.options.map((option, oIndex) => (
            <div key={oIndex} className="flex items-start space-x-2 p-2">
              <RadioGroupItem value={oIndex.toString()} id={`q${index}-o${oIndex}`} />
              <Label htmlFor={`q${index}-o${oIndex}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default Question;
