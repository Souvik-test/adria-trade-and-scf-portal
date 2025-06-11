
import React from 'react';
import { FileText, Upload, MessageSquare } from 'lucide-react';
import MethodCard from '../popi-modal/MethodCard';

type ActionType = 'create' | 'amend' | 'cancel' | null;

interface InvoiceMethodSectionProps {
  selectedAction: ActionType;
  onMethodSelect: (method: string) => void;
}

const InvoiceMethodSection: React.FC<InvoiceMethodSectionProps> = ({
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
            ? 'Enter invoice details manually through forms'
            : 'Select an action above to enable methods'
          }
          icon={FileText}
          isEnabled={!!selectedAction}
          onClick={() => onMethodSelect('manual')}
        />

        <MethodCard
          title="Upload"
          description={selectedAction 
            ? 'Upload invoice documents and auto-extract data'
            : 'Select an action above to enable methods'
          }
          icon={Upload}
          isEnabled={!!selectedAction}
          isComingSoon={true}
          onClick={() => onMethodSelect('upload')}
        />

        <MethodCard
          title="Contextual Assistance"
          description={selectedAction 
            ? 'Use AI-powered interactive assistant'
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

export default InvoiceMethodSection;
