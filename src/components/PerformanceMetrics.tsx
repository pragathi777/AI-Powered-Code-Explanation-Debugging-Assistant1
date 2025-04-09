
import { useAlgorithm } from '@/contexts/AlgorithmContext';
import { Algorithm } from '@/constants/algorithms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceMetricsProps {
  selectedAlgorithm: Algorithm | null;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ selectedAlgorithm }) => {
  const { state } = useAlgorithm();
  const { comparisons, swaps, array } = state;
  
  if (!selectedAlgorithm) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Algorithm Complexity</CardTitle>
          <CardDescription>
            Time and space complexity of {selectedAlgorithm.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <p className="text-sm font-medium">Time Complexity:</p>
              <ul className="text-sm">
                <li>Best: {selectedAlgorithm.timeComplexity.best}</li>
                <li>Average: {selectedAlgorithm.timeComplexity.average}</li>
                <li>Worst: {selectedAlgorithm.timeComplexity.worst}</li>
              </ul>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Space Complexity:</p>
              <p className="text-sm">{selectedAlgorithm.spaceComplexity}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Current Execution</CardTitle>
          <CardDescription>
            Real-time performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div className="border rounded p-2">
              <p className="text-sm font-medium">Comparisons</p>
              <p className="text-2xl font-bold">{comparisons}</p>
            </div>
            <div className="border rounded p-2">
              <p className="text-sm font-medium">Swaps/Operations</p>
              <p className="text-2xl font-bold">{swaps}</p>
            </div>
            <div className="border rounded p-2 col-span-2">
              <p className="text-sm font-medium">Array Size</p>
              <p className="text-2xl font-bold">{array.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
