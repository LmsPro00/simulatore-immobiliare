interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export const ProgressBar = ({
  currentStep,
  totalSteps,
  labels = [],
}: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between mt-4">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div
              key={stepNumber}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                  ${isCompleted
                    ? 'bg-primary text-white'
                    : isActive
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-slate-200 text-slate-500'
                  }
                `}
              >
                {stepNumber}
              </div>
              
              {labels[index] && (
                <span
                  className={`
                    text-xs font-medium text-center
                    ${isActive ? 'text-primary' : 'text-slate-500'}
                  `}
                >
                  {labels[index]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
