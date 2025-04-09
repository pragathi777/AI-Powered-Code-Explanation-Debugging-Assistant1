
import React from "react";
import { RefreshCw } from "lucide-react";

const LoadingQuestions: React.FC = () => {
  return (
    <div className="p-4 text-center">
      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
      <p>Generating questions from PDF content...</p>
    </div>
  );
};

export default LoadingQuestions;
