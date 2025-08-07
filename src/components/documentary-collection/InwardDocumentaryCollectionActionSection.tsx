import React from 'react';
import { CreditCard, CheckCircle, DollarSign } from 'lucide-react';
import ActionCard from '../popi-modal/ActionCard';

type ActionType = 'payment' | 'acceptance' | 'finance' | null;

interface InwardDocumentaryCollectionActionSectionProps {
  selectedAction: ActionType;
  onActionSelect: (action: ActionType) => void;
}

const InwardDocumentaryCollectionActionSection: React.FC<InwardDocumentaryCollectionActionSectionProps> = ({
  selectedAction,
  onActionSelect
}) => {
  const actionCards = [
    {
      id: 'payment',
      title: 'Bill Payment',
      description: 'Process payment for inward documentary collection bills',
      icon: CreditCard,
      color: 'corporate-teal'
    },
    {
      id: 'acceptance',
      title: 'Bill Acceptance/Refusal',
      description: 'Accept or refuse inward documentary collection bills',
      icon: CheckCircle,
      color: 'amber'
    },
    {
      id: 'finance',
      title: 'Request Finance',
      description: 'Request financing for inward documentary collection',
      icon: DollarSign,
      color: 'green'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        Inward Documentary Collection Actions
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

export default InwardDocumentaryCollectionActionSection;