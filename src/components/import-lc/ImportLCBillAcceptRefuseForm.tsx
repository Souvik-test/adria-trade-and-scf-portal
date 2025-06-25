
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Download, 
  Eye, 
  FileText, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search
} from 'lucide-react';

interface ImportLCBillAcceptRefuseFormProps {
  onBack: () => void;
  onClose: () => void;
}

interface BillData {
  billReference: string;
  billAmount: number;
  currency: string;
  billReceivedDate: string;
  billDueDate: string;
  paymentTerms: string;
  lcType: string;
  lcReference: string;
  beneficiaryName: string;
  applicantName: string;
  issuingBank: string;
  documents: {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedDate: string;
  }[];
  discrepancies: {
    id: string;
    type: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low';
  }[];
}

interface FormData {
  billReference: string;
  decision: 'accept' | 'refuse' | '';
  remarks: string;
  billData?: BillData;
}

const ImportLCBillAcceptRefuseForm: React.FC<ImportLCBillAcceptRefuseFormProps> = ({ onBack, onClose }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    billReference: '',
    decision: '',
    remarks: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = async () => {
    if (!formData.billReference.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Bill Reference number",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      console.log('Searching for bill:', formData.billReference);
      
      const { data: bills, error } = await supabase
        .from('export_lc_bills')
        .select('*')
        .eq('bill_reference', formData.billReference.trim())
        .in('status', ['submitted', 'presented']);

      if (error) {
        console.error('Bill search error:', error);
        throw error;
      }

      if (bills && bills.length > 0) {
        const bill = bills[0];
        console.log('Found bill:', bill);
        
        // Calculate bill due date (assuming 30 days from bill date for now)
        let billDueDate = '';
        if (bill.bill_date) {
          const billDate = new Date(bill.bill_date);
          const dueDate = new Date(billDate);
          dueDate.setDate(dueDate.getDate() + 30);
          billDueDate = dueDate.toISOString().split('T')[0];
        }

        const mockBillData: BillData = {
          billReference: bill.bill_reference,
          billAmount: bill.bill_amount || 0,
          currency: bill.bill_currency || 'USD',
          billReceivedDate: bill.bill_date || new Date().toISOString().split('T')[0],
          billDueDate: billDueDate,
          paymentTerms: 'At sight',
          lcType: 'Documentary Credit',
          lcReference: bill.lc_reference || '',
          beneficiaryName: 'ABC Trading Company Ltd.',
          applicantName: bill.applicant_name || 'XYZ Imports Pvt. Ltd.',
          issuingBank: bill.issuing_bank || 'Standard Bank International',
          documents: [
            {
              id: '1',
              name: 'Commercial Invoice.pdf',
              type: 'PDF',
              size: '2.4 MB',
              uploadedDate: bill.bill_date || new Date().toISOString().split('T')[0]
            },
            {
              id: '2',
              name: 'Bill of Lading.pdf',
              type: 'PDF',
              size: '1.8 MB',
              uploadedDate: bill.bill_date || new Date().toISOString().split('T')[0]
            },
            {
              id: '3',
              name: 'Packing List.pdf',
              type: 'PDF',
              size: '1.2 MB',
              uploadedDate: bill.bill_date || new Date().toISOString().split('T')[0]
            }
          ],
          discrepancies: [
            {
              id: '1',
              type: 'Document Discrepancy',
              description: 'Invoice amount exceeds LC amount by USD 5,000',
              severity: 'High'
            },
            {
              id: '2',
              type: 'Date Discrepancy',
              description: 'Bill of Lading date is later than LC expiry date',
              severity: 'Medium'
            }
          ]
        };
        
        setFormData(prev => ({
          ...prev,
          billData: mockBillData
        }));
        
        toast({
          title: "Success",
          description: "Bill details retrieved and auto-populated successfully",
        });
      } else {
        toast({
          title: "Not Found",
          description: "No presented or submitted bill found with this reference number",
          variant: "destructive",
        });
        
        setFormData(prev => ({
          ...prev,
          billData: undefined
        }));
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to retrieve bill details",
        variant: "destructive",
      });
      
      setFormData(prev => ({
        ...prev,
        billData: undefined
      }));
    } finally {
      setIsSearching(false);
    }
  };

  const handleDecisionChange = (decision: 'accept' | 'refuse') => {
    setFormData(prev => ({
      ...prev,
      decision
    }));
  };

  const handleDocumentPreview = (doc: any) => {
    console.log('Preview document:', doc);
    toast({
      title: "Document Preview",
      description: `Opening ${doc.name} for preview`,
    });
  };

  const handleDocumentDownload = (doc: any) => {
    console.log('Download document:', doc);
    toast({
      title: "Download Started",
      description: `Downloading ${doc.name}`,
    });
  };

  const handleSubmit = async () => {
    if (!formData.billData) {
      toast({
        title: "Error",
        description: "Please search for a bill first",
        variant: "destructive",
      });
      return;
    }

    if (!formData.decision) {
      toast({
        title: "Error",
        description: "Please select Accept or Refuse",
        variant: "destructive",
      });
      return;
    }

    if (!formData.remarks.trim()) {
      toast({
        title: "Error",
        description: "Please provide remarks for your decision",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting decision:', formData);
      
      // TODO: Implement actual submission logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: `Bill ${formData.decision === 'accept' ? 'accepted' : 'refused'} successfully`,
      });
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Failed to submit decision",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-800 flex h-screen w-screen overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-600 pb-4 mb-6 px-6 pt-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Import LC Bill - Accept/Refuse
            </h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden px-6">
          <ScrollArea className="h-full">
            <div className="space-y-6">
              {/* Bill Search Section */}
              <Card className="border border-corporate-blue-100 dark:border-corporate-blue-800 shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-corporate-blue-600 dark:text-corporate-blue-300">
                    Search Bill Reference
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Bill Reference Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={formData.billReference}
                        onChange={(e) => setFormData(prev => ({ ...prev, billReference: e.target.value }))}
                        placeholder="Enter Bill Reference Number..."
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleSearch}
                        disabled={isSearching || !formData.billReference.trim()}
                        className="bg-corporate-blue hover:bg-corporate-blue/90 text-white px-6"
                      >
                        {isSearching ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bill Details Section */}
              {formData.billData && (
                <>
                  <Card className="border border-gray-200 dark:border-gray-600 shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Bill Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Bill Amount</div>
                            <div className="font-semibold">{formData.billData.currency} {formData.billData.billAmount.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Bill Received Date</div>
                            <div className="font-semibold">{formData.billData.billReceivedDate}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-orange-600" />
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Bill Due Date</div>
                            <div className="font-semibold">{formData.billData.billDueDate}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Payment Terms</div>
                          <div className="font-semibold">{formData.billData.paymentTerms}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">LC Type</div>
                          <div className="font-semibold">{formData.billData.lcType}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">LC Reference</div>
                          <div className="font-semibold">{formData.billData.lcReference}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Beneficiary</div>
                          <div className="font-semibold">{formData.billData.beneficiaryName}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Applicant</div>
                          <div className="font-semibold">{formData.billData.applicantName}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Issuing Bank</div>
                          <div className="font-semibold">{formData.billData.issuingBank}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Documents Section */}
                  <Card className="border border-gray-200 dark:border-gray-600 shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Submitted Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {formData.billData.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-blue-600" />
                              <div>
                                <div className="font-medium text-gray-800 dark:text-gray-200">{doc.name}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {doc.size} • Uploaded: {doc.uploadedDate}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDocumentPreview(doc)}
                                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Preview
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDocumentDownload(doc)}
                                className="border-green-300 text-green-600 hover:bg-green-50"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Discrepancies Section */}
                  <Card className="border border-red-200 dark:border-red-600 shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Discrepancies Observed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {formData.billData.discrepancies.length === 0 ? (
                        <div className="text-center py-6 text-gray-600 dark:text-gray-400">
                          No discrepancies found
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {formData.billData.discrepancies.map((discrepancy) => (
                            <div key={discrepancy.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <div className="font-medium text-gray-800 dark:text-gray-200">
                                  {discrepancy.type}
                                </div>
                                <Badge className={getSeverityColor(discrepancy.severity)}>
                                  {discrepancy.severity}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {discrepancy.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Decision Section */}
                  <Card className="border border-amber-200 dark:border-amber-600 shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                        Accept/Refuse Decision
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                          Decision <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex gap-4">
                          <Button
                            variant={formData.decision === 'accept' ? 'default' : 'outline'}
                            onClick={() => handleDecisionChange('accept')}
                            className={formData.decision === 'accept' ? 
                              'bg-green-600 hover:bg-green-700 text-white' : 
                              'border-green-300 text-green-600 hover:bg-green-50'
                            }
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            variant={formData.decision === 'refuse' ? 'default' : 'outline'}
                            onClick={() => handleDecisionChange('refuse')}
                            className={formData.decision === 'refuse' ? 
                              'bg-red-600 hover:bg-red-700 text-white' : 
                              'border-red-300 text-red-600 hover:bg-red-50'
                            }
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Refuse
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Remarks <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          value={formData.remarks}
                          onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                          placeholder="Please provide detailed remarks for your decision..."
                          rows={4}
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 px-6 pb-6">
          <div className="flex justify-end items-center pt-6 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
            <div className="flex gap-3 items-center">
              <Button
                onClick={onBack}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Back
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={!formData.billData || !formData.decision || !formData.remarks.trim() || isSubmitting}
                className="bg-corporate-blue hover:bg-corporate-blue/90 text-white disabled:opacity-50 disabled:cursor-not-allowed px-8"
              >
                {isSubmitting ? 'Submitting...' : `Submit ${formData.decision ? (formData.decision === 'accept' ? 'Acceptance' : 'Refusal') : 'Decision'}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportLCBillAcceptRefuseForm;
