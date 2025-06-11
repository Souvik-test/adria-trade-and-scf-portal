
import React from 'react';
import { Plus, Edit, X } from 'lucide-react';
import ActionCard from '../popi-modal/ActionCard';

type ActionType = 'create' | 'amend' | 'cancel' | null;

interface InvoiceActionSectionProps {
  selectedAction: ActionType;
  onActionSelect: (action: ActionType) => void;
}

const InvoiceActionSection: React.FC<InvoiceActionSectionProps> = ({
  selectedAction,
  onActionSelect
}) => {
  const actionCards = [
    {
      id: 'create',
      title: 'Create Invoice',
      description: 'Create new commercial invoices',
      icon: Plus,
      color: 'corporate-teal'
    },
    {
      id: 'amend',
      title: 'Amend Invoice',
      description: 'Modify existing commercial invoices',
      icon: Edit,
      color: 'amber'
    },
    {
      id: 'cancel',
      title: 'Cancel Invoice',
      description: 'Cancel commercial invoices',
      icon: X,
      color: 'red'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        Invoice Management Actions
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

export default InvoiceActionSection;
