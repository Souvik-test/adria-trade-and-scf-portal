
import React, { useState } from "react";
import ExportLCProcessSection from "./ExportLCProcessSection";
import ExportLCMethodSection from "./ExportLCMethodSection";
import RequestLCTransferForm from "./RequestLCTransferForm";
import RequestAssignmentForm from "./RequestAssignmentForm";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExportLCModalContentProps {
  onClose: () => void;
  onManualReviewFullScreen?: () => void;
  onAmendmentResponseFullScreen?: () => void;
  onRequestTransferFullScreen?: () => void;
  onRequestAssignmentFullScreen?: () => void; // NEW for assignment request
}

const ExportLCModalContent: React.FC<ExportLCModalContentProps> = ({
  onClose,
  onManualReviewFullScreen,
  onAmendmentResponseFullScreen,
  onRequestTransferFullScreen,
  onRequestAssignmentFullScreen,
}) => {
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleProcessSelect = (process: string) => {
    setSelectedProcess(process);
    setSelectedMethod(null);
  };

  const handleMethodSelect = (method: string) => {
    if (!selectedProcess) return;
    if (selectedProcess === "review" && method === "manual" && onManualReviewFullScreen) {
      onManualReviewFullScreen();
      return;
    }
    if (selectedProcess === "amendConsent" && method === "manual" && onAmendmentResponseFullScreen) {
      onAmendmentResponseFullScreen();
      return;
    }
    if (selectedProcess === "transfer" && method === "manual" && onRequestTransferFullScreen) {
      onRequestTransferFullScreen();
      return;
    }
    if (selectedProcess === "assignment" && method === "manual" && onRequestAssignmentFullScreen) {
      onRequestAssignmentFullScreen();
      return;
    }
    setSelectedMethod(method);
  };

  if (selectedMethod) {
    return (
      <div className="min-h-[34rem] flex flex-col items-center justify-center py-20 px-4">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {selectedMethod === "manual"
            ? "Manual method for this process coming soon..."
            : selectedMethod === "upload"
            ? "Upload functionality coming soon..."
            : "GPTrade coming soon..."}
        </p>
        <Button
          variant="link"
          className="mt-6 text-corporate-blue"
          onClick={() => setSelectedMethod(null)}
        >
          ← Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
          Export Letter of Credit
        </DialogTitle>
      </DialogHeader>

      <ExportLCProcessSection
        selectedProcess={selectedProcess}
        onProcessSelect={handleProcessSelect}
      />

      <ExportLCMethodSection
        selectedProcess={selectedProcess}
        selectedMethod={selectedMethod}
        onMethodSelect={handleMethodSelect}
      />
    </div>
  );
};

export default ExportLCModalContent;
