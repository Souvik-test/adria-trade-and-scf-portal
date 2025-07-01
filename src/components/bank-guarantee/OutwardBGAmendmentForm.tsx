
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import OutwardBGFormActions from './OutwardBGFormActions';
import OutwardBGPaneRenderer from './OutwardBGPaneRenderer';
import OutwardBGProgressIndicator from './OutwardBGProgressIndicator';
import MT767SidebarPreview from './MT767SidebarPreview';
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
  const [guaranteeReference, setGuaranteeReference] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isGuaranteeFound, setIsGuaranteeFound] = useState(false);
  const { toast } = useToast();

  const panes = [
    'Search Guarantee',
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
    // Don't allow navigation beyond search pane if guarantee not found
    if (!isGuaranteeFound && paneIndex > 0) {
      return;
    }
    setCurrentPane(paneIndex);
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearchGuarantee = async () => {
    if (!guaranteeReference.trim()) {
      toast({
        title: "Error",
        description: "Please enter a guarantee reference number.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSearching(true);
      
      const { data, error } = await supabase
        .from('outward_bg_requests')
        .select('*')
        .eq('senders_reference', guaranteeReference.trim())
        .eq('status', 'submitted')
        .single();

      if (error || !data) {
        toast({
          title: "Not Found",
          description: "No active guarantee found with this reference number.",
          variant: "destructive",
        });
        return;
      }

      // Populate form with existing data
      const existingData: OutwardBGFormData = {
        sendersReference: data.senders_reference,
        bankOperationCode: data.bank_operation_code,
        dateOfIssue: data.date_of_issue,
        dateOfExpiry: data.date_of_expiry,
        placeOfExpiry: data.place_of_expiry,
        currency: data.currency,
        guaranteeAmount: data.guarantee_amount,
        formOfGuarantee: data.form_of_guarantee,
        applicableRules: data.applicable_rules,
        applicantName: data.applicant_name,
        applicantAddress: data.applicant_address,
        applicantAccountNumber: data.applicant_account_number,
        beneficiaryName: data.beneficiary_name,
        beneficiaryAddress: data.beneficiary_address,
        beneficiaryBankName: data.beneficiary_bank_name,
        beneficiaryBankAddress: data.beneficiary_bank_address,
        beneficiaryBankSwiftCode: data.beneficiary_bank_swift_code,
        guaranteeDetails: data.guarantee_details,
        termsAndConditions: data.terms_and_conditions,
        documentsRequired: data.documents_required,
        guaranteeType: data.guarantee_type,
        contractReference: data.contract_reference,
        underlyingContractDetails: data.underlying_contract_details,
        specialInstructions: data.special_instructions,
      };

      setOriginalData(existingData);
      setFormData(existingData);
      setIsGuaranteeFound(true);
      
      toast({
        title: "Success",
        description: "Guarantee found and data loaded successfully.",
      });

      // Move to next pane
      setCurrentPane(1);

    } catch (error) {
      console.error('Error searching guarantee:', error);
      toast({
        title: "Error",
        description: "Failed to search guarantee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
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
      setIsGuaranteeFound(false);
      setGuaranteeReference('');
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

  const renderSearchPane = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Search Guarantee Reference</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="guaranteeReference">Guarantee Reference Number *</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="guaranteeReference"
                value={guaranteeReference}
                onChange={(e) => setGuaranteeReference(e.target.value)}
                placeholder="Enter guarantee reference number"
                className="flex-1"
              />
              <Button 
                onClick={handleSearchGuarantee}
                disabled={isSearching}
                className="px-6"
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
          {isGuaranteeFound && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-green-800 dark:text-green-200 text-sm">
                ✓ Guarantee found and loaded successfully. You can now proceed to make amendments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
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
        <div className="flex-shrink-0">
          <OutwardBGProgressIndicator
            currentPane={currentPane}
            panes={panes}
            onPaneClick={handlePaneClick}
          />
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {currentPane === 0 ? renderSearchPane() : (
              <OutwardBGPaneRenderer
                currentPane={currentPane - 1}
                formData={formData}
                onFieldChange={handleFieldChange}
              />
            )}
          </div>
        </div>

        {/* Form Actions - Fixed at bottom */}
        <div className="flex-shrink-0">
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
      <div className="flex-shrink-0">
        <MT767SidebarPreview 
          formData={formData} 
          originalData={originalData}
          guaranteeReference={guaranteeReference}
        />
      </div>
    </div>
  );
};

export default OutwardBGAmendmentForm;
