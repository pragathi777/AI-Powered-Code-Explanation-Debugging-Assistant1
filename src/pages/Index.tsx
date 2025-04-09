
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">AI-Powered Algorithm & Code Assistant</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Explore our tools for algorithm visualization and code assistance. Perfect for students, teachers, and developers.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/code-assistant">
              <Code2 className="mr-2" />
              Code Assistant
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
