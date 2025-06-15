
import React, { useState } from "react";
import ExportLCProcessSection from "./ExportLCProcessSection";
import ExportLCMethodSection from "./ExportLCMethodSection";
import AmendmentResponseForm from "./AmendmentResponseForm";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExportLCModalContentProps {
  onClose: () => void;
  onManualReviewFullScreen?: () => void; // NEW: Callback to request full-screen mode
}

const ExportLCModalContent: React.FC<ExportLCModalContentProps> = ({
  onClose,
  onManualReviewFullScreen,
}) => {
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleProcessSelect = (process: string) => {
    setSelectedProcess(process);
    setSelectedMethod(null); // Reset method on process change
  };

  const handleMethodSelect = (method: string) => {
    if (!selectedProcess) return;

    // Manual for review process: open full screen via parent callback
    if (selectedProcess === "review" && method === "manual" && onManualReviewFullScreen) {
      onManualReviewFullScreen();
      return;
    }
    // Manual for amendment consent: show amendment response form
    if (selectedProcess === "amendConsent" && method === "manual") {
      setSelectedMethod("manual");
      return;
    }
    setSelectedMethod(method);
  };

  // Debug: Show current process and method
  // console.log("ExportLCModalContent: selectedProcess", selectedProcess, "selectedMethod", selectedMethod);

  // If "record amendment consent" + manual, render full-screen AmendmentResponseForm with overlay
  if (selectedProcess === "amendConsent" && selectedMethod === "manual") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        {/* AmendmentResponseForm covers the full window, with a high z-index. */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <AmendmentResponseForm onClose={() => setSelectedMethod(null)} />
        </div>
      </div>
    );
  }

  // If a method is picked (all others are "coming soon") render a stub + back button
  if (selectedMethod) {
    return (
      <div className="min-h-[34rem] flex flex-col items-center justify-center py-20 px-4">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {selectedMethod === "manual"
            ? "Manual method for this process coming soon..."
            : selectedMethod === "upload"
            ? "Upload functionality coming soon..."
            : "Contextual assistance coming soon..."}
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
      {/* Modal Title */}
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
