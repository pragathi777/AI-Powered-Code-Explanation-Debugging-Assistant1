
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Question from "./Question";

interface QuestionsListProps {
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
  showResults: boolean;
  answers: Record<string, number>;
  onAnswerSelect: (questionId: string, answerIndex: number) => void;
  onSubmitQuiz: () => void;
}

const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  showResults,
  answers,
  onAnswerSelect,
  onSubmitQuiz,
}) => {
  if (showResults) {
    return (
      <div className="space-y-4">
        {questions.map((question, qIndex) => (
          <Question
            key={question.id}
            question={question}
            index={qIndex}
            selectedAnswer={answers[question.id]}
            showResults={true}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question, qIndex) => (
        <Question
          key={question.id}
          question={question}
          index={qIndex}
          selectedAnswer={answers[question.id]}
          showResults={false}
          onAnswerSelect={onAnswerSelect}
        />
      ))}

      {questions.length > 0 && (
        <>
          <Separator />
          
          <div className="flex justify-end">
            <Button 
              onClick={onSubmitQuiz}
              disabled={Object.keys(answers).length !== questions.length}
            >
              Submit Answers
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionsList;
