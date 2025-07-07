
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, ArrowLeft, Calendar, Building, User, CreditCard, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

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
    // Simulate API submission
    setTimeout(() => {
      toast({
        title: "Success",
        description: `Amendment consent ${consentAction}ed successfully`,
        variant: "default"
      });
      setIsSubmitting(false);
      onClose();
    }, 1500);
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Guarantee/SBLC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="guaranteeRef" className="text-sm font-medium">
                  Guarantee/SBLC Reference Number
                </Label>
                <Input
                  id="guaranteeRef"
                  value={guaranteeReference}
                  onChange={(e) => setGuaranteeReference(e.target.value)}
                  placeholder="Enter guarantee/SBLC reference (e.g., IBG/2024/001234)"
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guarantee Details */}
        {guaranteeData && (
          <div className="space-y-6">
            {/* Basic Guarantee Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Guarantee/SBLC Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Guarantee/SBLC Reference
                    </Label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {guaranteeData.guaranteeReference}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Applicant
                    </Label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {guaranteeData.applicantName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      Issuing Bank
                    </Label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {guaranteeData.issuingBank}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Issue Date
                    </Label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {guaranteeData.issueDate}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Expiry Date
                    </Label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {guaranteeData.expiryDate}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Guarantee/SBLC Amount
                    </Label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {guaranteeData.guaranteeAmount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amendment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Amendment Details</span>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                      Pending Consent
                    </Badge>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {consentedChanges}/{totalChanges} changes consented
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {guaranteeData.amendments.map((amendment: any, index: number) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Amendment Number
                        </Label>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {amendment.amendmentNumber}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Amendment Date
                        </Label>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {amendment.amendmentDate}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">
                        Changes Summary
                      </Label>
                      <div className="space-y-3">
                        {amendment.changes.map((change: any, changeIndex: number) => (
                          <div key={changeIndex} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {change.field}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`consent-${change.id}`}
                                  checked={amendmentConsents[change.id] || false}
                                  onCheckedChange={(checked) => 
                                    handleAmendmentConsentChange(change.id, checked as boolean)
                                  }
                                />
                                <Label 
                                  htmlFor={`consent-${change.id}`} 
                                  className="text-xs font-medium cursor-pointer flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Consent
                                </Label>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                  Previous Value
                                </Label>
                                <p className="text-gray-900 dark:text-white font-medium">
                                  {change.previous}
                                </p>
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                  Updated Value
                                </Label>
                                <p className="text-green-700 dark:text-green-300 font-medium">
                                  {change.updated}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Consent Section */}
            <Card>
              <CardHeader>
                <CardTitle>Record Your Consent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">
                    Amendment Consent Status
                  </Label>
                  
                  {/* Consent Summary */}
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">
                        Individual Consent Status: {consentedChanges}/{totalChanges} changes consented
                      </span>
                    </div>
                    {allChangesConsented && (
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        All changes have been consented - Amendment will be accepted
                      </p>
                    )}
                    {someChangesNotConsented && (
                      <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                        Some changes not consented - Amendment will be refused
                      </p>
                    )}
                    {noChangesConsented && (
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                        No changes consented - Only refusal option available
                      </p>
                    )}
                  </div>

                  <RadioGroup
                    value={consentAction || ''}
                    onValueChange={(value) => setConsentAction(value as 'accept' | 'refuse')}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="accept" 
                        id="accept" 
                        disabled={!allChangesConsented}
                      />
                      <Label 
                        htmlFor="accept" 
                        className={`font-medium ${
                          allChangesConsented 
                            ? "text-green-700 dark:text-green-300" 
                            : "text-gray-400 dark:text-gray-600"
                        }`}
                      >
                        Accept Amendment
                        {allChangesConsented && (
                          <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                            (Auto-selected)
                          </span>
                        )}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="refuse" 
                        id="refuse" 
                        disabled={noChangesConsented && totalChanges > 0 ? false : allChangesConsented}
                      />
                      <Label 
                        htmlFor="refuse" 
                        className={`font-medium ${
                          !allChangesConsented 
                            ? "text-red-700 dark:text-red-300" 
                            : "text-gray-400 dark:text-gray-600"
                        }`}
                      >
                        Refuse Amendment
                        {(someChangesNotConsented || noChangesConsented) && (
                          <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                            {someChangesNotConsented ? "(Auto-selected)" : "(Available)"}
                          </span>
                        )}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {consentAction === 'refuse' && (
                  <div>
                    <Label htmlFor="rejectionReason" className="text-sm font-medium text-gray-900 dark:text-white">
                      Rejection Reason <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide detailed reason for refusing the amendment..."
                      className="mt-2 min-h-[100px]"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
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
