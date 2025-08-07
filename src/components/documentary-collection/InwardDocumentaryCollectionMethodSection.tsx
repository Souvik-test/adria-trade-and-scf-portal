import React from 'react';
import { FileText, Upload, MessageSquare } from 'lucide-react';
import MethodCard from '../popi-modal/MethodCard';

type ActionType = 'payment' | 'acceptance' | 'finance' | null;

interface InwardDocumentaryCollectionMethodSectionProps {
  selectedAction: ActionType;
  onMethodSelect: (method: string) => void;
}

const InwardDocumentaryCollectionMethodSection: React.FC<InwardDocumentaryCollectionMethodSectionProps> = ({
  selectedAction,
  onMethodSelect
}) => {
  const getMethodDescription = (baseDescription: string) => {
    if (!selectedAction) {
      return 'Select an action above to enable methods';
    }
    return baseDescription;
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
        Processing Methods
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MethodCard
          title="Manual"
          description={getMethodDescription('Enter details manually through forms')}
          icon={FileText}
          isEnabled={!!selectedAction}
          onClick={() => onMethodSelect('manual')}
        />

        <MethodCard
          title="Upload"
          description={getMethodDescription('Upload documents and auto-extract data')}
          icon={Upload}
          isEnabled={!!selectedAction}
          isComingSoon={true}
          onClick={() => onMethodSelect('upload')}
        />

        <MethodCard
          title="Contextual Assistance"
          description={getMethodDescription('Use AI-powered interactive assistant')}
          icon={MessageSquare}
          isEnabled={!!selectedAction}
          isComingSoon={true}
          onClick={() => onMethodSelect('assistance')}
        />
      </div>
    </div>
  );
};

export default InwardDocumentaryCollectionMethodSection;