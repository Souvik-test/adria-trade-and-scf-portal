
import React from 'react';

interface RequestAssignmentProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  'LC Information',
  'Assignment Details',
  'Assignee Information',
  'Documents',
  'Review & Submit'
];

const RequestAssignmentProgressIndicator: React.FC<RequestAssignmentProgressIndicatorProps> = ({
  currentStep,
  totalSteps
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {stepLabels.map((label, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep
                  ? 'bg-corporate-blue text-white'
                  : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`mt-2 text-xs text-center ${
                index <= currentStep
                  ? 'text-corporate-blue font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div
          className="bg-corporate-blue h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default RequestAssignmentProgressIndicator;
