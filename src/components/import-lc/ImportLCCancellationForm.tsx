
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import ImportLCSearchDropdown from '../export-lc/ImportLCSearchDropdown';
import ImportLCCancellationSupportingDocumentUpload from './ImportLCCancellationSupportingDocumentUpload';
import SwiftTagLabel from './SwiftTagLabel';
import { Plus, FilePlus } from 'lucide-react';

interface ImportLCCancellationFormProps {
  onBack: () => void;
  onClose: () => void;
}

interface CancellationFormData {
  lcReference: string;
  cancellationReason: string;
  supportingDocuments: any[];
  lcDetails?: {
    corporate_reference: string;
    beneficiary_name: string;
    lc_amount: number;
    currency: string;
    expiry_date: string;
    issuing_bank: string;
  };
}

const SUPPORTING_DOC_LABELS = [
  { key: 'cancellationRequest', label: 'Cancellation Request Letter' },
  { key: 'mutualAgreement', label: 'Mutual Agreement Document' },
  { key: 'bankCorrespondence', label: 'Bank Correspondence' },
  { key: 'legalDocuments', label: 'Legal Documents' },
];

const ImportLCCancellationForm: React.FC<ImportLCCancellationFormProps> = ({ onBack, onClose }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CancellationFormData>({
    lcReference: '',
    cancellationReason: '',
    supportingDocuments: []
  });
  const [customDocUploads, setCustomDocUploads] = useState<{ label: string; key: string }[]>([]);
  const [customDocUploadName, setCustomDocUploadName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLCSelect = (lc: any) => {
    console.log('Selected LC for cancellation:', lc);
    setFormData(prev => ({
      ...prev,
      lcReference: lc.corporate_reference || '',
      lcDetails: {
        corporate_reference: lc.corporate_reference || '',
        beneficiary_name: lc.beneficiary_name || '',
        lc_amount: lc.lc_amount || 0,
        currency: lc.currency || 'USD',
        expiry_date: lc.expiry_date || '',
        issuing_bank: lc.issuing_bank || ''
      }
    }));
  };

  const updateField = (field: keyof CancellationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddCustomUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customDocUploadName.trim();
    if (trimmed && !customDocUploads.some(d => d.label === trimmed)) {
      setCustomDocUploads(u => [...u, { label: trimmed, key: `custom-${u.length + 1}` }]);
      setCustomDocUploadName('');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.lcReference) {
        toast({
          title: "Error",
          description: "Please select an LC Reference",
          variant: "destructive",
        });
        return;
      }

      if (!formData.cancellationReason.trim()) {
        toast({
          title: "Error",
          description: "Please provide a cancellation reason",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      console.log('Submitting LC cancellation request:', formData);
      
      // TODO: Implement actual cancellation submission logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Success",
        description: "LC cancellation request submitted successfully",
      });
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit cancellation request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      console.log('Saving cancellation draft...', formData);
      toast({
        title: "Success",
        description: "Draft saved successfully",
      });
    } catch (error) {
      console.error('Save draft error:', error);
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive",
      });
    }
  };

  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard all changes? This action cannot be undone.')) {
      setFormData({
        lcReference: '',
        cancellationReason: '',
        supportingDocuments: []
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-800 flex h-screen w-screen overflow-hidden">
      {/* Main Form Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-600 pb-4 mb-6 px-6 pt-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Request ILC Cancellation
            </h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden px-6">
          <ScrollArea className="h-full">
            <div className="space-y-6">
              <Card className="border border-corporate-teal-100 dark:border-corporate-teal-800 shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-corporate-teal-600 dark:text-corporate-teal-300">
                    LC Cancellation Request
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* LC Reference Search */}
                  <div>
                    <SwiftTagLabel tag=":20:" label="Corporate Reference (Search)" required />
                    <ImportLCSearchDropdown
                      value={formData.lcReference}
                      onSelect={handleLCSelect}
                      placeholder="Search and select LC Reference for cancellation..."
                    />
                  </div>

                  {/* LC Details Display */}
                  {formData.lcDetails && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Selected LC Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Beneficiary:</span>
                          <div className="font-medium">{formData.lcDetails.beneficiary_name}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                          <div className="font-medium">{formData.lcDetails.currency} {formData.lcDetails.lc_amount?.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Expiry Date:</span>
                          <div className="font-medium">{formData.lcDetails.expiry_date}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Issuing Bank:</span>
                          <div className="font-medium">{formData.lcDetails.issuing_bank}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cancellation Reason */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Cancellation Reason <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      value={formData.cancellationReason}
                      onChange={(e) => updateField('cancellationReason', e.target.value)}
                      placeholder="Please provide detailed reason for LC cancellation..."
                      rows={4}
                      required
                    />
                  </div>

                  {/* Supporting Document Uploads */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-base font-semibold text-corporate-teal-700 dark:text-corporate-teal-200">
                        Upload Supporting Documents
                      </Label>
                      <span className="text-xs text-corporate-teal-500">
                        PDF, DOC, or Image. Optional but recommended.
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2 max-w-lg">
                      Attach documents supporting your cancellation request. Upload relevant documents below.
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {SUPPORTING_DOC_LABELS.map((doc) => (
                        <ImportLCCancellationSupportingDocumentUpload
                          key={doc.key}
                          docKey={doc.key}
                          label={doc.label}
                          lcId={formData.lcReference || "cancellation"}
                          updateField={updateField}
                          formData={formData}
                        />
                      ))}
                      {/* Custom Uploads */}
                      {customDocUploads.map((c) => (
                        <ImportLCCancellationSupportingDocumentUpload
                          key={c.key}
                          docKey={c.key}
                          label={c.label}
                          lcId={formData.lcReference || "cancellation"}
                          updateField={updateField}
                          formData={formData}
                          isCustom
                        />
                      ))}
                    </div>
                    {/* Add Custom Document Upload */}
                    <div className="flex gap-2 mt-4">
                      <Input
                        value={customDocUploadName}
                        onChange={(e) => setCustomDocUploadName(e.target.value)}
                        placeholder="Add custom supporting document"
                        maxLength={40}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleAddCustomUpload}
                        className="bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white"
                        disabled={!customDocUploadName.trim()}
                        type="button"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {customDocUploads.map((c) => (
                        <span key={c.key} className="inline-flex items-center px-2 py-1 rounded bg-corporate-teal-100 text-xs text-corporate-teal-700 gap-1 shadow border border-corporate-teal-200">
                          <FilePlus className="w-3 h-3 mr-0.5 text-corporate-teal-500"  />
                          {c.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 px-6 pb-6">
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
            {/* Left side - Go Back button */}
            <div className="flex gap-3">
              <Button
                onClick={onBack}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Go Back
              </Button>
            </div>

            {/* Right side - Actions */}
            <div className="flex gap-3 items-center">
              <Button
                onClick={handleDiscard}
                variant="outline"
                className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Discard
              </Button>
              
              <Button
                onClick={handleSaveDraft}
                variant="outline"
                className="border-corporate-teal-300 dark:border-corporate-teal-600 text-corporate-teal-600 dark:text-corporate-teal-400 hover:bg-corporate-teal-50 dark:hover:bg-corporate-teal-900/20"
              >
                Save as Draft
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={!formData.lcReference || !formData.cancellationReason.trim() || isSubmitting}
                className="bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed px-8"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Cancellation Request'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportLCCancellationForm;
