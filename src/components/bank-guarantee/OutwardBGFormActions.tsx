
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send, Save, Trash2 } from 'lucide-react';
import { OutwardBGFormData } from '@/types/outwardBankGuarantee';

interface OutwardBGFormActionsProps {
  currentPane: number;
  totalPanes: number;
  onNext: () => void;
  onPrevious: () => void;
  onSaveAsDraft: () => void;
  onDiscard: () => void;
  onSubmit: () => void;
  formData: OutwardBGFormData;
}

const OutwardBGFormActions: React.FC<OutwardBGFormActionsProps> = ({
  currentPane,
  totalPanes,
  onNext,
  onPrevious,
  onSaveAsDraft,
  onDiscard,
  onSubmit,
  formData
}) => {
  const isLastPane = currentPane === totalPanes - 1;
  const isFirstPane = currentPane === 0;

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onSaveAsDraft}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save as Draft</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={onDiscard}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
          >
            <Trash2 className="w-4 h-4" />
            <span>Discard</span>
          </Button>
        </div>

        <div className="flex items-center space-x-4">
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
              onClick={onSubmit}
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
    </div>
  );
};

export default OutwardBGFormActions;
