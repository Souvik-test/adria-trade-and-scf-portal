
import React from 'react';
import RequestAssignmentProgressIndicator from './RequestAssignmentProgressIndicator';
import RequestAssignmentPaneRenderer from './RequestAssignmentPaneRenderer';
import RequestAssignmentFormActions from './RequestAssignmentFormActions';
import { AssignmentFormData, AssignmentFormStep } from '@/types/exportLCAssignment';

interface RequestAssignmentLayoutProps {
  form: AssignmentFormData;
  step: AssignmentFormStep;
  stepIdx: number;
  updateField: (updates: Partial<AssignmentFormData>) => void;
  updateAssignee: (updates: Partial<AssignmentFormData['assignee']>) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: () => Promise<void>;
  handleDiscard: () => void;
  handleSaveAsDraft: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  isLastStep: boolean;
}

const RequestAssignmentLayout: React.FC<RequestAssignmentLayoutProps> = (props) => {
  return (
    <div className="w-full max-w-7xl mx-auto bg-white dark:bg-gray-900 min-h-screen">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Request Assignment - Article 39 UCP 600
          </h1>
        </div>
      </div>

      <div className="px-6 py-6">
        <RequestAssignmentProgressIndicator
          currentStep={props.stepIdx}
          totalSteps={5}
        />
      </div>

      <div className="flex-1 px-6 pb-6">
        <RequestAssignmentPaneRenderer {...props} />
      </div>

      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <RequestAssignmentFormActions {...props} />
      </div>
    </div>
  );
};

export default RequestAssignmentLayout;
