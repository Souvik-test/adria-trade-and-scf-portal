
import React from 'react';
import RequestAssignmentLayout from './RequestAssignmentLayout';
import { useRequestAssignmentForm } from '@/hooks/useRequestAssignmentForm';

interface RequestAssignmentFormProps {
  onClose: () => void;
}

const RequestAssignmentForm: React.FC<RequestAssignmentFormProps> = ({ onClose }) => {
  const formHook = useRequestAssignmentForm(onClose);

  return <RequestAssignmentLayout {...formHook} />;
};

export default RequestAssignmentForm;
