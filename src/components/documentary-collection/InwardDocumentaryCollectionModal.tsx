import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import InwardDocumentaryCollectionModalHeader from './InwardDocumentaryCollectionModalHeader';
import InwardDocumentaryCollectionActionSection from './InwardDocumentaryCollectionActionSection';
import InwardDocumentaryCollectionMethodSection from './InwardDocumentaryCollectionMethodSection';
import InwardBillPaymentForm from './InwardBillPaymentForm';
import InwardBillAcceptRefuseForm from './InwardBillAcceptRefuseForm';

type ActionType = 'payment' | 'acceptance' | 'finance' | null;
type ViewType = 'selection' | 'form';

interface InwardDocumentaryCollectionModalProps {
  open: boolean;
  onClose: () => void;
}

const InwardDocumentaryCollectionModal: React.FC<InwardDocumentaryCollectionModalProps> = ({
  open,
  onClose
}) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [currentView, setCurrentView] = useState<ViewType>('selection');

  const handleActionSelect = (action: ActionType) => {
    setSelectedAction(action);
  };

  const handleMethodSelect = (method: string) => {
    if (method === 'manual' && (selectedAction === 'payment' || selectedAction === 'acceptance')) {
      setCurrentView('form');
    }
    // Handle other method selections here
  };

  const handleBack = () => {
    if (currentView === 'form') {
      setCurrentView('selection');
    } else {
      setSelectedAction(null);
    }
  };

  const handleCancel = () => {
    setCurrentView('selection');
    setSelectedAction(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[98vw] max-w-[98vw] h-[95vh] overflow-y-auto">
        {currentView === 'form' ? (
          selectedAction === 'payment' ? (
            <InwardBillPaymentForm 
              onBack={handleBack}
              onCancel={handleCancel}
            />
          ) : selectedAction === 'acceptance' ? (
            <InwardBillAcceptRefuseForm 
              onBack={handleBack}
              onCancel={handleCancel}
            />
          ) : null
        ) : (
          <>
            <InwardDocumentaryCollectionModalHeader onBack={handleBack} />
            
            <div className="space-y-8 p-6">
              <InwardDocumentaryCollectionActionSection
                selectedAction={selectedAction}
                onActionSelect={handleActionSelect}
              />
              
              <InwardDocumentaryCollectionMethodSection
                selectedAction={selectedAction}
                onMethodSelect={handleMethodSelect}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InwardDocumentaryCollectionModal;