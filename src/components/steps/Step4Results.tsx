import { TrendingUp, AlertTriangle, CheckCircle, RotateCcw, ChevronLeft } from 'lucide-react';
import { Card, CardBody, Button } from '../ui';
import { formatCurrency, formatPercentage, formatMonths } from '../../utils/formatters';
import type { SimulationResults, OperationType } from '../../types/simulator.types';

interface Step4ResultsProps {
  results: SimulationResults;
  operationType: OperationType;
  budget: number;
  onReset: () => void;
  onBack: () => void;
}

export const Step4Results = ({
  results,
  operationType,
  budget,
  onReset,
  onBack,
}: Step4ResultsProps) => {
  const getOperationLabel = (type: OperationType) => {
    switch (type) {
      case 'mercato-libero':
        return 'Mercato Libero';
      case 'saldo-stralcio':
        return 'Saldo e Stralcio';
      case 'asta':
        return 'Asta Immobiliare';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getComplexityLabel = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'Bassa';
      case 'medium':
        return 'Media';
      case 'high':
        return 'Alta';
      default:
        return complexity;
    }
  };

  const isProfitable = results.profit > 0;
  const roiColor = results.roi > 20 ? 'text-green-600' : results.roi > 10 ? 'text-yellow-600' : results.roi > 0 ? 'text-blue-600' : 'text-red-600';

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Risultati Simulazione
        </h2>
        <p className="text-lg text-slate-600">
          {getOperationLabel(operationType)}
        </p>
      </div>

      {/* Main Result Card */}
      <Card variant="elevated" className="mb-8">
        <CardBody className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <TrendingUp className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Guadagno Potenziale
          </h3>
          <div className={`text-5xl font-bold mb-4 ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(results.profit)}
          </div>
          <div className="flex items-center justify-center gap-8 text-lg">
            <div>
              <span className="text-slate-600">ROI: </span>
              <span className={`font-bold ${roiColor}`}>
                {formatPercentage(results.roi)}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-300" />
            <div>
              <span className="text-slate-600">ROI Annualizzato: </span>
              <span className={`font-bold ${roiColor}`}>
                {formatPercentage(results.annualizedROI)}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Investimento Breakdown */}
        <Card>
          <CardBody>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              💰 Composizione Investimento
            </h3>
            <div className="space-y-3">
              {Object.entries(results.breakdown).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-slate-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(value)}
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t-2 border-slate-200 flex justify-between">
                <span className="font-bold text-slate-900">TOTALE:</span>
                <span className="font-bold text-lg text-primary">
                  {formatCurrency(results.totalInvestment)}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Budget disponibile:</span>
                <span className="font-semibold">{formatCurrency(budget)}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    results.totalInvestment <= budget ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min((results.totalInvestment / budget) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {results.totalInvestment <= budget
                  ? `✓ Budget utilizzato: ${((results.totalInvestment / budget) * 100).toFixed(1)}%`
                  : `⚠️ Superamento budget: ${formatCurrency(results.totalInvestment - budget)}`}
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Rendimento */}
        <Card>
          <CardBody>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              📈 Analisi Rendimento
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">ROI Totale</div>
                <div className={`text-3xl font-bold ${roiColor}`}>
                  {formatPercentage(results.roi)}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">ROI Annualizzato</div>
                <div className={`text-3xl font-bold ${roiColor}`}>
                  {formatPercentage(results.annualizedROI)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Valore Finale</div>
                  <div className="text-lg font-bold text-slate-900">
                    {formatCurrency(results.finalValue)}
                  </div>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Break-even</div>
                  <div className="text-lg font-bold text-slate-900">
                    {formatMonths(results.breakeven)}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">Tempistiche</div>
                <div className="text-lg font-bold text-slate-900">
                  {results.timeframe}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Rischi e Vantaggi */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Rischi */}
        <Card variant="outlined" className="border-red-200 bg-red-50/50">
          <CardBody>
            <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Rischi da Considerare
            </h3>
            <ul className="space-y-2">
              {results.risks.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-red-800">
                  <span className="text-red-600 mt-1">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {/* Vantaggi */}
        <Card variant="outlined" className="border-green-200 bg-green-50/50">
          <CardBody>
            <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Vantaggi dell'Operazione
            </h3>
            <ul className="space-y-2">
              {results.advantages.map((advantage, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-green-800">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{advantage}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      {/* Complessità */}
      <Card className="mb-8">
        <CardBody>
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            📊 Livello Complessità
          </h3>
          <div className="flex items-center gap-4">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getComplexityColor(
                results.complexity
              )}`}
            >
              {getComplexityLabel(results.complexity)}
            </span>
            <span className="text-slate-600">
              Questa operazione richiede un livello di expertise{' '}
              <strong>{getComplexityLabel(results.complexity).toLowerCase()}</strong>
            </span>
          </div>
        </CardBody>
      </Card>

      {/* Prossimi Passi */}
      <Card className="mb-8">
        <CardBody>
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            ✅ Prossimi Passi Consigliati
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" className="w-5 h-5 text-primary rounded" />
              <span className="text-slate-700">
                Verifica disponibilità finanziamento bancario
              </span>
            </label>
            <label className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" className="w-5 h-5 text-primary rounded" />
              <span className="text-slate-700">
                Consulta commercialista per aspetti fiscali
              </span>
            </label>
            <label className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" className="w-5 h-5 text-primary rounded" />
              <span className="text-slate-700">
                Richiedi valutazione professionale dell'immobile
              </span>
            </label>
            <label className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
              <input type="checkbox" className="w-5 h-5 text-primary rounded" />
              <span className="text-slate-700">
                Analizza documentazione catastale e urbanistica
              </span>
            </label>
            {operationType === 'saldo-stralcio' && (
              <label className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-primary rounded" />
                <span className="text-slate-700">
                  Consulta avvocato specializzato in NPL
                </span>
              </label>
            )}
            {operationType === 'asta' && (
              <label className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-primary rounded" />
                <span className="text-slate-700">
                  Studia documentazione asta e perizia tribunale
                </span>
              </label>
            )}
          </div>
        </CardBody>
      </Card>

      {/* CTA Lead Capture */}
      <Card variant="elevated" className="bg-gradient-to-br from-primary/5 to-accent/5 mb-8">
        <CardBody className="text-center py-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            🎯 Vuoi Realizzare Questa Operazione?
          </h3>
          <p className="text-lg text-slate-600 mb-6">
            Richiedi una consulenza gratuita personalizzata con i nostri esperti di
            investimenti immobiliari
          </p>
          <a
            href="https://meetings-eu1.hubspot.com/cristian-testa"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="lg" className="mx-auto">
              Richiedi Consulenza Gratuita
            </Button>
          </a>
          <p className="text-sm text-slate-500 mt-4">
            Prenota subito un appuntamento con il nostro team
          </p>
        </CardBody>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          icon={<ChevronLeft className="w-5 h-5" />}
          iconPosition="left"
        >
          Modifica Parametri
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onReset}
          icon={<RotateCcw className="w-5 h-5" />}
          iconPosition="left"
        >
          Nuova Simulazione
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Disclaimer:</strong> Questo simulatore fornisce stime indicative basate
          sui dati inseriti. I risultati non costituiscono consulenza finanziaria o legale.
          Per decisioni di investimento, consultare sempre professionisti qualificati.
        </p>
      </div>
    </div>
  );
};
