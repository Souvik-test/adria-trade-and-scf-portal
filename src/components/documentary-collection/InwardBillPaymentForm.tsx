import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Upload, X } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import SwiftTagLabel from '../import-lc/SwiftTagLabel';

interface InwardBillPaymentFormData {
  // SWIFT MT 400/416 Fields
  transactionReference: string;
  relatedReference: string;
  paymentDate: Date | null;
  currency: string;
  amount: string;
  
  // Party Information
  orderingCustomerName: string;
  orderingCustomerAddress: string;
  orderingCustomerAccount: string;
  
  advisingBankName: string;
  advisingBankAddress: string;
  advisingBankSwiftCode: string;
  
  beneficiaryName: string;
  beneficiaryAddress: string;
  beneficiaryAccount: string;
  
  // Additional Information
  remittanceInformation: string;
  senderToReceiverInfo: string;
  
  // Collection Details
  collectionReference: string;
  billReference: string;
  draweeName: string;
  drawerName: string;
}

interface InwardBillPaymentFormProps {
  onBack: () => void;
  onCancel: () => void;
}

const InwardBillPaymentForm: React.FC<InwardBillPaymentFormProps> = ({
  onBack,
  onCancel
}) => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<InwardBillPaymentFormData>({
    defaultValues: {
      currency: 'USD',
      paymentDate: null
    }
  });

  const paymentDate = watch('paymentDate');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: InwardBillPaymentFormData, status: 'draft' | 'submitted') => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to save bill payment
      console.log('Submitting bill payment:', { ...data, status, files: uploadedFiles });
      
      toast({
        title: status === 'draft' ? 'Saved as Draft' : 'Submitted Successfully',
        description: `Inward documentary collection bill payment has been ${status === 'draft' ? 'saved' : 'submitted'}.`,
      });
      
      if (status === 'submitted') {
        onBack();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save bill payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD'];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inward Documentary Collection - Bill Payment
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manual entry for inward documentary collection bill payment (SWIFT MT 400/416)
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => onSubmit(data, 'submitted'))} className="space-y-6">
        {/* Transaction Information */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SwiftTagLabel tag=":20" label="Transaction Reference" />
                <Input
                  {...register('transactionReference', { required: 'Transaction reference is required' })}
                  placeholder="Enter transaction reference"
                />
                {errors.transactionReference && (
                  <p className="text-sm text-red-600 mt-1">{errors.transactionReference.message}</p>
                )}
              </div>

              <div>
                <SwiftTagLabel tag=":21" label="Related Reference" />
                <Input
                  {...register('relatedReference')}
                  placeholder="Enter related reference"
                />
              </div>

              <div>
                <SwiftTagLabel tag=":32A" label="Payment Date" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !paymentDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {paymentDate ? format(paymentDate, "PPP") : "Select payment date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={paymentDate || undefined}
                      onSelect={(date) => setValue('paymentDate', date || null)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <SwiftTagLabel tag=":32A" label="Currency" />
                <Select value={watch('currency')} onValueChange={(value) => setValue('currency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <SwiftTagLabel tag=":32A" label="Amount" />
                <Input
                  {...register('amount', { required: 'Amount is required' })}
                  placeholder="Enter amount"
                  type="number"
                  step="0.01"
                />
                {errors.amount && (
                  <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ordering Customer */}
        <Card>
          <CardHeader>
            <CardTitle>Ordering Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <SwiftTagLabel tag=":50" label="Ordering Customer Name" />
              <Input
                {...register('orderingCustomerName', { required: 'Ordering customer name is required' })}
                placeholder="Enter ordering customer name"
              />
              {errors.orderingCustomerName && (
                <p className="text-sm text-red-600 mt-1">{errors.orderingCustomerName.message}</p>
              )}
            </div>

            <div>
              <SwiftTagLabel tag=":50" label="Ordering Customer Address" />
              <Textarea
                {...register('orderingCustomerAddress')}
                placeholder="Enter ordering customer address"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <SwiftTagLabel tag=":50" label="Ordering Customer Account" />
              <Input
                {...register('orderingCustomerAccount')}
                placeholder="Enter ordering customer account"
              />
            </div>
          </CardContent>
        </Card>

        {/* Advising Bank */}
        <Card>
          <CardHeader>
            <CardTitle>Advising Bank Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <SwiftTagLabel tag=":57A/D" label="Advising Bank Name" />
              <Input
                {...register('advisingBankName')}
                placeholder="Enter advising bank name"
              />
            </div>

            <div>
              <SwiftTagLabel tag=":57A/D" label="Advising Bank Address" />
              <Textarea
                {...register('advisingBankAddress')}
                placeholder="Enter advising bank address"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <SwiftTagLabel tag=":57A/D" label="Advising Bank SWIFT Code" />
              <Input
                {...register('advisingBankSwiftCode')}
                placeholder="Enter SWIFT code"
              />
            </div>
          </CardContent>
        </Card>

        {/* Beneficiary */}
        <Card>
          <CardHeader>
            <CardTitle>Beneficiary Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <SwiftTagLabel tag=":59" label="Beneficiary Name" />
              <Input
                {...register('beneficiaryName', { required: 'Beneficiary name is required' })}
                placeholder="Enter beneficiary name"
              />
              {errors.beneficiaryName && (
                <p className="text-sm text-red-600 mt-1">{errors.beneficiaryName.message}</p>
              )}
            </div>

            <div>
              <SwiftTagLabel tag=":59" label="Beneficiary Address" />
              <Textarea
                {...register('beneficiaryAddress')}
                placeholder="Enter beneficiary address"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <SwiftTagLabel tag=":59" label="Beneficiary Account" />
              <Input
                {...register('beneficiaryAccount')}
                placeholder="Enter beneficiary account"
              />
            </div>
          </CardContent>
        </Card>

        {/* Collection Details */}
        <Card>
          <CardHeader>
            <CardTitle>Collection Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="collectionReference">Collection Reference</Label>
                <Input
                  {...register('collectionReference')}
                  placeholder="Enter collection reference"
                />
              </div>

              <div>
                <Label htmlFor="billReference">Bill Reference</Label>
                <Input
                  {...register('billReference')}
                  placeholder="Enter bill reference"
                />
              </div>

              <div>
                <Label htmlFor="draweeName">Drawee Name</Label>
                <Input
                  {...register('draweeName')}
                  placeholder="Enter drawee name"
                />
              </div>

              <div>
                <Label htmlFor="drawerName">Drawer Name</Label>
                <Input
                  {...register('drawerName')}
                  placeholder="Enter drawer name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <SwiftTagLabel tag=":70" label="Remittance Information" />
              <Textarea
                {...register('remittanceInformation')}
                placeholder="Enter remittance information"
                className="min-h-[100px]"
              />
            </div>

            <div>
              <SwiftTagLabel tag=":72" label="Sender to Receiver Information" />
              <Textarea
                {...register('senderToReceiverInfo')}
                placeholder="Enter sender to receiver information"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Supporting Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fileUpload">Upload Documents</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    id="fileUpload"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('fileUpload')?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files:</Label>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InwardBillPaymentForm;