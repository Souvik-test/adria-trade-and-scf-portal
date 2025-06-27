
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import OutwardBGFormActions from './OutwardBGFormActions';
import OutwardBGPaneRenderer from './OutwardBGPaneRenderer';
import OutwardBGProgressIndicator from './OutwardBGProgressIndicator';
import MT760SidebarPreview from './MT760SidebarPreview';

interface OutwardBankGuaranteeIssuanceFormProps {
  onClose: () => void;
  onBack: () => void;
}

const OutwardBankGuaranteeIssuanceForm: React.FC<OutwardBankGuaranteeIssuanceFormProps> = ({ 
  onClose, 
  onBack 
}) => {
  const [currentPane, setCurrentPane] = useState(0);
  const [formData, setFormData] = useState({});

  const panes = [
    'Guarantee Information',
    'Party Details', 
    'Amount & Terms',
    'Conditions & Clauses',
    'Documents Required',
    'Supporting Documents',
    'Review & Submit'
  ];

  const handleNext = () => {
    if (currentPane < panes.length - 1) {
      setCurrentPane(currentPane + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPane > 0) {
      setCurrentPane(currentPane - 1);
    }
  };

  const handlePaneClick = (paneIndex: number) => {
    setCurrentPane(paneIndex);
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Outward Bank Guarantee/SBLC Issuance
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Request new guarantee issuance based on MT 760 format
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <OutwardBGProgressIndicator
          currentPane={currentPane}
          panes={panes}
          onPaneClick={handlePaneClick}
        />

        {/* Form Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            <OutwardBGPaneRenderer
              currentPane={currentPane}
              formData={formData}
              onFieldChange={handleFieldChange}
            />
          </div>
        </div>

        {/* Form Actions */}
        <OutwardBGFormActions
          currentPane={currentPane}
          totalPanes={panes.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          formData={formData}
        />
      </div>

      {/* MT 760 Preview Sidebar */}
      <MT760SidebarPreview formData={formData} />
    </div>
  );
};

export default OutwardBankGuaranteeIssuanceForm;
