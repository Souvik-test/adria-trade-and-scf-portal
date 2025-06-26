
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ManualBillsFormPane } from '@/hooks/useManualBillsForm';

interface FormActionsProps {
  currentPane: ManualBillsFormPane;
  isFirstPane: boolean;
  isLastPane: boolean;
  isSubmitting: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  currentPane,
  isFirstPane,
  isLastPane,
  isSubmitting,
  onNext,
  onPrevious,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="border-t border-border p-6">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
          >
            Cancel
          </Button>
          {!isFirstPane && (
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isSubmitting}
              className="border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
            >
              Previous
            </Button>
          )}
        </div>
        
        <div className="flex gap-3">
          {!isLastPane ? (
            <Button
              onClick={onNext}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormActions;
