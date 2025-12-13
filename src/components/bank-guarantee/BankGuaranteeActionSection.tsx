
import React, { useMemo } from 'react';
import { Plus, Edit, X, FileCheck, AlertTriangle } from 'lucide-react';
import ActionCard from '../popi-modal/ActionCard';
import { useProductEventMappings } from '@/hooks/useProductEventMappings';

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
  const { getProductName, getEventName, isClientPortal } = useProductEventMappings();

  const productCode = type === 'outward' ? 'OBG' : 'IBG';
  const productName = getProductName(productCode);

  const actionCards = useMemo(() => {
    if (type === 'inward') {
      return [
        {
          id: 'consent',
          title: getEventName('IBG', 'CON'),
          description: `Record consent for amendment of ${productName}`,
          icon: FileCheck,
          color: 'corporate-teal'
        },
        {
          id: 'demand',
          title: getEventName('IBG', 'DEM'),
          description: `Record demand or claim against ${productName}`,
          icon: AlertTriangle,
          color: 'amber'
        }
      ];
    }
    
    return [
      {
        id: 'issuance',
        title: getEventName('OBG', 'ISS'),
        description: `${isClientPortal ? 'Request new' : 'Create new'} ${productName}`,
        icon: Plus,
        color: 'corporate-teal'
      },
      {
        id: 'amendment',
        title: getEventName('OBG', 'AMD'),
        description: `${isClientPortal ? 'Modify' : 'Initiate amendment for'} existing ${productName}`,
        icon: Edit,
        color: 'amber'
      },
      {
        id: 'cancellation',
        title: getEventName('OBG', 'CAN'),
        description: `${isClientPortal ? 'Cancel' : 'Initiate cancellation for'} existing ${productName}`,
        icon: X,
        color: 'red'
      }
    ];
  }, [type, productName, getEventName, isClientPortal]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        {productName} Actions
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
