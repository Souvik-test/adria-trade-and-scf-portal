import React from 'react';
import { FileText, Upload, MessageSquare } from 'lucide-react';
import MethodCard from '../popi-modal/MethodCard';
import { ShippingGuaranteeActionType } from '@/types/shippingGuarantee';

interface ShippingGuaranteeMethodSectionProps {
  selectedAction: ShippingGuaranteeActionType;
  onMethodSelect: (method: string) => void;
}

const ShippingGuaranteeMethodSection: React.FC<ShippingGuaranteeMethodSectionProps> = ({
  selectedAction,
  onMethodSelect
}) => {
  const getActionText = () => {
    switch (selectedAction) {
      case 'create':
        return 'creation';
      case 'update':
        return 'update';
      case 'link-delink':
        return 'linking/delinking';
      default:
        return 'processing';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Processing Methods
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MethodCard
          title="Manual"
          description={selectedAction 
            ? `Enter shipping guarantee details manually for ${getActionText()}`
            : 'Select an action above to enable methods'
          }
          icon={FileText}
          isEnabled={!!selectedAction}
          onClick={() => onMethodSelect('manual')}
        />

        <MethodCard
          title="Upload"
          description={selectedAction 
            ? `Upload documents and auto-extract data for ${getActionText()}`
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
            ? `Use AI-powered assistant for ${getActionText()}`
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

export default ShippingGuaranteeMethodSection;