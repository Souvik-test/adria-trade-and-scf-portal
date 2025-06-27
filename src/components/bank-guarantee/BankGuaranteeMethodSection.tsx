
import React from 'react';
import { FileText, Upload, MessageSquare } from 'lucide-react';
import MethodCard from '../popi-modal/MethodCard';

interface BankGuaranteeMethodSectionProps {
  selectedAction: string | null;
  onMethodSelect: (method: string) => void;
}

const BankGuaranteeMethodSection: React.FC<BankGuaranteeMethodSectionProps> = ({
  selectedAction,
  onMethodSelect
}) => {
  const methodCards = [
    {
      id: 'manual',
      title: 'Manual',
      description: 'Enter bank guarantee details manually through forms',
      icon: FileText,
      comingSoon: true
    },
    {
      id: 'upload',
      title: 'Upload',
      description: 'Upload guarantee documents and auto-extract data (coming soon)',
      icon: Upload,
      comingSoon: true
    },
    {
      id: 'assistance',
      title: 'Contextual Assistance',
      description: 'Use AI-powered assistant (coming soon)',
      icon: MessageSquare,
      comingSoon: true
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
        Processing Methods
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {methodCards.map((card) => (
          <MethodCard
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            icon={card.icon}
            isEnabled={!!selectedAction}
            comingSoon={card.comingSoon}
            onClick={() => onMethodSelect(card.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default BankGuaranteeMethodSection;
