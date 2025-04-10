
import { toast } from "@/components/ui/use-toast";

// This is a temporary solution - in production, API keys should be managed on the server side
let apiKey: string | null = null;

export const setOpenAIKey = (key: string) => {
  apiKey = key;
  localStorage.setItem('temp_openai_key', key);
  return true;
};

export const getOpenAIKey = (): string | null => {
  if (!apiKey) {
    apiKey = localStorage.getItem('temp_openai_key');
  }
  return apiKey;
};

export const clearOpenAIKey = () => {
  apiKey = null;
  localStorage.removeItem('temp_openai_key');
};

export const getAIAnswer = async (prompt: string): Promise<string> => {
  const key = getOpenAIKey();
  
  if (!key) {
    throw new Error("API key not set");
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides concise, educational answers."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to get answer");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching AI answer:", error);
    throw error;
  }
};

export const generateQuestions = async (pdfContent: string, numberOfQuestions: number = 4): Promise<Array<{id: string, question: string, options: string[], correctAnswer: number, explanation: string}>> => {
  const key = getOpenAIKey();
  
  if (!key) {
    throw new Error("API key not set");
  }
  
  try {
    const prompt = `
Generate ${numberOfQuestions} multiple-choice questions based on the following content. 
Make sure the questions test different aspects of the material and have varying difficulty levels.

PDF Content:
"""
${pdfContent}
"""

For each question:
1. Create a clear, concise question
2. Provide 4 possible answers (only one should be correct)
3. Indicate which answer is correct (0-indexed, from 0 to 3)
4. Include a brief explanation of why the correct answer is right

Respond with ONLY a JSON array where each question has:
- id: a unique string ID (q1, q2, etc.)
- question: the question text
- options: array of 4 possible answers
- correctAnswer: number from 0-3 indicating the correct option index
- explanation: brief explanation of the correct answer

Example format:
[
  {
    "id": "q1",
    "question": "What is X?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 2,
    "explanation": "C is correct because..."
  }
]
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an educational content creator who creates thoughtful, accurate multiple-choice questions to test understanding of academic material."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate questions");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    try {
      // Handle case where the AI might include markdown code blocks or extra text
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback to trying to parse the whole content
      return JSON.parse(content);
    } catch (parseError) {
      console.error("Error parsing JSON from AI response:", parseError);
      throw new Error("Failed to parse questions from AI response");
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};

export const explainCode = async (code: string, language: string): Promise<Array<{lineNumber: number, code: string, explanation: string}>> => {
  const key = getOpenAIKey();
  
  if (!key) {
    throw new Error("API key not set");
  }
  
  try {
    const codeLines = code.split("\n");
    const prompt = `
I need you to explain each line of the following ${language} code in simple terms. 
For each line, provide a brief, beginner-friendly explanation of what it does.
Only explain lines that contain actual code (ignore empty lines or simple brackets).
Respond with a JSON array where each item has:
- lineNumber (the line number starting from 1)
- code (the original code line)
- explanation (brief explanation of what this code does)

Code:
\`\`\`${language}
${code}
\`\`\`

Important: ONLY respond with the JSON array and nothing else. Format should be:
[{"lineNumber": 1, "code": "const x = 5;", "explanation": "This creates a constant variable named x with value 5"}, ...]
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a coding tutor that explains code in simple terms that beginners can understand."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to explain code");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    try {
      // Handle case where the AI might include markdown code blocks or extra text
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback to trying to parse the whole content
      return JSON.parse(content);
    } catch (parseError) {
      console.error("Error parsing JSON from AI response:", parseError);
      
      // If parsing fails, return simpler explanations as fallback
      return codeLines.map((line, index) => {
        const trimmedLine = line.trim();
        return {
          lineNumber: index + 1,
          code: line,
          explanation: trimmedLine ? "This is a line of code." : ""
        };
      }).filter(item => item.explanation);
    }
  } catch (error) {
    console.error("Error explaining code:", error);
    throw error;
  }
};

export const debugCode = async (code: string, language: string): Promise<Array<{type: "error" | "warning" | "suggestion", lineNumber: number, message: string, suggestion: string}>> => {
  const key = getOpenAIKey();
  
  if (!key) {
    throw new Error("API key not set");
  }
  
  try {
    const prompt = `
Analyze this ${language} code for potential bugs, issues, or improvements.
Focus on finding:
1. Syntax errors
2. Logic errors 
3. Performance issues
4. Best practice violations

Code:
\`\`\`${language}
${code}
\`\`\`

Respond with a JSON array of issues. Each issue should have:
- type: either "error", "warning", or "suggestion"
- lineNumber: the line number where the issue occurs
- message: short description of the issue
- suggestion: how to fix it

Only respond with the JSON array in this format:
[{"type": "error", "lineNumber": 5, "message": "Uncaught TypeError potential", "suggestion": "Check that object exists before accessing properties"}, ...]

If no issues are found, return an empty array [].
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a code debugger that finds issues in code and suggests fixes."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to debug code");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    try {
      // Handle case where the AI might include markdown code blocks or extra text
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback to trying to parse the whole content
      return JSON.parse(content);
    } catch (parseError) {
      console.error("Error parsing JSON from AI response:", parseError);
      return []; // Return empty array as fallback
    }
  } catch (error) {
    console.error("Error debugging code:", error);
    throw error;
  }
};
