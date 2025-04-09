
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { InfoIcon, ZapIcon, AlertTriangleIcon, XCircleIcon } from "lucide-react";

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

  useEffect(() => {
    if (code.trim()) {
      findIssues();
    } else {
      setIssues([]);
    }
  }, [code, language]);

  const findIssues = () => {
    setLoading(true);
    
    // Simulate API call to get debugging suggestions
    setTimeout(() => {
      const mockIssues: DebugIssue[] = [];
      const codeLines = code.split("\n");
      
      // Simple pattern matching for common issues
      codeLines.forEach((line, index) => {
        const lineNumber = index + 1;
        
        // Check for missing semicolons (JavaScript/TypeScript)
        if ((language === "javascript" || language === "typescript") && 
            !line.trim().endsWith(";") && 
            !line.trim().endsWith("{") && 
            !line.trim().endsWith("}") && 
            !line.trim().startsWith("import") &&
            !line.trim().startsWith("//") &&
            line.trim().length > 0) {
          mockIssues.push({
            type: "warning",
            lineNumber,
            message: "Missing semicolon",
            suggestion: "Add a semicolon at the end of this line",
          });
        }
        
        // Check for console.log statements
        if (line.includes("console.log")) {
          mockIssues.push({
            type: "suggestion",
            lineNumber,
            message: "Debugging console.log statement found",
            suggestion: "Consider removing console.log statements before deploying to production",
          });
        }
        
        // Check for potential undefined variables (very basic check)
        if ((line.includes("=") || line.includes("(")) && 
            !(line.includes("var ") || line.includes("let ") || line.includes("const "))) {
          const parts = line.split(/[=( ]/);
          if (parts.length > 1 && !['if', 'for', 'while', 'switch', 'function', 'return'].includes(parts[0].trim())) {
            mockIssues.push({
              type: "warning",
              lineNumber,
              message: "Potential use of undeclared variable",
              suggestion: "Make sure all variables are properly declared with var, let, or const",
            });
          }
        }
        
        // Add a mock critical error for demonstration purposes if the code is long enough
        if (codeLines.length > 5 && index === Math.floor(codeLines.length / 2)) {
          mockIssues.push({
            type: "error",
            lineNumber,
            message: "Uncaught TypeError: Cannot read property of undefined",
            suggestion: "Check that all objects are properly initialized before accessing their properties",
          });
        }
      });
      
      setIssues(mockIssues);
      setLoading(false);
    }, 1000);
  };

  if (!code.trim()) {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>No Code to Debug</AlertTitle>
        <AlertDescription>
          Enter some code in the editor and click "Analyze Code" to get debugging suggestions.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return <div className="p-4 text-center">Analyzing your code for issues...</div>;
  }

  if (issues.length === 0) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <ZapIcon className="h-4 w-4 text-green-500" />
        <AlertTitle>No Issues Found</AlertTitle>
        <AlertDescription>
          Your code looks good! No obvious issues were detected.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Found {issues.length} Potential Issues</h3>
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
