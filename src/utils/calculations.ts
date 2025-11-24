import type {
  NotaryCosts,
  MercatoLiberoParams,
  SaldoStralcioParams,
  AstaParams,
  SimulationResults,
} from '../types/simulator.types';

/**
 * Calcola il ROI (Return on Investment)
 * Formula: ((Valore Finale - Investimento) / Investimento) × 100
 */
export const calculateROI = (
  finalValue: number,
  totalInvestment: number
): number => {
  if (totalInvestment === 0) return 0;
  return ((finalValue - totalInvestment) / totalInvestment) * 100;
};

/**
 * Calcola il ROI annualizzato
 * Formula: ((1 + ROI/100)^(12/mesi) - 1) × 100
 */
export const calculateAnnualizedROI = (
  roi: number,
  months: number
): number => {
  if (months === 0) return 0;
  return (Math.pow(1 + roi / 100, 12 / months) - 1) * 100;
};

/**
 * Calcola il break-even in mesi
 * Formula: Investimento Totale / Entrata Mensile
 */
export const calculateBreakeven = (
  totalInvestment: number,
  monthlyIncome: number
): number => {
  if (monthlyIncome === 0) return 0;
  return totalInvestment / monthlyIncome;
};

/**
 * Calcola i costi notarili e le imposte
 */
export const calculateNotaryCosts = (
  price: number,
  isFirstHome: boolean
): NotaryCosts => {
  const notary = price * 0.02; // 2% del prezzo
  const registration = isFirstHome ? price * 0.02 : price * 0.09; // 2% prima casa, 9% seconda
  const cadastral = 50;
  const mortgage = 50;
  
  return {
    notary,
    registration,
    cadastral,
    mortgage,
    total: notary + registration + cadastral + mortgage,
  };
};

/**
 * Calcola i risultati per operazione Mercato Libero
 */
export const calculateMercatoLibero = (
  params: MercatoLiberoParams
): SimulationResults => {
  // Calcolo prezzo acquisto con margine trattativa
  const purchasePrice = params.askingPrice * (1 - params.negotiationMargin / 100);
  
  // Calcolo costi notarili
  const costs = calculateNotaryCosts(purchasePrice, params.isFirstHome);
  
  // Costo agenzia (3% se presente)
  const agencyCost = params.hasAgency ? purchasePrice * 0.03 : 0;
  
  // Investimento totale
  const totalInvestment = 
    purchasePrice + 
    costs.total + 
    agencyCost + 
    params.renovationCost;
  
  // Calcolo valore finale e timeframe in base alla strategia
  let finalValue: number;
  let timeframe: number;
  
  if (params.strategy === 'resale') {
    finalValue = params.resalePrice || 0;
    timeframe = params.resaleMonths || 0;
  } else {
    // Affitto: valore finale = canone × anni × 12 mesi
    finalValue = (params.monthlyRent || 0) * (params.rentalYears || 0) * 12;
    timeframe = (params.rentalYears || 0) * 12;
  }
  
  // Calcolo profitto e ROI
  const profit = finalValue - totalInvestment;
  const roi = calculateROI(finalValue, totalInvestment);
  const annualizedROI = calculateAnnualizedROI(roi, timeframe);
  
  // Break-even
  const breakeven = params.strategy === 'rental' 
    ? calculateBreakeven(totalInvestment, params.monthlyRent || 0)
    : timeframe;
  
  return {
    totalInvestment,
    finalValue,
    profit,
    roi,
    annualizedROI,
    breakeven,
    breakdown: {
      purchase: purchasePrice,
      notary: costs.total,
      agency: agencyCost,
      renovation: params.renovationCost,
    },
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
    complexity: 'low',
    timeframe: params.strategy === 'resale' 
      ? `${params.resaleMonths} mesi` 
      : `${params.rentalYears} anni`,
  };
};

/**
 * Calcola i risultati per operazione Saldo e Stralcio
 */
export const calculateSaldoStralcio = (
  params: SaldoStralcioParams
): SimulationResults => {
  // Costo acquisto credito
  const creditPurchase = params.nominalValue * (params.purchasePercentage / 100);
  
  // Investimento totale
  const totalInvestment = creditPurchase + params.legalCosts;
  
  // Valore finale = valore immobile a garanzia
  const finalValue = params.propertyValue;
  
  // Calcolo profitto e ROI
  const profit = finalValue - totalInvestment;
  const roi = calculateROI(finalValue, totalInvestment);
  const annualizedROI = calculateAnnualizedROI(roi, params.recoveryMonths);
  
  return {
    totalInvestment,
    finalValue,
    profit,
    roi,
    annualizedROI,
    breakeven: params.recoveryMonths,
    breakdown: {
      creditPurchase,
      legalCosts: params.legalCosts,
    },
    risks: [
      'Elevata complessità legale e procedurale',
      'Tempi di recupero credito incerti',
      'Possibili contenziosi con debitori',
      'Necessità di expertise legale specializzata',
      'Rischio di mancato recupero totale',
    ],
    advantages: [
      'Sconto molto elevato sul valore nominale (60-80%)',
      'ROI potenzialmente molto alto (100-400%)',
      'Immobili a garanzia già identificati',
      'Possibilità di portfolio diversificati',
    ],
    complexity: 'high',
    timeframe: `${params.recoveryMonths} mesi`,
  };
};

/**
 * Calcola i risultati per operazione Asta Immobiliare
 */
export const calculateAstaImmobiliare = (
  params: AstaParams
): SimulationResults => {
  // Prezzo offerta con rilancio
  const bidPrice = params.basePrice * (1 + params.overbidPercentage / 100);
  
  // Contributo spese asta (10%)
  const auctionFee = bidPrice * 0.10;
  
  // Costi notarili
  const costs = calculateNotaryCosts(bidPrice, params.isFirstHome);
  
  // Costi liberazione (se occupato)
  const liberationCost = params.isOccupied ? params.liberationCost : 0;
  
  // Investimento totale
  const totalInvestment = 
    bidPrice + 
    auctionFee + 
    costs.total + 
    params.legalCosts + 
    liberationCost;
  
  // Calcolo valore finale e timeframe in base alla strategia
  let finalValue: number;
  let timeframe: number;
  
  switch (params.strategy) {
    case 'immediate-resale':
      finalValue = params.appraisalValue;
      timeframe = 6; // mesi stimati
      break;
    case 'renovation-resale':
      finalValue = params.renovatedValue || 0;
      timeframe = 12;
      break;
    case 'rental':
      finalValue = (params.monthlyRent || 0) * (params.rentalYears || 0) * 12;
      timeframe = (params.rentalYears || 0) * 12;
      break;
    default:
      finalValue = 0;
      timeframe = 0;
  }
  
  // Calcolo profitto e ROI
  const profit = finalValue - totalInvestment;
  const roi = calculateROI(finalValue, totalInvestment);
  const annualizedROI = calculateAnnualizedROI(roi, timeframe);
  
  // Break-even
  const breakeven = params.strategy === 'rental'
    ? calculateBreakeven(totalInvestment, params.monthlyRent || 0)
    : timeframe;
  
  return {
    totalInvestment,
    finalValue,
    profit,
    roi,
    annualizedROI,
    breakeven,
    breakdown: {
      bid: bidPrice,
      auctionFee,
      notary: costs.total,
      legal: params.legalCosts,
      liberation: liberationCost,
    },
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
    complexity: 'medium',
    timeframe: `${timeframe} mesi`,
  };
};
