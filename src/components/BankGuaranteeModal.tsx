
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BankGuaranteeActionSection from './bank-guarantee/BankGuaranteeActionSection';
import BankGuaranteeMethodSection from './bank-guarantee/BankGuaranteeMethodSection';
import OutwardBankGuaranteeIssuanceForm from './bank-guarantee/OutwardBankGuaranteeIssuanceForm';

interface BankGuaranteeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'outward' | 'inward';
}

type ActionType = 'issuance' | 'amendment' | 'cancellation' | 'consent' | 'demand' | null;

const BankGuaranteeModal: React.FC<BankGuaranteeModalProps> = ({ isOpen, onClose, type }) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showIssuanceForm, setShowIssuanceForm] = useState(false);

  const handleActionSelect = (action: ActionType) => {
    setSelectedAction(action);
    setSelectedMethod(null);
  };

  const handleMethodSelect = (method: string) => {
    if (!selectedAction) return;
    
    if (selectedAction === 'issuance' && method === 'manual' && type === 'outward') {
      setShowIssuanceForm(true);
      return;
    }
    
    setSelectedMethod(method);
    console.log('Selected action:', selectedAction, 'Method:', method);
  };

  const handleBack = () => {
    if (showIssuanceForm) {
      setShowIssuanceForm(false);
    } else if (selectedMethod) {
      setSelectedMethod(null);
    } else if (selectedAction) {
      setSelectedAction(null);
    }
  };

  const handleCloseIssuanceForm = () => {
    setShowIssuanceForm(false);
  };

  const renderContent = () => {
    if (showIssuanceForm) {
      return (
        <OutwardBankGuaranteeIssuanceForm 
          onClose={handleCloseIssuanceForm}
          onBack={handleBack}
        />
      );
    }

    if (selectedMethod) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            {selectedMethod === 'manual' ? 'Manual method for this process coming soon...' : 
             selectedMethod === 'upload' ? 'Upload functionality coming soon...' : 
             'Contextual assistance coming soon...'}
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <BankGuaranteeActionSection
          selectedAction={selectedAction}
          onActionSelect={handleActionSelect}
          type={type}
        />
        
        <BankGuaranteeMethodSection
          selectedAction={selectedAction}
          onMethodSelect={handleMethodSelect}
        />
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${showIssuanceForm ? 'max-w-[95vw] h-[95vh]' : 'max-w-6xl max-h-[90vh]'} w-full overflow-hidden p-0`}>
        <DialogHeader className="sr-only">
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
            {type === 'outward' ? 'Outward' : 'Inward'} Bank Guarantee/SBLC
          </DialogTitle>
        </DialogHeader>
        
        <div className="h-full w-full overflow-hidden">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BankGuaranteeModal;
