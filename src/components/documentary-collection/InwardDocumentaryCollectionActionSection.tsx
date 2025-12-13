import React, { useMemo } from 'react';
import { CreditCard, CheckCircle, DollarSign } from 'lucide-react';
import ActionCard from '../popi-modal/ActionCard';
import { useProductEventMappings } from '@/hooks/useProductEventMappings';

type ActionType = 'payment' | 'acceptance' | 'finance' | null;

interface InwardDocumentaryCollectionActionSectionProps {
  selectedAction: ActionType;
  onActionSelect: (action: ActionType) => void;
}

const InwardDocumentaryCollectionActionSection: React.FC<InwardDocumentaryCollectionActionSectionProps> = ({
  selectedAction,
  onActionSelect
}) => {
  const { getProductName, getEventName } = useProductEventMappings();

  const productName = getProductName('IDC');

  const actionCards = useMemo(() => [
    {
      id: 'payment',
      title: getEventName('IDC', 'PAY'),
      description: `Process payment for ${productName} bills`,
      icon: CreditCard,
      color: 'corporate-teal'
    },
    {
      id: 'acceptance',
      title: getEventName('IDC', 'ACC'),
      description: `Accept or refuse ${productName} bills`,
      icon: CheckCircle,
      color: 'amber'
    },
    {
      id: 'finance',
      title: getEventName('IDC', 'FIN'),
      description: `Request financing for ${productName}`,
      icon: DollarSign,
      color: 'green'
    }
  ], [getEventName, productName]);

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

export default InwardDocumentaryCollectionActionSection;