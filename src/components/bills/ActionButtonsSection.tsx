
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsSectionProps {
  onBack: () => void;
  onSubmit: () => void;
  submissionType: string;
  submissionDate: Date | null;
  lcReferenceNumber: string;
  declaration: boolean;
  documentsCount: number;
}

const ActionButtonsSection: React.FC<ActionButtonsSectionProps> = ({
  onBack,
  onSubmit,
  submissionType,
  submissionDate,
  lcReferenceNumber,
  declaration,
  documentsCount
}) => {
  return (
    <div className="flex justify-center gap-4 pt-8 border-t border-gray-200">
      <Button
        onClick={onSubmit}
        className="h-12 px-8 bg-orange-400 hover:bg-orange-500 text-white"
        disabled={!submissionType || !submissionDate || !lcReferenceNumber || !declaration}
      >
        Submit for Pre-check
      </Button>
      <Button
        variant="outline"
        className="h-12 px-8 border-orange-400 text-orange-400 hover:bg-orange-50"
      >
        Save as Draft
      </Button>
      <Button
        variant="outline"
        className="h-12 px-8 border-orange-400 text-orange-400 hover:bg-orange-50"
      >
        Save as Template
      </Button>
      <Button
        variant="outline"
        onClick={onBack}
        className="h-12 px-8 border-gray-300 text-gray-600 hover:bg-gray-50"
      >
        Discard
      </Button>
    </div>
  );
};

export default ActionButtonsSection;
