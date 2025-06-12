
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImportLCActionSection from './import-lc/ImportLCActionSection';
import ImportLCMethodSection from './import-lc/ImportLCMethodSection';
import ImportLCForm from './import-lc/ImportLCForm';

interface LetterOfCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'import' | 'export';
}

type ActionType = 'issuance' | 'amendment' | 'cancellation' | null;

const LetterOfCreditModal: React.FC<LetterOfCreditModalProps> = ({ isOpen, onClose, type }) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleActionSelect = (action: ActionType) => {
    setSelectedAction(action);
    setSelectedMethod(null); // Reset method when action changes
  };

  const handleMethodSelect = (method: string) => {
    if (!selectedAction) return;
    setSelectedMethod(method);
    console.log('Selected action:', selectedAction, 'Method:', method);
  };

  const handleBack = () => {
    if (selectedMethod) {
      setSelectedMethod(null);
    } else if (selectedAction) {
      setSelectedAction(null);
    }
  };

  const renderContent = () => {
    if (selectedMethod === 'manual' && selectedAction === 'issuance') {
      return (
        <ImportLCForm
          onBack={handleBack}
          onClose={onClose}
        />
      );
    }

    if (selectedMethod) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            {selectedMethod === 'upload' ? 'Upload functionality coming soon...' : 
             selectedMethod === 'assistance' ? 'Contextual assistance coming soon...' : 
             'Feature not implemented yet'}
          </p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 text-corporate-blue hover:underline"
          >
            ← Go Back
          </button>
        </div>
      );
    }

    return (
      <>
        <ImportLCActionSection
          selectedAction={selectedAction}
          onActionSelect={handleActionSelect}
        />
        
        <ImportLCMethodSection
          selectedAction={selectedAction}
          onMethodSelect={handleMethodSelect}
        />
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
            {type === 'import' ? 'Import' : 'Export'} Letter of Credit
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-2">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LetterOfCreditModal;
