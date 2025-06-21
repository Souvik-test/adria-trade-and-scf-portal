
import React from 'react';
import { Label } from '@/components/ui/label';

interface AmendmentFieldWrapperProps {
  fieldName: string;
  label: string;
  hasChanged: boolean;
  originalValue: any;
  children: React.ReactNode;
}

const AmendmentFieldWrapper: React.FC<AmendmentFieldWrapperProps> = ({
  fieldName,
  label,
  hasChanged,
  originalValue,
  children
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={fieldName} className={hasChanged ? 'text-amber-600 font-medium' : ''}>
        {label} {hasChanged && '(Modified)'}
      </Label>
      {children}
      {hasChanged && (
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded border-l-4 border-red-400">
          <span className="font-medium text-red-600 dark:text-red-400">Original: </span>
          <span className="line-through">{String(originalValue)}</span>
        </div>
      )}
    </div>
  );
};

export default AmendmentFieldWrapper;
