
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, RefreshCw, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import NoPdfContent from "./pdf-question/NoPdfContent";
import LoadingQuestions from "./pdf-question/LoadingQuestions";
import QuizResults from "./pdf-question/QuizResults";
import QuestionsList from "./pdf-question/QuestionsList";
import { Slider } from "@/components/ui/slider";
import { generateQuestions } from "@/utils/openaiService";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(4);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (pdfContent) {
      generateQuestionsFromPdf();
    } else {
      setQuestions([]);
      setAnswers({});
      setShowResults(false);
      setShowFeedback(false);
    }
  }, [pdfContent]);

  const generateQuestionsFromPdf = async () => {
    if (!pdfContent) {
      toast({
        title: "No PDF content",
        description: "Please upload a PDF first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setAnswers({});
    setShowResults(false);
    setShowFeedback(false);
    
    try {
      const aiGeneratedQuestions = await generateQuestions(pdfContent, numberOfQuestions);
      setQuestions(aiGeneratedQuestions);
      toast({
        title: "Questions Generated",
        description: `Successfully generated ${aiGeneratedQuestions.length} questions.`,
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Error",
        description: "Failed to generate questions. Please check your API key.",
        variant: "destructive",
      });
      
      // Fallback to mock questions if AI generation fails
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
      }, 1200);
    } finally {
      setLoading(false);
    }
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
    generateQuestionsFromPdf();
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
    return <NoPdfContent />;
  }

  if (loading) {
    return <LoadingQuestions />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Generated Questions
        </h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGenerateNew}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
        </div>
      </div>

      {showSettings && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Number of Questions: {numberOfQuestions}</Label>
                </div>
                <Slider 
                  value={[numberOfQuestions]} 
                  min={1} 
                  max={10} 
                  step={1} 
                  onValueChange={(value) => setNumberOfQuestions(value[0])}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  size="sm" 
                  onClick={handleGenerateNew}
                >
                  Apply Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showResults && (
        <QuizResults 
          score={getScore()} 
          showFeedback={showFeedback} 
          getFeedbackMessage={getFeedbackMessage} 
        />
      )}

      <QuestionsList 
        questions={questions}
        showResults={showResults}
        answers={answers}
        onAnswerSelect={handleAnswerSelect}
        onSubmitQuiz={handleSubmitQuiz}
      />
    </div>
  );
};

export default PdfQuestionGenerator;
