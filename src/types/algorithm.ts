
export interface ArrayElement {
  value: number;
  id: string;
  status: 'default' | 'comparing' | 'swapping' | 'sorted';
}

export interface AlgorithmStep {
  array: ArrayElement[];
  description: string;
  comparison?: [number, number]; // Indices being compared
  swap?: [number, number]; // Indices being swapped
}

export interface AlgorithmState {
  array: ArrayElement[];
  steps: AlgorithmStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  comparisons: number;
  swaps: number;
  isComplete: boolean;
}

export type AlgorithmAction = 
  | { type: 'SET_ARRAY'; payload: ArrayElement[] }
  | { type: 'SET_STEPS'; payload: AlgorithmStep[] }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'RESET' }
  | { type: 'INCREMENT_COMPARISON' }
  | { type: 'INCREMENT_SWAP' }
  | { type: 'SET_COMPLETE'; payload: boolean };
