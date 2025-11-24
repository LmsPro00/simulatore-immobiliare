/**
 * Tooltip educativi per termini tecnici
 */
export const tooltips = {
  roi: 'Return on Investment - La percentuale di guadagno rispetto all\'investimento iniziale',
  roiAnnualizzato: 'ROI calcolato su base annua, utile per confrontare investimenti con durate diverse',
  npl: 'Non-Performing Loan - Credito in sofferenza o deteriorato',
  saldoStralcio: 'Accordo per estinguere un credito pagando solo una percentuale del valore nominale',
  prezzoBase: 'Importo minimo di partenza fissato dal tribunale per l\'asta',
  perizia: 'Valutazione tecnica dell\'immobile effettuata da un perito del tribunale',
  rilancio: 'Aumento percentuale dell\'offerta rispetto al prezzo base',
  breakeven: 'Tempo necessario per recuperare completamente l\'investimento iniziale',
  valoreNominale: 'Valore originale del credito prima dello sconto',
  margineTrattativa: 'Percentuale di sconto che prevedi di ottenere sul prezzo richiesto',
  costiNotarili: 'Spese per notaio, imposte di registro, catastali e ipotecarie',
  primaCasa: 'Agevolazioni fiscali per acquisto prima abitazione (imposte ridotte al 2%)',
  secondaCasa: 'Imposte standard per acquisto seconda abitazione (9%)',
  contributoSpese: 'Quota fissa del 10% sul prezzo di aggiudicazione da versare al tribunale',
  immobileOccupato: 'Immobile con persone residenti che devono essere sgomberate legalmente',
  costiLiberazione: 'Spese legali e procedurali per lo sgombero degli occupanti',
};

/**
 * Restituisce il tooltip per una chiave specifica
 */
export const getTooltip = (key: keyof typeof tooltips): string => {
  return tooltips[key] || '';
};
