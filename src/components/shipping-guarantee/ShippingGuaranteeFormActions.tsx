import React from 'react';
import { Button } from '@/components/ui/button';

interface ShippingGuaranteeFormActionsProps {
  currentPane: number;
  onDiscard: () => void;
  onSaveAsDraft: () => void;
  onGoBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canProceed: boolean;
  isFirstPane: boolean;
  isLastPane: boolean;
}

const ShippingGuaranteeFormActions: React.FC<ShippingGuaranteeFormActionsProps> = ({
  currentPane,
  onDiscard,
  onSaveAsDraft,
  onGoBack,
  onNext,
  onSubmit,
  canProceed,
  isFirstPane,
  isLastPane
}) => {
  return (
    <div className="flex justify-between items-center pt-6 border-t border-border">
      {/* Left aligned buttons */}
      <div className="flex gap-3">
        {!isFirstPane && (
          <Button
            onClick={onGoBack}
            variant="outline"
            className="border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
          >
            Go Back
          </Button>
        )}
      </div>

      {/* Right aligned buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onDiscard}
          variant="outline"
          className="border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
        >
          Discard
        </Button>
        
        <Button
          onClick={onSaveAsDraft}
          variant="outline"
          className="border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/20"
        >
          Save as Draft
        </Button>
        
        {!isLastPane ? (
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={!canProceed}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Guarantee
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShippingGuaranteeFormActions;