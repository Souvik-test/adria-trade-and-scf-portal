
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, X, Search, Upload, FileText, Save, Send, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OutwardBGCancellationFormProps {
  onClose: () => void;
  onBack: () => void;
}

interface GuaranteeSearchResult {
  id: string;
  request_reference: string;
  beneficiary_name: string;
  guarantee_amount: number;
  currency: string;
  date_of_issue: string;
  date_of_expiry: string;
  status: string;
  guarantee_type: string;
}

const OutwardBGCancellationForm: React.FC<OutwardBGCancellationFormProps> = ({ 
  onClose, 
  onBack 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuarantee, setSelectedGuarantee] = useState<GuaranteeSearchResult | null>(null);
  const [searchResults, setSearchResults] = useState<GuaranteeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [cancellationRemarks, setCancellationRemarks] = useState('');
  const [supportingDocuments, setSupportingDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Sample guarantee data for testing
  const sampleGuarantees: GuaranteeSearchResult[] = [
    {
      id: '1',
      request_reference: 'BG-2024-001234',
      beneficiary_name: 'ABC Construction Ltd.',
      guarantee_amount: 500000,
      currency: 'USD',
      date_of_issue: '2024-01-15',
      date_of_expiry: '2024-12-31',
      status: 'issued',
      guarantee_type: 'Performance Guarantee'
    },
    {
      id: '2',
      request_reference: 'BG-2024-005678',
      beneficiary_name: 'XYZ Trading Company',
      guarantee_amount: 250000,
      currency: 'EUR',
      date_of_issue: '2024-02-20',
      date_of_expiry: '2024-11-30',
      status: 'issued',
      guarantee_type: 'Bid Bond'
    },
    {
      id: '3',
      request_reference: 'SBLC-2024-009876',
      beneficiary_name: 'Global Suppliers Inc.',
      guarantee_amount: 750000,
      currency: 'USD',
      date_of_issue: '2024-03-10',
      date_of_expiry: '2025-03-10',
      status: 'issued',
      guarantee_type: 'Standby Letter of Credit'
    }
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a guarantee reference number to search.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter sample guarantees based on search term
      const filteredResults = sampleGuarantees.filter(guarantee =>
        guarantee.request_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guarantee.beneficiary_name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults(filteredResults);
      
      if (filteredResults.length === 0) {
        toast({
          title: "No Results",
          description: "No unused guarantees found matching your search criteria.",
        });
      }
      
      setIsSearching(false);
    }, 1000);
  };

  const handleGuaranteeSelect = (guarantee: GuaranteeSearchResult) => {
    setSelectedGuarantee(guarantee);
    setSearchResults([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSupportingDocuments(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSupportingDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!selectedGuarantee) {
      toast({
        title: "Guarantee Required",
        description: "Please search and select a guarantee to cancel.",
        variant: "destructive",
      });
      return false;
    }

    if (!cancellationRemarks.trim()) {
      toast({
        title: "Remarks Required",
        description: "Please provide cancellation remarks.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSaveAsDraft = async () => {
    if (!validateForm()) return;

    // Implementation for saving as draft
    toast({
      title: "Success",
      description: "Cancellation request saved as draft.",
    });
  };

  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard all changes? This action cannot be undone.')) {
      setSelectedGuarantee(null);
      setSearchTerm('');
      setCancellationRemarks('');
      setSupportingDocuments([]);
      setSearchResults([]);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      
      // Here you would implement the actual submission logic
      // For now, we'll just show a success message
      
      toast({
        title: "Success",
        description: "Cancellation request submitted successfully.",
      });

      onClose();

    } catch (error) {
      console.error('Error submitting cancellation:', error);
      toast({
        title: "Error",
        description: "Failed to submit cancellation request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex flex-col h-screen w-screen">
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
                Outward Bank Guarantee/SBLC Cancellation
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Request cancellation of existing guarantee
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle>Search Guarantee</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="search">Guarantee/SBLC Reference</Label>
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter guarantee reference or beneficiary name (try 'BG-2024' or 'ABC')"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} disabled={isSearching}>
                    <Search className="w-4 h-4 mr-2" />
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <Label>Search Results</Label>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {searchResults.map((guarantee) => (
                      <div
                        key={guarantee.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => handleGuaranteeSelect(guarantee)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{guarantee.request_reference}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Beneficiary: {guarantee.beneficiary_name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Amount: {guarantee.currency} {guarantee.guarantee_amount?.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right text-sm">
                            <p>Issued: {guarantee.date_of_issue}</p>
                            <p>Expires: {guarantee.date_of_expiry}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Guarantee Details */}
          {selectedGuarantee && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Guarantee Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Reference Number</Label>
                    <p className="font-medium">{selectedGuarantee.request_reference}</p>
                  </div>
                  <div>
                    <Label>Guarantee Type</Label>
                    <p className="font-medium">{selectedGuarantee.guarantee_type || 'N/A'}</p>
                  </div>
                  <div>
                    <Label>Beneficiary</Label>
                    <p className="font-medium">{selectedGuarantee.beneficiary_name}</p>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <p className="font-medium">
                      {selectedGuarantee.currency} {selectedGuarantee.guarantee_amount?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label>Issue Date</Label>
                    <p className="font-medium">{selectedGuarantee.date_of_issue}</p>
                  </div>
                  <div>
                    <Label>Expiry Date</Label>
                    <p className="font-medium">{selectedGuarantee.date_of_expiry}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cancellation Details */}
          {selectedGuarantee && (
            <Card>
              <CardHeader>
                <CardTitle>Cancellation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="remarks">Cancellation Remarks *</Label>
                  <Textarea
                    id="remarks"
                    value={cancellationRemarks}
                    onChange={(e) => setCancellationRemarks(e.target.value)}
                    placeholder="Please provide detailed reasons for cancellation..."
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Document Upload */}
          {selectedGuarantee && (
            <Card>
              <CardHeader>
                <CardTitle>Supporting Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Button variant="outline" asChild>
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Documents
                          </span>
                        </Button>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={handleFileUpload}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Upload cancellation request form or consent letter (PDF, DOC, DOCX, JPG, PNG)
                    </p>
                  </div>
                </div>

                {supportingDocuments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Uploaded Files:</h4>
                    {supportingDocuments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleSaveAsDraft}
              className="flex items-center space-x-2"
              disabled={!selectedGuarantee}
            >
              <Save className="w-4 h-4" />
              <span>Save as Draft</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDiscard}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
            >
              <Trash2 className="w-4 h-4" />
              <span>Discard</span>
            </Button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!selectedGuarantee || !cancellationRemarks.trim() || isSubmitting}
            className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OutwardBGCancellationForm;
