import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SendHorizontal, RotateCcw, ArrowRight } from 'lucide-react';
import { RemittanceActionType } from '@/types/remittance';

interface RemittanceActionSectionProps {
  onSelectAction: (action: RemittanceActionType) => void;
}

const RemittanceActionSection: React.FC<RemittanceActionSectionProps> = ({ onSelectAction }) => {
  const actions = [
    {
      id: 'process' as RemittanceActionType,
      title: 'Process Inward/Outward Remittance',
      description: 'Create and manage transfer transactions for inward and outward remittances',
      icon: SendHorizontal,
    },
    {
      id: 'return-reject' as RemittanceActionType,
      title: 'Return/Reject',
      description: 'Process returns or rejections for remittance transactions',
      icon: RotateCcw,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {actions.map((action) => (
        <Card
          key={action.id}
          className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 group"
          onClick={() => onSelectAction(action.id)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RemittanceActionSection;
