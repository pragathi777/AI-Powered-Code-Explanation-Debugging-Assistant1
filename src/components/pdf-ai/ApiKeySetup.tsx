
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Lock, Eye, EyeOff } from "lucide-react";
import { setOpenAIKey, getOpenAIKey, clearOpenAIKey } from "@/utils/openaiService";
import { useToast } from "@/components/ui/use-toast";

interface ApiKeySetupProps {
  onKeySet: (isSet: boolean) => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onKeySet }) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isKeySet, setIsKeySet] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = getOpenAIKey();
    if (savedKey) {
      setIsKeySet(true);
      onKeySet(true);
    }
  }, [onKeySet]);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter an OpenAI API key",
        variant: "destructive"
      });
      return;
    }

    try {
      setOpenAIKey(apiKey);
      setIsKeySet(true);
      onKeySet(true);
      setApiKey("");
      toast({
        title: "API Key Saved",
        description: "Your API key has been securely saved for this session",
      });
    } catch (error) {
      toast({
        title: "Error Saving API Key",
        description: "There was a problem saving your API key",
        variant: "destructive"
      });
    }
  };

  const handleClearKey = () => {
    clearOpenAIKey();
    setIsKeySet(false);
    onKeySet(false);
    toast({
      title: "API Key Removed",
      description: "Your API key has been removed",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Key className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">OpenAI Integration</h3>
      </div>
      
      {!isKeySet ? (
        <>
          <p className="text-sm text-muted-foreground">
            Enter your OpenAI API key to enable AI-powered answers. Your key is stored locally in your browser and is not sent to our servers.
          </p>
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Button onClick={handleSaveKey} className="w-full">
            <Lock className="mr-2 h-4 w-4" />
            Save API Key
          </Button>
        </>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-green-50 dark:bg-green-950 p-3 rounded-md">
            <p className="text-sm text-green-700 dark:text-green-300">
              <Lock className="inline h-4 w-4 mr-1" />
              API key is set and ready to use
            </p>
            <Button variant="outline" size="sm" onClick={handleClearKey}>
              Remove Key
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeySetup;
