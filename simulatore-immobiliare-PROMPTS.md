# 🤖 GUIDA PROMPTS PER WINDSURF/CASCADE
## Simulatore Operazioni Immobiliari

---

## 📖 COME USARE QUESTA GUIDA

Questa guida contiene **prompts ottimizzati** da usare con Windsurf (IDE) e Cascade (AI agent) per implementare il simulatore passo dopo passo.

### Strategia Consigliata:
1. **Leggi prima** i documenti PRD e ARCHITECTURE
2. **Copia i prompts** nell'ordine suggerito
3. **Verifica** ogni step prima di procedere
4. **Personalizza** se necessario

### Tips per Massimizzare l'Efficacia:
- ✅ Fornisci sempre **contesto completo** nei prompts
- ✅ Specifica **tecnologie precise** (React, TypeScript, TailwindCSS)
- ✅ Chiedi **codice commentato** e con **type safety**
- ✅ Richiedi **esempi concreti** e **best practices**
- ✅ Fai **review del codice** generato prima di procedere

---

## 🚀 FASE 1: SETUP PROGETTO

### Prompt 1.1: Inizializzazione Progetto
```
Crea un nuovo progetto React con le seguenti specifiche:

STACK:
- React 18+ con TypeScript
- Vite come bundler
- TailwindCSS per styling
- react-hook-form per gestione form
- zod per validazione
- recharts per grafici
- lucide-react per icone

REQUISITI:
1. Setup completo con configurazione TypeScript strict mode
2. Configurazione TailwindCSS con palette custom:
   - Primary: verde (#22c55e)
   - Accent: arancione (#f97316)
   - Neutral: grigi
3. Struttura directory seguendo best practices:
   - src/components (ui, layout, steps, results, forms)
   - src/hooks
   - src/utils
   - src/types
   - src/data
4. Setup ESLint e Prettier
5. File README.md con istruzioni

Genera i comandi necessari e i file di configurazione base.
```

### Prompt 1.2: Configurazione TailwindCSS
```
Configura TailwindCSS per il progetto con:

PALETTE COLORI:
- primary: verde con sfumature (50, 100, 500, 600, 700)
- accent: arancione con sfumature
- neutral: grigi per testo e backgrounds

TIPOGRAFIA:
- Font: Inter (via Google Fonts)
- Scale: display, h1, h2, h3, body, small

COMPONENTI CUSTOM:
- Button variants (primary, secondary, outline)
- Card con shadows
- Input fields con focus states
- Container responsivo

Genera:
1. tailwind.config.js completo
2. globals.css con @layer utilities custom
3. Esempi di uso delle classi custom
```

---

## 🏗️ FASE 2: TYPES & UTILITIES

### Prompt 2.1: Type Definitions
```
Crea le type definitions TypeScript per un simulatore di operazioni immobiliari con 3 tipi:
1. Mercato Libero
2. Saldo e Stralcio
3. Asta Immobiliare

FILE: src/types/simulator.types.ts

TYPES RICHIESTI:
- OperationType: union type dei 3 tipi
- SimulatorState: state globale app con currentStep, operationType, budget, parameters, results
- MercatoLiberoParams: parametri specifici (askingPrice, marketValue, negotiationMargin, renovationCost, strategy, etc.)
- SaldoStralcioParams: parametri NPL (nominalValue, purchasePercentage, propertyValue, recoveryMonths, legalCosts)
- AstaParams: parametri asta (basePrice, appraisalValue, overbidPercentage, isOccupied, liberationCost, strategy)
- SimulationResults: risultati calcolo (totalInvestment, finalValue, profit, roi, annualizedROI, breakeven, breakdown, risks, advantages)
- LeadData: dati form lead capture

Usa discriminated unions dove appropriato e commenta ogni type.
```

### Prompt 2.2: Calculation Utilities
```
Crea utility functions per i calcoli finanziari del simulatore immobiliare.

FILE: src/utils/calculations.ts

FUNZIONI RICHIESTE:

1. calculateROI(finalValue, totalInvestment): number
   Formula: ((finalValue - totalInvestment) / totalInvestment) * 100

2. calculateAnnualizedROI(roi, months): number
   Formula: ((1 + roi/100)^(12/months) - 1) * 100

3. calculateBreakeven(totalInvestment, monthlyIncome): number
   Formula: totalInvestment / monthlyIncome

4. calculateNotaryCosts(price, isFirstHome): object
   Ritorna: { notary, registration, cadastral, mortgage, total }
   - notary: 2% prezzo
   - registration: 2% prima casa, 9% seconda casa
   - cadastral: €50
   - mortgage: €50

5. calculateMercatoLibero(params: MercatoLiberoParams): MercatoLiberoResults
   Calcola investimento totale, valore finale, profitto, ROI basato su strategia (rivendita/affitto)

6. calculateSaldoStralcio(params: SaldoStralcioParams): SaldoStralcioResults
   Calcola acquisto credito, investimento totale, recupero, ROI

7. calculateAstaImmobiliare(params: AstaParams): AstaResults
   Calcola offerta, contributo asta (10%), costi notarili, investimento totale, ROI

Usa TypeScript strict types e commenta le formule.
```

### Prompt 2.3: Formatters & Validators
```
Crea utilities per formattazione e validazione.

FILE 1: src/utils/formatters.ts

FUNZIONI:
- formatCurrency(amount: number, showDecimals?: boolean): string
  Output: "€ 150.000" o "€ 150.000,50"
- formatPercentage(value: number, decimals?: number): string
  Output: "15,5%"
- formatMonths(months: number): string
  Output: "12 mesi" o "2 anni" (converti se > 12)
- getBudgetRange(budget: number): string
  Output: "0-50k", "50k-100k", "100k-250k", "250k+"

FILE 2: src/utils/validators.ts

Usa Zod per creare schemi di validazione:
- budgetSchema: valida budget (min 10k, max 10M), hasFinancing, financingAmount
- mercatoLiberoSchema: valida tutti i campi con conditional validation per strategy
- saldoStralcioSchema: valida parametri NPL
- astaSchema: valida parametri asta
- leadSchema: valida form lead (email, phone regex, gdprConsent required)

Includi messaggi errore in italiano user-friendly.
```

---

## 🎨 FASE 3: UI COMPONENTS BASE

### Prompt 3.1: Button Component
```
Crea un Button component riutilizzabile con TypeScript e TailwindCSS.

FILE: src/components/ui/Button.tsx

REQUIREMENTS:
- Variants: primary, secondary, outline, ghost
- Sizes: sm, md, lg
- Stati: loading, disabled
- Supporto icone (before/after)
- Full TypeScript con PropTypes
- Accessibilità: aria-labels, focus states

ESEMPIO USO:
<Button variant="primary" size="lg" onClick={handleClick}>
  Continua
</Button>

<Button variant="outline" loading={isLoading} icon={<ArrowRight />}>
  Avanti
</Button>

Usa forwardRef per ref support e clsx per gestione classi condizionali.
```

### Prompt 3.2: Input Components
```
Crea componenti Input field riutilizzabili con react-hook-form integration.

FILE: src/components/ui/Input.tsx

COMPONENTS:
1. Input: text, number, email, tel
2. Select: dropdown con opzioni
3. Textarea: text area multi-line
4. Checkbox: con label
5. Radio: gruppo radio buttons
6. Toggle: switch on/off

FEATURES:
- Integrazione react-hook-form (register, errors)
- Label e helper text
- Error states con messaggi
- Icone opzionali
- Prefissi/suffissi (es. "€" per currency)
- Formatting automatico (numeri con separatori)

ESEMPIO:
<Input
  label="Prezzo immobile"
  type="number"
  prefix="€"
  error={errors.price?.message}
  {...register('price')}
/>

Includi FormField wrapper component per layout consistente.
```

### Prompt 3.3: Card & Layout Components
```
Crea componenti layout base.

FILES:
1. src/components/ui/Card.tsx
   - Varianti: default, elevated, outlined
   - Header, Body, Footer sections
   - Hover effects opzionali

2. src/components/ui/Container.tsx
   - Max width responsive
   - Padding consistente
   - Centering

3. src/components/ui/ProgressBar.tsx
   - Mostra step corrente (1/4, 2/4, etc.)
   - Animated progress
   - Labels per ogni step

4. src/components/ui/Tooltip.tsx
   - Posizionamento (top, bottom, left, right)
   - Trigger on hover
   - Contenuto custom

Usa Radix UI o Headless UI se utile per accessibilità.
```

---

## 🎯 FASE 4: STEP COMPONENTS

### Prompt 4.1: Step 1 - Type Selection
```
Crea il componente per la selezione del tipo operazione (Step 1).

FILE: src/components/steps/Step1TypeSelection.tsx

UI:
- 3 card grandi per i tipi: Mercato Libero, Saldo e Stralcio, Asta
- Ogni card mostra:
  - Icona grande (emoji o icon)
  - Titolo
  - Descrizione breve
  - Badge complessità (Bassa/Media/Alta)
  - Badge budget minimo consigliato
  - Sconto medio vs mercato
  - Tempistiche
- Card selezionabile con stato active
- Tooltip "info" con dettagli rischi/vantaggi

DATA:
Importa da src/data/operationTypes.ts (crealo con i 3 tipi e relative info)

INTERAZIONE:
- Click card → seleziona tipo
- Mostra dettagli expanded al click
- Button "Continua" (disabled se nessuna selezione)

Props: { onSelect: (type: OperationType) => void, selected?: OperationType }
```

### Prompt 4.2: Step 2 - Budget
```
Crea il componente per inserimento budget (Step 2).

FILE: src/components/steps/Step2Budget.tsx

UI:
- Input grande per budget con prefix "€" e formatting automatico
- Range slider visuale (opzionale) per range predefiniti
- Toggle "Intendi richiedere un finanziamento?"
- Se Sì: Input aggiuntivo per importo finanziamento
- Card riepilogo:
  - Capitale proprio: €XX.XXX
  - Finanziamento: €XX.XXX (se applicabile)
  - TOTALE DISPONIBILE: €XX.XXX
- Helper text: "Inserisci il capitale che hai a disposizione per investire"
- Validazione real-time (min €10.000)

FEATURES:
- Auto-format numeri durante typing (separatore migliaia)
- Paste handling (rimuovi caratteri non numerici)
- Suggerimenti budget basati su tipo operazione selezionato step 1

Props: { 
  operationType: OperationType,
  onSubmit: (budget: number, hasFinancing: boolean, financingAmount?: number) => void 
}

Usa react-hook-form + zod per validazione.
```

### Prompt 4.3: Step 3A - Mercato Libero Parameters
```
Crea form parametri per operazione Mercato Libero (Step 3).

FILE: src/components/steps/Step3Parameters/MercatoLibero.tsx

SEZIONI FORM:

1. IMMOBILE:
   - Prezzo richiesto venditore (€)
   - Valore di mercato stimato (€)
   - Margine trattativa previsto (%, default 5-10%)
   - [Calcolo automatico]: Prezzo acquisto stimato

2. COSTI AGGIUNTIVI:
   - Costi ristrutturazione previsti (€)
   - Acquisto tramite agenzia? (toggle)
   - Prima o seconda casa? (radio)

3. STRATEGIA:
   - Radio: Rivendita / Affitto
   
   SE RIVENDITA:
   - Prezzo rivendita previsto (€)
   - Tempo stimato vendita (mesi)
   
   SE AFFITTO:
   - Canone mensile previsto (€)
   - Periodo locazione (anni)

4. RIEPILOGO INVESTIMENTO (card laterale o in fondo):
   - Acquisto: €XXX
   - Notaio: €XXX (calc auto)
   - Imposte: €XXX (calc auto)
   - Agenzia: €XXX (se sì)
   - Ristrutturazione: €XXX
   - TOTALE: €XXX
   - Budget disponibile: €XXX
   - [Warning se insufficiente]

Tooltip su ogni campo con spiegazioni.
Validazione con zod schema.
Calcoli live mentre utente compila.

Props: { budget: number, onSubmit: (params: MercatoLiberoParams) => void }
```

### Prompt 4.4: Step 3B - Saldo e Stralcio Parameters
```
Crea form parametri per Saldo e Stralcio (Step 3).

FILE: src/components/steps/Step3Parameters/SaldoStralcio.tsx

SEZIONI:

1. CREDITO:
   - Valore nominale credito (€)
   - Percentuale acquisto (%, default 20-40%)
   - [Calcolo auto]: Costo acquisto credito = nominale × %

2. IMMOBILE A GARANZIA:
   - Valore mercato immobile (€)
   - [Indicatore]: Rapporto credito/valore immobile

3. RECUPERO:
   - Tempi previsti recupero (mesi, slider 12-36)
   - Costi legali stimati (€, suggerimento €5k-15k)

4. ALERT BOX (warning style):
   ⚠️ ATTENZIONE - OPERAZIONE AD ALTO RISCHIO
   - Richiede expertise legale specializzata
   - Tempi recupero incerti
   - Possibili contenziosi
   - Consigliato solo per investitori esperti

5. RIEPILOGO:
   - Acquisto credito: €XXX
   - Costi legali: €XXX
   - INVESTIMENTO TOTALE: €XXX
   - Valore immobile recuperabile: €XXX
   - GUADAGNO POTENZIALE: €XXX
   - ROI potenziale: XX%

Mostra sempre educational tooltips su termini come NPL, valore nominale, saldo e stralcio.

Props: { budget: number, onSubmit: (params: SaldoStralcioParams) => void }
```

### Prompt 4.5: Step 3C - Asta Immobiliare Parameters
```
Crea form parametri per Asta (Step 3).

FILE: src/components/steps/Step3Parameters/AstaImmobiliare.tsx

SEZIONI:

1. ASTA:
   - Prezzo base asta (€)
   - Valore perizia tribunale (€)
   - Rilancio previsto (%, default 10-20%)
   - [Calcolo auto]: Offerta totale prevista

2. STATO IMMOBILE:
   - Radio: Libero / Occupato
   - SE OCCUPATO:
     - Costi liberazione stimati (€, range €10k-30k)
     - [Alert]: "Tempistiche liberazione incerte - rischio maggiore"

3. COSTI:
   - Contributo spese asta: [auto 10% offerta]
   - Spese legali (€, default €5k-10k)
   - Prima o seconda casa (radio)
   - Imposte registro: [auto calc]

4. STRATEGIA POST-ACQUISTO:
   - Radio:
     • Rivendita immediata
     • Ristrutturazione + Rivendita
     • Affitto
   
   CAMPI CONDIZIONALI:
   - Se ristrutturazione: valore post-ristrutturazione
   - Se affitto: canone mensile, anni locazione

5. VANTAGGI ASTA (info box):
   ✓ Sconto medio 20-40% vs mercato
   ✓ Procedura trasparente
   ✓ Garanzia tribunale

6. RIEPILOGO COMPLETO:
   Tutti i costi breakdown + totale vs budget

Props: { budget: number, onSubmit: (params: AstaParams) => void }
```

---

## 📊 FASE 5: RESULTS DASHBOARD

### Prompt 5.1: Results Main Component
```
Crea il componente Results Dashboard (Step 4) - il cuore del simulatore.

FILE: src/components/steps/Step4Results.tsx

LAYOUT (mobile-first, cards stacked):

1. HERO SECTION:
   [Grande card evidenziata]
   💰 GUADAGNO POTENZIALE
   € XX.XXX
   ROI: XX%
   [Gauge chart o progress circle visuale]

2. INVESTIMENTO BREAKDOWN:
   [Card con tabella]
   📊 COMPOSIZIONE INVESTIMENTO
   ├─ Acquisto: €XXX
   ├─ Notaio/Legale: €XXX
   ├─ Imposte: €XXX
   ├─ Extra: €XXX
   └─ TOTALE: €XXX
   
   [Progress bar: Budget usato vs disponibile]

3. RENDIMENTO:
   [Card con metrics]
   📈 ANALISI RENDIMENTO
   - ROI totale: XX%
   - ROI annualizzato: XX%
   - Break-even: X mesi/anni
   - Valore finale: €XXX

4. TIMELINE:
   [Visual timeline con milestones]
   Oggi → Acquisto → Break-even → Fine periodo
   0m     1m          Xm           XXm

5. RISCHI & VANTAGGI:
   [Due colonne o accordion]
   ⚠️ RISCHI:
   - Lista rischi specifici per tipo operazione
   
   ✅ VANTAGGI:
   - Lista vantaggi

6. COMPLESSITÀ:
   [Badge grande]
   Livello: BASSO/MEDIO/ALTO
   Expertise: [tags]
   Tempistiche: X mesi

7. NEXT STEPS:
   [Checklist interattiva]
   □ Verifica finanziamento
   □ Consulta commercialista
   □ Valutazione professionale
   □ [Altri step specifici]

8. CTA LEAD CAPTURE:
   [Card prominente sticky/fixed su mobile]
   🎯 VUOI REALIZZARE QUESTA OPERAZIONE?
   "Richiedi consulenza gratuita..."
   [Button grande]

Props: { 
  results: SimulationResults, 
  operationType: OperationType,
  onLeadCapture: () => void 
}

Usa Recharts per grafici, animazioni smooth con framer-motion.
```

### Prompt 5.2: Charts Components
```
Crea componenti per visualizzazioni grafiche.

FILE: src/components/results/Charts.tsx

COMPONENTI:

1. InvestmentPieChart
   - Pie chart breakdown costi
   - Colori custom per categorie
   - Labels con percentuali
   - Tooltip dettagliato

2. ROIProgressChart
   - Gauge/semicircle chart per ROI %
   - Colore gradiente (rosso<0, giallo 0-10%, verde >10%)
   - Animazione fill

3. TimelineChart
   - Bar chart orizzontale
   - Mostra progressione nel tempo
   - Evidenzia break-even point

4. ComparisonChart (se comparatore attivo)
   - Bar chart comparativo 3 strategie
   - Metrics: ROI, Rischio, Tempo, Complessità

TECH:
- Usa Recharts (o Chart.js)
- Responsive
- Colori brand (primary/accent)
- Animations smooth

Export tutti i componenti.
```

### Prompt 5.3: Lead Capture Form
```
Crea form per acquisizione lead.

FILE: src/components/forms/LeadCaptureForm.tsx

UI/UX:

1. HEADER:
   🎯 "VUOI REALIZZARE QUESTA OPERAZIONE?"
   Sottotitolo: "Richiedi una consulenza gratuita personalizzata"

2. FORM FIELDS:
   - Nome completo (required)
   - Email (required, validation)
   - Telefono (required, format +39 XXX XXXXXXX)
   - Note/Domande (optional, textarea)
   - [Pre-filled hidden]:
     • Budget
     • Tipo operazione
     • Risultati simulazione (JSON)

3. GDPR:
   - Checkbox required: "Acconsento al trattamento dati..."
   - Link: "Leggi l'informativa privacy"

4. SUBMIT:
   - Button grande: "RICHIEDI CONSULENZA GRATUITA"
   - Loading state
   - Success message con next steps

5. SUCCESS STATE:
   ✓ "RICHIESTA INVIATA!"
   "Riceverai una email di conferma a [email]"
   "Ti contatteremo entro 24 ore"
   [Button: "Scarica riepilogo PDF"] (future feature)

TECH:
- react-hook-form + zod validation
- API call simulata (o integrazione EmailJS/FormSpree)
- Error handling con toast notifications
- Analytics tracking on submit

Props: {
  simulationData: {
    operationType: OperationType,
    budget: number,
    results: SimulationResults
  },
  onSuccess: () => void
}
```

---

## 🎣 FASE 6: HOOKS & STATE MANAGEMENT

### Prompt 6.1: useSimulator Hook
```
Crea custom hook per gestire lo state del simulatore.

FILE: src/hooks/useSimulator.ts

STATE:
- currentStep (1-4)
- operationType
- budget
- hasFinancing
- financingAmount
- parameters (union type)
- results

METHODS:
- nextStep()
- prevStep()
- setOperationType(type)
- setBudget(amount, financing)
- setParameters(params)
- calculateResults() → chiama utils di calcolo
- reset() → torna step 1
- canProceed() → validation step corrente

FEATURES:
- LocalStorage persistence (auto-save/restore)
- Validation prima di nextStep()
- Computed values (totalBudget, etc.)

Return type ben definito per TypeScript.

ESEMPIO USO:
const { state, nextStep, setOperationType, calculateResults } = useSimulator();
```

### Prompt 6.2: useLocalStorage Hook
```
Crea hook per persistenza state in localStorage.

FILE: src/hooks/useLocalStorage.ts

FEATURES:
- Generic type support
- Auto-save on change (debounced)
- Restore on mount
- Clear method
- Expiry time opzionale

ESEMPIO:
const [state, setState] = useLocalStorage<SimulatorState>('simulator-state', initialState);

Error handling per quota exceeded e parsing errors.
```

---

## 🎨 FASE 7: MAIN APP & ROUTING

### Prompt 7.1: App Component
```
Crea il main App component con orchestrazione degli step.

FILE: src/App.tsx

STRUCTURE:
- Header (logo, tagline)
- ProgressBar (step corrente)
- Step container (conditional rendering)
  • Step 1: Type Selection
  • Step 2: Budget
  • Step 3: Parameters (conditional su type)
  • Step 4: Results
- Footer (links, credits)

NAVIGATION:
- Button "Indietro" (se step > 1)
- Button "Avanti" (validato per step corrente)
- Button "Ricomincia" su results

STATE:
- Usa useSimulator hook
- Gestisci transizioni smooth tra step

UI:
- Animazioni page transition (framer-motion)
- Mobile-first responsive
- Loading states appropriati

FEATURES:
- Auto-save progress
- Restore on reload
- Confirmation dialog su reset
```

### Prompt 7.2: Header & Footer
```
Crea componenti Header e Footer.

FILE 1: src/components/layout/Header.tsx
- Logo/Brand
- Tagline: "Simula la tua prima operazione immobiliare"
- CTA secondary: "Info" / "Contatti"

FILE 2: src/components/layout/Footer.tsx
- Links: Privacy Policy, Cookie Policy, Contatti
- Social icons (opzionali)
- Copyright
- Disclaimer: "I risultati sono indicativi..."

Responsive, sticky header opzionale.
```

---

## 🚀 FASE 8: POLISH & OPTIMIZATION

### Prompt 8.1: Animations & Transitions
```
Aggiungi micro-interactions e animazioni con Framer Motion.

ANIMAZIONI:
1. Page transitions tra step (slide/fade)
2. Card hover effects (lift, glow)
3. Number counting animation su results (0 → final value)
4. Progress bar animated fill
5. Form field focus animations
6. Success checkmark animation
7. Loading spinners

PRINCIPI:
- Duration: 200-400ms per UI, 600-1000ms per celebratory
- Easing: ease-out per entrance, ease-in per exit
- Respect prefers-reduced-motion

FILE: src/utils/animations.ts
Export variants riutilizzabili.
```

### Prompt 8.2: Responsive Optimization
```
Ottimizza responsive design per tutti i breakpoints.

BREAKPOINTS:
- Mobile: 320-767px
- Tablet: 768-1023px
- Desktop: 1024-1439px
- Large: 1440px+

FOCUS AREAS:
1. Step form layouts (stack su mobile)
2. Results dashboard (single column mobile, grid desktop)
3. Card sizing e padding
4. Button sizes (larger tap targets mobile)
5. Font scaling
6. Charts responsive

TEST DEVICES:
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPad (768px)
- Desktop (1440px)

Usa container queries se appropriato.
```

### Prompt 8.3: Performance Optimization
```
Ottimizza performance app.

ACTIONS:
1. Code splitting:
   - Lazy load Step components
   - Lazy load Charts
   - Lazy load Lead form

2. Memoization:
   - useMemo per calcoli pesanti
   - useCallback per handlers
   - React.memo per componenti puri

3. Bundle optimization:
   - Tree shaking (check imports)
   - Analizza bundle size
   - Dynamic imports

4. Images:
   - Ottimizza logo/icons
   - Lazy load images
   - WebP format

5. Fonts:
   - Preload critical fonts
   - Font-display: swap

TARGET METRICS:
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse score > 90
```

### Prompt 8.4: Error Handling & Edge Cases
```
Implementa error handling robusto.

SCENARI:
1. Validazione form errors
   - Inline errors
   - Toast notifications
   - Prevent submission

2. API errors (lead submission)
   - Retry logic
   - Fallback message
   - Manual contact info

3. Calcoli errors
   - Division by zero
   - Negative values
   - Overflow

4. Storage errors
   - LocalStorage quota
   - Parsing errors
   - Graceful degradation

5. Network errors
   - Offline detection
   - Retry with exponential backoff

ERROR UI:
- Toast component
- Error boundaries
- Fallback UI
- User-friendly messages (NO codici errore tecnici)

FILE: src/components/ui/Toast.tsx
FILE: src/components/ErrorBoundary.tsx
```

---

## 📊 FASE 9: ANALYTICS & TRACKING

### Prompt 9.1: Analytics Setup
```
Setup Google Analytics 4 per tracking.

FILE: src/utils/analytics.ts

EVENTS DA TRACCIARE:
1. Page views (step_viewed)
2. Tipo operazione selezionato
3. Budget inserito (range)
4. Simulazione completata
5. Lead form opened
6. Lead form submitted
7. Errori form
8. Download PDF (future)

CUSTOM DIMENSIONS:
- operation_type
- budget_range
- roi_percentage
- completion_rate

IMPLEMENTATION:
- gtag.js setup in index.html
- Type-safe wrapper functions
- Privacy-compliant (anonymize IP)
- Consent management ready

Non tracciare PII (email, phone) direttamente.
```

### Prompt 9.2: Conversion Tracking
```
Setup tracking per conversioni lead.

FUNNEL:
1. Landing → Step 1
2. Step 1 → Step 2
3. Step 2 → Step 3
4. Step 3 → Step 4 (simulation complete)
5. Step 4 → Lead form (intent)
6. Lead form → Submit (conversion)

METRICS:
- Drop-off rate per step
- Average time per step
- Completion rate
- Lead conversion rate
- Most popular operation type

DASHBOARD:
Crea file /docs/analytics-dashboard.md con:
- KPI definitions
- GA4 setup instructions
- Custom reports queries
```

---

## 🧪 FASE 10: TESTING & QA

### Prompt 10.1: Unit Tests
```
Scrivi unit tests per utilities functions.

FILE: src/utils/__tests__/calculations.test.ts

TEST CASES:
1. calculateROI
   - Positive ROI
   - Negative ROI (loss)
   - Zero investment (error)
   - Break-even (0% ROI)

2. calculateAnnualizedROI
   - Various time periods
   - < 12 months
   - > 12 months

3. calculateNotaryCosts
   - Prima casa
   - Seconda casa
   - Edge values

4. Full operation calculations
   - Mercato Libero (resale/rental)
   - Saldo e Stralcio
   - Asta (various strategies)

Usa Vitest (o Jest).
Coverage target: >80% per utils.
```

### Prompt 10.2: Integration Tests
```
Scrivi integration tests per flussi utente.

TEST SCENARIOS:

1. Happy Path - Mercato Libero
   - Seleziona tipo
   - Inserisci budget
   - Compila parametri
   - Visualizza results
   - Submit lead

2. Budget Insufficiente
   - Mostra warning
   - Non permette proceed

3. Form Validation
   - Field errors
   - Required fields
   - Format validation

4. Navigation
   - Avanti/Indietro
   - State persistence
   - Reset

Usa React Testing Library + Vitest.
Mock API calls.
```

### Prompt 10.3: Manual QA Checklist
```
Crea checklist QA completa.

FILE: /docs/qa-checklist.md

FUNCTIONAL:
- [ ] Tutti e 3 i flussi completabili end-to-end
- [ ] Calcoli matematici corretti (verificati con Excel)
- [ ] Validazioni form funzionanti
- [ ] Lead submission + email conferma
- [ ] Navigazione avanti/indietro
- [ ] Reset funzionante
- [ ] LocalStorage save/restore

CROSS-BROWSER:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari iOS
- [ ] Chrome Android

RESPONSIVE:
- [ ] Mobile portrait (320-767px)
- [ ] Mobile landscape
- [ ] Tablet (768-1023px)
- [ ] Desktop (1024px+)
- [ ] Large screens (1440px+)

ACCESSIBILITY:
- [ ] Keyboard navigation completa
- [ ] Screen reader compatibile
- [ ] Color contrast WCAG AA
- [ ] Focus indicators visibili
- [ ] Alt text su immagini

PERFORMANCE:
- [ ] Lighthouse score > 90
- [ ] FCP < 1.5s
- [ ] TTI < 3s
- [ ] No layout shifts (CLS < 0.1)
- [ ] Bundle size < 500KB

UX:
- [ ] Loading states appropriati
- [ ] Error messages chiari
- [ ] Success feedback
- [ ] Tooltips informativi
- [ ] Animazioni smooth (60fps)

BUSINESS:
- [ ] Lead data salvati correttamente
- [ ] Email inviata con template corretto
- [ ] Analytics events firing
- [ ] GDPR compliance
- [ ] Privacy policy accessibile
```

---

## 🚀 FASE 11: DEPLOYMENT

### Prompt 11.1: Production Build
```
Prepara build di produzione ottimizzato.

ACTIONS:
1. Environment variables setup
   - .env.example con tutti i keys
   - VITE_GA_ID
   - VITE_API_ENDPOINT (EmailJS/FormSpree)

2. Build optimization
   - vite.config.ts con rollup options
   - Code splitting strategico
   - Compression (gzip/brotli)

3. Assets optimization
   - Minify CSS/JS
   - Optimize images
   - Generate sourcemaps (production)

4. Pre-deployment checklist
   - Replace tutti i TODO
   - Remove console.logs
   - Verify env vars
   - Test production build locally

COMMANDS:
npm run build
npm run preview

Output: /dist folder ready for deploy.
```

### Prompt 11.2: Vercel Deployment
```
Setup deployment su Vercel.

STEPS:
1. Install Vercel CLI: npm i -g vercel
2. Login: vercel login
3. Setup project: vercel
4. Configure:
   - Framework: Vite
   - Build command: npm run build
   - Output directory: dist
   - Environment variables

5. Deploy: vercel --prod

6. Post-deployment:
   - Custom domain setup (opzionale)
   - Analytics integration
   - Preview deployments per branch

FILE: vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}

Automated deploys via Git push.
```

### Prompt 11.3: Monitoring & Maintenance
```
Setup monitoring post-deployment.

TOOLS:
1. Vercel Analytics (built-in)
   - Real User Metrics
   - Web Vitals

2. Google Analytics 4
   - Custom events
   - Conversion tracking

3. Sentry (error tracking)
   - Frontend errors
   - Source maps

4. Uptime monitoring
   - UptimeRobot o similar
   - Alert su downtime

MAINTENANCE PLAN:
- Weekly: Check analytics
- Monthly: Review lead quality
- Quarterly: Update calcoli se cambiano normative
- Ad-hoc: Bug fixes, performance improvements

DOCUMENTATION:
- README.md con setup instructions
- CHANGELOG.md per versioning
- /docs folder con PRD, Architecture, API docs
```

---

## 📚 FASE 12: DOCUMENTATION

### Prompt 12.1: README.md
```
Scrivi README.md completo per il progetto.

SECTIONS:

# 🏠 Simulatore Operazioni Immobiliari

## 📋 Overview
Breve descrizione, purpose, value proposition

## ✨ Features
- Lista feature principali
- Screenshot/GIF

## 🚀 Quick Start
```bash
# Installation
npm install

# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## 🏗️ Tech Stack
- React 18 + TypeScript
- TailwindCSS
- Vite
- React Hook Form + Zod
- Recharts
- Framer Motion

## 📁 Project Structure
Directory tree spiegata

## 🔧 Configuration
- Environment variables
- Customization options

## 📊 Analytics & Tracking
Come funziona tracking

## 🧪 Testing
Come eseguire tests

## 🚀 Deployment
Istruzioni deploy Vercel/Netlify

## 📝 License
MIT / Proprietario

## 👥 Credits
Team, contacts

Usa badges per build status, test coverage, etc.
```

### Prompt 12.2: User Guide
```
Crea guida utente per end-users.

FILE: /docs/user-guide.md

CONTENT:
1. Introduzione
   - Cos'è il simulatore
   - A chi è rivolto
   - Come funziona

2. Guida passo-passo
   - Step 1: Scegli tipo operazione
   - Step 2: Inserisci budget
   - Step 3: Parametri specifici
   - Step 4: Analizza risultati

3. Interpretare i risultati
   - Cosa significa ROI
   - Come valutare rischi
   - Quando considerare l'operazione vantaggiosa

4. FAQ
   - Domande comuni
   - Troubleshooting

5. Glossario
   - Termini tecnici spiegati

6. Next steps
   - Cosa fare dopo la simulazione
   - Come procedere con investimento reale

Linguaggio semplice, esempi pratici.
```

---

## 🎯 PROMPTS BONUS: FEATURES AVANZATE

### Bonus 1: Comparatore Scenari
```
Aggiungi feature comparatore tra le 3 strategie.

COMPONENT: src/components/ComparatorModal.tsx

UI:
- Modal o pagina separata
- Tabella comparativa
- Input: stesso budget per tutte e 3
- Output: Metrics affiancati
  • Guadagno potenziale
  • ROI %
  • Tempo
  • Rischio (stelle)
  • Complessità

- Chart: Bar chart comparativo
- CTA: "Scegli questa strategia"

Usa parametri default sensati per fair comparison.
```

### Bonus 2: PDF Export
```
Aggiungi export risultati in PDF.

LIBRARY: jsPDF + autoTable

CONTENT PDF:
1. Header con logo
2. Riepilogo operazione
3. Breakdown investimento (tabella)
4. Risultati ROI
5. Grafici (convertiti in immagini)
6. Rischi e vantaggi
7. Disclaimer legale
8. Footer con contatti

Button: "Scarica Riepilogo PDF"
Filename: simulazione-[tipo]-[data].pdf
```

### Bonus 3: Share Link
```
Aggiungi condivisione simulazione via link.

IMPLEMENTATION:
- Genera short ID univoco
- Salva simulazione su backend/localStorage
- Crea shareable URL: /sim/[id]
- Route dinamica carica simulazione
- Read-only view

Utile per:
- Condividere con partner
- Consultare commercialista
- Revisione successiva

Button: "Condividi simulazione" → Copia link
```

---

## ✅ CHECKLIST FINALE

### Pre-Launch
- [ ] Tutti i prompts implementati
- [ ] Tests passati
- [ ] QA checklist completata
- [ ] Build production funzionante
- [ ] Analytics configurato
- [ ] Domain configurato (se custom)
- [ ] GDPR compliance verificata
- [ ] Email templates pronti

### Launch
- [ ] Deploy su Vercel/Netlify
- [ ] Smoke test su produzione
- [ ] Monitor errors prime ore
- [ ] Share con stakeholders
- [ ] Marketing assets pronti

### Post-Launch
- [ ] Monitor analytics daily (prima settimana)
- [ ] Rispondi a lead entro 24h
- [ ] Raccogli feedback utenti
- [ ] Itera su miglioramenti

---

## 🎓 TIPS FINALI PER WINDSURF

### Massimizza l'Efficacia:
1. **Context is King**: Fornisci sempre file rilevanti nel contesto (types, utils esistenti)
2. **Iterazione**: Non aspettarti perfezione al primo prompt - itera e raffina
3. **Specificity**: Più sei specifico, migliore sarà l'output
4. **Examples**: Chiedi esempi d'uso quando non chiaro
5. **Review**: Rivedi sempre il codice generato, non fidarti ciecamente

### Quando Chiedere Help:
- "Spiega questo codice passo-passo"
- "Quali sono edge cases che dovrei gestire?"
- "Come posso ottimizzare questa funzione?"
- "Mostrami best practices per X"
- "Debug questo errore: [error message]"

### Cascade-Specific:
- Usa @file per riferimenti specifici
- Usa /edit per modifiche mirate
- Usa /ask per domande senza modifica
- Fai commit frequenti durante sviluppo

---

**Buon sviluppo! 🚀**

---

**Versione**: 1.0  
**Ultimo aggiornamento**: 2024  
**Linguaggio**: Italiano  
**Tool**: Windsurf + Cascade
