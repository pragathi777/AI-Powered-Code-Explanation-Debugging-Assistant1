
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import PdfUploader from "@/components/PdfUploader";
import PdfQuestionGenerator from "@/components/PdfQuestionGenerator";
import AiAnswerGenerator from "@/components/pdf-ai/AiAnswerGenerator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  FileText, 
  BookOpen,
  Sparkles
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PdfAssistant = () => {
  const [pdfContent, setPdfContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handlePdfContent = (content: string) => {
    setPdfContent(content);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              PDF Uploader
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PdfUploader 
              onPdfContent={handlePdfContent} 
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              PDF Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="questions" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="questions">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Generated Questions
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Answers
                </TabsTrigger>
              </TabsList>
              <TabsContent value="questions">
                <PdfQuestionGenerator pdfContent={pdfContent} />
              </TabsContent>
              <TabsContent value="ai">
                <AiAnswerGenerator pdfContent={pdfContent} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PdfAssistant;
