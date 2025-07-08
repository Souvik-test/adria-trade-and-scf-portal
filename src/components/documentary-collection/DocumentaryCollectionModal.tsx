
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import DocumentaryCollectionModalHeader from './DocumentaryCollectionModalHeader';
import DocumentaryCollectionActionSection from './DocumentaryCollectionActionSection';
import DocumentaryCollectionMethodSection from './DocumentaryCollectionMethodSection';
import OutwardBillSubmissionForm from './OutwardBillSubmissionForm';

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
  const [showForm, setShowForm] = useState(false);

  const handleActionSelect = (action: ActionType) => {
    setSelectedAction(action);
    setShowForm(false);
  };

  const handleMethodSelect = (method: string) => {
    if (method === 'manual' && selectedAction === 'submit') {
      setShowForm(true);
    }
    // Handle other method selections here
  };

  const handleBack = () => {
    if (showForm) {
      setShowForm(false);
    } else {
      setSelectedAction(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedAction(null);
    onClose();
  };

  if (showForm && selectedAction === 'submit') {
    return (
      <OutwardBillSubmissionForm
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
