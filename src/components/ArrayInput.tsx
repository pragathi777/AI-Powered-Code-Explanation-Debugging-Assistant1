
import { useState } from 'react';
import { useAlgorithm } from '@/contexts/AlgorithmContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

const ArrayInput = () => {
  const { generateRandomArray, setArray } = useAlgorithm();
  const [inputValue, setInputValue] = useState('');
  const [arraySize, setArraySize] = useState<number>(10);
  const [minValue, setMinValue] = useState<number>(1);
  const [maxValue, setMaxValue] = useState<number>(100);
  const { toast } = useToast();

  const handleManualInput = () => {
    // Parse input value (comma-separated numbers)
    try {
      const values = inputValue.split(',').map(item => parseInt(item.trim()));
      
      // Validate input
      if (values.some(isNaN)) {
        toast({
          title: 'Invalid input',
          description: 'Please enter valid numbers separated by commas.',
          variant: 'destructive',
        });
        return;
      }
      
      if (values.length < 2) {
        toast({
          title: 'Not enough values',
          description: 'Please enter at least two numbers.',
          variant: 'destructive',
        });
        return;
      }
      
      setArray(values);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to parse input. Please check your format.',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateRandom = () => {
    generateRandomArray(arraySize, minValue, maxValue);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium">Manual Input</h3>
        <div className="flex space-x-2">
          <Input
            placeholder="Enter numbers separated by commas (e.g., 5, 2, 9, 1, 5)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button onClick={handleManualInput}>Set</Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium">Random Generation</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Array Size: {arraySize}</span>
            </div>
            <Slider 
              value={[arraySize]} 
              min={2} 
              max={30} 
              step={1} 
              onValueChange={(value) => setArraySize(value[0])}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <span>Min Value: {minValue}</span>
              <Slider 
                value={[minValue]} 
                min={1} 
                max={maxValue - 1} 
                step={1} 
                onValueChange={(value) => setMinValue(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <span>Max Value: {maxValue}</span>
              <Slider 
                value={[maxValue]} 
                min={minValue + 1} 
                max={200} 
                step={1} 
                onValueChange={(value) => setMaxValue(value[0])}
              />
            </div>
          </div>
          
          <Button onClick={handleGenerateRandom} className="w-full" variant="outline">
            Generate Random Array
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArrayInput;
