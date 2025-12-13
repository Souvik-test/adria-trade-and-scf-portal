
import React, { useMemo } from 'react';
import { FileText, Edit, DollarSign } from 'lucide-react';
import ActionCard from '../popi-modal/ActionCard';
import { useProductEventMappings } from '@/hooks/useProductEventMappings';

type ActionType = 'submit' | 'update' | 'finance' | null;

interface DocumentaryCollectionActionSectionProps {
  selectedAction: ActionType;
  onActionSelect: (action: ActionType) => void;
}

const DocumentaryCollectionActionSection: React.FC<DocumentaryCollectionActionSectionProps> = ({
  selectedAction,
  onActionSelect
}) => {
  const { getProductName, getEventName, isClientPortal } = useProductEventMappings();

  const productName = getProductName('ODC');

  const actionCards = useMemo(() => [
    {
      id: 'submit',
      title: getEventName('ODC', 'SUB'),
      description: `Submit new ${productName} bills`,
      icon: FileText,
      color: 'corporate-teal'
    },
    {
      id: 'update',
      title: getEventName('ODC', 'UPD'),
      description: `Update existing ${productName} bills`,
      icon: Edit,
      color: 'amber'
    },
    {
      id: 'finance',
      title: getEventName('ODC', 'FIN'),
      description: `Request discount or financing for ${productName} bills`,
      icon: DollarSign,
      color: 'green'
    }
  ], [getEventName, productName]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        {productName} Processes
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
