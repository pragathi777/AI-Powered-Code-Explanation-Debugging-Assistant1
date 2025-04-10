
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InfoIcon, ZapIcon, AlertTriangleIcon, XCircleIcon, Bug, RefreshCw } from "lucide-react";
import { debugCode, getOpenAIKey } from "@/utils/openaiService";
import ApiKeySetup from "@/components/pdf-ai/ApiKeySetup";

interface DebugSuggestionsProps {
  code: string;
  language: string;
}

interface DebugIssue {
  type: "error" | "warning" | "suggestion";
  lineNumber: number;
  message: string;
  suggestion: string;
}

const DebugSuggestions: React.FC<DebugSuggestionsProps> = ({ code, language }) => {
  const [issues, setIssues] = useState<DebugIssue[]>([]);
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
    // Clear issues when code changes
    setIssues([]);
    setError(null);
  }, [code, language]);

  const findIssues = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const aiIssues = await debugCode(code, language);
      setIssues(aiIssues);
    } catch (err) {
      console.error("Error getting AI debug suggestions:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze code");
    } finally {
      setLoading(false);
    }
  };

  const handleKeySet = (isSet: boolean) => {
    setIsKeySet(isSet);
    if (isSet && code.trim()) {
      findIssues();
    }
  };

  if (!isKeySet) {
    return (
      <div className="space-y-4">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>OpenAI API Key Required</AlertTitle>
          <AlertDescription>
            To get AI-powered debugging suggestions, please set your OpenAI API key.
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
        <AlertTitle>No Code to Debug</AlertTitle>
        <AlertDescription>
          Enter some code in the editor and click "Analyze Code" to get AI-powered debugging suggestions.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Error Analyzing Code</AlertTitle>
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={findIssues} 
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
        <p>AI is analyzing your code for issues...</p>
      </div>
    );
  }

  if (issues.length === 0 && !loading && !error) {
    if (code.trim() && !loading) {
      return (
        <div className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <ZapIcon className="h-4 w-4 text-green-500" />
            <AlertTitle>Ready to Analyze</AlertTitle>
            <AlertDescription>
              Click the button below to check your code for potential issues.
            </AlertDescription>
          </Alert>
          <Button onClick={findIssues} className="w-full">
            <Bug className="mr-2 h-4 w-4" />
            Debug My Code
          </Button>
        </div>
      );
    }

    return (
      <Alert className="bg-green-50 border-green-200">
        <ZapIcon className="h-4 w-4 text-green-500" />
        <AlertTitle>No Issues Found</AlertTitle>
        <AlertDescription>
          Your code looks good! No obvious issues were detected.
          <Button 
            variant="outline" 
            size="sm" 
            onClick={findIssues} 
            className="ml-2"
          >
            <RefreshCw className="mr-2 h-3 w-3" />
            Check Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Found {issues.length} Potential Issues</h3>
        <Button variant="outline" size="sm" onClick={findIssues}>
          <RefreshCw className="mr-2 h-3 w-3" />
          Refresh
        </Button>
      </div>
      <div className="space-y-2">
        {issues.map((issue, index) => (
          <Card key={index} className={
            issue.type === "error" 
              ? "border-red-200 bg-red-50" 
              : issue.type === "warning" 
                ? "border-amber-200 bg-amber-50"
                : "border-blue-200 bg-blue-50"
          }>
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                {issue.type === "error" ? (
                  <XCircleIcon className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                ) : issue.type === "warning" ? (
                  <AlertTriangleIcon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <InfoIcon className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-medium flex items-center gap-2">
                    Line {issue.lineNumber}: {issue.message}
                  </div>
                  <div className="text-sm mt-1 text-muted-foreground">
                    {issue.suggestion}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DebugSuggestions;
