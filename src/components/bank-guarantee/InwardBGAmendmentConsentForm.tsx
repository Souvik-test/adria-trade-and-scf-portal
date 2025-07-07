
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import InwardBGSearchSection from './inward-amendment-consent/InwardBGSearchSection';
import GuaranteeDetailsCard from './inward-amendment-consent/GuaranteeDetailsCard';
import AmendmentDetailsCard from './inward-amendment-consent/AmendmentDetailsCard';
import ConsentSection from './inward-amendment-consent/ConsentSection';
import { useInwardBGAmendmentConsent } from './inward-amendment-consent/useInwardBGAmendmentConsent';

interface InwardBGAmendmentConsentFormProps {
  onClose: () => void;
  onBack: () => void;
}

// Mock data for demonstration
const MOCK_GUARANTEE_DATA = {
  guaranteeReference: "IBG/2024/001234",
  applicantName: "ABC Manufacturing Ltd",
  issuingBank: "Deutsche Bank AG",
  issueDate: "2024-01-15",
  expiryDate: "2024-12-15",
  guaranteeAmount: "USD 500,000.00",
  guaranteeType: "Performance Guarantee/SBLC",
  beneficiaryName: "XYZ Construction Co.",
  status: "Active",
  amendments: [
    {
      amendmentNumber: "01",
      amendmentDate: "2024-03-20",
      status: "Pending Consent",
      changes: [
        { field: "Expiry Date", previous: "2024-12-15", updated: "2025-02-15", id: "expiry_date" },
        { field: "Guarantee/SBLC Amount", previous: "USD 500,000.00", updated: "USD 600,000.00", id: "guarantee_amount" },
        { field: "Terms & Conditions", previous: "Original terms", updated: "Updated performance milestones", id: "terms_conditions" }
      ]
    }
  ]
};

const InwardBGAmendmentConsentForm: React.FC<InwardBGAmendmentConsentFormProps> = ({
  onClose,
  onBack
}) => {
  const [guaranteeReference, setGuaranteeReference] = useState('');
  const [guaranteeData, setGuaranteeData] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [consentAction, setConsentAction] = useState<'accept' | 'refuse' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amendmentConsents, setAmendmentConsents] = useState<Record<string, boolean>>({});
  
  const { toast } = useToast();
  const { submitAmendmentConsent } = useInwardBGAmendmentConsent();

  // Calculate total changes and consented changes
  const totalChanges = guaranteeData?.amendments?.reduce((total: number, amendment: any) => 
    total + amendment.changes.length, 0
  ) || 0;
  
  const consentedChanges = Object.values(amendmentConsents).filter(Boolean).length;
  const allChangesConsented = totalChanges > 0 && consentedChanges === totalChanges;
  const someChangesNotConsented = totalChanges > 0 && consentedChanges < totalChanges && consentedChanges > 0;
  const noChangesConsented = consentedChanges === 0;

  // Auto-update consent action based on individual consents
  useEffect(() => {
    if (totalChanges === 0) return;

    if (allChangesConsented) {
      setConsentAction('accept');
      setRejectionReason(''); // Clear rejection reason when accepting
    } else if (consentedChanges > 0) {
      setConsentAction('refuse');
    } else {
      setConsentAction(null);
    }
  }, [amendmentConsents, totalChanges, allChangesConsented, consentedChanges]);

  const handleSearch = async () => {
    if (!guaranteeReference.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Guarantee/SBLC Reference Number",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      if (guaranteeReference === MOCK_GUARANTEE_DATA.guaranteeReference) {
        setGuaranteeData(MOCK_GUARANTEE_DATA);
        // Initialize consent checkboxes
        const initialConsents: Record<string, boolean> = {};
        MOCK_GUARANTEE_DATA.amendments.forEach((amendment) => {
          amendment.changes.forEach((change) => {
            initialConsents[change.id] = false;
          });
        });
        setAmendmentConsents(initialConsents);
      } else {
        toast({
          title: "Not Found",
          description: "No guarantee/SBLC found with the provided reference number",
          variant: "destructive"
        });
        setGuaranteeData(null);
        setAmendmentConsents({});
      }
      setIsSearching(false);
    }, 1000);
  };

  const handleAmendmentConsentChange = (changeId: string, consented: boolean) => {
    setAmendmentConsents(prev => ({
      ...prev,
      [changeId]: consented
    }));
  };

  const handleSubmit = async () => {
    if (!consentAction) {
      toast({
        title: "Error",
        description: "Please provide consent for all amendment changes",
        variant: "destructive"
      });
      return;
    }

    if (consentAction === 'refuse' && !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason for refused amendments",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await submitAmendmentConsent({
        guaranteeReference: guaranteeData.guaranteeReference,
        amendmentNumber: guaranteeData.amendments[0].amendmentNumber,
        consentAction,
        individualConsents: amendmentConsents,
        rejectionReason: consentAction === 'refuse' ? rejectionReason : undefined,
        applicantName: guaranteeData.applicantName,
        issuingBank: guaranteeData.issuingBank,
        guaranteeAmount: guaranteeData.guaranteeAmount,
        currency: 'USD',
        issueDate: guaranteeData.issueDate,
        expiryDate: guaranteeData.expiryDate,
        beneficiaryName: guaranteeData.beneficiaryName,
      });
      
      onClose();
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Are you sure you want to discard all changes?")) {
      onBack();
    }
  };

  const handleSaveAsDraft = () => {
    toast({
      title: "Saved",
      description: "Amendment consent saved as draft",
      variant: "default"
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 w-full h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Beneficiary's Response on Amendment
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Search and record consent for Inward Bank Guarantee/SBLC amendments
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <InwardBGSearchSection
          guaranteeReference={guaranteeReference}
          setGuaranteeReference={setGuaranteeReference}
          onSearch={handleSearch}
          isSearching={isSearching}
        />

        {/* Guarantee Details */}
        {guaranteeData && (
          <div className="space-y-6">
            {/* Basic Guarantee Information */}
            <GuaranteeDetailsCard guaranteeData={guaranteeData} />

            {/* Amendment Details */}
            <AmendmentDetailsCard
              guaranteeData={guaranteeData}
              amendmentConsents={amendmentConsents}
              onAmendmentConsentChange={handleAmendmentConsentChange}
              totalChanges={totalChanges}
              consentedChanges={consentedChanges}
            />

            {/* Consent Section */}
            <ConsentSection
              consentAction={consentAction}
              setConsentAction={setConsentAction}
              rejectionReason={rejectionReason}
              setRejectionReason={setRejectionReason}
              totalChanges={totalChanges}
              consentedChanges={consentedChanges}
              allChangesConsented={allChangesConsented}
              someChangesNotConsented={someChangesNotConsented}
              noChangesConsented={noChangesConsented}
            />
          </div>
        )}

        {/* Action Buttons */}
        {guaranteeData && (
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
            <div></div>
            <div className="flex gap-3">
              <Button
                onClick={handleDiscard}
                variant="outline"
                className="border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
              >
                Discard
              </Button>
              
              <Button
                onClick={handleSaveAsDraft}
                variant="outline"
                className="border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/20"
              >
                Save as Draft
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !consentAction || (consentAction === 'refuse' && !rejectionReason.trim())}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Consent'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InwardBGAmendmentConsentForm;
