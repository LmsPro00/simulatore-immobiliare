import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, ChevronLeft, Wallet } from 'lucide-react';
import { Card, CardBody, Button, Input, Toggle } from '../ui';
import { budgetSchema, type BudgetFormData } from '../../utils/validators';
import { formatCurrency, formatInputNumber, cleanNumericInput } from '../../utils/formatters';
import type { OperationType } from '../../types/simulator.types';
import { getOperationTypeInfo } from '../../data/operationTypes';

interface Step2BudgetProps {
  operationType: OperationType;
  initialBudget?: number;
  initialHasFinancing?: boolean;
  initialFinancingAmount?: number;
  onSubmit: (budget: number, hasFinancing: boolean, financingAmount: number) => void;
  onBack: () => void;
}

export const Step2Budget = ({
  operationType,
  initialBudget = 0,
  initialHasFinancing = false,
  initialFinancingAmount = 0,
  onSubmit,
  onBack,
}: Step2BudgetProps) => {
  const [budgetInput, setBudgetInput] = useState(initialBudget > 0 ? initialBudget.toString() : '');
  const [financingInput, setFinancingInput] = useState(
    initialFinancingAmount > 0 ? initialFinancingAmount.toString() : ''
  );
  const [hasFinancing, setHasFinancing] = useState(initialHasFinancing);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      budget: initialBudget,
      hasFinancing: initialHasFinancing,
      financingAmount: initialFinancingAmount,
    },
  });

  const budget = watch('budget');
  const financingAmount = watch('financingAmount') || 0;
  const totalBudget = budget + financingAmount;

  const operationInfo = getOperationTypeInfo(operationType);

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = cleanNumericInput(value);
    setBudgetInput(cleaned);
    setValue('budget', cleaned ? parseInt(cleaned, 10) : 0);
  };

  const handleFinancingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = cleanNumericInput(value);
    setFinancingInput(cleaned);
    setValue('financingAmount', cleaned ? parseInt(cleaned, 10) : 0);
  };

  const onFormSubmit = (data: BudgetFormData) => {
    onSubmit(data.budget, data.hasFinancing, data.financingAmount || 0);
  };

  useEffect(() => {
    setValue('hasFinancing', hasFinancing);
    if (!hasFinancing) {
      setFinancingInput('');
      setValue('financingAmount', 0);
    }
  }, [hasFinancing, setValue]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Wallet className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Definisci il tuo Budget
        </h2>
        <p className="text-lg text-slate-600">
          Inserisci il capitale che hai a disposizione per investire
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Budget principale */}
        <Card>
          <CardBody>
            <Input
              label="Capitale Disponibile"
              type="text"
              value={budgetInput ? formatInputNumber(budgetInput) : ''}
              onChange={handleBudgetChange}
              prefix="€"
              error={errors.budget?.message}
              helperText={`Budget minimo consigliato per ${operationInfo?.label}: ${formatCurrency(
                operationInfo?.minBudget || 0
              )}`}
              placeholder="Es. 100.000"
            />
          </CardBody>
        </Card>

        {/* Finanziamento */}
        <Card>
          <CardBody className="space-y-4">
            <Toggle
              label="Intendi richiedere un finanziamento?"
              description="Aggiungi un importo di finanziamento bancario al tuo capitale"
              checked={hasFinancing}
              onChange={(e) => setHasFinancing(e.target.checked)}
            />

            {hasFinancing && (
              <div className="pt-4 border-t border-slate-200">
                <Input
                  label="Importo Finanziamento"
                  type="text"
                  value={financingInput ? formatInputNumber(financingInput) : ''}
                  onChange={handleFinancingChange}
                  prefix="€"
                  error={errors.financingAmount?.message}
                  placeholder="Es. 50.000"
                />
              </div>
            )}
          </CardBody>
        </Card>

        {/* Riepilogo */}
        {budget > 0 && (
          <Card variant="elevated">
            <CardBody>
              <h3 className="font-semibold text-slate-900 mb-4">
                Riepilogo Budget
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Capitale proprio:</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(budget)}
                  </span>
                </div>
                {hasFinancing && financingAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Finanziamento:</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(financingAmount)}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 flex justify-between">
                  <span className="font-semibold text-slate-900">
                    TOTALE DISPONIBILE:
                  </span>
                  <span className="font-bold text-primary text-lg">
                    {formatCurrency(totalBudget)}
                  </span>
                </div>
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
            disabled={budget < 10000}
            icon={<ChevronRight className="w-5 h-5" />}
          >
            Continua
          </Button>
        </div>
      </form>
    </div>
  );
};
