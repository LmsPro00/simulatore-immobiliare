/**
 * Formatta un numero come valuta in euro
 * @param amount - Importo da formattare
 * @param showDecimals - Se mostrare i decimali (default: false)
 * @returns Stringa formattata es. "€ 150.000" o "€ 150.000,50"
 */
export const formatCurrency = (
  amount: number,
  showDecimals: boolean = false
): string => {
  const formatted = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
  
  return formatted;
};

/**
 * Formatta un numero come percentuale
 * @param value - Valore da formattare
 * @param decimals - Numero di decimali (default: 1)
 * @returns Stringa formattata es. "15,5%"
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * Formatta mesi in formato leggibile
 * @param months - Numero di mesi
 * @returns Stringa formattata es. "12 mesi" o "2 anni"
 */
export const formatMonths = (months: number): string => {
  if (months < 12) {
    return `${months} ${months === 1 ? 'mese' : 'mesi'}`;
  }
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? 'anno' : 'anni'}`;
  }
  
  return `${years} ${years === 1 ? 'anno' : 'anni'} e ${remainingMonths} ${remainingMonths === 1 ? 'mese' : 'mesi'}`;
};

/**
 * Restituisce il range di budget come stringa
 * @param budget - Budget in euro
 * @returns Range es. "0-50k", "50k-100k", etc.
 */
export const getBudgetRange = (budget: number): string => {
  if (budget < 50000) return '0-50k';
  if (budget < 100000) return '50k-100k';
  if (budget < 250000) return '100k-250k';
  if (budget < 500000) return '250k-500k';
  return '500k+';
};

/**
 * Formatta un numero con separatori di migliaia
 * @param value - Numero da formattare
 * @returns Stringa formattata es. "150.000"
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('it-IT').format(value);
};

/**
 * Rimuove caratteri non numerici da una stringa
 * @param value - Stringa da pulire
 * @returns Solo numeri
 */
export const cleanNumericInput = (value: string): string => {
  return value.replace(/[^\d]/g, '');
};

/**
 * Formatta input numerico durante la digitazione
 * @param value - Valore input
 * @returns Valore formattato con separatori
 */
export const formatInputNumber = (value: string): string => {
  const cleaned = cleanNumericInput(value);
  if (!cleaned) return '';
  
  const number = parseInt(cleaned, 10);
  return formatNumber(number);
};
