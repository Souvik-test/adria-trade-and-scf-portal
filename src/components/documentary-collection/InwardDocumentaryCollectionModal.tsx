import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import InwardDocumentaryCollectionModalHeader from './InwardDocumentaryCollectionModalHeader';
import InwardDocumentaryCollectionActionSection from './InwardDocumentaryCollectionActionSection';
import InwardDocumentaryCollectionMethodSection from './InwardDocumentaryCollectionMethodSection';

type ActionType = 'payment' | 'acceptance' | 'finance' | null;

interface InwardDocumentaryCollectionModalProps {
  open: boolean;
  onClose: () => void;
}

const InwardDocumentaryCollectionModal: React.FC<InwardDocumentaryCollectionModalProps> = ({
  open,
  onClose
}) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);

  const handleActionSelect = (action: ActionType) => {
    setSelectedAction(action);
  };

  const handleMethodSelect = (method: string) => {
    if (method === 'manual') {
      // TODO: Implement form navigation based on selectedAction
      console.log(`Selected ${selectedAction} with ${method} method`);
    }
    // Handle other method selections here
  };

  const handleBack = () => {
    setSelectedAction(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
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
      </DialogContent>
    </Dialog>
  );
};

export default InwardDocumentaryCollectionModal;