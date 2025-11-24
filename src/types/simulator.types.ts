// Types per il Simulatore Immobiliare

export type OperationType = 'mercato-libero' | 'saldo-stralcio' | 'asta';
export type Strategy = 'resale' | 'rental' | 'renovation-resale' | 'immediate-resale';
export type Complexity = 'low' | 'medium' | 'high';

// State globale del simulatore
export interface SimulatorState {
  currentStep: number;
  operationType: OperationType | null;
  budget: number;
  hasFinancing: boolean;
  financingAmount: number;
  parameters: OperationParameters | null;
  results: SimulationResults | null;
}

// Parametri per Mercato Libero
export interface MercatoLiberoParams {
  askingPrice: number;
  marketValue: number;
  negotiationMargin: number;
  renovationCost: number;
  hasAgency: boolean;
  isFirstHome: boolean;
  strategy: 'resale' | 'rental';
  // Campi condizionali per rivendita
  resalePrice?: number;
  resaleMonths?: number;
  // Campi condizionali per affitto
  monthlyRent?: number;
  rentalYears?: number;
}

// Parametri per Saldo e Stralcio
export interface SaldoStralcioParams {
  nominalValue: number;
  purchasePercentage: number;
  propertyValue: number;
  recoveryMonths: number;
  legalCosts: number;
}

// Parametri per Asta Immobiliare
export interface AstaParams {
  basePrice: number;
  appraisalValue: number;
  overbidPercentage: number;
  isOccupied: boolean;
  liberationCost: number;
  legalCosts: number;
  isFirstHome: boolean;
  strategy: 'immediate-resale' | 'renovation-resale' | 'rental';
  // Campi condizionali
  renovatedValue?: number;
  monthlyRent?: number;
  rentalYears?: number;
}

// Union type per tutti i parametri
export type OperationParameters = 
  | MercatoLiberoParams 
  | SaldoStralcioParams 
  | AstaParams;

// Costi notarili
export interface NotaryCosts {
  notary: number;
  registration: number;
  cadastral: number;
  mortgage: number;
  total: number;
}

// Risultati simulazione
export interface SimulationResults {
  totalInvestment: number;
  finalValue: number;
  profit: number;
  roi: number;
  annualizedROI: number;
  breakeven: number;
  breakdown: Record<string, number>;
  risks: string[];
  advantages: string[];
  complexity: Complexity;
  timeframe: string;
}

// Dati lead capture
export interface LeadData {
  name: string;
  email: string;
  phone: string;
  budget: number;
  operationType: OperationType;
  notes?: string;
  gdprConsent: boolean;
}

// Info tipo operazione
export interface OperationTypeInfo {
  id: OperationType;
  label: string;
  icon: string;
  description: string;
  complexity: Complexity;
  minBudget: number;
  avgDiscount: string;
  timeframe: string;
  risks: string[];
  advantages: string[];
}
