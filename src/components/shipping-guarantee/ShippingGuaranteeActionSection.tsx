import React, { useMemo } from 'react';
import { Plus, Edit, Link } from 'lucide-react';
import ActionCard from '../popi-modal/ActionCard';
import { ShippingGuaranteeActionType } from '@/types/shippingGuarantee';
import { useProductEventMappings } from '@/hooks/useProductEventMappings';

interface ShippingGuaranteeActionSectionProps {
  selectedAction: ShippingGuaranteeActionType;
  onActionSelect: (action: ShippingGuaranteeActionType) => void;
}

const ShippingGuaranteeActionSection: React.FC<ShippingGuaranteeActionSectionProps> = ({
  selectedAction,
  onActionSelect
}) => {
  const { getProductName, getEventName, isClientPortal } = useProductEventMappings();

  const productName = getProductName('SHG');

  const actionCards = useMemo(() => [
    {
      id: 'create',
      title: getEventName('SHG', 'ISS'),
      description: `${isClientPortal ? 'Create new' : 'Issue new'} ${productName} for vessel cargo`,
      icon: Plus,
      color: 'corporate-teal'
    },
    {
      id: 'update',
      title: getEventName('SHG', 'UPD'),
      description: `Modify existing ${productName} details`,
      icon: Edit,
      color: 'amber'
    },
    {
      id: 'link-delink',
      title: getEventName('SHG', 'LNK'),
      description: `Link or delink ${productName} with transactions`,
      icon: Link,
      color: 'blue'
    }
  ], [getEventName, productName, isClientPortal]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-6">
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
            onClick={() => onActionSelect(card.id as ShippingGuaranteeActionType)}
          />
        ))}
      </div>
    </div>
  );
};

export default ShippingGuaranteeActionSection;