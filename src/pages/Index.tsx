
import { useState, useEffect } from 'react';
import { AlgorithmProvider, useAlgorithm } from '@/contexts/AlgorithmContext';
import AlgorithmSelector from '@/components/AlgorithmSelector';
import ArrayInput from '@/components/ArrayInput';
import ArrayVisualizer from '@/components/ArrayVisualizer';
import ControlPanel from '@/components/ControlPanel';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import AlgorithmInfo from '@/components/AlgorithmInfo';
import SearchTarget from '@/components/SearchTarget';
import { Algorithm, ALGORITHMS } from '@/constants/algorithms';
import { bubbleSort, insertionSort, quickSort } from '@/utils/sortingAlgorithms';
import { useToast } from '@/hooks/use-toast';

const AlgorithmVisualizer = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const { state, dispatch } = useAlgorithm();
  const { toast } = useToast();

  const handleAlgorithmSelect = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    dispatch({ type: 'RESET' });
  };

  const handleStartVisualization = () => {
    if (!selectedAlgorithm) {
      toast({
        title: 'No algorithm selected',
        description: 'Please select an algorithm to visualize.',
        variant: 'destructive',
      });
      return;
    }

    if (state.array.length === 0) {
      toast({
        title: 'No data to visualize',
        description: 'Please generate or input an array first.',
        variant: 'destructive',
      });
      return;
    }

    // Generate steps based on selected algorithm
    let steps;
    switch (selectedAlgorithm.id) {
      case 'bubble-sort':
        steps = bubbleSort(state.array);
        break;
      case 'insertion-sort':
        steps = insertionSort(state.array);
        break;
      case 'quick-sort':
        steps = quickSort(state.array);
        break;
      // Searching algorithms are handled by the SearchTarget component
      default:
        return;
    }

    dispatch({ type: 'SET_STEPS', payload: steps });
  };

  useEffect(() => {
    // Reset whenever the algorithm changes
    return () => {
      dispatch({ type: 'RESET' });
    };
  }, [selectedAlgorithm]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">Visual Algorithm Simulator</h1>
        <p className="text-gray-600">Interactive tool to visualize sorting and searching algorithms</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Choose Algorithm</h2>
            <AlgorithmSelector 
              onSelect={handleAlgorithmSelect} 
              selectedAlgorithmId={selectedAlgorithm?.id || null} 
            />
          </div>
          
          {selectedAlgorithm && (
            <AlgorithmInfo algorithm={selectedAlgorithm} />
          )}
          
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Input Data</h2>
            <ArrayInput />
          </div>
          
          {selectedAlgorithm?.type === 'searching' && (
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Search Target</h2>
              <SearchTarget 
                onSearchStepsGenerated={() => {}}
                selectedAlgorithmId={selectedAlgorithm.id}
              />
            </div>
          )}
          
          {selectedAlgorithm?.type === 'sorting' && (
            <div className="mt-4">
              <button
                className="w-full py-2 px-4 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 transition-colors"
                onClick={handleStartVisualization}
              >
                Start Visualization
              </button>
            </div>
          )}
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Visualization</h2>
            <ArrayVisualizer />
          </div>
          
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Controls</h2>
            <ControlPanel />
          </div>
          
          <PerformanceMetrics selectedAlgorithm={selectedAlgorithm} />
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AlgorithmProvider>
      <AlgorithmVisualizer />
    </AlgorithmProvider>
  );
};

export default Index;
