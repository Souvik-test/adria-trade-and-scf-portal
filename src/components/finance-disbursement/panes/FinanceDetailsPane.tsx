import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateFinanceTenor, calculateInterest, convertCurrency } from '@/services/financeDisbursementService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FinanceDetailsPaneProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
}

const FinanceDetailsPane: React.FC<FinanceDetailsPaneProps> = ({
  formData,
  onFieldChange
}) => {
  const showExchangeRate = formData.invoiceCurrency !== formData.financeCurrency;
  const isAdvance = formData.interestTreatment === 'advance';
  const isFromClientAccount = formData.interestDeductionMethod === 'client_account';

  // Auto-calculate finance tenor and due date WITH GRACE PERIOD
  useEffect(() => {
    if (formData.selectedInvoices.length > 0 && formData.financeDate) {
      // Find invoice with latest due date
      const latestDueDate = new Date(
        Math.max(...formData.selectedInvoices.map((inv: any) => new Date(inv.due_date).getTime()))
      );
      
      // Calculate tenor from finance date to invoice due date
      const financeDate = new Date(formData.financeDate);
      const tenorDays = Math.ceil(
        (latestDueDate.getTime() - financeDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      onFieldChange('financeTenorDays', tenorDays);
      
      // Calculate finance due date = invoice due date + grace period + holiday treatment
      const graceDays = formData.graceDays || 0;
      const holidayTreatment = formData.holidayTreatment || 'No Change';
      
      const dueDate = new Date(latestDueDate);
      dueDate.setDate(dueDate.getDate() + graceDays);
      
      // Apply holiday treatment (simplified - check weekends)
      if (holidayTreatment !== 'No Change') {
        const day = dueDate.getDay();
        if (day === 0 || day === 6) { // Weekend
          if (holidayTreatment === 'Next Business Day') {
            while (dueDate.getDay() === 0 || dueDate.getDay() === 6) {
              dueDate.setDate(dueDate.getDate() + 1);
            }
          } else if (holidayTreatment === 'Previous Business Day') {
            while (dueDate.getDay() === 0 || dueDate.getDay() === 6) {
              dueDate.setDate(dueDate.getDate() - 1);
            }
          }
        }
      }
      
      onFieldChange('financeDueDate', dueDate);
    }
  }, [formData.selectedInvoices, formData.financeDate, formData.graceDays, formData.holidayTreatment]);

  // Auto-calculate finance amount with currency conversion AND finance percentage
  useEffect(() => {
    if (formData.selectedInvoices.length > 0) {
      const totalInvoiceAmount = formData.selectedInvoices.reduce((sum: number, inv: any) => sum + inv.amount, 0);
      
      // Apply finance percentage
      const maxFinanceAmount = totalInvoiceAmount * ((formData.financePercentage || 100) / 100);
      
      if (showExchangeRate && formData.exchangeRate) {
        const converted = convertCurrency(
          maxFinanceAmount,
          formData.invoiceCurrency,
          formData.financeCurrency,
          formData.exchangeRate
        );
        onFieldChange('financeAmount', converted.convertedAmount);
        onFieldChange('maxFinanceAmount', converted.convertedAmount);
      } else if (!showExchangeRate) {
        onFieldChange('financeAmount', maxFinanceAmount);
        onFieldChange('maxFinanceAmount', maxFinanceAmount);
      }
    }
  }, [formData.selectedInvoices, formData.exchangeRate, formData.financePercentage, showExchangeRate]);

  // Auto-calculate interest, proceeds, and total repayment based on interest treatment
  useEffect(() => {
    if (formData.financeAmount && formData.interestRate && formData.financeTenorDays) {
      const interest = calculateInterest(
        formData.financeAmount,
        formData.interestRate,
        formData.financeTenorDays
      );
      onFieldChange('interestAmount', interest);
      
      // Calculate total repayment amount
      // If Interest in Advance: repayment = finance amount only (interest already collected)
      // If Interest in Arrears: repayment = finance amount + interest
      const totalRepaymentAmount = isAdvance
        ? formData.financeAmount  // Interest already collected upfront
        : formData.financeAmount + interest;  // Interest collected at maturity
      onFieldChange('totalRepaymentAmount', totalRepaymentAmount);
      
      // Calculate proceeds amount
      // If Advance + From Proceeds: proceeds = finance amount - interest
      // If Advance + From Client Account: proceeds = finance amount (interest collected separately)
      // If Arrears: proceeds = finance amount (no deduction)
      const proceedsAmount = (isAdvance && !isFromClientAccount)
        ? formData.financeAmount - interest  // Deducted from proceeds
        : formData.financeAmount;  // Full amount (arrears OR advance from client account)
      onFieldChange('proceedsAmount', proceedsAmount);
    }
  }, [formData.financeAmount, formData.interestRate, formData.financeTenorDays, formData.interestTreatment, formData.interestDeductionMethod]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finance Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Finance Date *</Label>
            <Input
              type="date"
              value={formData.financeDate instanceof Date ? formData.financeDate.toISOString().split('T')[0] : ''}
              onChange={(e) => onFieldChange('financeDate', new Date(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Invoice Currency</Label>
            <Input value={formData.invoiceCurrency} disabled className="bg-muted" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Finance Currency *</Label>
            <Select value={formData.financeCurrency} onValueChange={(value) => onFieldChange('financeCurrency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showExchangeRate && (
            <div className="space-y-2">
              <Label>Exchange Rate * (1 {formData.invoiceCurrency} = X {formData.financeCurrency})</Label>
              <Input
                type="number"
                step="0.000001"
                value={formData.exchangeRate || ''}
                onChange={(e) => onFieldChange('exchangeRate', parseFloat(e.target.value))}
                placeholder="Enter exchange rate"
              />
            </div>
          )}
        </div>

        {showExchangeRate && !formData.exchangeRate && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Exchange rate is required when invoice currency differs from finance currency
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Finance Amount</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.financeAmount}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (value > (formData.maxFinanceAmount || 0)) {
                  toast.error(`Finance amount cannot exceed ${(formData.maxFinanceAmount || 0).toFixed(2)} (${formData.financePercentage}% of invoice amount)`);
                  return;
                }
                onFieldChange('financeAmount', value);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Maximum allowed: {(formData.maxFinanceAmount || 0).toFixed(2)} {formData.financeCurrency} 
              ({formData.financePercentage}% of invoice total)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Finance Tenor (Days)</Label>
            <Input type="number" value={formData.financeTenorDays} disabled className="bg-muted" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Finance Due Date</Label>
          <Input
            type="date"
            value={formData.financeDueDate instanceof Date ? formData.financeDueDate.toISOString().split('T')[0] : ''}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Calculated as: Invoice due date + {formData.graceDays} grace days
            {formData.holidayTreatment !== 'No Change' && ` (Holiday treatment: ${formData.holidayTreatment})`}
          </p>
        </div>

        <div className="border-t pt-4 space-y-4">
          <h4 className="font-semibold">Interest Calculation</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Interest Rate Type</Label>
              <Select value={formData.interestRateType} onValueChange={(value) => onFieldChange('interestRateType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Input</SelectItem>
                  <SelectItem value="reference_rate">Reference Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Interest Treatment</Label>
              <Select 
                value={formData.interestTreatment || 'arrears'} 
                onValueChange={(value) => {
                  onFieldChange('interestTreatment', value);
                  // Reset deduction method when switching away from advance
                  if (value !== 'advance') {
                    onFieldChange('interestDeductionMethod', 'proceeds');
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arrears">Interest in Arrears</SelectItem>
                  <SelectItem value="advance">Interest in Advance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conditional Interest Deduction Method for Advance */}
          {isAdvance && (
            <div className="space-y-2">
              <Label>Interest Deduction Method</Label>
              <Select 
                value={formData.interestDeductionMethod || 'proceeds'} 
                onValueChange={(value) => onFieldChange('interestDeductionMethod', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proceeds">From Proceeds</SelectItem>
                  <SelectItem value="client_account">From Client's Account</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {isFromClientAccount 
                  ? 'Interest will be debited from client\'s account separately' 
                  : 'Interest will be deducted from the disbursement proceeds'}
              </p>
            </div>
          )}

          {formData.interestRateType === 'manual' ? (
            <div className="space-y-2">
              <Label>Interest Rate (%) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.interestRate}
                onChange={(e) => onFieldChange('interestRate', parseFloat(e.target.value))}
                placeholder="e.g., 5.5"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reference Rate</Label>
                <Select value={formData.referenceRateCode} onValueChange={(value) => onFieldChange('referenceRateCode', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reference rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LIBOR">LIBOR</SelectItem>
                    <SelectItem value="EURIBOR">EURIBOR</SelectItem>
                    <SelectItem value="SOFR">SOFR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Margin (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.referenceRateMargin}
                  onChange={(e) => onFieldChange('referenceRateMargin', parseFloat(e.target.value))}
                />
              </div>
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Interest Amount:</span>
              <span className="font-medium">{formData.interestAmount.toFixed(2)} {formData.financeCurrency}</span>
            </div>
            
            {isAdvance && !isFromClientAccount && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Net Proceeds (after interest deduction):</span>
                <span className="font-medium text-primary">
                  {(formData.proceedsAmount || (formData.financeAmount - formData.interestAmount)).toFixed(2)} {formData.financeCurrency}
                </span>
              </div>
            )}
            
            {isAdvance && isFromClientAccount && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Net Proceeds:</span>
                  <span className="font-medium">{formData.financeAmount.toFixed(2)} {formData.financeCurrency}</span>
                </div>
                <div className="flex justify-between text-destructive">
                  <span className="text-sm">Interest Debit (from client account):</span>
                  <span className="font-medium">-{formData.interestAmount.toFixed(2)} {formData.financeCurrency}</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm font-semibold">Total Repayment Amount:</span>
              <span className="font-semibold text-lg">
                {formData.totalRepaymentAmount.toFixed(2)} {formData.financeCurrency}
                {isAdvance && <span className="text-xs text-muted-foreground ml-1">(Principal only)</span>}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceDetailsPane;
