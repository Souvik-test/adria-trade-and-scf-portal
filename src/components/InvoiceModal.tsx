
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import InvoiceForm from './InvoiceForm';
import InvoiceModalHeader from './invoice-modal/InvoiceModalHeader';
import InvoiceActionSection from './invoice-modal/InvoiceActionSection';
import InvoiceMethodSection from './invoice-modal/InvoiceMethodSection';

interface InvoiceModalProps {
  onClose: () => void;
  onBack: () => void;
}

type ActionType = 'create' | 'amend' | 'cancel' | null;

const InvoiceModal: React.FC<InvoiceModalProps> = ({ onClose, onBack }) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [showForm, setShowForm] = useState(false);

  const handleActionSelect = (action: ActionType) => {
    setSelectedAction(action);
  };

  const handleMethodSelect = (method: string) => {
    if (method === 'manual' && selectedAction === 'create') {
      setShowForm(true);
    } else {
      console.log(`Opening ${method} for ${selectedAction} action`);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormBack = () => {
    setShowForm(false);
  };

  if (showForm) {
    return (
      <InvoiceForm 
        onClose={handleFormClose}
        onBack={handleFormBack}
      />
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <InvoiceModalHeader onBack={onBack} />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-8">
            <InvoiceActionSection
              selectedAction={selectedAction}
              onActionSelect={handleActionSelect}
            />

            <InvoiceMethodSection
              selectedAction={selectedAction}
              onMethodSelect={handleMethodSelect}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
