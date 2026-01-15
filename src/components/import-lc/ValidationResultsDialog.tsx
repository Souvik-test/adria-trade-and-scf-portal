import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ValidationResult } from '@/services/businessValidationService';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ValidationResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  validationResult: ValidationResult | null;
  onProceed: () => void;
  onCancel: () => void;
}

const ValidationResultsDialog: React.FC<ValidationResultsDialogProps> = ({
  open,
  onOpenChange,
  validationResult,
  onProceed,
  onCancel,
}) => {
  if (!validationResult) return null;

  const hasErrors = validationResult.errors.length > 0;
  const hasWarnings = validationResult.warnings.length > 0;
  const hasInfo = validationResult.information.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {hasErrors ? (
              <>
                <AlertCircle className="h-5 w-5 text-destructive" />
                Validation Errors
              </>
            ) : hasWarnings ? (
              <>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Validation Warnings
              </>
            ) : (
              <>
                <Info className="h-5 w-5 text-blue-500" />
                Validation Information
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {hasErrors
              ? 'Please fix the following errors before proceeding.'
              : 'Please review the following messages before proceeding.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px]">
          <div className="space-y-4 py-4">
            {/* Errors */}
            {validationResult.errors.map((error, index) => (
              <div
                key={`error-${index}`}
                className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">{error.message}</p>
                  {error.field_codes.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Related fields: {error.field_codes.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Warnings */}
            {validationResult.warnings.map((warning, index) => (
              <div
                key={`warning-${index}`}
                className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
              >
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                    {warning.message}
                  </p>
                  {warning.field_codes.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Related fields: {warning.field_codes.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Information */}
            {validationResult.information.map((info, index) => (
              <div
                key={`info-${index}`}
                className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
              >
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    {info.message}
                  </p>
                  {info.field_codes.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Related fields: {info.field_codes.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          {hasErrors ? (
            <Button onClick={onCancel} className="w-full sm:w-auto">
              OK
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={onCancel}>
                Go Back
              </Button>
              <Button onClick={onProceed}>
                {hasWarnings ? 'Proceed Anyway' : 'Continue'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ValidationResultsDialog;
