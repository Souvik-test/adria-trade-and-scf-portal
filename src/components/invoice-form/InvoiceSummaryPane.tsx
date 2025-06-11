
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { InvoiceFormData } from '@/hooks/useInvoiceForm';

interface InvoiceSummaryPaneProps {
  formData: InvoiceFormData;
  updateField: (field: keyof InvoiceFormData, value: any) => void;
}

const InvoiceSummaryPane: React.FC<InvoiceSummaryPaneProps> = ({
  formData,
  updateField
}) => {
  return (
    <div className="space-y-6">
      {/* Invoice Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Invoice Type</Label>
              <Input
                value={formData.invoiceType === 'invoice' ? 'Invoice' : 
                       formData.invoiceType === 'credit-note' ? 'Credit Note' : 'Debit Note'}
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            
            <div>
              <Label>Invoice Number</Label>
              <Input
                value={formData.invoiceNumber}
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            
            <div>
              <Label>Customer</Label>
              <Input
                value={formData.customerName}
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            
            <div>
              <Label>Currency</Label>
              <Input
                value={formData.currency}
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Subtotal</Label>
              <Input
                value={formData.subtotal.toFixed(2)}
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            
            <div>
              <Label>Tax Amount</Label>
              <Input
                value={formData.taxAmount.toFixed(2)}
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            
            <div>
              <Label htmlFor="discountAmount">Discount Amount</Label>
              <Input
                id="discountAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.discountAmount}
                onChange={(e) => updateField('discountAmount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <Label>Total Amount</Label>
              <Input
                value={formData.totalAmount.toFixed(2)}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 font-bold text-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Enter any additional notes"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceSummaryPane;
