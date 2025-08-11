import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, FileText, Download, Eye, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SwiftTagLabel from '../import-lc/SwiftTagLabel';

interface InwardBillAcceptRefuseFormProps {
  onBack: () => void;
  onCancel: () => void;
}

interface BillData {
  billReference: string;
  collectionReference: string;
  documentValue: string;
  currency: string;
  maturityDate: string;
  principalName: string;
  principalAddress: string;
  beneficiaryName: string;
  beneficiaryAddress: string;
  collectingBank: string;
  remittingBank: string;
  paymentTerms: string;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadDate: string;
  }>;
  discrepancies: Array<{
    id: string;
    type: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }>;
}

interface FormData {
  billSearchReference: string;
  decision: 'accept' | 'refuse' | '';
  remarks: string;
  internalNotes: string;
}

const InwardBillAcceptRefuseForm: React.FC<InwardBillAcceptRefuseFormProps> = ({ onBack, onCancel }) => {
  const { toast } = useToast();
  const [billData, setBillData] = useState<BillData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      billSearchReference: '',
      decision: '',
      remarks: '',
      internalNotes: ''
    }
  });

  const billSearchReference = watch('billSearchReference');
  const decision = watch('decision');

  const handleSearch = async () => {
    if (!billSearchReference.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a bill reference number to search.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      // TODO: Implement actual Supabase query when table is available
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demonstration, simulate finding the bill
      const mockBillData: BillData = {
        billReference: billSearchReference,
        collectionReference: `DC${Date.now()}`,
        documentValue: "150,000.00",
        currency: "USD",
        maturityDate: "2024-03-15",
        principalName: "ABC Trading Corporation",
        principalAddress: "123 Business Street\nNew York, NY 10001\nUSA",
        beneficiaryName: "XYZ International Ltd",
        beneficiaryAddress: "456 Commerce Road\nLondon, EC1A 1BB\nUK",
        collectingBank: "Standard Chartered Bank",
        remittingBank: "HSBC Bank USA",
        paymentTerms: "At sight",
        documents: [
          { id: '1', name: 'Commercial Invoice', type: 'Invoice', uploadDate: '2024-01-15' },
          { id: '2', name: 'Bill of Lading', type: 'Transport', uploadDate: '2024-01-15' },
          { id: '3', name: 'Packing List', type: 'Commercial', uploadDate: '2024-01-15' }
        ],
        discrepancies: [
          { id: '1', type: 'Document', description: 'Invoice amount mismatch', severity: 'high' },
          { id: '2', type: 'Date', description: 'Late presentation', severity: 'medium' }
        ]
      };

      setBillData(mockBillData);
      toast({
        title: "Bill Found",
        description: "Bill details loaded successfully.",
      });
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for bill. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleDecisionChange = (decision: 'accept' | 'refuse') => {
    setValue('decision', decision);
  };

  const handleDocumentPreview = (doc: any) => {
    toast({
      title: "Document Preview",
      description: `Opening preview for ${doc.name}`,
    });
  };

  const handleDocumentDownload = (doc: any) => {
    toast({
      title: "Document Download",
      description: `Downloading ${doc.name}`,
    });
  };

  const onSubmit = async (data: FormData) => {
    if (!billData) {
      toast({
        title: "No Bill Selected",
        description: "Please search and select a bill first.",
        variant: "destructive"
      });
      return;
    }

    if (!data.decision) {
      toast({
        title: "Decision Required",
        description: "Please select accept or refuse.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Submission Successful",
        description: `Bill ${data.decision === 'accept' ? 'accepted' : 'refused'} successfully.`,
      });
      
      onCancel();
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Failed to submit decision. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="w-full px-4 py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inward Documentary Collection - Bill Acceptance/Refusal
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manual entry for inward documentary collection bill acceptance/refusal
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Bill Search */}
        <Card>
          <CardHeader>
            <CardTitle>Bill Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <SwiftTagLabel tag=":20" label="Bill Reference Number" />
                <Input
                  {...register('billSearchReference', { required: 'Bill reference is required' })}
                  placeholder="Enter bill reference number"
                />
                {errors.billSearchReference && (
                  <p className="text-sm text-red-600 mt-1">{errors.billSearchReference.message}</p>
                )}
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching || !billSearchReference.trim()}
                  className="flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {billData && (
          <>
            {/* Bill Details */}
            <Card>
              <CardHeader>
                <CardTitle>Bill Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Collection Reference</Label>
                    <div className="text-sm font-medium">{billData.collectionReference}</div>
                  </div>
                  <div>
                    <Label>Document Value</Label>
                    <div className="text-sm font-medium">{billData.currency} {billData.documentValue}</div>
                  </div>
                  <div>
                    <Label>Maturity Date</Label>
                    <div className="text-sm font-medium">{billData.maturityDate}</div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Principal</Label>
                    <div className="text-sm font-medium">{billData.principalName}</div>
                    <div className="text-sm text-gray-600 whitespace-pre-line">{billData.principalAddress}</div>
                  </div>
                  <div>
                    <Label>Beneficiary</Label>
                    <div className="text-sm font-medium">{billData.beneficiaryName}</div>
                    <div className="text-sm text-gray-600 whitespace-pre-line">{billData.beneficiaryAddress}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Collecting Bank</Label>
                    <div className="text-sm font-medium">{billData.collectingBank}</div>
                  </div>
                  <div>
                    <Label>Remitting Bank</Label>
                    <div className="text-sm font-medium">{billData.remittingBank}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {billData.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-sm text-gray-600">{doc.type} • Uploaded: {doc.uploadDate}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDocumentPreview(doc)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDocumentDownload(doc)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Discrepancies */}
            {billData.discrepancies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    Discrepancies Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {billData.discrepancies.map((disc) => (
                      <Alert key={disc.id}>
                        <AlertDescription className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{disc.type}:</span> {disc.description}
                          </div>
                          <Badge variant={getSeverityColor(disc.severity)}>
                            {disc.severity}
                          </Badge>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Decision */}
            <Card>
              <CardHeader>
                <CardTitle>Decision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Accept or Refuse Bill</Label>
                  <RadioGroup
                    value={decision}
                    onValueChange={(value) => handleDecisionChange(value as 'accept' | 'refuse')}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="accept" id="accept" />
                      <Label htmlFor="accept" className="flex items-center gap-2 cursor-pointer">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Accept
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="refuse" id="refuse" />
                      <Label htmlFor="refuse" className="flex items-center gap-2 cursor-pointer">
                        <XCircle className="w-4 h-4 text-red-600" />
                        Refuse
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    {...register('remarks')}
                    placeholder="Enter remarks for the decision"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="internalNotes">Internal Notes (Optional)</Label>
                  <Textarea
                    {...register('internalNotes')}
                    placeholder="Enter internal notes"
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Form Actions */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Back
          </Button>
          
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting || !billData || !decision}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Decision'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InwardBillAcceptRefuseForm;