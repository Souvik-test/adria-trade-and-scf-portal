import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, SendHorizontal, RotateCcw } from 'lucide-react';
import { RemittanceActionType } from '@/types/remittance';
import RemittanceActionSection from './RemittanceActionSection';
import RemittanceForm from './RemittanceForm';

interface RemittanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionComplete?: () => void; // Callback to navigate to dashboard
}

const RemittanceModal: React.FC<RemittanceModalProps> = ({ isOpen, onClose, onTransactionComplete }) => {
  const [selectedAction, setSelectedAction] = useState<RemittanceActionType>(null);

  const handleBack = () => {
    if (selectedAction) {
      setSelectedAction(null);
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedAction(null);
    onClose();
  };

  const handleTransactionComplete = () => {
    setSelectedAction(null);
    onClose();
    // Trigger dashboard navigation callback
    if (onTransactionComplete) {
      onTransactionComplete();
    }
  };

  const getTitle = () => {
    if (!selectedAction) return 'Remittance';
    if (selectedAction === 'process') return 'Process Inward/Outward Remittance';
    return 'Return/Reject Remittance';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={selectedAction === 'process' ? "w-screen h-screen max-w-none max-h-none p-0 m-0 rounded-none flex flex-col bg-background" : "max-w-4xl max-h-[90vh] overflow-y-auto bg-background"}>
        <DialogHeader className={`flex flex-row items-center gap-4 pb-4 border-b ${selectedAction === 'process' ? 'px-6 pt-4' : ''}`}>
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <SendHorizontal className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl font-semibold">{getTitle()}</DialogTitle>
          </div>
        </DialogHeader>

        <div className={selectedAction === 'process' ? "flex-1 overflow-y-auto px-6 py-4" : "py-4"}>
          {!selectedAction ? (
            <RemittanceActionSection onSelectAction={setSelectedAction} />
          ) : selectedAction === 'process' ? (
            <RemittanceForm onBack={handleBack} onTransactionComplete={handleTransactionComplete} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <RotateCcw className="h-12 w-12 mb-4" />
              <p className="text-lg">Return/Reject functionality coming soon</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemittanceModal;
