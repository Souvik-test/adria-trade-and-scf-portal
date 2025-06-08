
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  currentPane: number;
  onGoBack: () => void;
  onDiscard: () => void;
  onSaveAsDraft: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  currentPane,
  onGoBack,
  onDiscard,
  onSaveAsDraft,
  onNext,
  onSubmit
}) => {
  switch (currentPane) {
    case 0:
      return (
        <div className="flex justify-end items-center">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onDiscard}
              className="px-6 py-2 text-sm font-medium border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500"
            >
              Discard
            </Button>
            <Button 
              variant="outline" 
              onClick={onSaveAsDraft}
              className="px-6 py-2 text-sm font-medium border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={onNext}
              className="px-6 py-2 text-sm font-medium bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white"
            >
              Next
            </Button>
          </div>
        </div>
      );
    
    case 1:
    case 2:
    case 3:
      return (
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={onGoBack}
            className="px-6 py-2 text-sm font-medium border-gray-400 text-gray-600 hover:bg-gray-50"
          >
            Go Back
          </Button>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onDiscard}
              className="px-6 py-2 text-sm font-medium border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500"
            >
              Discard
            </Button>
            <Button 
              variant="outline" 
              onClick={onSaveAsDraft}
              className="px-6 py-2 text-sm font-medium border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={onNext}
              className="px-6 py-2 text-sm font-medium bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white"
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
            className="px-6 py-2 text-sm font-medium border-gray-400 text-gray-600 hover:bg-gray-50"
          >
            Go Back
          </Button>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onDiscard}
              className="px-6 py-2 text-sm font-medium border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500"
            >
              Discard
            </Button>
            <Button 
              variant="outline" 
              onClick={onSaveAsDraft}
              className="px-6 py-2 text-sm font-medium border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={onSubmit}
              className="px-6 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white"
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
