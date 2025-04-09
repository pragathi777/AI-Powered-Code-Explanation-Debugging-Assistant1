
import { useAlgorithm } from '@/contexts/AlgorithmContext';
import { cn } from '@/lib/utils';
import { ArrayElement } from '@/types/algorithm';

const ArrayVisualizer = () => {
  const { state } = useAlgorithm();
  const { array, steps, currentStep } = state;
  
  // Get current step information
  const currentStepInfo = steps[currentStep] || { description: 'No visualization yet.', array: [] };
  
  // Calculate the height factor for better visualization
  const getHeight = (value: number) => {
    const maxValue = Math.max(...array.map(el => el.value));
    return (value / maxValue) * 100;
  };
  
  // Determine element status class
  const getStatusClass = (element: ArrayElement) => {
    switch (element.status) {
      case 'comparing':
        return 'border-amber-500 bg-amber-100';
      case 'swapping':
        return 'border-red-500 bg-red-100';
      case 'sorted':
        return 'border-green-500 bg-green-100';
      default:
        return 'border-gray-300 bg-white';
    }
  };
  
  // Determine animation class
  const getAnimationClass = (element: ArrayElement, index: number) => {
    if (!steps[currentStep]) return '';
    
    const currentStepData = steps[currentStep];
    
    if (currentStepData.comparison && (index === currentStepData.comparison[0] || index === currentStepData.comparison[1])) {
      return 'array-element-comparing';
    }
    
    if (currentStepData.swap && (index === currentStepData.swap[0] || index === currentStepData.swap[1])) {
      return 'array-element-swapping';
    }
    
    return '';
  };
  
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg bg-gray-50 min-h-[100px]">
        <p className="text-sm text-gray-700 mb-4">{currentStepInfo.description}</p>
        
        <div className="flex justify-center items-end h-[200px] space-x-1">
          {array.map((element, index) => (
            <div
              key={element.id}
              className={cn(
                'array-element',
                getStatusClass(element),
                getAnimationClass(element, index)
              )}
              style={{
                height: `${getHeight(element.value)}%`,
                width: array.length > 15 ? '20px' : '40px',
              }}
            >
              <span className={array.length > 15 ? 'text-xs' : 'text-sm'}>
                {element.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArrayVisualizer;
