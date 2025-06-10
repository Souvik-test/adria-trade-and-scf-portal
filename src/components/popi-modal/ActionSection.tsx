
import React from 'react';
import { Plus, Edit, X } from 'lucide-react';
import ActionCard from './ActionCard';

type ActionType = 'create' | 'amend' | 'cancel' | null;

interface ActionSectionProps {
  selectedAction: ActionType;
  onActionSelect: (action: ActionType) => void;
}

const ActionSection: React.FC<ActionSectionProps> = ({
  selectedAction,
  onActionSelect
}) => {
  const actionCards = [
    {
      id: 'create',
      title: 'Create Purchase Order/Pro-forma Invoice',
      description: 'Create new purchase orders and pro-forma invoices',
      icon: Plus,
      color: 'corporate-teal'
    },
    {
      id: 'amend',
      title: 'Amend Purchase Order/Pro-forma Invoice',
      description: 'Modify existing purchase orders and pro-forma invoices',
      icon: Edit,
      color: 'amber'
    },
    {
      id: 'cancel',
      title: 'Cancel Purchase Order/Pro-forma Invoice',
      description: 'Cancel purchase orders and pro-forma invoices',
      icon: X,
      color: 'red'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        PO/PI Management Actions
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

export default ActionSection;
