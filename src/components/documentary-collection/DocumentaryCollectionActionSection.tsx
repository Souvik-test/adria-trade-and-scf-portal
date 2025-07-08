
import React from 'react';
import { FileText, Edit, DollarSign } from 'lucide-react';
import ActionCard from '../popi-modal/ActionCard';

type ActionType = 'submit' | 'update' | 'finance' | null;

interface DocumentaryCollectionActionSectionProps {
  selectedAction: ActionType;
  onActionSelect: (action: ActionType) => void;
}

const DocumentaryCollectionActionSection: React.FC<DocumentaryCollectionActionSectionProps> = ({
  selectedAction,
  onActionSelect
}) => {
  const actionCards = [
    {
      id: 'submit',
      title: 'Submit Bill',
      description: 'Submit new documentary collection bills',
      icon: FileText,
      color: 'corporate-teal'
    },
    {
      id: 'update',
      title: 'Update Bill',
      description: 'Update existing documentary collection bills',
      icon: Edit,
      color: 'amber'
    },
    {
      id: 'finance',
      title: 'Request Discount/Finance',
      description: 'Request discount or financing for collection bills',
      icon: DollarSign,
      color: 'green'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        Documentary Collection Processes
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

export default DocumentaryCollectionActionSection;
