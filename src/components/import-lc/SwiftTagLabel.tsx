
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SwiftTagInfo } from '@/types/importLC';

interface SwiftTagLabelProps {
  swiftInfo: SwiftTagInfo;
  className?: string;
}

const SwiftTagLabel: React.FC<SwiftTagLabelProps> = ({ swiftInfo, className = '' }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-1 ${className}`}>
            <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded">
              {swiftInfo.tag}
            </span>
            {swiftInfo.required && (
              <span className="text-red-500 text-xs">*</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            <p className="font-semibold">{swiftInfo.label}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {swiftInfo.description}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SwiftTagLabel;
