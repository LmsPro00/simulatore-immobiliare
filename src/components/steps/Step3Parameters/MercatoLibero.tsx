import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, ChevronLeft, Home, TrendingUp } from 'lucide-react';
import { Card, CardBody, Button, Input, Toggle, Select } from '../../ui';
import { mercatoLiberoSchema, type MercatoLiberoFormData } from '../../../utils/validators';
import { formatCurrency, formatInputNumber, cleanNumericInput } from '../../../utils/formatters';
import { calculateNotaryCosts } from '../../../utils/calculations';
import { getTooltip } from '../../../data/tooltips';
import type { MercatoLiberoParams } from '../../../types/simulator.types';

interface MercatoLiberoProps {
  budget: number;
  initialData?: Partial<MercatoLiberoParams>;
  onSubmit: (params: MercatoLiberoParams) => void;
  onBack: () => void;
}

export const MercatoLibero = ({
  budget,
  initialData,
  onSubmit,
  onBack,
}: MercatoLiberoProps) => {
  const [strategy, setStrategy] = useState<'resale' | 'rental'>(
    initialData?.strategy || 'resale'
  );
  const [hasAgency, setHasAgency] = useState(initialData?.hasAgency || false);
  const [isFirstHome, setIsFirstHome] = useState(initialData?.isFirstHome || true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MercatoLiberoFormData>({
    resolver: zodResolver(mercatoLiberoSchema),
    defaultValues: {
      askingPrice: initialData?.askingPrice || 0,
      marketValue: initialData?.marketValue || 0,
      negotiationMargin: initialData?.negotiationMargin || 10,
      renovationCost: initialData?.renovationCost || 0,
      hasAgency: initialData?.hasAgency || false,
      isFirstHome: initialData?.isFirstHome || true,
      strategy: initialData?.strategy || 'resale',
      resalePrice: initialData?.resalePrice,
      resaleMonths: initialData?.resaleMonths,
      monthlyRent: initialData?.monthlyRent,
      rentalYears: initialData?.rentalYears,
    },
  });

  const askingPrice = watch('askingPrice') || 0;
  const negotiationMargin = watch('negotiationMargin') || 0;
  const renovationCost = watch('renovationCost') || 0;

  // Calcolo prezzo acquisto stimato
  const purchasePrice = askingPrice * (1 - negotiationMargin / 100);
  
  // Calcolo costi
  const costs = calculateNotaryCosts(purchasePrice, isFirstHome);
  const agencyCost = hasAgency ? purchasePrice * 0.03 : 0;
  const totalInvestment = purchasePrice + costs.total + agencyCost + renovationCost;

  const isBudgetSufficient = totalInvestment <= budget;

  useEffect(() => {
    setValue('strategy', strategy);
    setValue('hasAgency', hasAgency);
    setValue('isFirstHome', isFirstHome);
  }, [strategy, hasAgency, isFirstHome, setValue]);

  const onFormSubmit = (data: MercatoLiberoFormData) => {
    onSubmit(data as MercatoLiberoParams);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Home className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Mercato Libero
        </h2>
        <p className="text-lg text-slate-600">
          Inserisci i parametri per l'acquisto tradizionale
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Sezione Immobile */}
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              📍 Dati Immobile
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Prezzo Richiesto dal Venditore"
                type="number"
                prefix="€"
                tooltip={getTooltip('margineTrattativa')}
                error={errors.askingPrice?.message}
                {...register('askingPrice', { valueAsNumber: true })}
              />
              <Input
                label="Valore di Mercato Stimato"
                type="number"
                prefix="€"
                error={errors.marketValue?.message}
                {...register('marketValue', { valueAsNumber: true })}
              />
              <Input
                label="Margine Trattativa Previsto"
                type="number"
                suffix="%"
                tooltip={getTooltip('margineTrattativa')}
                helperText="Sconto che prevedi di ottenere"
                error={errors.negotiationMargin?.message}
                {...register('negotiationMargin', { valueAsNumber: true })}
              />
              <Input
                label="Costi Ristrutturazione"
                type="number"
                prefix="€"
                helperText="Lascia 0 se non necessaria"
                error={errors.renovationCost?.message}
                {...register('renovationCost', { valueAsNumber: true })}
              />
            </div>

            {purchasePrice > 0 && (
              <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-slate-700">
                  💰 Prezzo acquisto stimato:{' '}
                  <span className="font-bold text-primary">
                    {formatCurrency(purchasePrice)}
                  </span>
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Sezione Costi Aggiuntivi */}
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              💼 Costi Aggiuntivi
            </h3>
            <div className="space-y-4">
              <Toggle
                label="Acquisto tramite agenzia immobiliare?"
                description="Costo agenzia: 3% del prezzo di acquisto"
                checked={hasAgency}
                onChange={(e) => setHasAgency(e.target.checked)}
              />
              <div className="pt-4 border-t border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Tipo di acquisto
                </label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={isFirstHome}
                      onChange={() => setIsFirstHome(true)}
                      className="sr-only peer"
                    />
                    <div className="p-4 border-2 rounded-lg transition-all peer-checked:border-primary peer-checked:bg-primary/5">
                      <div className="font-semibold text-slate-900">Prima Casa</div>
                      <div className="text-sm text-slate-600">Imposte ridotte (2%)</div>
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isFirstHome}
                      onChange={() => setIsFirstHome(false)}
                      className="sr-only peer"
                    />
                    <div className="p-4 border-2 rounded-lg transition-all peer-checked:border-primary peer-checked:bg-primary/5">
                      <div className="font-semibold text-slate-900">Seconda Casa</div>
                      <div className="text-sm text-slate-600">Imposte standard (9%)</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Sezione Strategia */}
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              🎯 Strategia Finale
            </h3>
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setStrategy('resale')}
                className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                  strategy === 'resale'
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold text-slate-900">Rivendita</div>
                <div className="text-sm text-slate-600">Flip immobiliare</div>
              </button>
              <button
                type="button"
                onClick={() => setStrategy('rental')}
                className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                  strategy === 'rental'
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Home className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold text-slate-900">Affitto</div>
                <div className="text-sm text-slate-600">Rendita mensile</div>
              </button>
            </div>

            {strategy === 'resale' && (
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Prezzo Rivendita Previsto"
                  type="number"
                  prefix="€"
                  error={errors.resalePrice?.message}
                  {...register('resalePrice', { valueAsNumber: true })}
                />
                <Input
                  label="Tempo Stimato per Vendita"
                  type="number"
                  suffix="mesi"
                  error={errors.resaleMonths?.message}
                  {...register('resaleMonths', { valueAsNumber: true })}
                />
              </div>
            )}

            {strategy === 'rental' && (
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Canone Mensile Previsto"
                  type="number"
                  prefix="€"
                  error={errors.monthlyRent?.message}
                  {...register('monthlyRent', { valueAsNumber: true })}
                />
                <Input
                  label="Periodo Locazione"
                  type="number"
                  suffix="anni"
                  error={errors.rentalYears?.message}
                  {...register('rentalYears', { valueAsNumber: true })}
                />
              </div>
            )}
          </CardBody>
        </Card>

        {/* Riepilogo Investimento */}
        {totalInvestment > 0 && (
          <Card variant="elevated">
            <CardBody>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                📊 Riepilogo Investimento
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Acquisto immobile:</span>
                  <span className="font-semibold">{formatCurrency(purchasePrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Notaio e imposte:</span>
                  <span className="font-semibold">{formatCurrency(costs.total)}</span>
                </div>
                {hasAgency && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Agenzia (3%):</span>
                    <span className="font-semibold">{formatCurrency(agencyCost)}</span>
                  </div>
                )}
                {renovationCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Ristrutturazione:</span>
                    <span className="font-semibold">{formatCurrency(renovationCost)}</span>
                  </div>
                )}
                <div className="pt-3 border-t-2 border-slate-200 flex justify-between">
                  <span className="font-bold text-slate-900">TOTALE INVESTIMENTO:</span>
                  <span className="font-bold text-lg text-primary">
                    {formatCurrency(totalInvestment)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Budget disponibile:</span>
                  <span className="font-semibold">{formatCurrency(budget)}</span>
                </div>
                {!isBudgetSufficient && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 font-medium">
                      ⚠️ Budget insufficiente di {formatCurrency(totalInvestment - budget)}
                    </p>
                  </div>
                )}
                {isBudgetSufficient && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Budget sufficiente
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onBack}
            icon={<ChevronLeft className="w-5 h-5" />}
            iconPosition="left"
          >
            Indietro
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={!isBudgetSufficient || totalInvestment === 0}
            icon={<ChevronRight className="w-5 h-5" />}
          >
            Calcola Risultati
          </Button>
        </div>
      </form>
    </div>
  );
};
