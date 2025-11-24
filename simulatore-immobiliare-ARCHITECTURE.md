# 🏗️ ARCHITETTURA TECNICA & GUIDA IMPLEMENTAZIONE
## Simulatore Operazioni Immobiliari

---

## 📦 STACK TECNOLOGICO

### Core
```json
{
  "runtime": "Node.js 18+",
  "framework": "React 18.2+",
  "language": "TypeScript 5+",
  "bundler": "Vite 5+",
  "package-manager": "npm / pnpm"
}
```

### Librerie Principali
```json
{
  "styling": "TailwindCSS 3.4+",
  "forms": "react-hook-form 7.x",
  "validation": "zod 3.x",
  "charts": "recharts 2.x",
  "icons": "lucide-react 0.x",
  "animations": "framer-motion 11.x (optional)"
}
```

### Development Tools
```json
{
  "linting": "ESLint 8+",
  "formatting": "Prettier 3+",
  "type-checking": "TypeScript strict mode"
}
```

---

## 🏛️ ARCHITETTURA APPLICAZIONE

### Struttura Directory
```
simulatore-immobiliare/
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── ui/                    # Componenti UI base
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── layout/                # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Container.tsx
│   │   ├── steps/                 # Step components
│   │   │   ├── Step1TypeSelection.tsx
│   │   │   ├── Step2Budget.tsx
│   │   │   ├── Step3Parameters/
│   │   │   │   ├── MercatoLibero.tsx
│   │   │   │   ├── SaldoStralcio.tsx
│   │   │   │   └── AstaImmobiliare.tsx
│   │   │   └── Step4Results.tsx
│   │   ├── results/               # Results components
│   │   │   ├── InvestmentBreakdown.tsx
│   │   │   ├── ROICalculator.tsx
│   │   │   ├── RiskAnalysis.tsx
│   │   │   ├── NextSteps.tsx
│   │   │   └── Charts.tsx
│   │   └── forms/                 # Form components
│   │       ├── LeadCaptureForm.tsx
│   │       └── FormField.tsx
│   ├── hooks/                     # Custom hooks
│   │   ├── useSimulator.ts
│   │   ├── useCalculations.ts
│   │   └── useLocalStorage.ts
│   ├── utils/                     # Utilities
│   │   ├── calculations.ts        # Formule calcoli
│   │   ├── formatters.ts          # Format numeri/date
│   │   ├── validators.ts          # Validazioni custom
│   │   └── constants.ts           # Costanti app
│   ├── types/                     # TypeScript types
│   │   ├── simulator.types.ts
│   │   ├── operations.types.ts
│   │   └── forms.types.ts
│   ├── data/                      # Data & Config
│   │   ├── operationTypes.ts
│   │   ├── tooltips.ts
│   │   └── risks.ts
│   ├── styles/                    # Global styles
│   │   └── globals.css
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── .eslintrc.json
├── .prettierrc
└── README.md
```

---

## 🎯 COMPONENTI CHIAVE

### 1. App.tsx (Main Container)
```typescript
// Gestisce lo state globale e la navigazione tra step
interface AppState {
  currentStep: number;
  operationType: 'mercato-libero' | 'saldo-stralcio' | 'asta';
  budget: number;
  hasFinancing: boolean;
  parameters: OperationParameters;
  results: SimulationResults | null;
}
```

### 2. useSimulator Hook
```typescript
// Custom hook per gestire la logica del simulatore
const useSimulator = () => {
  const [state, setState] = useState<AppState>(initialState);
  
  const nextStep = () => { /* ... */ };
  const prevStep = () => { /* ... */ };
  const updateParameters = (params: Partial<OperationParameters>) => { /* ... */ };
  const calculateResults = () => { /* ... */ };
  const reset = () => { /* ... */ };
  
  return { state, nextStep, prevStep, updateParameters, calculateResults, reset };
};
```

### 3. Calculation Utils
```typescript
// utils/calculations.ts

// ROI Standard
export const calculateROI = (
  finalValue: number,
  totalInvestment: number
): number => {
  return ((finalValue - totalInvestment) / totalInvestment) * 100;
};

// ROI Annualizzato
export const calculateAnnualizedROI = (
  roi: number,
  months: number
): number => {
  return (Math.pow(1 + roi / 100, 12 / months) - 1) * 100;
};

// Break-even
export const calculateBreakeven = (
  totalInvestment: number,
  monthlyIncome: number
): number => {
  return totalInvestment / monthlyIncome;
};

// Costi Notarili
export const calculateNotaryCosts = (
  price: number,
  isFirstHome: boolean
): NotaryCosts => {
  return {
    notary: price * 0.02,
    registration: isFirstHome ? price * 0.02 : price * 0.09,
    cadastral: 50,
    mortgage: 50,
  };
};

// Specifici per Mercato Libero
export const calculateMercatoLibero = (
  params: MercatoLiberoParams
): MercatoLiberoResults => {
  const purchasePrice = params.askingPrice * (1 - params.negotiationMargin / 100);
  const costs = calculateNotaryCosts(purchasePrice, params.isFirstHome);
  const agencyCost = params.hasAgency ? purchasePrice * 0.03 : 0;
  
  const totalInvestment = 
    purchasePrice + 
    costs.total + 
    agencyCost + 
    params.renovationCost;
  
  let finalValue: number;
  let timeframe: number;
  
  if (params.strategy === 'resale') {
    finalValue = params.resalePrice;
    timeframe = params.resaleMonths;
  } else {
    finalValue = params.monthlyRent * params.rentalYears * 12;
    timeframe = params.rentalYears * 12;
  }
  
  const profit = finalValue - totalInvestment;
  const roi = calculateROI(finalValue, totalInvestment);
  const annualizedROI = calculateAnnualizedROI(roi, timeframe);
  
  return {
    totalInvestment,
    finalValue,
    profit,
    roi,
    annualizedROI,
    breakeven: params.strategy === 'rental' 
      ? calculateBreakeven(totalInvestment, params.monthlyRent)
      : timeframe,
    breakdown: {
      purchase: purchasePrice,
      notary: costs.total,
      agency: agencyCost,
      renovation: params.renovationCost,
    }
  };
};

// Specifici per Saldo e Stralcio
export const calculateSaldoStralcio = (
  params: SaldoStralcioParams
): SaldoStralcioResults => {
  const creditPurchase = params.nominalValue * (params.purchasePercentage / 100);
  const totalInvestment = creditPurchase + params.legalCosts;
  const finalValue = params.propertyValue;
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
    }
  };
};

// Specifici per Asta Immobiliare
export const calculateAstaImmobiliare = (
  params: AstaParams
): AstaResults => {
  const bidPrice = params.basePrice * (1 + params.overbidPercentage / 100);
  const auctionFee = bidPrice * 0.10;
  const costs = calculateNotaryCosts(bidPrice, params.isFirstHome);
  const liberationCost = params.isOccupied ? params.liberationCost : 0;
  
  const totalInvestment = 
    bidPrice + 
    auctionFee + 
    costs.total + 
    params.legalCosts + 
    liberationCost;
  
  let finalValue: number;
  let timeframe: number;
  
  switch (params.strategy) {
    case 'immediate-resale':
      finalValue = params.appraisalValue;
      timeframe = 6; // mesi stimati
      break;
    case 'renovation-resale':
      finalValue = params.renovatedValue;
      timeframe = 12;
      break;
    case 'rental':
      finalValue = params.monthlyRent * params.rentalYears * 12;
      timeframe = params.rentalYears * 12;
      break;
  }
  
  const profit = finalValue - totalInvestment;
  const roi = calculateROI(finalValue, totalInvestment);
  const annualizedROI = calculateAnnualizedROI(roi, timeframe);
  
  return {
    totalInvestment,
    finalValue,
    profit,
    roi,
    annualizedROI,
    breakeven: params.strategy === 'rental'
      ? calculateBreakeven(totalInvestment, params.monthlyRent)
      : timeframe,
    breakdown: {
      bid: bidPrice,
      auctionFee,
      notary: costs.total,
      legal: params.legalCosts,
      liberation: liberationCost,
    }
  };
};
```

---

## 🎨 DESIGN SYSTEM

### Color Palette (Tailwind)
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e', // Verde principale
          600: '#16a34a',
          700: '#15803d',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316', // Arancione
          600: '#ea580c',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

### Typography Scale
```css
/* globals.css */
.text-display { @apply text-5xl font-bold; }
.text-h1 { @apply text-4xl font-bold; }
.text-h2 { @apply text-3xl font-semibold; }
.text-h3 { @apply text-2xl font-semibold; }
.text-body { @apply text-base; }
.text-small { @apply text-sm; }
```

---

## 🔐 TYPES DEFINITIONS

### Core Types
```typescript
// types/simulator.types.ts

export type OperationType = 'mercato-libero' | 'saldo-stralcio' | 'asta';
export type Strategy = 'resale' | 'rental' | 'renovation-resale' | 'immediate-resale';

export interface SimulatorState {
  currentStep: number;
  operationType: OperationType | null;
  budget: number;
  hasFinancing: boolean;
  financingAmount: number;
  parameters: OperationParameters | null;
  results: SimulationResults | null;
}

export interface MercatoLiberoParams {
  askingPrice: number;
  marketValue: number;
  negotiationMargin: number;
  renovationCost: number;
  hasAgency: boolean;
  isFirstHome: boolean;
  strategy: 'resale' | 'rental';
  // Se resale
  resalePrice?: number;
  resaleMonths?: number;
  // Se rental
  monthlyRent?: number;
  rentalYears?: number;
}

export interface SaldoStralcioParams {
  nominalValue: number;
  purchasePercentage: number;
  propertyValue: number;
  recoveryMonths: number;
  legalCosts: number;
}

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

export type OperationParameters = 
  | MercatoLiberoParams 
  | SaldoStralcioParams 
  | AstaParams;

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
  complexity: 'low' | 'medium' | 'high';
  timeframe: string;
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  budget: number;
  operationType: OperationType;
  notes?: string;
  gdprConsent: boolean;
}
```

---

## 📝 VALIDATION SCHEMAS

### Zod Schemas
```typescript
// utils/validators.ts
import { z } from 'zod';

export const budgetSchema = z.object({
  budget: z.number()
    .min(10000, "Budget minimo: €10.000")
    .max(10000000, "Budget massimo: €10.000.000"),
  hasFinancing: z.boolean(),
  financingAmount: z.number().optional(),
});

export const mercatoLiberoSchema = z.object({
  askingPrice: z.number().positive("Inserisci un prezzo valido"),
  marketValue: z.number().positive("Inserisci un valore valido"),
  negotiationMargin: z.number().min(0).max(100),
  renovationCost: z.number().min(0),
  hasAgency: z.boolean(),
  isFirstHome: z.boolean(),
  strategy: z.enum(['resale', 'rental']),
  resalePrice: z.number().positive().optional(),
  resaleMonths: z.number().positive().optional(),
  monthlyRent: z.number().positive().optional(),
  rentalYears: z.number().positive().optional(),
}).refine(
  (data) => {
    if (data.strategy === 'resale') {
      return data.resalePrice && data.resaleMonths;
    }
    return data.monthlyRent && data.rentalYears;
  },
  { message: "Completa tutti i campi per la strategia selezionata" }
);

export const saldoStralcioSchema = z.object({
  nominalValue: z.number().positive(),
  purchasePercentage: z.number().min(1).max(100),
  propertyValue: z.number().positive(),
  recoveryMonths: z.number().min(1).max(120),
  legalCosts: z.number().min(0),
});

export const astaSchema = z.object({
  basePrice: z.number().positive(),
  appraisalValue: z.number().positive(),
  overbidPercentage: z.number().min(0).max(100),
  isOccupied: z.boolean(),
  liberationCost: z.number().min(0),
  legalCosts: z.number().min(0),
  isFirstHome: z.boolean(),
  strategy: z.enum(['immediate-resale', 'renovation-resale', 'rental']),
  renovatedValue: z.number().positive().optional(),
  monthlyRent: z.number().positive().optional(),
  rentalYears: z.number().positive().optional(),
});

export const leadSchema = z.object({
  name: z.string().min(2, "Nome troppo corto"),
  email: z.string().email("Email non valida"),
  phone: z.string().regex(/^[0-9+\s()-]+$/, "Numero non valido"),
  notes: z.string().optional(),
  gdprConsent: z.literal(true, {
    errorMap: () => ({ message: "Devi accettare il trattamento dati" })
  }),
});
```

---

## 🎯 DATA & CONSTANTS

### Operation Types Data
```typescript
// data/operationTypes.ts

export const operationTypes = [
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
```

### Tooltips
```typescript
// data/tooltips.ts

export const tooltips = {
  roi: 'Return on Investment - La percentuale di guadagno rispetto all\'investimento iniziale',
  roiAnnualizzato: 'ROI calcolato su base annua, utile per confrontare investimenti con durate diverse',
  npl: 'Non-Performing Loan - Credito in sofferenza o deteriorato',
  saldoStralcio: 'Accordo per estinguere un credito pagando solo una percentuale del valore nominale',
  prezzoBase: 'Importo minimo di partenza fissato dal tribunale per l\'asta',
  perizia: 'Valutazione tecnica dell\'immobile effettuata da un perito del tribunale',
  rilancio: 'Aumento percentuale dell\'offerta rispetto al prezzo base',
  breakeven: 'Tempo necessario per recuperare completamente l\'investimento iniziale',
};
```

---

## 🚀 DEPLOYMENT GUIDE

### Option 1: Vercel (Raccomandato)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Production deploy
vercel --prod
```

### Option 2: Netlify
```bash
# 1. Install Netlify CLI
npm i -g netlify-cli

# 2. Login
netlify login

# 3. Init
netlify init

# 4. Deploy
netlify deploy --prod
```

### Option 3: GitHub Pages
```json
// package.json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

```bash
# Deploy
npm run deploy
```

---

## 📊 ANALYTICS SETUP

### Google Analytics 4
```typescript
// utils/analytics.ts

export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Eventi custom
export const trackSimulationComplete = (
  operationType: OperationType,
  budget: number,
  roi: number
) => {
  trackEvent('simulation_complete', {
    operation_type: operationType,
    budget_range: getBudgetRange(budget),
    roi_percentage: Math.round(roi),
  });
};

export const trackLeadCapture = (operationType: OperationType) => {
  trackEvent('lead_captured', {
    operation_type: operationType,
  });
};
```

---

## ✅ TESTING CHECKLIST

### Functional Tests
- [ ] Tutti e 3 i flussi operativi completabili
- [ ] Calcoli matematici verificati con Excel
- [ ] Validazioni form funzionanti
- [ ] Lead capture e invio email ok
- [ ] Navigazione avanti/indietro funzionante
- [ ] Reset simulazione funzionante

### Cross-browser
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari iOS
- [ ] Chrome Android

### Responsive
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)
- [ ] Large screens (1440px+)

### Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] No layout shifts

---

## 🔧 MAINTENANCE & UPDATES

### Regular Updates
- Aggiornare percentuali imposte se cambiano
- Verificare calcoli con normativa vigente
- Aggiornare tooltip con info recenti
- Monitorare tasso conversione lead

### A/B Testing Ideas
- Diverse CTA copy
- Posizionamento form lead
- Colori pulsanti
- Lunghezza form (campi richiesti)

---

**Versione**: 1.0  
**Ultimo aggiornamento**: 2024
