
import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InwardBGDemandSearchSection from './inward-demand/InwardBGDemandSearchSection';
import GuaranteeDemandDetailsCard from './inward-demand/GuaranteeDemandDetailsCard';
import DemandDetailsSection from './inward-demand/DemandDetailsSection';
import DemandSupportingDocuments from './inward-demand/DemandSupportingDocuments';
import { useToast } from '@/hooks/use-toast';

interface InwardBGRecordDemandFormProps {
  onClose: () => void;
  onBack: () => void;
}

const InwardBGRecordDemandForm: React.FC<InwardBGRecordDemandFormProps> = ({
  onClose,
  onBack
}) => {
  const { toast } = useToast();
  const [guaranteeReference, setGuaranteeReference] = useState('');
  const [guaranteeData, setGuaranteeData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [demandData, setDemandData] = useState({
    relatedReference: '',
    demandReference: '',
    demandType: '',
    demandAmount: '',
    demandCurrency: '',
    requestExtension: false,
    extensionDate: '',
    demandStatementType: '',
    demandStatementNarration: '',
    supportingDocuments: []
  });

  const handleSearch = async () => {
    if (!guaranteeReference.trim()) {
      toast({
        title: "Error",
        description: "Please enter a guarantee reference number",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    // Mock search - in real implementation, this would call Supabase
    setTimeout(() => {
      setGuaranteeData({
        guaranteeReference: guaranteeReference,
        applicantName: "ABC Trading Corp",
        issuingBank: "Standard Chartered Bank",
        guaranteeAmount: "500,000.00",
        currency: "USD",
        issueDate: "2024-01-15",
        expiryDate: "2024-12-31",
        beneficiaryName: "XYZ Construction Ltd",
        guaranteeType: "Performance Guarantee"
      });
      setDemandData(prev => ({
        ...prev,
        demandCurrency: "USD"
      }));
      setIsSearching(false);
    }, 1000);
  };

  const handleDemandDataChange = (field: string, value: any) => {
    setDemandData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAsDraft = () => {
    // Validation for draft
    if (!guaranteeData) {
      toast({
        title: "Error",
        description: "Please search for a guarantee first",
        variant: "destructive"
      });
      return;
    }

    console.log('Saving demand as draft:', demandData);
    
    toast({
      title: "Success",
      description: "Demand record has been saved as draft",
      variant: "default"
    });
  };

  const handleSubmit = () => {
    // Validation
    if (!guaranteeData) {
      toast({
        title: "Error",
        description: "Please search for a guarantee first",
        variant: "destructive"
      });
      return;
    }

    if (!demandData.relatedReference || !demandData.demandType || !demandData.demandAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Amount validation
    const demandAmount = parseFloat(demandData.demandAmount);
    const guaranteeAmount = parseFloat(guaranteeData.guaranteeAmount.replace(/,/g, ''));
    
    if (demandAmount > guaranteeAmount) {
      toast({
        title: "Error",
        description: "Demand amount cannot exceed guarantee amount",
        variant: "destructive"
      });
      return;
    }

    console.log('Submitting demand data:', demandData);
    
    toast({
      title: "Success",
      description: "Demand record has been submitted successfully",
      variant: "default"
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Record Demand/Claim</h1>
                <p className="text-sm text-gray-600">Inward Bank Guarantee/SBLC</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Search Section */}
          <InwardBGDemandSearchSection
            guaranteeReference={guaranteeReference}
            setGuaranteeReference={setGuaranteeReference}
            onSearch={handleSearch}
            isSearching={isSearching}
          />

          {/* Guarantee Details */}
          {guaranteeData && (
            <GuaranteeDemandDetailsCard guaranteeData={guaranteeData} />
          )}

          {/* Demand Details */}
          {guaranteeData && (
            <DemandDetailsSection
              demandData={demandData}
              guaranteeData={guaranteeData}
              onDemandDataChange={handleDemandDataChange}
            />
          )}

          {/* Supporting Documents */}
          {guaranteeData && (
            <DemandSupportingDocuments
              documents={demandData.supportingDocuments}
              onDocumentsChange={(docs) => handleDemandDataChange('supportingDocuments', docs)}
            />
          )}

          {/* Action Buttons */}
          {guaranteeData && (
            <div className="flex justify-end gap-4 pt-6">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-8"
              >
                Discard
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveAsDraft}
                className="px-8"
              >
                Save as Draft
              </Button>
              <Button
                onClick={handleSubmit}
                className="px-8 bg-primary hover:bg-primary/90"
              >
                Submit Demand
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InwardBGRecordDemandForm;
