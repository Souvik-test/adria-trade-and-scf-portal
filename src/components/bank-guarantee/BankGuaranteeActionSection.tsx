
import React from 'react';
import { Plus, Edit, X, FileCheck, AlertTriangle } from 'lucide-react';
import ActionCard from '../popi-modal/ActionCard';

type ActionType = 'issuance' | 'amendment' | 'cancellation' | 'consent' | 'demand' | null;

interface BankGuaranteeActionSectionProps {
  selectedAction: ActionType;
  onActionSelect: (action: ActionType) => void;
  type: 'outward' | 'inward';
}

const BankGuaranteeActionSection: React.FC<BankGuaranteeActionSectionProps> = ({
  selectedAction,
  onActionSelect,
  type
}) => {
  const getActionCards = () => {
    if (type === 'inward') {
      return [
        {
          id: 'consent',
          title: 'Record Amendment Consent',
          description: 'Record consent for amendment of Inward Bank Guarantee/SBLC',
          icon: FileCheck,
          color: 'corporate-teal'
        },
        {
          id: 'demand',
          title: 'Record Demand/Claim',
          description: 'Record demand or claim against Inward Bank Guarantee/SBLC',
          icon: AlertTriangle,
          color: 'amber'
        }
      ];
    }
    
    return [
      {
        id: 'issuance',
        title: 'Request Issuance',
        description: `Request new ${type === 'outward' ? 'Outward' : 'Inward'} Bank Guarantee/SBLC issuance`,
        icon: Plus,
        color: 'corporate-teal'
      },
      {
        id: 'amendment',
        title: 'Request Amendment',
        description: `Modify existing ${type === 'outward' ? 'Outward' : 'Inward'} Bank Guarantee/SBLC`,
        icon: Edit,
        color: 'amber'
      },
      {
        id: 'cancellation',
        title: 'Request Cancellation',
        description: `Cancel existing ${type === 'outward' ? 'Outward' : 'Inward'} Bank Guarantee/SBLC`,
        icon: X,
        color: 'red'
      }
    ];
  };

  const actionCards = getActionCards();

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        {type === 'outward' ? 'Outward' : 'Inward'} Bank Guarantee/SBLC Actions
      </h2>
      
      <div className={`grid grid-cols-1 ${type === 'inward' ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'} gap-6 mb-8`}>
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

export default BankGuaranteeActionSection;
