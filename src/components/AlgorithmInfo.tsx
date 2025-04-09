
import { Algorithm } from '@/constants/algorithms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AlgorithmInfoProps {
  algorithm: Algorithm | null;
}

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ algorithm }) => {
  if (!algorithm) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{algorithm.name}</CardTitle>
        <CardDescription>
          {algorithm.type.charAt(0).toUpperCase() + algorithm.type.slice(1)} Algorithm
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">{algorithm.description}</p>
      </CardContent>
    </Card>
  );
};

export default AlgorithmInfo;
