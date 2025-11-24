import { useSimulator } from './hooks/useSimulator';
import { ProgressBar } from './components/ui';
import { Step1TypeSelection } from './components/steps/Step1TypeSelection';
import { Step2Budget } from './components/steps/Step2Budget';
import { MercatoLibero, SaldoStralcio, AstaImmobiliare } from './components/steps/Step3Parameters';
import { Step4Results } from './components/steps/Step4Results';
import { Calculator } from 'lucide-react';
import type { OperationParameters } from './types/simulator.types';

function App() {
  const {
    state,
    totalBudget,
    nextStep,
    prevStep,
    setOperationType,
    setBudget,
    setParameters,
    reset,
  } = useSimulator();

  const handleTypeSelect = (type: any) => {
    setOperationType(type);
  };

  const handleBudgetSubmit = (budget: number, hasFinancing: boolean, financingAmount: number) => {
    setBudget(budget, hasFinancing, financingAmount);
    nextStep();
  };

  const handleParametersSubmit = (params: OperationParameters) => {
    setParameters(params); // Ora calcola automaticamente i risultati
    nextStep();
  };

  const stepLabels = ['Tipo', 'Budget', 'Parametri', 'Risultati'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Simulatore Immobiliare
                </h1>
                <p className="text-sm text-slate-600">
                  Calcola il tuo potenziale guadagno
                </p>
              </div>
            </div>
            {state.currentStep > 1 && (
              <button
                onClick={reset}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Ricomincia
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ProgressBar
          currentStep={state.currentStep}
          totalSteps={4}
          labels={stepLabels}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {state.currentStep === 1 && (
          <Step1TypeSelection
            selected={state.operationType}
            onSelect={handleTypeSelect}
            onNext={nextStep}
          />
        )}

        {state.currentStep === 2 && state.operationType && (
          <Step2Budget
            operationType={state.operationType}
            initialBudget={state.budget}
            initialHasFinancing={state.hasFinancing}
            initialFinancingAmount={state.financingAmount}
            onSubmit={handleBudgetSubmit}
            onBack={prevStep}
          />
        )}

        {state.currentStep === 3 && state.operationType && (
          <>
            {state.operationType === 'mercato-libero' && (
              <MercatoLibero
                budget={totalBudget}
                onSubmit={handleParametersSubmit}
                onBack={prevStep}
              />
            )}
            {state.operationType === 'saldo-stralcio' && (
              <SaldoStralcio
                budget={totalBudget}
                onSubmit={handleParametersSubmit}
                onBack={prevStep}
              />
            )}
            {state.operationType === 'asta' && (
              <AstaImmobiliare
                budget={totalBudget}
                onSubmit={handleParametersSubmit}
                onBack={prevStep}
              />
            )}
          </>
        )}

        {state.currentStep === 4 && state.results && state.operationType && (
          <Step4Results
            results={state.results}
            operationType={state.operationType}
            budget={totalBudget}
            onReset={reset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>
            ⚠️ Disclaimer: Questo simulatore fornisce stime indicative. I risultati non
            costituiscono consulenza finanziaria o legale.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
