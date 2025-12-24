import React from 'react';
import { Check } from 'lucide-react';

interface RemittanceProgressIndicatorProps<T extends string> {
  steps: T[];
  currentStep: T;
  stepLabels: Record<T, string>;
  onStepClick: (step: T) => void;
  getStepStatus: (step: T) => 'completed' | 'current' | 'pending';
}

function RemittanceProgressIndicator<T extends string>({
  steps,
  currentStep,
  stepLabels,
  onStepClick,
  getStepStatus,
}: RemittanceProgressIndicatorProps<T>) {
  return (
    <div className="flex items-center justify-between w-full px-4 py-4 bg-muted/30 rounded-lg mb-6">
      {steps.map((step, index) => {
        const status = getStepStatus(step);
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step}>
            <button
              onClick={() => onStepClick(step)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                status === 'current'
                  ? 'bg-primary text-primary-foreground'
                  : status === 'completed'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                  status === 'current'
                    ? 'bg-primary-foreground text-primary'
                    : status === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-muted-foreground/30 text-muted-foreground'
                }`}
              >
                {status === 'completed' ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  index + 1
                )}
              </span>
              <span className="text-sm font-medium hidden md:inline">
                {stepLabels[step]}
              </span>
            </button>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  status === 'completed' ? 'bg-green-500' : 'bg-muted-foreground/30'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default RemittanceProgressIndicator;
