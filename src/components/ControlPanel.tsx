
import { useAlgorithm } from '@/contexts/AlgorithmContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw,
  Zap
} from 'lucide-react';

const ControlPanel = () => {
  const { state, dispatch } = useAlgorithm();
  const { isPlaying, speed, currentStep, steps } = state;
  
  const handlePlayPause = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };
  
  const handleStepForward = () => {
    dispatch({ type: 'NEXT_STEP' });
  };
  
  const handleStepBackward = () => {
    dispatch({ type: 'PREV_STEP' });
  };
  
  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };
  
  const handleSpeedChange = (value: number[]) => {
    // Convert slider value (1-5) to milliseconds (1000ms - 100ms)
    const speedInMs = 1100 - (value[0] * 200);
    dispatch({ type: 'SET_SPEED', payload: speedInMs });
  };
  
  // Calculate progress
  const progress = steps.length > 0 ? Math.round((currentStep / (steps.length - 1)) * 100) : 0;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          disabled={steps.length === 0}
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleStepBackward}
          disabled={currentStep <= 0 || steps.length === 0}
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        
        <Button
          variant={isPlaying ? 'secondary' : 'default'}
          size="icon"
          onClick={handlePlayPause}
          disabled={steps.length === 0 || currentStep >= steps.length - 1}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleStepForward}
          disabled={currentStep >= steps.length - 1 || steps.length === 0}
        >
          <SkipForward className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <Slider
            value={[(1100 - speed) / 200]}
            min={1}
            max={5}
            step={1}
            onValueChange={handleSpeedChange}
            className="w-24"
          />
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{progress}% Complete</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
