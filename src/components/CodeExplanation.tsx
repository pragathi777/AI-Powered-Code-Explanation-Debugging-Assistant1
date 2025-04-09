
import React, { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Code2 } from "lucide-react";

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

  useEffect(() => {
    if (code.trim()) {
      analyzeCode();
    } else {
      setExplanations([]);
    }
  }, [code, language]);

  const analyzeCode = () => {
    setLoading(true);
    
    // Simulate API call to get explanations
    setTimeout(() => {
      const codeLines = code.split("\n");
      
      // Generate mock explanations based on code content
      const mockExplanations = codeLines.map((line, index) => {
        const trimmedLine = line.trim();
        let explanation = "This line doesn't contain any specific code to explain.";
        
        // Simple patterns to detect
        if (trimmedLine.includes("function") || trimmedLine.includes("=>")) {
          explanation = "This line defines a function, which is a reusable block of code.";
        } else if (trimmedLine.includes("if") || trimmedLine.includes("else")) {
          explanation = "This is a conditional statement that controls the flow of execution based on a condition.";
        } else if (trimmedLine.includes("for") || trimmedLine.includes("while")) {
          explanation = "This is a loop that repeats an action a certain number of times or until a condition is met.";
        } else if (trimmedLine.includes("return")) {
          explanation = "This statement returns a value from a function and ends its execution.";
        } else if (trimmedLine.includes("const") || trimmedLine.includes("let") || trimmedLine.includes("var")) {
          explanation = "This line declares a variable to store data.";
        } else if (trimmedLine.includes("class")) {
          explanation = "This defines a class, which is a blueprint for creating objects with shared properties and methods.";
        } else if (trimmedLine.includes("import") || trimmedLine.includes("require")) {
          explanation = "This line imports functionality from another module or file.";
        }
        
        return {
          lineNumber: index + 1,
          code: line,
          explanation,
        };
      }).filter(item => item.code.trim());
      
      setExplanations(mockExplanations);
      setLoading(false);
    }, 1000);
  };

  if (!code.trim()) {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>No Code to Explain</AlertTitle>
        <AlertDescription>
          Enter some code in the editor and click "Analyze Code" to get explanations.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return <div className="p-4 text-center">Analyzing your code...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Line-by-Line Explanation</h3>
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
