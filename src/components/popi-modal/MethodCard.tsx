
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MethodCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isEnabled: boolean;
  isComingSoon?: boolean;
  onClick: () => void;
}

const MethodCard: React.FC<MethodCardProps> = ({
  title,
  description,
  icon: Icon,
  isEnabled,
  isComingSoon = false,
  onClick
}) => {
  const getCardClasses = () => {
    if (!isEnabled) {
      return 'border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed';
    }
    if (isComingSoon) {
      return 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer opacity-50';
    }
    return 'border-gray-200 dark:border-gray-600 hover:border-corporate-teal-300 dark:hover:border-corporate-teal-400 cursor-pointer';
  };

  const getIconClasses = () => {
    if (!isEnabled || isComingSoon) {
      return 'bg-gray-100 dark:bg-gray-800';
    }
    return 'bg-corporate-teal-100 dark:bg-corporate-teal-900';
  };

  const getIconColor = () => {
    if (!isEnabled || isComingSoon) {
      return 'text-gray-400';
    }
    return 'text-corporate-teal-600 dark:text-corporate-teal-400';
  };

  const getTextColor = () => {
    if (!isEnabled || isComingSoon) {
      return 'text-gray-500 dark:text-gray-500';
    }
    return 'text-gray-800 dark:text-white';
  };

  const getDescriptionColor = () => {
    if (!isEnabled || isComingSoon) {
      return 'text-gray-500 dark:text-gray-500';
    }
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <Card 
      className={`border transition-colors ${getCardClasses()}`}
      onClick={isEnabled && !isComingSoon ? onClick : undefined}
    >
      <CardHeader className="text-center">
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${getIconClasses()}`}>
          <Icon className={`w-8 h-8 ${getIconColor()}`} />
        </div>
        <CardTitle className={`text-lg font-semibold ${getTextColor()}`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className={`text-sm ${getDescriptionColor()}`}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default MethodCard;
