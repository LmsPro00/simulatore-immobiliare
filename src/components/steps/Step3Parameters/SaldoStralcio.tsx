import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, ChevronLeft, DollarSign, AlertTriangle } from 'lucide-react';
import { Card, CardBody, Button, Input } from '../../ui';
import { saldoStralcioSchema, type SaldoStralcioFormData } from '../../../utils/validators';
import { formatCurrency } from '../../../utils/formatters';
import { getTooltip } from '../../../data/tooltips';
import type { SaldoStralcioParams } from '../../../types/simulator.types';

interface SaldoStralcioProps {
  budget: number;
  initialData?: Partial<SaldoStralcioParams>;
  onSubmit: (params: SaldoStralcioParams) => void;
  onBack: () => void;
}

export const SaldoStralcio = ({
  budget,
  initialData,
  onSubmit,
  onBack,
}: SaldoStralcioProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SaldoStralcioFormData>({
    resolver: zodResolver(saldoStralcioSchema),
    defaultValues: {
      nominalValue: initialData?.nominalValue || 0,
      purchasePercentage: initialData?.purchasePercentage || 30,
      propertyValue: initialData?.propertyValue || 0,
      recoveryMonths: initialData?.recoveryMonths || 18,
      legalCosts: initialData?.legalCosts || 10000,
    },
  });

  const nominalValue = watch('nominalValue') || 0;
  const purchasePercentage = watch('purchasePercentage') || 0;
  const propertyValue = watch('propertyValue') || 0;
  const legalCosts = watch('legalCosts') || 0;

  // Calcoli
  const creditPurchase = nominalValue * (purchasePercentage / 100);
  const totalInvestment = creditPurchase + legalCosts;
  const potentialProfit = propertyValue - totalInvestment;
  const potentialROI = totalInvestment > 0 ? (potentialProfit / totalInvestment) * 100 : 0;
  const creditToValueRatio = propertyValue > 0 ? (nominalValue / propertyValue) * 100 : 0;

  const isBudgetSufficient = totalInvestment <= budget;

  const onFormSubmit = (data: SaldoStralcioFormData) => {
    onSubmit(data as SaldoStralcioParams);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
          <DollarSign className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Saldo e Stralcio
        </h2>
        <p className="text-lg text-slate-600">
          Acquisto di crediti deteriorati (NPL)
        </p>
      </div>

      {/* Alert Box Rischio */}
      <Card variant="outlined" className="mb-6 border-red-300 bg-red-50">
        <CardBody>
          <div className="flex gap-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-red-900 mb-2">
                ⚠️ ATTENZIONE - OPERAZIONE AD ALTO RISCHIO
              </h3>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Richiede expertise legale specializzata</li>
                <li>• Tempi di recupero credito incerti</li>
                <li>• Possibili contenziosi con debitori</li>
                <li>• Consigliato solo per investitori esperti</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Sezione Credito */}
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              💰 Dati Credito
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Valore Nominale del Credito"
                type="number"
                prefix="€"
                tooltip={getTooltip('valoreNominale')}
                helperText="Valore originale del credito"
                error={errors.nominalValue?.message}
                {...register('nominalValue', { valueAsNumber: true })}
              />
              <Input
                label="Percentuale di Acquisto"
                type="number"
                suffix="%"
                tooltip={getTooltip('saldoStralcio')}
                helperText="Tipicamente 20-40%"
                error={errors.purchasePercentage?.message}
                {...register('purchasePercentage', { valueAsNumber: true })}
              />
            </div>

            {creditPurchase > 0 && (
              <div className="mt-4 p-4 bg-accent/5 rounded-lg">
                <p className="text-sm text-slate-700">
                  💵 Costo acquisto credito:{' '}
                  <span className="font-bold text-accent">
                    {formatCurrency(creditPurchase)}
                  </span>
                  {' '}(sconto: {(100 - purchasePercentage).toFixed(0)}%)
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Sezione Immobile a Garanzia */}
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              🏠 Immobile a Garanzia
            </h3>
            <Input
              label="Valore di Mercato Immobile"
              type="number"
              prefix="€"
              helperText="Valore stimato dell'immobile a garanzia del credito"
              error={errors.propertyValue?.message}
              {...register('propertyValue', { valueAsNumber: true })}
            />

            {creditToValueRatio > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-700">
                    Rapporto Credito/Valore Immobile:
                  </span>
                  <span className={`font-bold ${
                    creditToValueRatio > 80 ? 'text-red-600' : 
                    creditToValueRatio > 60 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {creditToValueRatio.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  {creditToValueRatio > 80 && '⚠️ Rapporto alto - rischio maggiore'}
                  {creditToValueRatio <= 80 && creditToValueRatio > 60 && '⚡ Rapporto medio'}
                  {creditToValueRatio <= 60 && '✓ Rapporto buono - margine di sicurezza'}
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Sezione Recupero */}
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              ⏱️ Tempi e Costi Recupero
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Tempi Previsti per Recupero"
                type="number"
                suffix="mesi"
                helperText="Tipicamente 12-24 mesi"
                error={errors.recoveryMonths?.message}
                {...register('recoveryMonths', { valueAsNumber: true })}
              />
              <Input
                label="Costi Legali Stimati"
                type="number"
                prefix="€"
                helperText="Include avvocati e procedure"
                error={errors.legalCosts?.message}
                {...register('legalCosts', { valueAsNumber: true })}
              />
            </div>
          </CardBody>
        </Card>

        {/* Riepilogo */}
        {totalInvestment > 0 && (
          <Card variant="elevated">
            <CardBody>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                📊 Riepilogo Operazione
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Acquisto credito:</span>
                  <span className="font-semibold">{formatCurrency(creditPurchase)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Costi legali:</span>
                  <span className="font-semibold">{formatCurrency(legalCosts)}</span>
                </div>
                <div className="pt-3 border-t-2 border-slate-200 flex justify-between">
                  <span className="font-bold text-slate-900">INVESTIMENTO TOTALE:</span>
                  <span className="font-bold text-lg text-accent">
                    {formatCurrency(totalInvestment)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Valore immobile recuperabile:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(propertyValue)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">GUADAGNO POTENZIALE:</span>
                  <span className={`font-bold ${potentialProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(potentialProfit)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">ROI potenziale:</span>
                  <span className={`font-bold text-lg ${potentialROI > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {potentialROI.toFixed(1)}%
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between text-sm">
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
