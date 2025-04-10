
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import CodeEditor from "@/components/CodeEditor";
import CodeExplanation from "@/components/CodeExplanation";
import DebugSuggestions from "@/components/DebugSuggestions";
import QuizGenerator from "@/components/QuizGenerator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Code2, 
  BugPlay, 
  ClipboardCheck,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { getOpenAIKey } from "@/utils/openaiService";

const CodeAssistant = () => {
  const [code, setCode] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("javascript");
  const [shouldAnalyze, setShouldAnalyze] = useState<boolean>(false);
  const { toast } = useToast();

  // Check for API key on component mount
  useEffect(() => {
    const hasApiKey = !!getOpenAIKey();
    if (hasApiKey) {
      toast({
        title: "OpenAI API Key Detected",
        description: "AI-powered code analysis is ready to use.",
      });
    }
  }, [toast]);

  const handleAnalyze = () => {
    if (!code.trim()) {
      toast({
        title: "Empty Code",
        description: "Please enter some code to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setShouldAnalyze(true);
    
    // Set a brief delay to allow UI to update
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Ready",
        description: "AI is ready to explain your code.",
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Code Editor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodeEditor 
              code={code} 
              setCode={setCode} 
              language={language}
              setLanguage={setLanguage}
            />
            <div className="mt-4 flex justify-between items-center">
              <div>
                <span className="text-sm text-muted-foreground">
                  Language: {language}
                </span>
              </div>
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !code.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Code
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="explain">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="explain" className="flex items-center gap-1">
                  <Code2 className="h-4 w-4" />
                  Explain
                </TabsTrigger>
                <TabsTrigger value="debug" className="flex items-center gap-1">
                  <BugPlay className="h-4 w-4" />
                  Debug
                </TabsTrigger>
                <TabsTrigger value="quiz" className="flex items-center gap-1">
                  <ClipboardCheck className="h-4 w-4" />
                  Quiz
                </TabsTrigger>
              </TabsList>
              <TabsContent value="explain">
                <CodeExplanation code={code} language={language} />
              </TabsContent>
              <TabsContent value="debug">
                <DebugSuggestions code={code} language={language} />
              </TabsContent>
              <TabsContent value="quiz">
                <QuizGenerator code={code} language={language} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodeAssistant;
