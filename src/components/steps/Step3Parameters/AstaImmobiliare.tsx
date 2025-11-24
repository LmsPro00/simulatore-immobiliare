import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, ChevronLeft, Gavel, Home, TrendingUp, Wrench } from 'lucide-react';
import { Card, CardBody, Button, Input, Toggle } from '../../ui';
import { astaSchema, type AstaFormData } from '../../../utils/validators';
import { formatCurrency } from '../../../utils/formatters';
import { calculateNotaryCosts } from '../../../utils/calculations';
import { getTooltip } from '../../../data/tooltips';
import type { AstaParams } from '../../../types/simulator.types';

interface AstaImmobiliareProps {
  budget: number;
  initialData?: Partial<AstaParams>;
  onSubmit: (params: AstaParams) => void;
  onBack: () => void;
}

export const AstaImmobiliare = ({
  budget,
  initialData,
  onSubmit,
  onBack,
}: AstaImmobiliareProps) => {
  const [strategy, setStrategy] = useState<'immediate-resale' | 'renovation-resale' | 'rental'>(
    initialData?.strategy || 'immediate-resale'
  );
  const [isOccupied, setIsOccupied] = useState(initialData?.isOccupied || false);
  const [isFirstHome, setIsFirstHome] = useState(initialData?.isFirstHome || true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AstaFormData>({
    resolver: zodResolver(astaSchema),
    defaultValues: {
      basePrice: initialData?.basePrice || 0,
      appraisalValue: initialData?.appraisalValue || 0,
      overbidPercentage: initialData?.overbidPercentage || 15,
      isOccupied: initialData?.isOccupied || false,
      liberationCost: initialData?.liberationCost || 0,
      legalCosts: initialData?.legalCosts || 7500,
      isFirstHome: initialData?.isFirstHome || true,
      strategy: initialData?.strategy || 'immediate-resale',
      renovatedValue: initialData?.renovatedValue,
      monthlyRent: initialData?.monthlyRent,
      rentalYears: initialData?.rentalYears,
    },
  });

  const basePrice = watch('basePrice') || 0;
  const overbidPercentage = watch('overbidPercentage') || 0;
  const legalCosts = watch('legalCosts') || 0;
  const liberationCost = watch('liberationCost') || 0;

  // Calcoli
  const bidPrice = basePrice * (1 + overbidPercentage / 100);
  const auctionFee = bidPrice * 0.10;
  const costs = calculateNotaryCosts(bidPrice, isFirstHome);
  const liberationCostTotal = isOccupied ? liberationCost : 0;
  const totalInvestment = bidPrice + auctionFee + costs.total + legalCosts + liberationCostTotal;

  const isBudgetSufficient = totalInvestment <= budget;

  useEffect(() => {
    setValue('strategy', strategy);
    setValue('isOccupied', isOccupied);
    setValue('isFirstHome', isFirstHome);
  }, [strategy, isOccupied, isFirstHome, setValue]);

  const onFormSubmit = (data: AstaFormData) => {
    onSubmit(data as AstaParams);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700/10 rounded-full mb-4">
          <Gavel className="w-8 h-8 text-slate-700" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Asta Immobiliare
        </h2>
        <p className="text-lg text-slate-600">
          Acquisto tramite tribunale
        </p>
      </div>

      {/* Info Box Vantaggi */}
      <Card variant="outlined" className="mb-6 border-green-300 bg-green-50">
        <CardBody>
          <h3 className="font-bold text-green-900 mb-2">
            ✓ Vantaggi Asta Immobiliare
          </h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Sconto medio 20-40% rispetto al mercato</li>
            <li>• Procedura trasparente e regolamentata</li>
            <li>• Garanzia legale del tribunale</li>
          </ul>
        </CardBody>
      </Card>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Sezione Asta */}
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              ⚖️ Dati Asta
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Prezzo Base d'Asta"
                type="number"
                prefix="€"
                tooltip={getTooltip('prezzoBase')}
                helperText="Importo minimo fissato dal tribunale"
                error={errors.basePrice?.message}
                {...register('basePrice', { valueAsNumber: true })}
              />
              <Input
                label="Valore Perizia Tribunale"
                type="number"
                prefix="€"
                tooltip={getTooltip('perizia')}
                error={errors.appraisalValue?.message}
                {...register('appraisalValue', { valueAsNumber: true })}
              />
              <Input
                label="Rilancio Previsto"
                type="number"
                suffix="%"
                tooltip={getTooltip('rilancio')}
                helperText="Tipicamente 10-20%"
                error={errors.overbidPercentage?.message}
                {...register('overbidPercentage', { valueAsNumber: true })}
              />
            </div>

            {bidPrice > 0 && (
              <div className="mt-4 p-4 bg-slate-700/5 rounded-lg">
                <p className="text-sm text-slate-700">
                  💰 Offerta totale prevista:{' '}
                  <span className="font-bold text-slate-900">
                    {formatCurrency(bidPrice)}
                  </span>
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Sezione Stato Immobile */}
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              🏠 Stato Immobile
            </h3>
            <Toggle
              label="Immobile occupato?"
              description="Presenza di occupanti da sgomberare"
              tooltip={getTooltip('immobileOccupato')}
              checked={isOccupied}
              onChange={(e) => setIsOccupied(e.target.checked)}
            />

            {isOccupied && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <Input
                  label="Costi Liberazione Stimati"
                  type="number"
                  prefix="€"
                  tooltip={getTooltip('costiLiberazione')}
                  helperText="Tipicamente €10.000-30.000"
                  error={errors.liberationCost?.message}
                  {...register('liberationCost', { valueAsNumber: true })}
                />
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Tempistiche liberazione incerte - rischio maggiore
                  </p>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Sezione Costi */}
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              💼 Costi e Imposte
            </h3>
            <div className="space-y-4">
              <Input
                label="Spese Legali"
                type="number"
                prefix="€"
                helperText="Onorari avvocato e procedure"
                error={errors.legalCosts?.message}
                {...register('legalCosts', { valueAsNumber: true })}
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

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">Contributo spese asta (10%):</span>
                  <span className="font-semibold">{formatCurrency(auctionFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">Imposte registro:</span>
                  <span className="font-semibold">{formatCurrency(costs.registration)}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Sezione Strategia Post-Acquisto */}
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              🎯 Strategia Post-Acquisto
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setStrategy('immediate-resale')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  strategy === 'immediate-resale'
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold text-sm text-slate-900">Rivendita</div>
                <div className="text-xs text-slate-600">Immediata</div>
              </button>
              <button
                type="button"
                onClick={() => setStrategy('renovation-resale')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  strategy === 'renovation-resale'
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Wrench className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold text-sm text-slate-900">Ristruttura</div>
                <div className="text-xs text-slate-600">+ Rivendi</div>
              </button>
              <button
                type="button"
                onClick={() => setStrategy('rental')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  strategy === 'rental'
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Home className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold text-sm text-slate-900">Affitto</div>
                <div className="text-xs text-slate-600">Rendita</div>
              </button>
            </div>

            {strategy === 'renovation-resale' && (
              <Input
                label="Valore Post-Ristrutturazione"
                type="number"
                prefix="€"
                helperText="Valore stimato dopo i lavori"
                error={errors.renovatedValue?.message}
                {...register('renovatedValue', { valueAsNumber: true })}
              />
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

        {/* Riepilogo Completo */}
        {totalInvestment > 0 && (
          <Card variant="elevated">
            <CardBody>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                📊 Riepilogo Investimento
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Offerta asta:</span>
                  <span className="font-semibold">{formatCurrency(bidPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Contributo spese (10%):</span>
                  <span className="font-semibold">{formatCurrency(auctionFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Notaio e imposte:</span>
                  <span className="font-semibold">{formatCurrency(costs.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Spese legali:</span>
                  <span className="font-semibold">{formatCurrency(legalCosts)}</span>
                </div>
                {isOccupied && liberationCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Costi liberazione:</span>
                    <span className="font-semibold">{formatCurrency(liberationCostTotal)}</span>
                  </div>
                )}
                <div className="pt-3 border-t-2 border-slate-200 flex justify-between">
                  <span className="font-bold text-slate-900">TOTALE INVESTIMENTO:</span>
                  <span className="font-bold text-lg text-slate-700">
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
