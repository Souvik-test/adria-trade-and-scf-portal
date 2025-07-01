import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import OutwardBGFormActions from './OutwardBGFormActions';
import OutwardBGPaneRenderer from './OutwardBGPaneRenderer';
import OutwardBGProgressIndicator from './OutwardBGProgressIndicator';
import MT767SidebarPreview from './MT767SidebarPreview';
import AmendmentChangesSummaryModal from './AmendmentChangesSummaryModal';
import { OutwardBGFormData } from '@/types/outwardBankGuarantee';

interface OutwardBGAmendmentFormProps {
  onClose: () => void;
  onBack: () => void;
}

const OutwardBGAmendmentForm: React.FC<OutwardBGAmendmentFormProps> = ({ 
  onClose, 
  onBack 
}) => {
  const [currentPane, setCurrentPane] = useState(0);
  const [formData, setFormData] = useState<OutwardBGFormData>({});
  const [originalData, setOriginalData] = useState<OutwardBGFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChangesSummaryOpen, setIsChangesSummaryOpen] = useState(false);
  const { toast } = useToast();

  const panes = [
    'Guarantee Information',
    'Party Details', 
    'Amount & Terms',
    'Conditions & Clauses',
    'Documents Required',
    'Supporting Documents',
    'Review & Submit'
  ];

  const detectChanges = useMemo(() => {
    const changes = [];
    const fieldsToCheck = [
      { key: 'guaranteeAmount', label: 'Guarantee Amount' },
      { key: 'dateOfExpiry', label: 'Date of Expiry' },
      { key: 'placeOfExpiry', label: 'Place of Expiry' },
      { key: 'guaranteeText', label: 'Guarantee Text/Purpose' },
      { key: 'applicantAddress', label: 'Applicant Address' },
      { key: 'beneficiaryAddress', label: 'Beneficiary Address' },
      { key: 'additionalConditions', label: 'Additional Conditions' },
      { key: 'documentsRequired', label: 'Documents Required' },
      { key: 'chargesDetails', label: 'Charges Details' },
      { key: 'percentageCreditAmount', label: 'Percentage Credit Amount' },
      { key: 'maximumCreditAmount', label: 'Maximum Credit Amount' },
      { key: 'additionalAmounts', label: 'Additional Amounts' },
      { key: 'currency', label: 'Currency' }
    ];

    fieldsToCheck.forEach(field => {
      const oldValue = originalData[field.key as keyof OutwardBGFormData];
      const newValue = formData[field.key as keyof OutwardBGFormData];
      
      if (oldValue !== newValue) {
        changes.push({
          field: field.label,
          oldValue: String(oldValue || ''),
          newValue: String(newValue || '')
        });
      }
    });

    return changes;
  }, [formData, originalData]);

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

  const handleSaveAsDraft = async () => {
    // Implementation for saving amendment as draft
    toast({
      title: "Success",
      description: "Amendment request saved as draft.",
    });
  };

  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard all changes? This action cannot be undone.')) {
      setFormData({});
      setOriginalData({});
      setCurrentPane(0);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      toast({
        title: "Success",
        description: "Amendment request submitted successfully.",
      });

      onClose();

    } catch (error) {
      console.error('Error submitting amendment:', error);
      toast({
        title: "Error",
        description: "Failed to submit amendment request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex h-screen w-screen">
      {/* Main Content Area */}
      <div 
        className={`flex flex-col h-full min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'flex-1' : 'flex-1'
        }`}
        style={{
          width: isSidebarCollapsed ? 'calc(100% - 48px)' : 'calc(100% - 384px)'
        }}
      >
        {/* Header - Fixed */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
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
                  Outward Bank Guarantee/SBLC Amendment
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Request amendment to existing guarantee based on MT 767 format
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChangesSummaryOpen(true)}
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Changes ({detectChanges.length})
              </Button>
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
        </div>

        {/* Progress Indicator - Fixed */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <OutwardBGProgressIndicator
            currentPane={currentPane}
            panes={panes}
            onPaneClick={handlePaneClick}
          />
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto p-6">
            <OutwardBGPaneRenderer
              currentPane={currentPane}
              formData={formData}
              onFieldChange={handleFieldChange}
              isAmendment={true}
            />
          </div>
        </div>

        {/* Form Actions - Fixed at bottom */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <OutwardBGFormActions
            currentPane={currentPane}
            totalPanes={panes.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSaveAsDraft={handleSaveAsDraft}
            onDiscard={handleDiscard}
            onSubmit={handleSubmit}
            formData={formData}
          />
        </div>
      </div>

      {/* MT 767 Preview Sidebar - Fixed width */}
      <div 
        className={`flex-shrink-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-12' : 'w-96'
        }`}
      >
        <MT767SidebarPreview 
          formData={formData} 
          originalData={originalData}
          guaranteeReference={formData.guaranteeReferenceNo || ''}
          onToggleCollapse={handleSidebarToggle}
        />
      </div>

      {/* Amendment Changes Summary Modal */}
      <AmendmentChangesSummaryModal
        open={isChangesSummaryOpen}
        onClose={() => setIsChangesSummaryOpen(false)}
        changes={detectChanges}
      />
    </div>
  );
};

export default OutwardBGAmendmentForm;
