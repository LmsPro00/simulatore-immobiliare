import type { OperationTypeInfo } from '../types/simulator.types';

/**
 * Dati per i 3 tipi di operazione immobiliare
 */
export const operationTypes: OperationTypeInfo[] = [
  {
    id: 'mercato-libero',
    label: 'Mercato Libero',
    icon: '🏠',
    description: 'Acquisto tradizionale dal mercato immobiliare',
    complexity: 'low',
    minBudget: 30000,
    avgDiscount: '5-15%',
    timeframe: '6-12 mesi',
    risks: [
      'Fluttuazioni del mercato immobiliare',
      'Tempi di vendita più lunghi del previsto',
      'Costi di ristrutturazione imprevisti',
      'Difficoltà nel trovare inquilini (se affitto)',
    ],
    advantages: [
      'Procedura standard e familiare',
      'Ampia scelta di immobili disponibili',
      'Possibilità di visita e verifica accurata',
      'Rischio relativamente contenuto',
      'Accesso facilitato al credito bancario',
    ],
  },
  {
    id: 'saldo-stralcio',
    label: 'Saldo e Stralcio',
    icon: '💰',
    description: 'Acquisto di crediti deteriorati (NPL)',
    complexity: 'high',
    minBudget: 50000,
    avgDiscount: '60-80%',
    timeframe: '12-24 mesi',
    risks: [
      'Elevata complessità legale e procedurale',
      'Tempi di recupero credito incerti',
      'Possibili contenziosi con debitori',
      'Necessità di expertise legale specializzata',
      'Rischio di mancato recupero totale',
    ],
    advantages: [
      'Sconto molto elevato sul valore nominale',
      'ROI potenzialmente molto alto (100-400%)',
      'Immobili a garanzia già identificati',
      'Possibilità di portfolio diversificati',
    ],
  },
  {
    id: 'asta',
    label: 'Asta Immobiliare',
    icon: '⚖️',
    description: 'Acquisto tramite tribunale',
    complexity: 'medium',
    minBudget: 30000,
    avgDiscount: '20-40%',
    timeframe: '3-8 mesi',
    risks: [
      'Impossibilità di visitare l\'immobile prima',
      'Possibile presenza di occupanti abusivi',
      'Vizi occulti non verificabili in anticipo',
      'Tempistiche di liberazione incerte',
      'Costi extra non previsti',
    ],
    advantages: [
      'Prezzi mediamente 20-40% sotto mercato',
      'Procedura trasparente e regolamentata',
      'Garanzia legale dell\'asta',
      'Possibilità di finanziamento bancario',
      'Ampia offerta di immobili',
    ],
  },
];

/**
 * Trova info tipo operazione per ID
 */
export const getOperationTypeInfo = (id: string): OperationTypeInfo | undefined => {
  return operationTypes.find((type) => type.id === id);
};
