import React from 'react';
import { AlertCircle, AlertTriangle, Info, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ValidationResult, ValidationResultItem, normalizeFieldCode } from '@/services/businessValidationService';
import { cn } from '@/lib/utils';

interface InlineValidationMessagesProps {
  validationResult: ValidationResult | null;
  position?: 'top' | 'bottom';
  onDismiss?: () => void;
  onProceed?: () => void;
  onFieldClick?: (fieldCode: string) => void;
  className?: string;
}

const InlineValidationMessages: React.FC<InlineValidationMessagesProps> = ({
  validationResult,
  position = 'top',
  onDismiss,
  onProceed,
  onFieldClick,
  className,
}) => {
  if (!validationResult) return null;

  const hasErrors = validationResult.errors.length > 0;
  const hasWarnings = validationResult.warnings.length > 0;
  const hasInfo = validationResult.information.length > 0;

  if (!hasErrors && !hasWarnings && !hasInfo) return null;

  const handleFieldClick = (fieldCodes: string[]) => {
    if (onFieldClick && fieldCodes.length > 0) {
      // Navigate to the first field in the list
      onFieldClick(fieldCodes[0]);
    }
  };

  const renderMessage = (
    item: ValidationResultItem,
    type: 'error' | 'warning' | 'info',
    index: number
  ) => {
    const config = {
      error: {
        icon: AlertCircle,
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/30',
        textColor: 'text-destructive',
        iconColor: 'text-destructive',
      },
      warning: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        textColor: 'text-yellow-700 dark:text-yellow-400',
        iconColor: 'text-yellow-500',
      },
      info: {
        icon: Info,
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        textColor: 'text-blue-700 dark:text-blue-400',
        iconColor: 'text-blue-500',
      },
    };

    const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

    return (
      <div
        key={`${type}-${index}`}
        className={cn(
          'flex items-start gap-3 px-3 py-2 rounded-md border',
          bgColor,
          borderColor
        )}
      >
        <Icon className={cn('h-4 w-4 flex-shrink-0 mt-0.5', iconColor)} />
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium', textColor)}>{item.message}</p>
          {item.field_codes.length > 0 && (
            <button
              onClick={() => handleFieldClick(item.field_codes)}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1 cursor-pointer group"
            >
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              <span className="underline underline-offset-2">
                Go to: {item.field_codes.join(', ')}
              </span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'w-full rounded-lg border bg-card p-4 shadow-sm',
        position === 'top' ? 'mb-4' : 'mt-4',
        hasErrors ? 'border-destructive/50' : hasWarnings ? 'border-yellow-500/50' : 'border-blue-500/50',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {hasErrors ? (
            <>
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span className="font-semibold text-destructive">Validation Errors</span>
            </>
          ) : hasWarnings ? (
            <>
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold text-yellow-700 dark:text-yellow-400">Validation Warnings</span>
            </>
          ) : (
            <>
              <Info className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-blue-700 dark:text-blue-400">Information</span>
            </>
          )}
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="space-y-2">
        {validationResult.errors.map((item, index) =>
          renderMessage(item, 'error', index)
        )}
        {validationResult.warnings.map((item, index) =>
          renderMessage(item, 'warning', index)
        )}
        {validationResult.information.map((item, index) =>
          renderMessage(item, 'info', index)
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border">
        {hasErrors ? (
          <p className="text-sm text-muted-foreground mr-auto">
            Please fix the errors before proceeding.
          </p>
        ) : (
          <>
            {onDismiss && (
              <Button variant="outline" size="sm" onClick={onDismiss}>
                Go Back
              </Button>
            )}
            {onProceed && (
              <Button size="sm" onClick={onProceed}>
                {hasWarnings ? 'Proceed Anyway' : 'Continue'}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InlineValidationMessages;
