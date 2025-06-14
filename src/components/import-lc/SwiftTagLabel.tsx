
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SwiftTagLabelProps {
  tag: string;
  label: string;
  required?: boolean;
}

const SwiftTagLabel: React.FC<SwiftTagLabelProps> = ({ tag, label, required = false }) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Badge variant="outline" className="bg-corporate-teal-50 text-corporate-teal-700 border-corporate-teal-200">
        {tag}
      </Badge>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
    </div>
  );
};

export default SwiftTagLabel;
