import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ImportLCModalContent from "./import-lc/ImportLCModalContent";
import ExportLCModalContent from "./export-lc/ExportLCModalContent";
import RequestLCTransferForm from "./export-lc/RequestLCTransferForm";
import RequestLCAssignmentForm from "./export-lc/RequestLCAssignmentForm";

interface LetterOfCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'import' | 'export';
}

const LetterOfCreditModal: React.FC<LetterOfCreditModalProps> = ({ isOpen, onClose, type }) => {
  const [showManualReviewFullScreen, setShowManualReviewFullScreen] = useState(false);
  const [showAmendmentResponseFullScreen, setShowAmendmentResponseFullScreen] = useState(false);
  const [showRequestTransferForm, setShowRequestTransferForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  const handleManualReviewFullScreen = () => {
    setShowManualReviewFullScreen(true);
  };

  const handleAmendmentResponseFullScreen = () => {
    setShowAmendmentResponseFullScreen(true);
  };

  const handleRequestTransferFullScreen = () => {
    setShowRequestTransferForm(true);
  };

  const handleRequestAssignmentFullScreen = () => {
    setShowAssignmentForm(true);
  };

  return (
    <>
      <Dialog open={isOpen && !showRequestTransferForm && !showAssignmentForm} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-6xl h-full max-h-[90vh] p-0 overflow-hidden bg-white dark:bg-gray-900">
          {type === "import" ? (
            <ImportLCModalContent onClose={onClose} />
          ) : null}
          {type === "export" && (
            <ExportLCModalContent
              onClose={onClose}
              onManualReviewFullScreen={handleManualReviewFullScreen}
              onAmendmentResponseFullScreen={handleAmendmentResponseFullScreen}
              onRequestTransferFullScreen={handleRequestTransferFullScreen}
              onRequestAssignmentFullScreen={handleRequestAssignmentFullScreen}
            />
          )}
        </DialogContent>
      </Dialog>

      {showRequestTransferForm && (
        <RequestLCTransferForm
          isOpen={showRequestTransferForm}
          onClose={() => setShowRequestTransferForm(false)}
        />
      )}
      
      {showAssignmentForm && (
        <RequestLCAssignmentForm
          isOpen={showAssignmentForm}
          onClose={() => setShowAssignmentForm(false)}
        />
      )}
    </>
  );
};

export default LetterOfCreditModal;
