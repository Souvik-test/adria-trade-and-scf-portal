import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImportLCActionSection from './import-lc/ImportLCActionSection';
import ImportLCMethodSection from './import-lc/ImportLCMethodSection';
import ImportLCForm from './import-lc/ImportLCForm';
import ExportLCModalContent from "./export-lc/ExportLCModalContent";
import ReviewPreAdvicedLCForm from "./export-lc/ReviewPreAdvicedLCForm";
import AmendmentResponseForm from "./export-lc/AmendmentResponseForm";
import RequestLCTransferForm from "./export-lc/RequestLCTransferForm";

interface LetterOfCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'import' | 'export';
}

type ActionType = 'issuance' | 'amendment' | 'cancellation' | null;

const LetterOfCreditModal: React.FC<LetterOfCreditModalProps> = ({ isOpen, onClose, type }) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [reviewManualFullScreen, setReviewManualFullScreen] = useState(false);
  const [amendmentResponseFullScreen, setAmendmentResponseFullScreen] = useState(false);
  const [transferFullScreen, setTransferFullScreen] = useState(false);

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

  const handleExportManualFullScreen = () => {
    setReviewManualFullScreen(true);
  };
  const handleExportManualBack = () => {
    setReviewManualFullScreen(false);
  };

  const handleAmendmentResponseFullScreen = () => {
    setAmendmentResponseFullScreen(true);
  };
  const handleAmendmentResponseBack = () => {
    setAmendmentResponseFullScreen(false);
  };

  const handleTransferFullScreen = () => {
    setTransferFullScreen(true);
  };
  const handleTransferFullScreenClose = () => {
    setTransferFullScreen(false);
    // Do not call onClose() unless user wants to fully exit.
  };

  if (type === "export") {
    if (reviewManualFullScreen) {
      return (
        <div className="fixed inset-0 z-50">
          <ReviewPreAdvicedLCForm
            onBack={handleExportManualBack}
            onClose={() => {
              handleExportManualBack();
              onClose();
            }}
            onSaveDraft={() => { /* simulate save draft */ }}
          />
        </div>
      );
    }

    if (amendmentResponseFullScreen) {
      return (
        <div className="fixed inset-0 z-50">
          <AmendmentResponseForm
            onClose={handleAmendmentResponseBack}
          />
        </div>
      );
    }

    if (transferFullScreen) {
      return (
        <div className="fixed inset-0 z-50 bg-background">
          <RequestLCTransferForm
            onClose={handleTransferFullScreenClose}
          />
        </div>
      );
    }

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] w-full overflow-hidden p-0">
          <DialogHeader className="sr-only">
            <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
              Export Letter of Credit
            </DialogTitle>
          </DialogHeader>
          <div className="h-full w-full overflow-hidden">
            <ExportLCModalContent 
              onClose={onClose} 
              onManualReviewFullScreen={handleExportManualFullScreen}
              onAmendmentResponseFullScreen={handleAmendmentResponseFullScreen}
              onRequestTransferFullScreen={() => {
                setTransferFullScreen(true);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ImportLCActionSection
          selectedAction={selectedAction}
          onActionSelect={handleActionSelect}
        />
        
        <ImportLCMethodSection
          selectedAction={selectedAction}
          onMethodSelect={handleMethodSelect}
        />
      </div>
    );
  };

  if (selectedMethod === 'manual' && selectedAction === 'issuance') {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 z-50">
            {renderContent()}
          </div>
        )}
      </>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] w-full overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
            {type === 'import' ? 'Import' : 'Export'} Letter of Credit
          </DialogTitle>
        </DialogHeader>
        
        <div className="h-full w-full overflow-hidden">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LetterOfCreditModal;
