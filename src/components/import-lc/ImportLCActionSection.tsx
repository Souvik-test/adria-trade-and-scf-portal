
import React, { useMemo } from 'react';
import { Plus, Edit, X } from 'lucide-react';
import ActionCard from '../popi-modal/ActionCard';
import { useProductEventMappings } from '@/hooks/useProductEventMappings';

type ActionType = 'issuance' | 'amendment' | 'cancellation' | null;

interface ImportLCActionSectionProps {
  selectedAction: ActionType;
  onActionSelect: (action: ActionType) => void;
}

const ImportLCActionSection: React.FC<ImportLCActionSectionProps> = ({
  selectedAction,
  onActionSelect
}) => {
  const { getProductName, getEventName, isClientPortal } = useProductEventMappings();

  const productName = getProductName('ILC');

  const actionCards = useMemo(() => {
    return [
      {
        id: 'issuance',
        title: getEventName('ILC', 'ISS'),
        description: `${isClientPortal ? 'Request new' : 'Create new'} ${productName}`,
        icon: Plus,
        color: 'corporate-teal'
      },
      {
        id: 'amendment',
        title: getEventName('ILC', 'AMD'),
        description: `${isClientPortal ? 'Modify' : 'Initiate amendment for'} existing ${productName}`,
        icon: Edit,
        color: 'amber'
      },
      {
        id: 'cancellation',
        title: getEventName('ILC', 'CAN'),
        description: `${isClientPortal ? 'Cancel' : 'Initiate cancellation for'} existing ${productName}`,
        icon: X,
        color: 'red'
      }
    ];
  }, [getEventName, productName, isClientPortal]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        {productName} Actions
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
