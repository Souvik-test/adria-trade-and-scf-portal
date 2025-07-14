
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import DocumentaryCollectionModalHeader from './DocumentaryCollectionModalHeader';
import DocumentaryCollectionActionSection from './DocumentaryCollectionActionSection';
import DocumentaryCollectionMethodSection from './DocumentaryCollectionMethodSection';
import OutwardBillSubmissionForm from './OutwardBillSubmissionForm';
import OutwardBillUpdateForm from './OutwardBillUpdateForm';
import OutwardBillDiscountFinanceForm from './OutwardBillDiscountFinanceForm';

type ActionType = 'submit' | 'update' | 'finance' | null;

interface DocumentaryCollectionModalProps {
  open: boolean;
  onClose: () => void;
}

const DocumentaryCollectionModal: React.FC<DocumentaryCollectionModalProps> = ({
  open,
  onClose
}) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDiscountFinanceForm, setShowDiscountFinanceForm] = useState(false);

  const handleActionSelect = (action: ActionType) => {
    setSelectedAction(action);
    setShowSubmitForm(false);
    setShowUpdateForm(false);
    setShowDiscountFinanceForm(false);
  };

  const handleMethodSelect = (method: string) => {
    if (method === 'manual' && selectedAction === 'submit') {
      setShowSubmitForm(true);
    } else if (method === 'manual' && selectedAction === 'update') {
      setShowUpdateForm(true);
    } else if (method === 'manual' && selectedAction === 'finance') {
      setShowDiscountFinanceForm(true);
    }
    // Handle other method selections here
  };

  const handleBack = () => {
    if (showSubmitForm || showUpdateForm || showDiscountFinanceForm) {
      setShowSubmitForm(false);
      setShowUpdateForm(false);
      setShowDiscountFinanceForm(false);
    } else {
      setSelectedAction(null);
    }
  };

  const handleFormClose = () => {
    setShowSubmitForm(false);
    setShowUpdateForm(false);
    setShowDiscountFinanceForm(false);
    setSelectedAction(null);
    onClose();
  };

  if (showSubmitForm && selectedAction === 'submit') {
    return (
      <OutwardBillSubmissionForm
        onClose={handleFormClose}
        onBack={handleBack}
      />
    );
  }

  if (showUpdateForm && selectedAction === 'update') {
    return (
      <OutwardBillUpdateForm
        onClose={handleFormClose}
        onBack={handleBack}
      />
    );
  }

  if (showDiscountFinanceForm && selectedAction === 'finance') {
    return (
      <OutwardBillDiscountFinanceForm
        onClose={handleFormClose}
        onBack={handleBack}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <DocumentaryCollectionModalHeader onBack={handleBack} />
        
        <div className="space-y-8 p-6">
          <DocumentaryCollectionActionSection
            selectedAction={selectedAction}
            onActionSelect={handleActionSelect}
          />
          
          <DocumentaryCollectionMethodSection
            selectedAction={selectedAction}
            onMethodSelect={handleMethodSelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentaryCollectionModal;
