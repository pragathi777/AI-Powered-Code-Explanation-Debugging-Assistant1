
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Trophy, ThumbsUp, Star } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface QuizResultsProps {
  score: string;
  showFeedback: boolean;
  getFeedbackMessage: () => string;
}

const QuizResults: React.FC<QuizResultsProps> = ({ 
  score, 
  showFeedback, 
  getFeedbackMessage 
}) => {
  return (
    <Alert className="bg-green-50 border-green-200">
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      <AlertTitle>Quiz Results</AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        <span>You scored {score} correct answers!</span>
        
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
  );
};

export default QuizResults;
