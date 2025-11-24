import { z } from 'zod';

/**
 * Schema validazione budget
 */
export const budgetSchema = z.object({
  budget: z
    .number({
      required_error: 'Il budget è obbligatorio',
      invalid_type_error: 'Inserisci un numero valido',
    })
    .min(10000, 'Budget minimo: € 10.000')
    .max(10000000, 'Budget massimo: € 10.000.000'),
  hasFinancing: z.boolean(),
  financingAmount: z.number().min(0).optional(),
});

/**
 * Schema validazione Mercato Libero
 */
export const mercatoLiberoSchema = z
  .object({
    askingPrice: z
      .number({ required_error: 'Prezzo richiesto obbligatorio' })
      .positive('Inserisci un prezzo valido'),
    marketValue: z
      .number({ required_error: 'Valore di mercato obbligatorio' })
      .positive('Inserisci un valore valido'),
    negotiationMargin: z
      .number()
      .min(0, 'Il margine non può essere negativo')
      .max(100, 'Il margine non può superare il 100%'),
    renovationCost: z.number().min(0, 'I costi non possono essere negativi'),
    hasAgency: z.boolean(),
    isFirstHome: z.boolean(),
    strategy: z.enum(['resale', 'rental'], {
      required_error: 'Seleziona una strategia',
    }),
    resalePrice: z.number().positive().optional(),
    resaleMonths: z.number().positive().optional(),
    monthlyRent: z.number().positive().optional(),
    rentalYears: z.number().positive().optional(),
  })
  .refine(
    (data) => {
      if (data.strategy === 'resale') {
        return data.resalePrice && data.resaleMonths;
      }
      return data.monthlyRent && data.rentalYears;
    },
    {
      message: 'Completa tutti i campi per la strategia selezionata',
      path: ['strategy'],
    }
  );

/**
 * Schema validazione Saldo e Stralcio
 */
export const saldoStralcioSchema = z.object({
  nominalValue: z
    .number({ required_error: 'Valore nominale obbligatorio' })
    .positive('Inserisci un valore valido'),
  purchasePercentage: z
    .number({ required_error: 'Percentuale acquisto obbligatoria' })
    .min(1, 'Percentuale minima: 1%')
    .max(100, 'Percentuale massima: 100%'),
  propertyValue: z
    .number({ required_error: 'Valore immobile obbligatorio' })
    .positive('Inserisci un valore valido'),
  recoveryMonths: z
    .number({ required_error: 'Tempi recupero obbligatori' })
    .min(1, 'Minimo 1 mese')
    .max(120, 'Massimo 120 mesi (10 anni)'),
  legalCosts: z.number().min(0, 'I costi non possono essere negativi'),
});

/**
 * Schema validazione Asta Immobiliare
 */
export const astaSchema = z
  .object({
    basePrice: z
      .number({ required_error: 'Prezzo base obbligatorio' })
      .positive('Inserisci un prezzo valido'),
    appraisalValue: z
      .number({ required_error: 'Valore perizia obbligatorio' })
      .positive('Inserisci un valore valido'),
    overbidPercentage: z
      .number()
      .min(0, 'Il rilancio non può essere negativo')
      .max(100, 'Rilancio massimo: 100%'),
    isOccupied: z.boolean(),
    liberationCost: z.number().min(0, 'I costi non possono essere negativi'),
    legalCosts: z.number().min(0, 'I costi non possono essere negativi'),
    isFirstHome: z.boolean(),
    strategy: z.enum(['immediate-resale', 'renovation-resale', 'rental'], {
      required_error: 'Seleziona una strategia',
    }),
    renovatedValue: z.number().positive().optional(),
    monthlyRent: z.number().positive().optional(),
    rentalYears: z.number().positive().optional(),
  })
  .refine(
    (data) => {
      if (data.strategy === 'renovation-resale') {
        return data.renovatedValue;
      }
      if (data.strategy === 'rental') {
        return data.monthlyRent && data.rentalYears;
      }
      return true;
    },
    {
      message: 'Completa tutti i campi per la strategia selezionata',
      path: ['strategy'],
    }
  );

/**
 * Schema validazione Lead Capture
 */
export const leadSchema = z.object({
  name: z
    .string({ required_error: 'Il nome è obbligatorio' })
    .min(2, 'Nome troppo corto')
    .max(100, 'Nome troppo lungo'),
  email: z
    .string({ required_error: 'L\'email è obbligatoria' })
    .email('Email non valida'),
  phone: z
    .string({ required_error: 'Il telefono è obbligatorio' })
    .regex(/^[0-9+\s()-]+$/, 'Numero di telefono non valido')
    .min(8, 'Numero troppo corto'),
  notes: z.string().optional(),
  gdprConsent: z.literal(true, {
    errorMap: () => ({ message: 'Devi accettare il trattamento dei dati' }),
  }),
});

// Export types inferiti dagli schemi
export type BudgetFormData = z.infer<typeof budgetSchema>;
export type MercatoLiberoFormData = z.infer<typeof mercatoLiberoSchema>;
export type SaldoStralcioFormData = z.infer<typeof saldoStralcioSchema>;
export type AstaFormData = z.infer<typeof astaSchema>;
export type LeadFormData = z.infer<typeof leadSchema>;
