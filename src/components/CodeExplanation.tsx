
import React, { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InfoIcon, Code2, RefreshCw } from "lucide-react";
import { explainCode, getOpenAIKey } from "@/utils/openaiService";
import ApiKeySetup from "@/components/pdf-ai/ApiKeySetup";

interface CodeExplanationProps {
  code: string;
  language: string;
}

interface ExplanationLine {
  lineNumber: number;
  code: string;
  explanation: string;
}

const CodeExplanation: React.FC<CodeExplanationProps> = ({ code, language }) => {
  const [explanations, setExplanations] = useState<ExplanationLine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isKeySet, setIsKeySet] = useState<boolean>(false);

  useEffect(() => {
    const checkApiKey = () => {
      const hasKey = !!getOpenAIKey();
      setIsKeySet(hasKey);
      return hasKey;
    };

    checkApiKey();
  }, []);

  useEffect(() => {
    // Clear explanations when code changes
    setExplanations([]);
    setError(null);
  }, [code, language]);

  const analyzeCode = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const aiExplanations = await explainCode(code, language);
      setExplanations(aiExplanations.filter(item => item.code.trim()));
    } catch (err) {
      console.error("Error getting AI explanations:", err);
      setError(err instanceof Error ? err.message : "Failed to get explanations");
    } finally {
      setLoading(false);
    }
  };

  const handleKeySet = (isSet: boolean) => {
    setIsKeySet(isSet);
    if (isSet && code.trim()) {
      analyzeCode();
    }
  };

  if (!isKeySet) {
    return (
      <div className="space-y-4">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>OpenAI API Key Required</AlertTitle>
          <AlertDescription>
            To get AI-powered code explanations, please set your OpenAI API key.
          </AlertDescription>
        </Alert>
        <ApiKeySetup onKeySet={handleKeySet} />
      </div>
    );
  }

  if (!code.trim()) {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>No Code to Explain</AlertTitle>
        <AlertDescription>
          Enter some code in the editor and click "Analyze Code" to get AI-powered explanations.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Error Getting Explanations</AlertTitle>
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={analyzeCode} 
            className="mt-2"
          >
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-center space-y-2">
        <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
        <p>AI is analyzing your code...</p>
      </div>
    );
  }

  if (explanations.length === 0 && !loading) {
    return (
      <div className="space-y-4">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Code Ready for Analysis</AlertTitle>
          <AlertDescription>
            Click the button below to get AI-powered explanations for your code.
          </AlertDescription>
        </Alert>
        <Button onClick={analyzeCode} className="w-full">
          <Code2 className="mr-2 h-4 w-4" />
          Explain My Code
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Line-by-Line Explanation</h3>
        <Button variant="outline" size="sm" onClick={analyzeCode}>
          <RefreshCw className="mr-2 h-3 w-3" />
          Refresh
        </Button>
      </div>
      <Accordion type="multiple" className="w-full">
        {explanations.map((item) => (
          <AccordionItem key={item.lineNumber} value={`line-${item.lineNumber}`}>
            <AccordionTrigger className="hover:bg-muted/50 px-4">
              <div className="flex items-start text-left">
                <div className="text-muted-foreground mr-2 w-8 text-right">
                  {item.lineNumber}
                </div>
                <div className="font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.code}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-12 py-4 bg-muted/30">
              <div className="flex gap-2">
                <Code2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{item.explanation}</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CodeExplanation;
