
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, SendIcon, RefreshCw } from "lucide-react";
import { getAIAnswer } from "@/utils/openaiService";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import ApiKeySetup from "./ApiKeySetup";

interface AiAnswerGeneratorProps {
  pdfContent: string;
}

const AiAnswerGenerator: React.FC<AiAnswerGeneratorProps> = ({ pdfContent }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isKeySet, setIsKeySet] = useState(false);
  const { toast } = useToast();

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question to get an AI answer",
        variant: "destructive"
      });
      return;
    }

    if (!pdfContent) {
      toast({
        title: "No PDF Content",
        description: "Please upload and process a PDF first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const prompt = `Based on the following content from a PDF, please answer this question: "${question}"\n\nPDF CONTENT:\n${pdfContent}`;
      const aiAnswer = await getAIAnswer(prompt);
      setAnswer(aiAnswer);
    } catch (error) {
      console.error("Error getting AI answer:", error);
      toast({
        title: "Error Getting Answer",
        description: error instanceof Error ? error.message : "Failed to get AI answer",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ApiKeySetup onKeySet={setIsKeySet} />
      
      {isKeySet && (
        <>
          <Separator className="my-4" />
          
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Ask AI About This PDF</h3>
          </div>
          
          <Textarea
            placeholder="Ask a question about the PDF content..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            className="resize-none"
          />
          
          <Button 
            onClick={handleAskQuestion} 
            disabled={isLoading || !question.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating Answer...
              </>
            ) : (
              <>
                <SendIcon className="mr-2 h-4 w-4" />
                Get AI Answer
              </>
            )}
          </Button>
          
          {answer && (
            <Card className="mt-4 bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div className="space-y-2">
                    <h4 className="font-medium">AI Answer</h4>
                    <div className="text-sm whitespace-pre-line">
                      {answer}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default AiAnswerGenerator;
