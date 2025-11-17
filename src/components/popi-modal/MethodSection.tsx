
import React from 'react';
import { FileText, Upload, MessageSquare } from 'lucide-react';
import MethodCard from './MethodCard';

type ActionType = 'create' | 'amend' | 'cancel' | null;

interface MethodSectionProps {
  selectedAction: ActionType;
  onMethodSelect: (method: string) => void;
}

const MethodSection: React.FC<MethodSectionProps> = ({
  selectedAction,
  onMethodSelect
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
        Processing Methods
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MethodCard
          title="Manual"
          description={selectedAction 
            ? 'Enter details manually through forms'
            : 'Select an action above to enable methods'
          }
          icon={FileText}
          isEnabled={!!selectedAction}
          onClick={() => onMethodSelect('manual')}
        />

        <MethodCard
          title="Upload"
          description={selectedAction 
            ? 'Upload documents and auto-extract data'
            : 'Select an action above to enable methods'
          }
          icon={Upload}
          isEnabled={!!selectedAction}
          isComingSoon={true}
          onClick={() => onMethodSelect('upload')}
        />

        <MethodCard
          title="GPTrade"
          description={selectedAction 
            ? 'Use GPTrade AI-powered assistant'
            : 'Select an action above to enable methods'
          }
          icon={MessageSquare}
          isEnabled={!!selectedAction}
          isComingSoon={true}
          onClick={() => onMethodSelect('assistance')}
        />
      </div>
    </div>
  );
};

export default MethodSection;
