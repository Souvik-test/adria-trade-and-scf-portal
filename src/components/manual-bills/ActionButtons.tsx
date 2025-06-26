
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  currentPane: number;
  onGoBack: () => void;
  onDiscard: () => void;
  onSaveAsDraft: () => void;
  onNext: () => void;
  onSubmit: () => void;
  formType?: 'manual-bills' | 'resolve-discrepancies' | 'request-finance';
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  currentPane,
  onGoBack,
  onDiscard,
  onSaveAsDraft,
  onNext,
  onSubmit,
  formType = 'manual-bills'
}) => {
  // Determine the maximum pane based on form type
  const getMaxPane = () => {
    if (formType === 'request-finance') return 3;
    return 4; // manual-bills and resolve-discrepancies have 5 panes (0-4)
  };

  const maxPane = getMaxPane();

  // Professional Next/Submit button styling
  const getNextButtonClass = () => {
    return "bg-professional-orange hover:bg-professional-orange-dark text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 px-6 py-2";
  };

  const getSubmitButtonClass = () => {
    return "bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 px-6 py-2";
  };

  switch (currentPane) {
    case 0:
      return (
        <div className="flex justify-end items-center">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onDiscard}
              className="px-6 py-2 text-sm font-medium border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
            >
              Discard
            </Button>
            <Button 
              variant="outline" 
              onClick={onSaveAsDraft}
              className="px-6 py-2 text-sm font-medium border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/20"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={onNext}
              className={getNextButtonClass()}
            >
              Next
            </Button>
          </div>
        </div>
      );
    
    case 1:
    case 2:
      return (
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={onGoBack}
            className="px-6 py-2 text-sm font-medium border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
          >
            Go Back
          </Button>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onDiscard}
              className="px-6 py-2 text-sm font-medium border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
            >
              Discard
            </Button>
            <Button 
              variant="outline" 
              onClick={onSaveAsDraft}
              className="px-6 py-2 text-sm font-medium border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/20"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={onNext}
              className={getNextButtonClass()}
            >
              Next
            </Button>
          </div>
        </div>
      );
    
    case 3:
      // For request-finance, this is the final pane
      if (formType === 'request-finance') {
        return (
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={onGoBack}
              className="px-6 py-2 text-sm font-medium border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
            >
              Go Back
            </Button>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={onDiscard}
                className="px-6 py-2 text-sm font-medium border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
              >
                Discard
              </Button>
              <Button 
                variant="outline" 
                onClick={onSaveAsDraft}
                className="px-6 py-2 text-sm font-medium border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/20"
              >
                Save as Draft
              </Button>
              <Button 
                onClick={onSubmit}
                className={getSubmitButtonClass()}
              >
                Submit
              </Button>
            </div>
          </div>
        );
      }
      // For other forms, continue to next pane
      return (
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={onGoBack}
            className="px-6 py-2 text-sm font-medium border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
          >
            Go Back
          </Button>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onDiscard}
              className="px-6 py-2 text-sm font-medium border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
            >
              Discard
            </Button>
            <Button 
              variant="outline" 
              onClick={onSaveAsDraft}
              className="px-6 py-2 text-sm font-medium border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/20"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={onNext}
              className={getNextButtonClass()}
            >
              Next
            </Button>
          </div>
        </div>
      );
    
    case 4:
      return (
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={onGoBack}
            className="px-6 py-2 text-sm font-medium border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
          >
            Go Back
          </Button>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onDiscard}
              className="px-6 py-2 text-sm font-medium border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
            >
              Discard
            </Button>
            <Button 
              variant="outline" 
              onClick={onSaveAsDraft}
              className="px-6 py-2 text-sm font-medium border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/20"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={onSubmit}
              className={getSubmitButtonClass()}
            >
              Submit
            </Button>
          </div>
        </div>
      );
    
    default:
      return null;
  }
};

export default ActionButtons;
