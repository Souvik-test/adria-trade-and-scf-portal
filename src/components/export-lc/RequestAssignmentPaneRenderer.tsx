
import React from 'react';
import LCInformationPane from './steps/LCInformationPane';
import AssignmentDetailsPane from './steps/AssignmentDetailsPane';
import AssigneeInformationPane from './steps/AssigneeInformationPane';
import DocumentsPane from './steps/DocumentsPane';
import ReviewSubmitPane from './steps/ReviewSubmitPane';
import { AssignmentFormData, AssignmentFormStep } from '@/types/exportLCAssignment';

interface RequestAssignmentPaneRendererProps {
  form: AssignmentFormData;
  step: AssignmentFormStep;
  updateField: (updates: Partial<AssignmentFormData>) => void;
  updateAssignee: (updates: Partial<AssignmentFormData['assignee']>) => void;
}

const RequestAssignmentPaneRenderer: React.FC<RequestAssignmentPaneRendererProps> = ({
  form,
  step,
  updateField,
  updateAssignee
}) => {
  switch (step) {
    case 'lc-information':
      return (
        <LCInformationPane
          form={form}
          updateField={updateField}
        />
      );
    case 'assignment-details':
      return (
        <AssignmentDetailsPane
          form={form}
          updateField={updateField}
        />
      );
    case 'assignee-information':
      return (
        <AssigneeInformationPane
          form={form}
          updateAssignee={updateAssignee}
        />
      );
    case 'documents':
      return (
        <DocumentsPane
          form={form}
          updateField={updateField}
        />
      );
    case 'review-submit':
      return (
        <ReviewSubmitPane
          form={form}
        />
      );
    default:
      return null;
  }
};

export default RequestAssignmentPaneRenderer;
