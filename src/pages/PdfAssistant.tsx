
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import PdfUploader from "@/components/PdfUploader";
import PdfQuestionGenerator from "@/components/PdfQuestionGenerator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  FileText, 
  BookOpen
} from "lucide-react";

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
              Questions Generated from PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PdfQuestionGenerator pdfContent={pdfContent} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PdfAssistant;
