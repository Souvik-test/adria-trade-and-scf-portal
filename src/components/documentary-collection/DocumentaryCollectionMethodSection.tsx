
import React from 'react';
import { FileText, Upload, MessageSquare } from 'lucide-react';
import MethodCard from '../popi-modal/MethodCard';

type ActionType = 'submit' | 'update' | 'finance' | null;

interface DocumentaryCollectionMethodSectionProps {
  selectedAction: ActionType;
  onMethodSelect: (method: string) => void;
}

const DocumentaryCollectionMethodSection: React.FC<DocumentaryCollectionMethodSectionProps> = ({
  selectedAction,
  onMethodSelect
}) => {
  const getMethodDescription = (method: string) => {
    if (!selectedAction) {
      return 'Select a process above to enable methods';
    }
    
    switch (method) {
      case 'manual':
        return 'Enter bill details manually through forms';
      case 'upload':
        return 'Upload bill documents and auto-extract data';
      case 'assistance':
        return 'Use AI-powered interactive assistant';
      default:
        return '';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
        Processing Methods
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MethodCard
          title="Manual"
          description={getMethodDescription('manual')}
          icon={FileText}
          isEnabled={!!selectedAction}
          onClick={() => onMethodSelect('manual')}
        />

        <MethodCard
          title="Upload"
          description={getMethodDescription('upload')}
          icon={Upload}
          isEnabled={!!selectedAction}
          isComingSoon={true}
          onClick={() => onMethodSelect('upload')}
        />

        <MethodCard
          title="Contextual Assistance"
          description={getMethodDescription('assistance')}
          icon={MessageSquare}
          isEnabled={!!selectedAction}
          isComingSoon={true}
          onClick={() => onMethodSelect('assistance')}
        />
      </div>
    </div>
  );
};

export default DocumentaryCollectionMethodSection;
