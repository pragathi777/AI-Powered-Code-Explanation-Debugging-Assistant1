
export type AlgorithmType = 'sorting' | 'searching';

export interface Algorithm {
  id: string;
  name: string;
  type: AlgorithmType;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
}

export const ALGORITHMS: Algorithm[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    type: 'sorting',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    type: 'sorting',
    description: 'Builds the sorted array one element at a time by shifting elements that are larger than the current element to the right.',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    type: 'sorting',
    description: 'A divide-and-conquer algorithm that works by selecting a pivot element and partitioning the array around the pivot.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(log n)',
  },
  {
    id: 'linear-search',
    name: 'Linear Search',
    type: 'searching',
    description: 'A sequential search algorithm that starts at the beginning of the list and checks each element until the target is found.',
    timeComplexity: {
      best: 'O(1)',
      average: 'O(n)',
      worst: 'O(n)',
    },
    spaceComplexity: 'O(1)',
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    type: 'searching',
    description: 'A divide and conquer algorithm that finds the position of a target value within a sorted array.',
    timeComplexity: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)',
    },
    spaceComplexity: 'O(1)',
  },
];
