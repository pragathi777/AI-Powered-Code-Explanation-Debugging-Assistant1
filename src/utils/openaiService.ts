
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
