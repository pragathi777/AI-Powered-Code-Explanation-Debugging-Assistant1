
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const NoPdfContent: React.FC = () => {
  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>No PDF Content</AlertTitle>
      <AlertDescription>
        Upload a PDF document to generate questions.
      </AlertDescription>
    </Alert>
  );
};

export default NoPdfContent;
