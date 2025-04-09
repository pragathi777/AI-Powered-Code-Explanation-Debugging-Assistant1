
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AlgorithmState, AlgorithmAction, ArrayElement } from '../types/algorithm';
import { v4 as uuidv4 } from 'uuid';

const initialState: AlgorithmState = {
  array: [],
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1000, // milliseconds
  comparisons: 0,
  swaps: 0,
  isComplete: false
};

const AlgorithmContext = createContext<{
  state: AlgorithmState;
  dispatch: React.Dispatch<AlgorithmAction>;
  generateRandomArray: (size: number, min: number, max: number) => void;
  setArray: (array: number[]) => void;
}>({
  state: initialState,
  dispatch: () => null,
  generateRandomArray: () => undefined,
  setArray: () => undefined
});

const algorithmReducer = (state: AlgorithmState, action: AlgorithmAction): AlgorithmState => {
  switch (action.type) {
    case 'SET_ARRAY':
      return {
        ...state,
        array: action.payload,
        steps: [],
        currentStep: 0,
        comparisons: 0,
        swaps: 0,
        isComplete: false
      };
    case 'SET_STEPS':
      return {
        ...state,
        steps: action.payload,
        currentStep: 0,
        isComplete: false
      };
    case 'NEXT_STEP':
      if (state.currentStep >= state.steps.length - 1) {
        return {
          ...state,
          isPlaying: false,
          isComplete: true
        };
      }
      return {
        ...state,
        currentStep: state.currentStep + 1,
        array: state.steps[state.currentStep + 1].array
      };
    case 'PREV_STEP':
      if (state.currentStep <= 0) {
        return state;
      }
      return {
        ...state,
        currentStep: state.currentStep - 1,
        array: state.steps[state.currentStep - 1].array,
        isComplete: false
      };
    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: action.payload,
        array: state.steps[action.payload].array,
        isComplete: action.payload === state.steps.length - 1
      };
    case 'TOGGLE_PLAY':
      return {
        ...state,
        isPlaying: !state.isPlaying
      };
    case 'SET_SPEED':
      return {
        ...state,
        speed: action.payload
      };
    case 'RESET':
      return {
        ...state,
        currentStep: 0,
        isPlaying: false,
        array: state.steps.length > 0 ? state.steps[0].array : state.array,
        isComplete: false
      };
    case 'INCREMENT_COMPARISON':
      return {
        ...state,
        comparisons: state.comparisons + 1
      };
    case 'INCREMENT_SWAP':
      return {
        ...state,
        swaps: state.swaps + 1
      };
    case 'SET_COMPLETE':
      return {
        ...state,
        isComplete: action.payload,
        isPlaying: false
      };
    default:
      return state;
  }
};

const AlgorithmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(algorithmReducer, initialState);

  const generateRandomArray = (size: number, min: number, max: number) => {
    const randomArray: ArrayElement[] = [];
    for (let i = 0; i < size; i++) {
      randomArray.push({
        value: Math.floor(Math.random() * (max - min + 1)) + min,
        id: uuidv4(),
        status: 'default'
      });
    }
    dispatch({ type: 'SET_ARRAY', payload: randomArray });
  };

  const setArray = (array: number[]) => {
    const newArray: ArrayElement[] = array.map(value => ({
      value,
      id: uuidv4(),
      status: 'default'
    }));
    dispatch({ type: 'SET_ARRAY', payload: newArray });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (state.isPlaying && state.currentStep < state.steps.length - 1) {
      timer = setTimeout(() => {
        dispatch({ type: 'NEXT_STEP' });
        
        // Update counters
        if (state.steps[state.currentStep].comparison) {
          dispatch({ type: 'INCREMENT_COMPARISON' });
        }
        if (state.steps[state.currentStep].swap) {
          dispatch({ type: 'INCREMENT_SWAP' });
        }
      }, state.speed);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [state.isPlaying, state.currentStep, state.steps, state.speed]);

  return (
    <AlgorithmContext.Provider value={{ state, dispatch, generateRandomArray, setArray }}>
      {children}
    </AlgorithmContext.Provider>
  );
};

const useAlgorithm = () => {
  const context = useContext(AlgorithmContext);
  if (!context) {
    throw new Error('useAlgorithm must be used within an AlgorithmProvider');
  }
  return context;
};

export { AlgorithmProvider, useAlgorithm };
