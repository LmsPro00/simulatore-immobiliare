import { useState, useCallback } from 'react';
import type {
  SimulatorState,
  OperationType,
  OperationParameters,
  SimulationResults,
  MercatoLiberoParams,
  SaldoStralcioParams,
  AstaParams,
} from '../types/simulator.types';
import {
  calculateMercatoLibero,
  calculateSaldoStralcio,
  calculateAstaImmobiliare,
} from '../utils/calculations';

const initialState: SimulatorState = {
  currentStep: 1,
  operationType: null,
  budget: 0,
  hasFinancing: false,
  financingAmount: 0,
  parameters: null,
  results: null,
};

export const useSimulator = () => {
  const [state, setState] = useState<SimulatorState>(initialState);

  // Naviga allo step successivo
  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 4),
    }));
  }, []);

  // Naviga allo step precedente
  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  // Imposta il tipo di operazione
  const setOperationType = useCallback((type: OperationType) => {
    setState((prev) => ({
      ...prev,
      operationType: type,
    }));
  }, []);

  // Imposta il budget
  const setBudget = useCallback(
    (budget: number, hasFinancing: boolean, financingAmount: number = 0) => {
      setState((prev) => ({
        ...prev,
        budget,
        hasFinancing,
        financingAmount,
      }));
    },
    []
  );

  // Imposta i parametri dell'operazione e calcola i risultati
  const setParameters = useCallback((parameters: OperationParameters) => {
    setState((prev) => {
      if (!prev.operationType) {
        return prev;
      }

      let results: SimulationResults;

      switch (prev.operationType) {
        case 'mercato-libero':
          results = calculateMercatoLibero(parameters as MercatoLiberoParams);
          break;
        case 'saldo-stralcio':
          results = calculateSaldoStralcio(parameters as SaldoStralcioParams);
          break;
        case 'asta':
          results = calculateAstaImmobiliare(parameters as AstaParams);
          break;
        default:
          return prev;
      }

      return {
        ...prev,
        parameters,
        results,
      };
    });
  }, []);

  // Calcola i risultati in base al tipo di operazione (deprecato, ora fatto in setParameters)
  const calculateResults = useCallback(() => {
    // Questa funzione ora è vuota perché il calcolo avviene in setParameters
    // Mantenuta per compatibilità
  }, []);

  // Reset completo del simulatore
  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  // Verifica se si può procedere allo step successivo
  const canProceed = useCallback(() => {
    switch (state.currentStep) {
      case 1:
        return state.operationType !== null;
      case 2:
        return state.budget >= 10000;
      case 3:
        return state.parameters !== null;
      case 4:
        return true;
      default:
        return false;
    }
  }, [state.currentStep, state.operationType, state.budget, state.parameters]);

  // Budget totale disponibile
  const totalBudget = state.budget + state.financingAmount;

  return {
    state,
    totalBudget,
    nextStep,
    prevStep,
    setOperationType,
    setBudget,
    setParameters,
    calculateResults,
    reset,
    canProceed,
  };
};
