
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X, FileUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PdfUploaderProps {
  onPdfContent: (content: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ 
  onPdfContent, 
  isLoading,
  setIsLoading 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real application, we would use a PDF parsing library
      // For this demo, we'll simulate PDF content extraction
      setTimeout(() => {
        // Simulate extracted text from the PDF
        const mockPdfContent = `
          # Introduction to Algorithms
          
          Algorithms are step-by-step procedures for solving problems. They are essential in computer science.
          
          ## Types of Algorithms
          
          1. Sorting Algorithms: Used to rearrange elements in a specific order.
          2. Search Algorithms: Used to find an element in a data structure.
          3. Graph Algorithms: Used to solve problems related to graph data structures.
          
          ## Time Complexity
          
          Time complexity is a measure of the amount of time an algorithm takes to complete as a function of the length of the input.
          
          Common time complexities include:
          - O(1): Constant time
          - O(log n): Logarithmic time
          - O(n): Linear time
          - O(n log n): Log-linear time
          - O(n²): Quadratic time
          - O(2^n): Exponential time
        `;
        
        onPdfContent(mockPdfContent);
        setIsLoading(false);
        
        toast({
          title: "PDF Processed",
          description: `Successfully processed ${file.name}`,
        });
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error processing PDF",
        description: "There was an error processing the PDF file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Label>Upload PDF Document</Label>
      
      {!file ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <FileUp className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              Drag and drop a PDF file here, or click to browse
            </p>
            <Input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("pdf-upload")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose PDF
            </Button>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium truncate max-w-[200px]">
                  {file.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({Math.round(file.size / 1024)} KB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleUpload} 
          disabled={!file || isLoading}
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">◌</span>
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Process PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PdfUploader;
