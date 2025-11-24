# 🏠 SIMULATORE OPERAZIONI IMMOBILIARI
## Product Requirements Document (PRD)

---

## 📋 PANORAMICA PROGETTO

### Obiettivo
Creare un simulatore web interattivo che permette agli utenti di calcolare il potenziale guadagno di diverse strategie di investimento immobiliare, funzionando come lead magnet per acquisire contatti qualificati.

### Value Proposition
**"Simula la tua prima operazione immobiliare e scopri quanto puoi guadagnare"**

### Target Audience
- Investitori immobiliari principianti
- Persone interessate a diversificare il portfolio
- Chi cerca opportunità di guadagno nel settore immobiliare

---

## 🎯 FUNZIONALITÀ CORE

### 1. SELEZIONE TIPO OPERAZIONE
Menu dropdown con 3 opzioni:
- 🏠 **Mercato Libero** - Acquisto tradizionale dal mercato
- 💰 **Saldo e Stralcio** - Acquisto crediti deteriorati (NPL)
- ⚖️ **Asta Immobiliare** - Acquisto tramite tribunale

### 2. DEFINIZIONE BUDGET
- Input: Capitale disponibile (€)
- Toggle: "Intendi richiedere un finanziamento?" (Sì/No)
- Se Sì: Campo aggiuntivo per importo finanziamento disponibile

---

## 📊 PARAMETRI PER TIPO OPERAZIONE

### A) MERCATO LIBERO

**Input richiesti:**
- Prezzo richiesto dal venditore (€)
- Valore di mercato stimato (€)
- Margine di trattativa previsto (%, default 5-10%)
- Costi ristrutturazione previsti (€, opzionale)
- Strategia finale:
  - 🔄 Rivendita (flip)
  - 🏘️ Affitto (rendita)

**Se Rivendita:**
- Prezzo rivendita previsto (€)
- Tempo stimato per vendita (mesi)

**Se Affitto:**
- Canone mensile previsto (€)
- Periodo locazione previsto (anni)

**Costi Standard (calcolati automaticamente):**
- Notaio: 2% del prezzo
- Imposte:
  - Prima casa: 2% + €50 catastale + €50 ipotecaria
  - Seconda casa: 9% + €50 catastale + €50 ipotecaria
- Agenzia: 3% (se presente)

---

### B) SALDO E STRALCIO

**Input richiesti:**
- Valore nominale del credito (€)
- Percentuale di acquisto credito (%, tipicamente 20-40%)
- Valore di mercato immobile a garanzia (€)
- Tempi previsti per recupero (mesi, default 12-24)
- Costi legali e recupero credito (€, default 5.000-15.000)

**Parametri educativi da mostrare:**
- Livello di rischio: ALTO
- Expertise richiesta: Legale/Finanziaria
- Capitale minimo consigliato: €50.000

**Calcoli:**
- Investimento totale = (Credito × Percentuale) + Costi legali
- Guadagno potenziale = Valore immobile - Investimento totale
- ROI = (Guadagno / Investimento) × 100

---

### C) ASTA IMMOBILIARE

**Input richiesti:**
- Prezzo base d'asta (€)
- Valore perizia tribunale (€)
- Rilancio previsto (%, default 10-20%)
- Stato immobile:
  - 🟢 Libero
  - 🔴 Occupato
- Se occupato: Costi stimati liberazione (€, default 10.000-30.000)
- Spese legali previste (€, default 5.000-10.000)

**Strategia post-acquisto:**
- Rivendita immediata
- Ristrutturazione + Rivendita
- Affitto

**Costi Standard:**
- Contributo spese asta: 10% del prezzo aggiudicazione
- Imposte registro: 9% (o 2% prima casa)
- Onorari avvocato: calcolati su base

**Parametri educativi:**
- Livello di rischio: MEDIO-ALTO
- Expertise richiesta: Legale
- Capitale minimo: €30.000
- Sconto medio mercato: 20-40%

---

## 📈 OUTPUT - DASHBOARD RISULTATI

### Sezione 1: INVESTIMENTO TOTALE
```
💰 CAPITALE NECESSARIO
├─ Acquisto immobile/credito: €XXX.XXX
├─ Costi notarili/legali: €X.XXX
├─ Imposte e tasse: €X.XXX
├─ Ristrutturazione/Extra: €X.XXX
└─ TOTALE INVESTIMENTO: €XXX.XXX

📊 Budget disponibile: €XX.XXX
✅ Budget sufficiente / ⚠️ Budget insufficiente di €X.XXX
```

### Sezione 2: GUADAGNO POTENZIALE
```
📈 RITORNO INVESTIMENTO
├─ Valore finale stimato: €XXX.XXX
├─ Investimento totale: €XXX.XXX
├─ GUADAGNO NETTO: €XX.XXX
└─ ROI: XX%

⏱️ ROI Annualizzato: XX%
📅 Break-even: X mesi/anni
```

### Sezione 3: ANALISI RISCHI
Per ogni tipo, mostrare:
- ⚠️ Rischi specifici (3-5 punti)
- ✅ Vantaggi specifici (3-5 punti)
- 📊 Livello complessità: Basso/Medio/Alto
- ⏰ Tempistiche realistiche

**Esempi Rischi per Tipo:**

**Mercato Libero:**
- Fluttuazioni mercato
- Tempi vendita più lunghi previsti
- Costi ristrutturazione imprevisti
- Difficoltà locazione

**Saldo e Stralcio:**
- Complessità legali elevate
- Tempi recupero incerti
- Possibili contenziosi
- Necessità expertise specializzata

**Asta Immobiliare:**
- Immobile occupato abusivamente
- Vizi occulti non verificabili
- Tempistiche liberazione lunghe
- Costi extra imprevisti

### Sezione 4: PROSSIMI PASSI
Checklist personalizzata:
- [ ] Verifica disponibilità finanziamento
- [ ] Consulta commercialista per aspetti fiscali
- [ ] Valutazione professionale immobile
- [ ] Analisi documentazione catastale
- [ ] (Altri specifici per tipo operazione)

---

## 🎁 LEAD CAPTURE

### CTA Principale (sempre visibile)
```
🎯 VUOI REALIZZARE QUESTA OPERAZIONE?

Richiedi una consulenza gratuita personalizzata
con i nostri esperti di investimenti immobiliari.

[Nome] [Email] [Telefono]
[RICHIEDI CONSULENZA GRATUITA]
```

### Info da Raccogliere
- Nome completo
- Email
- Telefono
- Budget disponibile (pre-compilato)
- Tipo operazione interessata (pre-compilato)
- Note/Domande (opzionale)

### Privacy
- Checkbox GDPR: "Acconsento al trattamento dati per finalità di contatto"
- Link: Informativa Privacy

---

## 🎨 UX/UI REQUIREMENTS

### Design System
- **Stile**: Moderno, professionale, pulito
- **Colori**: 
  - Primario: Verde/Blu (fiducia, crescita)
  - Accento: Oro/Arancione (opportunità, valore)
  - Neutri: Grigi per testo e backgrounds
- **Font**: Sans-serif moderno (Inter, Roboto, o simile)

### Layout
- **Mobile-first**: Responsive su tutti i dispositivi
- **Single page application**: Navigazione fluida senza reload
- **Progress indicator**: Mostrare step corrente (1/4, 2/4, etc.)

### Interattività
- **Validazione real-time**: Feedback immediato su input
- **Calcoli live**: Aggiornamento automatico risultati
- **Tooltips educativi**: Spiegazioni termini tecnici al hover
- **Animazioni subtle**: Transizioni fluide tra step

### Accessibilità
- Contrasto colori WCAG AA
- Navigazione da tastiera
- Label chiari per screen reader
- Font size minimo 16px

---

## 🔧 FEATURES AVANZATE (Nice to Have)

### 1. Comparatore Scenari
Tabella comparativa delle 3 strategie con stesso budget:
```
| Criterio          | Mercato Libero | Saldo/Stralcio | Asta      |
|-------------------|----------------|----------------|-----------|
| Guadagno potenziale| €XX.XXX       | €XX.XXX        | €XX.XXX   |
| ROI %             | XX%            | XX%            | XX%       |
| Rischio           | ⭐⭐          | ⭐⭐⭐⭐     | ⭐⭐⭐    |
| Tempistiche       | 6-12 mesi      | 12-24 mesi     | 3-8 mesi  |
| Complessità       | Bassa          | Alta           | Media     |
```

### 2. Grafici Visuali
- 📊 Breakdown costi (pie chart)
- 📈 Proiezione ROI nel tempo (line chart)
- 📉 Confronto investimento vs guadagno (bar chart)

### 3. Export Risultati
- 📄 PDF scaricabile con simulazione completa
- 📧 Invio email con riepilogo
- 🔗 Link condivisibile simulazione

### 4. Calcolatore Inverso
"Quanto posso permettermi con il mio budget?"
- Input: Budget disponibile
- Output: Range prezzi immobili accessibili per ogni strategia

### 5. Sezione Educational
- 📚 Glossario termini immobiliari
- 🎓 Guide brevi per ogni tipo operazione
- 📹 Video tutorial (embedded)

---

## 📱 TECHNICAL STACK CONSIGLIATO

### Frontend
- **Framework**: React 18+ con TypeScript
- **Styling**: TailwindCSS (o Styled Components)
- **Form Management**: React Hook Form
- **Validazione**: Zod
- **Charts**: Recharts (o Chart.js)
- **Icons**: Lucide React
- **Animations**: Framer Motion (opzionale)

### Deployment
- **Hosting**: Vercel / Netlify (deploy automatico)
- **Alternative**: GitHub Pages (static)
- **Domain**: Personalizzato consigliato

### Analytics & Lead Management
- **Analytics**: Google Analytics 4
- **Lead Capture**: 
  - FormSpree (no-code)
  - EmailJS (invio email dirette)
  - Integrazione CRM (Zapier/Make)

---

## ✅ ACCEPTANCE CRITERIA

### Funzionali
- [ ] Tutti e 3 i tipi di operazione funzionanti
- [ ] Calcoli matematici corretti e verificati
- [ ] Form lead capture funzionante
- [ ] Email conferma inviata all'utente
- [ ] Responsive su mobile, tablet, desktop
- [ ] Validazione input completa
- [ ] Tooltip informativi presenti

### Performance
- [ ] Load time < 3 secondi
- [ ] Smooth animations (60fps)
- [ ] Nessun layout shift (CLS < 0.1)

### Business
- [ ] Conversione lead trackabile
- [ ] Info salvate correttamente
- [ ] Privacy compliance (GDPR)

---

## 🚀 ROADMAP IMPLEMENTAZIONE

### Phase 1: MVP (Settimana 1-2)
- Setup progetto React + TypeScript
- Implementazione Step 1: Selezione tipo operazione
- Implementazione Step 2: Budget
- Implementazione calcoli base per 1 tipo (Mercato Libero)
- Dashboard risultati base
- Form lead capture

### Phase 2: Completamento Core (Settimana 2-3)
- Implementazione Saldo e Stralcio
- Implementazione Asta Immobiliare
- Sezione rischi e vantaggi
- Validazioni complete
- Mobile responsive

### Phase 3: Polish & Deploy (Settimana 3-4)
- Design refinement
- Animazioni e micro-interazioni
- Testing cross-browser
- Setup analytics
- Deploy produzione

### Phase 4: Enhancements (Futuro)
- Grafici visuali
- Export PDF
- Comparatore scenari
- A/B testing CTA

---

## 📊 KPI & METRICHE

### Metriche Engagement
- Tasso completamento simulazione
- Tempo medio per simulazione
- Distribuzione per tipo operazione

### Metriche Conversione
- Tasso lead capture (goal: >15%)
- Qualità lead (budget dichiarato)
- Tasso bounce rate (<40%)

### Metriche Tecniche
- Page load speed
- Error rate
- Mobile vs Desktop usage

---

## 🎯 DIFFERENZIATORI COMPETITIVI

1. **Focus sul guadagno**: Non solo calcoli, ma potenziale profitto
2. **Multi-strategia**: 3 diversi approcci investimento
3. **Educazione integrata**: Utente impara mentre simula
4. **Lead qualificati**: Budget e interesse dichiarati
5. **UX eccellente**: Flow intuitivo e veloce

---

## 📝 NOTE IMPLEMENTATIVE

### Formule Chiave

**ROI Standard:**
```
ROI (%) = ((Valore Finale - Investimento Totale) / Investimento Totale) × 100
```

**ROI Annualizzato:**
```
ROI Annualizzato (%) = ((1 + ROI) ^ (12 / Mesi)) - 1) × 100
```

**Break-even:**
```
Per affitto: Investimento Totale / Canone Mensile = Mesi
Per rivendita: Tempo previsto vendita
```

### Validazioni Input
- Budget: min €10.000, max €10.000.000
- Percentuali: 0-100%
- Prezzi: > €0
- Tempi: > 0 mesi

### Messaggi Errore User-Friendly
- "Il budget inserito è insufficiente per questa operazione"
- "Inserisci un valore valido maggiore di €10.000"
- "La percentuale deve essere tra 0 e 100"

---

## 🔐 PRIVACY & LEGAL

### GDPR Compliance
- Cookie banner (se analytics con cookies)
- Privacy policy linkata
- Consenso esplicito raccolta dati
- Diritto cancellazione dati

### Disclaimer Legale
```
⚠️ DISCLAIMER:
Questo simulatore fornisce stime indicative basate sui dati inseriti.
I risultati non costituiscono consulenza finanziaria o legale.
Per decisioni di investimento, consultare sempre professionisti qualificati.
```

---

## 🎓 RISORSE EDUCATIONAL DA INTEGRARE

### Tooltip Termini
- **ROI**: Return on Investment - percentuale guadagno rispetto investimento
- **NPL**: Non-Performing Loan - credito deteriorato
- **Saldo e Stralcio**: Accordo pagamento parziale per estinzione credito
- **Prezzo base**: Importo minimo partenza asta giudiziaria
- **Rilancio**: Aumento offerta rispetto prezzo base

### Link Utili (footer)
- Guida investimenti immobiliari
- Blog settore
- FAQ operative
- Casi studio

---

## ✨ CONCLUSIONE

Questo simulatore è progettato per essere:
- **Semplice** da usare per chiunque
- **Educativo** per utenti principianti
- **Efficace** come lead magnet
- **Scalabile** per future implementazioni

L'obiettivo è generare lead qualificati mostrando concretamente le opportunità di guadagno nel settore immobiliare, differenziando tra diverse strategie di investimento.

---

**Versione**: 1.0
**Data**: 2024
**Autore**: Progetto Simulatore Immobiliare
