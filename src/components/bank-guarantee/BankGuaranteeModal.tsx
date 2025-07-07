
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import BankGuaranteeActionSection from './BankGuaranteeActionSection';
import BankGuaranteeMethodSection from './BankGuaranteeMethodSection';
import OutwardBankGuaranteeIssuanceForm from './OutwardBankGuaranteeIssuanceForm';
import OutwardBGAmendmentForm from './OutwardBGAmendmentForm';
import OutwardBGCancellationForm from './OutwardBGCancellationForm';
import InwardBGAmendmentConsentForm from './InwardBGAmendmentConsentForm';
import InwardBGRecordDemandForm from './InwardBGRecordDemandForm';

interface BankGuaranteeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'outward' | 'inward';
}

type ActionType = 'issuance' | 'amendment' | 'cancellation' | 'consent' | 'demand' | null;

const BankGuaranteeModal: React.FC<BankGuaranteeModalProps> = ({
  isOpen,
  onClose,
  type
}) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleActionSelect = (action: ActionType) => {
    setSelectedAction(action);
    setSelectedMethod(null);
    setShowForm(false);
  };

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    if (method === 'manual') {
      setShowForm(true);
    }
  };

  const handleBack = () => {
    if (showForm) {
      setShowForm(false);
      setSelectedMethod(null);
    } else if (selectedMethod) {
      setSelectedMethod(null);
    } else if (selectedAction) {
      setSelectedAction(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedAction(null);
    setSelectedMethod(null);
    setShowForm(false);
    onClose();
  };

  // Render forms in full-screen mode outside the dialog
  if (showForm && selectedAction === 'issuance') {
    return (
      <OutwardBankGuaranteeIssuanceForm
        onClose={handleCloseModal}
        onBack={handleBack}
      />
    );
  }

  if (showForm && selectedAction === 'amendment') {
    return (
      <OutwardBGAmendmentForm
        onClose={handleCloseModal}
        onBack={handleBack}
      />
    );
  }

  if (showForm && selectedAction === 'cancellation') {
    return (
      <OutwardBGCancellationForm
        onClose={handleCloseModal}
        onBack={handleBack}
      />
    );
  }

  if (showForm && selectedAction === 'consent') {
    return (
      <InwardBGAmendmentConsentForm
        onClose={handleCloseModal}
        onBack={handleBack}
      />
    );
  }

  if (showForm && selectedAction === 'demand') {
    return (
      <InwardBGRecordDemandForm
        onClose={handleCloseModal}
        onBack={handleBack}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-8 p-6">
          <BankGuaranteeActionSection
            selectedAction={selectedAction}
            onActionSelect={handleActionSelect}
            type={type}
          />

          {selectedAction && (
            <BankGuaranteeMethodSection
              selectedAction={selectedAction}
              onMethodSelect={handleMethodSelect}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BankGuaranteeModal;
