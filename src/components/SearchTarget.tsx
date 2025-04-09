
import { useState } from 'react';
import { useAlgorithm } from '@/contexts/AlgorithmContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { linearSearch, binarySearch } from '@/utils/searchingAlgorithms';

interface SearchTargetProps {
  onSearchStepsGenerated: () => void;
  selectedAlgorithmId: string;
}

const SearchTarget: React.FC<SearchTargetProps> = ({ 
  onSearchStepsGenerated,
  selectedAlgorithmId
}) => {
  const [target, setTarget] = useState<string>('');
  const { state, dispatch } = useAlgorithm();
  const { toast } = useToast();
  
  const handleSearch = () => {
    const targetNum = parseInt(target);
    
    if (isNaN(targetNum)) {
      toast({
        title: 'Invalid target',
        description: 'Please enter a valid number to search for.',
        variant: 'destructive',
      });
      return;
    }
    
    if (state.array.length === 0) {
      toast({
        title: 'Empty array',
        description: 'Please generate an array first.',
        variant: 'destructive',
      });
      return;
    }
    
    // If binary search, check if array is sorted
    if (selectedAlgorithmId === 'binary-search') {
      const isSorted = state.array.every((element, index, array) => {
        return index === 0 || element.value >= array[index - 1].value;
      });
      
      if (!isSorted) {
        toast({
          title: 'Array not sorted',
          description: 'Binary search requires a sorted array. Please sort your array first.',
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Generate search steps
    let steps;
    if (selectedAlgorithmId === 'binary-search') {
      steps = binarySearch(state.array, targetNum);
    } else {
      steps = linearSearch(state.array, targetNum);
    }
    
    dispatch({ type: 'SET_STEPS', payload: steps });
    onSearchStepsGenerated();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="number"
          placeholder="Enter a value to search for"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
    </div>
  );
};

export default SearchTarget;
