
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
  id,
  title,
  description,
  icon: Icon,
  color,
  isSelected,
  onClick
}) => {
  return (
    <Card 
      className={`border transition-colors cursor-pointer ${
        isSelected
          ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
          : `border-gray-200 dark:border-gray-600 hover:border-${color}-300 dark:hover:border-${color}-400`
      }`}
      onClick={onClick}
    >
      <CardHeader className="text-center">
        <div className={`mx-auto w-16 h-16 bg-${color}-100 dark:bg-${color}-900 rounded-full flex items-center justify-center mb-4`}>
          <Icon className={`w-8 h-8 text-${color}-600 dark:text-${color}-400`} />
        </div>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default ActionCard;
