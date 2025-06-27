
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface OutwardBGFormActionsProps {
  currentPane: number;
  totalPanes: number;
  onNext: () => void;
  onPrevious: () => void;
  formData: any;
}

const OutwardBGFormActions: React.FC<OutwardBGFormActionsProps> = ({
  currentPane,
  totalPanes,
  onNext,
  onPrevious,
  formData
}) => {
  const isLastPane = currentPane === totalPanes - 1;
  const isFirstPane = currentPane === 0;

  const handleSubmit = () => {
    console.log('Submitting form:', formData);
    // Handle form submission logic here
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstPane}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Step {currentPane + 1} of {totalPanes}
        </div>

        {isLastPane ? (
          <Button
            onClick={handleSubmit}
            className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
            <span>Submit Request</span>
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default OutwardBGFormActions;
