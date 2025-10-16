import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { InvoiceFormData } from '@/hooks/useInvoiceForm';
import { 
  calculateInvoiceTenorInDays, 
  calculateLimitUsage, 
  LimitUsage 
} from '@/services/invoiceManualValidationService';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface InvoiceSummaryPaneProps {
  formData: InvoiceFormData;
  updateField: (field: keyof InvoiceFormData, value: any) => void;
}

const InvoiceSummaryPane: React.FC<InvoiceSummaryPaneProps> = ({
  formData,
  updateField
}) => {
  const [tenorDays, setTenorDays] = useState<number>(0);
  const [limitUsage, setLimitUsage] = useState<LimitUsage | null>(null);
  const [tenorValid, setTenorValid] = useState<boolean>(true);
  const [currencyValid, setCurrencyValid] = useState<boolean>(true);

  useEffect(() => {
    // Calculate tenor
    const calculatedTenor = calculateInvoiceTenorInDays(formData.invoiceDate, formData.dueDate);
    setTenorDays(calculatedTenor);
    
    // Validate tenor
    if (
      formData.minTenorDays !== undefined && 
      formData.maxTenorDays !== undefined &&
      calculatedTenor >= 0
    ) {
      setTenorValid(
        calculatedTenor >= formData.minTenorDays && 
        calculatedTenor <= formData.maxTenorDays
      );
    }
    
    // Validate currency
    if (formData.programCurrency) {
      setCurrencyValid(formData.currency === formData.programCurrency);
    }
    
    // Calculate limit usage
    if (formData.programId && formData.buyerName && formData.sellerName) {
      calculateLimitUsage(
        formData.programId,
        formData.buyerName,
        formData.sellerName
      ).then(setLimitUsage);
    }
  }, [
    formData.invoiceDate, 
    formData.dueDate, 
    formData.minTenorDays, 
    formData.maxTenorDays,
    formData.currency,
    formData.programCurrency,
    formData.programId,
    formData.buyerName,
    formData.sellerName
  ]);

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getLimitStatus = (used: number, limit: number, requested: number) => {
    if (limit === 0) return { valid: true, color: 'text-gray-500' };
    const newTotal = used + requested;
    const isValid = newTotal <= limit;
    return {
      valid: isValid,
      color: isValid ? 'text-green-600' : 'text-red-600'
    };
  };

  return (
    <div className="space-y-6">
      {/* Validation Status */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Validation Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tenor Validation */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {getStatusIcon(tenorValid)}
                <span className="font-medium">Invoice Tenor</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {tenorDays >= 0 ? `${tenorDays} days` : 'Invalid dates'}
                {formData.minTenorDays !== undefined && formData.maxTenorDays !== undefined && (
                  <> (Required: {formData.minTenorDays}-{formData.maxTenorDays} days)</>
                )}
              </p>
            </div>
          </div>

          {/* Currency Validation */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {getStatusIcon(currencyValid)}
                <span className="font-medium">Currency Match</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Invoice: {formData.currency} | Program: {formData.programCurrency || 'N/A'}
              </p>
            </div>
          </div>

          {/* Limit Utilization */}
          {limitUsage && (
            <>
              {/* Counter Party Limit */}
              {limitUsage.counterPartyLimit > 0 && (
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(
                      getLimitStatus(
                        limitUsage.counterPartyUsed, 
                        limitUsage.counterPartyLimit, 
                        formData.totalAmount
                      ).valid
                    )}
                    <span className="font-medium">Counter Party Limit</span>
                  </div>
                  <p className={`text-sm ${getLimitStatus(
                    limitUsage.counterPartyUsed, 
                    limitUsage.counterPartyLimit, 
                    formData.totalAmount
                  ).color}`}>
                    Used: {limitUsage.counterPartyUsed.toFixed(2)} + Requested: {formData.totalAmount.toFixed(2)} = {(limitUsage.counterPartyUsed + formData.totalAmount).toFixed(2)}
                    <br />
                    Available: {limitUsage.counterPartyLimit.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Anchor Limit */}
              {limitUsage.anchorLimit > 0 && (
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(
                      getLimitStatus(
                        limitUsage.anchorUsed, 
                        limitUsage.anchorLimit, 
                        formData.totalAmount
                      ).valid
                    )}
                    <span className="font-medium">Anchor (Buyer) Limit</span>
                  </div>
                  <p className={`text-sm ${getLimitStatus(
                    limitUsage.anchorUsed, 
                    limitUsage.anchorLimit, 
                    formData.totalAmount
                  ).color}`}>
                    Used: {limitUsage.anchorUsed.toFixed(2)} + Requested: {formData.totalAmount.toFixed(2)} = {(limitUsage.anchorUsed + formData.totalAmount).toFixed(2)}
                    <br />
                    Available: {limitUsage.anchorLimit.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Program Limit */}
              {limitUsage.programLimit > 0 && (
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(
                      getLimitStatus(
                        limitUsage.programUsed, 
                        limitUsage.programLimit, 
                        formData.totalAmount
                      ).valid
                    )}
                    <span className="font-medium">Program Limit</span>
                  </div>
                  <p className={`text-sm ${getLimitStatus(
                    limitUsage.programUsed, 
                    limitUsage.programLimit, 
                    formData.totalAmount
                  ).color}`}>
                    Used: {limitUsage.programUsed.toFixed(2)} + Requested: {formData.totalAmount.toFixed(2)} = {(limitUsage.programUsed + formData.totalAmount).toFixed(2)}
                    <br />
                    Available: {limitUsage.programLimit.toFixed(2)}
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

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
              <Label>Buyer Name</Label>
              <Input
                value={formData.buyerName}
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            
            <div>
              <Label>Seller Name</Label>
              <Input
                value={formData.sellerName}
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
