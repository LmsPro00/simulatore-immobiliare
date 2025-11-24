import { useState } from 'react';
import { ChevronRight, Info } from 'lucide-react';
import { Card, CardBody, Button } from '../ui';
import { operationTypes } from '../../data/operationTypes';
import { formatCurrency } from '../../utils/formatters';
import type { OperationType } from '../../types/simulator.types';

interface Step1TypeSelectionProps {
  selected?: OperationType | null;
  onSelect: (type: OperationType) => void;
  onNext: () => void;
}

export const Step1TypeSelection = ({
  selected,
  onSelect,
  onNext,
}: Step1TypeSelectionProps) => {
  const [expandedType, setExpandedType] = useState<OperationType | null>(null);

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

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Scegli il Tipo di Operazione
        </h2>
        <p className="text-lg text-slate-600">
          Seleziona la strategia di investimento immobiliare che ti interessa
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {operationTypes.map((type) => {
          const isSelected = selected === type.id;
          const isExpanded = expandedType === type.id;

          return (
            <Card
              key={type.id}
              variant={isSelected ? 'elevated' : 'outlined'}
              hover
              className={`
                transition-all duration-200
                ${isSelected ? 'ring-2 ring-primary' : ''}
              `}
              onClick={() => {
                onSelect(type.id);
                setExpandedType(isExpanded ? null : type.id);
              }}
            >
              <CardBody className="p-6">
                {/* Icon & Title */}
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{type.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {type.label}
                  </h3>
                  <p className="text-sm text-slate-600">{type.description}</p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getComplexityColor(
                      type.complexity
                    )}`}
                  >
                    {getComplexityLabel(type.complexity)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    {type.avgDiscount}
                  </span>
                </div>

                {/* Key Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Budget minimo:</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(type.minBudget)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tempistiche:</span>
                    <span className="font-semibold text-slate-900">
                      {type.timeframe}
                    </span>
                  </div>
                </div>

                {/* Expand button */}
                <button
                  className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedType(isExpanded ? null : type.id);
                  }}
                >
                  <Info className="w-4 h-4" />
                  {isExpanded ? 'Nascondi dettagli' : 'Mostra dettagli'}
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                    {/* Vantaggi */}
                    <div>
                      <h4 className="font-semibold text-sm text-green-700 mb-2 flex items-center gap-1">
                        ✓ Vantaggi
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {type.advantages.slice(0, 3).map((advantage, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">•</span>
                            <span>{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Rischi */}
                    <div>
                      <h4 className="font-semibold text-sm text-red-700 mb-2 flex items-center gap-1">
                        ⚠ Rischi
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {type.risks.slice(0, 3).map((risk, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-red-600 mt-0.5">•</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <Button
          variant="primary"
          size="lg"
          disabled={!selected}
          onClick={onNext}
          icon={<ChevronRight className="w-5 h-5" />}
        >
          Continua
        </Button>
      </div>
    </div>
  );
};
