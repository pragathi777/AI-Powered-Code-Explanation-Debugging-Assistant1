
import { AlgorithmStep, ArrayElement } from '../types/algorithm';

// Helper function to create a deep copy of the array
const cloneArray = (array: ArrayElement[]): ArrayElement[] => {
  return array.map(element => ({ ...element }));
};

// Helper function to create a step
const createStep = (
  array: ArrayElement[],
  description: string,
  comparison?: [number, number]
): AlgorithmStep => {
  return {
    array: cloneArray(array),
    description,
    comparison
  };
};

// Linear Search Algorithm
export const linearSearch = (array: ArrayElement[], target: number): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arrayToSearch = cloneArray(array);
  
  steps.push(createStep(
    arrayToSearch,
    `Starting Linear Search for target value: ${target}.`
  ));
  
  for (let i = 0; i < arrayToSearch.length; i++) {
    arrayToSearch[i].status = 'comparing';
    
    steps.push(createStep(
      arrayToSearch,
      `Checking element at index ${i}: ${arrayToSearch[i].value}.`,
      [i, i]
    ));
    
    if (arrayToSearch[i].value === target) {
      arrayToSearch[i].status = 'sorted';
      
      steps.push(createStep(
        arrayToSearch,
        `Target value ${target} found at index ${i}!`
      ));
      
      return steps;
    }
    
    arrayToSearch[i].status = 'default';
  }
  
  steps.push(createStep(
    arrayToSearch,
    `Target value ${target} not found in the array.`
  ));
  
  return steps;
};

// Binary Search Algorithm (requires sorted array)
export const binarySearch = (array: ArrayElement[], target: number): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arrayToSearch = cloneArray(array);
  
  steps.push(createStep(
    arrayToSearch,
    `Starting Binary Search for target value: ${target}.`
  ));
  
  let left = 0;
  let right = arrayToSearch.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // Highlight current search range
    for (let i = left; i <= right; i++) {
      arrayToSearch[i].status = 'default';
    }
    
    arrayToSearch[mid].status = 'comparing';
    
    steps.push(createStep(
      arrayToSearch,
      `Checking middle element at index ${mid}: ${arrayToSearch[mid].value}.`,
      [mid, mid]
    ));
    
    if (arrayToSearch[mid].value === target) {
      arrayToSearch[mid].status = 'sorted';
      
      steps.push(createStep(
        arrayToSearch,
        `Target value ${target} found at index ${mid}!`
      ));
      
      return steps;
    }
    
    if (arrayToSearch[mid].value < target) {
      steps.push(createStep(
        arrayToSearch,
        `${arrayToSearch[mid].value} is less than ${target}. Search in the right half.`
      ));
      
      left = mid + 1;
    } else {
      steps.push(createStep(
        arrayToSearch,
        `${arrayToSearch[mid].value} is greater than ${target}. Search in the left half.`
      ));
      
      right = mid - 1;
    }
  }
  
  steps.push(createStep(
    arrayToSearch,
    `Target value ${target} not found in the array.`
  ));
  
  return steps;
};
