
import React, { useMemo } from 'react';
import { Plus, Edit, X } from 'lucide-react';
import ActionCard from '../popi-modal/ActionCard';

type ActionType = 'issuance' | 'amendment' | 'cancellation' | null;

interface ImportLCActionSectionProps {
  selectedAction: ActionType;
  onActionSelect: (action: ActionType) => void;
}

const ImportLCActionSection: React.FC<ImportLCActionSectionProps> = ({
  selectedAction,
  onActionSelect
}) => {
  const businessCentre = localStorage.getItem('businessCentre') || 'Adria TSCF Client';
  const isClientPortal = businessCentre === 'Adria TSCF Client';

  const actionCards = useMemo(() => {
    if (isClientPortal) {
      return [
        {
          id: 'issuance',
          title: 'Request Issuance',
          description: 'Request new Import Letter of Credit issuance',
          icon: Plus,
          color: 'corporate-teal'
        },
        {
          id: 'amendment',
          title: 'Request Amendment',
          description: 'Modify existing Import Letter of Credit',
          icon: Edit,
          color: 'amber'
        },
        {
          id: 'cancellation',
          title: 'Request Cancellation',
          description: 'Cancel existing Import Letter of Credit',
          icon: X,
          color: 'red'
        }
      ];
    } else {
      // For Trade Middle Office / Trade Product Processor / Trade Back Office
      return [
        {
          id: 'issuance',
          title: 'Create LC',
          description: 'Create new Import Letter of Credit',
          icon: Plus,
          color: 'corporate-teal'
        },
        {
          id: 'amendment',
          title: 'Initiate Amendment',
          description: 'Initiate amendment for Import Letter of Credit',
          icon: Edit,
          color: 'amber'
        },
        {
          id: 'cancellation',
          title: 'Initiate LC Cancellation',
          description: 'Initiate cancellation for Import Letter of Credit',
          icon: X,
          color: 'red'
        }
      ];
    }
  }, [isClientPortal]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        Import Letter of Credit Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {actionCards.map((card) => (
          <ActionCard
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            icon={card.icon}
            color={card.color}
            isSelected={selectedAction === card.id}
            onClick={() => onActionSelect(card.id as ActionType)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImportLCActionSection;
