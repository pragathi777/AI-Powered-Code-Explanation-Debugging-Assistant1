
import { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Algorithm, ALGORITHMS } from '@/constants/algorithms';

interface AlgorithmSelectorProps {
  onSelect: (algorithm: Algorithm) => void;
  selectedAlgorithmId: string | null;
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({ onSelect, selectedAlgorithmId }) => {
  const [algorithmType, setAlgorithmType] = useState<'sorting' | 'searching'>('sorting');
  
  const handleAlgorithmChange = (value: string) => {
    const algorithm = ALGORITHMS.find(alg => alg.id === value);
    if (algorithm) {
      onSelect(algorithm);
    }
  };
  
  const filteredAlgorithms = ALGORITHMS.filter(alg => alg.type === algorithmType);
  
  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <button
          className={`px-4 py-2 rounded-md ${algorithmType === 'sorting' ? 'bg-primary text-white' : 'bg-secondary'}`}
          onClick={() => setAlgorithmType('sorting')}
        >
          Sorting
        </button>
        <button
          className={`px-4 py-2 rounded-md ${algorithmType === 'searching' ? 'bg-primary text-white' : 'bg-secondary'}`}
          onClick={() => setAlgorithmType('searching')}
        >
          Searching
        </button>
      </div>
      
      <Select onValueChange={handleAlgorithmChange} value={selectedAlgorithmId || undefined}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an algorithm" />
        </SelectTrigger>
        <SelectContent>
          {filteredAlgorithms.map(algorithm => (
            <SelectItem key={algorithm.id} value={algorithm.id}>
              {algorithm.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AlgorithmSelector;
