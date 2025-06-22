
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
    <div className="border-t border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          {!isFirstPane && (
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isSubmitting}
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
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
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
