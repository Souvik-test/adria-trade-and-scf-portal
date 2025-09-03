import React from 'react';
import { Plus, Edit, Link } from 'lucide-react';
import ActionCard from '../popi-modal/ActionCard';
import { ShippingGuaranteeActionType } from '@/types/shippingGuarantee';

interface ShippingGuaranteeActionSectionProps {
  selectedAction: ShippingGuaranteeActionType;
  onActionSelect: (action: ShippingGuaranteeActionType) => void;
}

const ShippingGuaranteeActionSection: React.FC<ShippingGuaranteeActionSectionProps> = ({
  selectedAction,
  onActionSelect
}) => {
  const actionCards = [
    {
      id: 'create',
      title: 'Create Shipping Guarantee',
      description: 'Create new shipping guarantee for vessel cargo',
      icon: Plus,
      color: 'corporate-teal'
    },
    {
      id: 'update',
      title: 'Update Shipping Guarantee',
      description: 'Modify existing shipping guarantee details',
      icon: Edit,
      color: 'amber'
    },
    {
      id: 'link-delink',
      title: 'Link/Delink Shipping Guarantee',
      description: 'Link or delink shipping guarantee with transactions',
      icon: Link,
      color: 'blue'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Shipping Guarantee Actions
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