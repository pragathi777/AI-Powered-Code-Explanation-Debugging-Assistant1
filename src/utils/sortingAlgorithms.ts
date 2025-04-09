
import { AlgorithmStep, ArrayElement } from '../types/algorithm';

// Helper function to create a deep copy of the array
const cloneArray = (array: ArrayElement[]): ArrayElement[] => {
  return array.map(element => ({ ...element }));
};

// Helper function to create a step
const createStep = (
  array: ArrayElement[],
  description: string,
  comparison?: [number, number],
  swap?: [number, number]
): AlgorithmStep => {
  return {
    array: cloneArray(array),
    description,
    comparison,
    swap
  };
};

// Bubble Sort Algorithm
export const bubbleSort = (array: ArrayElement[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arrayToSort = cloneArray(array);
  const n = arrayToSort.length;
  
  steps.push(createStep(
    arrayToSort, 
    'Starting Bubble Sort algorithm. We will compare adjacent elements and swap them if they are in the wrong order.'
  ));
  
  for (let i = 0; i < n; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      // Mark elements being compared
      arrayToSort[j].status = 'comparing';
      arrayToSort[j + 1].status = 'comparing';
      
      steps.push(createStep(
        arrayToSort,
        `Comparing elements at indices ${j} and ${j + 1}: ${arrayToSort[j].value} and ${arrayToSort[j + 1].value}`,
        [j, j + 1]
      ));
      
      // If elements need to be swapped
      if (arrayToSort[j].value > arrayToSort[j + 1].value) {
        arrayToSort[j].status = 'swapping';
        arrayToSort[j + 1].status = 'swapping';
        
        steps.push(createStep(
          arrayToSort,
          `Swapping elements: ${arrayToSort[j].value} and ${arrayToSort[j + 1].value}`,
          undefined,
          [j, j + 1]
        ));
        
        // Swap the elements
        [arrayToSort[j], arrayToSort[j + 1]] = [arrayToSort[j + 1], arrayToSort[j]];
        swapped = true;
      }
      
      // Reset status
      arrayToSort[j].status = 'default';
      arrayToSort[j + 1].status = 'default';
    }
    
    // Mark the last element as sorted
    arrayToSort[n - i - 1].status = 'sorted';
    
    steps.push(createStep(
      arrayToSort,
      `Element ${arrayToSort[n - i - 1].value} is now in its correct position.`
    ));
    
    // If no swapping occurred in this pass, the array is sorted
    if (!swapped) {
      // Mark all elements as sorted
      for (let k = 0; k < n - i - 1; k++) {
        arrayToSort[k].status = 'sorted';
      }
      
      steps.push(createStep(
        arrayToSort,
        'No swaps performed in this pass. The array is now sorted!'
      ));
      
      break;
    }
  }
  
  return steps;
};

// Insertion Sort Algorithm
export const insertionSort = (array: ArrayElement[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arrayToSort = cloneArray(array);
  const n = arrayToSort.length;
  
  steps.push(createStep(
    arrayToSort,
    'Starting Insertion Sort algorithm. We will build the sorted array one element at a time.'
  ));
  
  // Mark the first element as sorted
  arrayToSort[0].status = 'sorted';
  steps.push(createStep(
    arrayToSort,
    `First element ${arrayToSort[0].value} is considered sorted.`
  ));
  
  for (let i = 1; i < n; i++) {
    // Store the current element to be inserted
    const key = arrayToSort[i].value;
    const keyElement = { ...arrayToSort[i] };
    keyElement.status = 'comparing';
    
    steps.push(createStep(
      arrayToSort,
      `Picking element at index ${i}: ${key} to insert into the sorted portion.`,
      [i, i]
    ));
    
    let j = i - 1;
    
    // Move elements that are greater than key to one position ahead
    while (j >= 0 && arrayToSort[j].value > key) {
      arrayToSort[j].status = 'comparing';
      
      steps.push(createStep(
        arrayToSort,
        `Comparing ${key} with ${arrayToSort[j].value} at index ${j}.`,
        [i, j]
      ));
      
      arrayToSort[j].status = 'swapping';
      arrayToSort[j + 1] = { ...arrayToSort[j] };
      
      steps.push(createStep(
        arrayToSort,
        `Moving ${arrayToSort[j].value} one position ahead.`,
        undefined,
        [j, j + 1]
      ));
      
      arrayToSort[j].status = 'sorted';
      j--;
    }
    
    // Place the key at its correct position
    arrayToSort[j + 1] = { ...keyElement };
    arrayToSort[j + 1].status = 'sorted';
    
    steps.push(createStep(
      arrayToSort,
      `Inserted ${key} at position ${j + 1}.`
    ));
  }
  
  steps.push(createStep(
    arrayToSort,
    'Insertion Sort completed. The array is now sorted!'
  ));
  
  return steps;
};

// Quick Sort Algorithm
export const quickSort = (array: ArrayElement[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arrayToSort = cloneArray(array);
  
  steps.push(createStep(
    arrayToSort,
    'Starting Quick Sort algorithm. We will select a pivot and partition the array around it.'
  ));
  
  // Helper function to perform quick sort recursively
  const quickSortHelper = (arr: ArrayElement[], low: number, high: number) => {
    if (low < high) {
      // Partition the array and get the pivot index
      const pivotIndex = partition(arr, low, high);
      
      // Recursively sort the sub-arrays
      quickSortHelper(arr, low, pivotIndex - 1);
      quickSortHelper(arr, pivotIndex + 1, high);
    }
  };
  
  // Helper function to partition the array
  const partition = (arr: ArrayElement[], low: number, high: number): number => {
    // Select the rightmost element as pivot
    const pivotValue = arr[high].value;
    arr[high].status = 'comparing';
    
    steps.push(createStep(
      arrayToSort,
      `Selecting pivot: ${pivotValue} at index ${high}.`,
      [high, high]
    ));
    
    let i = low - 1; // Index of smaller element
    
    for (let j = low; j < high; j++) {
      arr[j].status = 'comparing';
      
      steps.push(createStep(
        arrayToSort,
        `Comparing ${arr[j].value} with pivot ${pivotValue}.`,
        [j, high]
      ));
      
      // If current element is smaller than the pivot
      if (arr[j].value < pivotValue) {
        i++;
        
        // Swap arr[i] and arr[j]
        if (i !== j) {
          arr[i].status = 'swapping';
          arr[j].status = 'swapping';
          
          steps.push(createStep(
            arrayToSort,
            `Swapping ${arr[i].value} and ${arr[j].value}.`,
            undefined,
            [i, j]
          ));
          
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
      
      arr[j].status = 'default';
    }
    
    // Swap arr[i+1] and arr[high] (the pivot)
    i++;
    arr[i].status = 'swapping';
    arr[high].status = 'swapping';
    
    steps.push(createStep(
      arrayToSort,
      `Placing pivot ${pivotValue} in its correct position at index ${i}.`,
      undefined,
      [i, high]
    ));
    
    [arr[i], arr[high]] = [arr[high], arr[i]];
    arr[i].status = 'sorted';
    
    steps.push(createStep(
      arrayToSort,
      `Pivot ${pivotValue} is now in its final position.`
    ));
    
    return i;
  };
  
  quickSortHelper(arrayToSort, 0, arrayToSort.length - 1);
  
  // Mark all elements as sorted
  for (let i = 0; i < arrayToSort.length; i++) {
    arrayToSort[i].status = 'sorted';
  }
  
  steps.push(createStep(
    arrayToSort,
    'Quick Sort completed. The array is now sorted!'
  ));
  
  return steps;
};
