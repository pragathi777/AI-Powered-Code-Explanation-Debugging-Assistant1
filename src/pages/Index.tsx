
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, FileText, ArrowLeft } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Handle mouse movement for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Calculate distance from center (for parallax effect)
    setMousePosition({
      x: (clientX - centerX) / 25,
      y: (clientY - centerY) / 25
    });
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div 
      className="relative min-h-screen w-full overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" 
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1498050108023-c5249f4df085')`,
          filter: 'brightness(0.3)'
        }}
      />

      {/* Moving particles based on cursor */}
      <div className="absolute inset-0 z-10">
        <div className="moving-particle bg-primary/20 rounded-full w-32 h-32 absolute blur-3xl"
          style={{ 
            top: '20%', 
            left: '20%', 
            transform: `translate(${mousePosition.x * -1.5}px, ${mousePosition.y * -1.5}px)`,
            transition: 'transform 0.2s ease-out'
          }}
        />
        <div className="moving-particle bg-indigo-500/20 rounded-full w-48 h-48 absolute blur-3xl"
          style={{ 
            top: '60%', 
            left: '60%', 
            transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
            transition: 'transform 0.2s ease-out'
          }}
        />
        <div className="moving-particle bg-blue-500/20 rounded-full w-40 h-40 absolute blur-3xl"
          style={{ 
            top: '30%', 
            left: '70%', 
            transform: `translate(${mousePosition.x * 1.2}px, ${mousePosition.y * 1.2}px)`,
            transition: 'transform 0.2s ease-out'
          }}
        />
      </div>

      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <Button 
          onClick={handleBack} 
          variant="outline" 
          size="icon" 
          className="bg-background/30 backdrop-blur-sm border-white/10 hover:bg-background/50 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12 relative z-20">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
          <h1 
            className="text-5xl md:text-6xl font-bold tracking-tight text-white"
            style={{ 
              transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            AI-Powered Algorithm & Code Assistant
          </h1>
          <p 
            className="text-xl text-gray-300 max-w-3xl"
            style={{ 
              transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            Explore our tools for algorithm visualization, code assistance, and PDF-based learning. Perfect for students, teachers, and developers.
          </p>
          <div 
            className="flex flex-wrap justify-center gap-4 mt-8"
            style={{ 
              transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <Button 
              asChild 
              size="lg" 
              className="hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Link to="/code-assistant">
                <Code2 className="mr-2" />
                Code Assistant
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="backdrop-blur-sm bg-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Link to="/pdf-assistant">
                <FileText className="mr-2" />
                PDF Assistant
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
