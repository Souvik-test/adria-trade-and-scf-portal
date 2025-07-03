
import React from 'react';

interface RequestFinanceProgressIndicatorProps {
  currentPane: number;
  paneHeaders: string[];
}

const RequestFinanceProgressIndicator: React.FC<RequestFinanceProgressIndicatorProps> = ({
  currentPane,
  paneHeaders
}) => {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-2">
        {paneHeaders.map((header, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index === currentPane 
                ? 'bg-primary text-primary-foreground' 
                : index < currentPane 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-400'
            }`}>
              {index + 1}
            </div>
            {index < paneHeaders.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 ${
                index < currentPane ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestFinanceProgressIndicator;
