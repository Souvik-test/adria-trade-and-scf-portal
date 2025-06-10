
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

interface FinanceDetailsPaneProps {
  financeRequestType: string;
  setFinanceRequestType: (value: string) => void;
  financeProductType: string;
  setFinanceProductType: (value: string) => void;
  financeCurrency: string;
  setFinanceCurrency: (value: string) => void;
  financeAmountRequested: string;
  setFinanceAmountRequested: (value: string) => void;
  financeRequestDate: string;
  setFinanceRequestDate: (value: string) => void;
  financeTenureDays: string;
  setFinanceTenureDays: (value: string) => void;
  financeDueDate: string;
  setFinanceDueDate: (value: string) => void;
  interestRate: string;
  setInterestRate: (value: string) => void;
  interestCurrency: string;
  interestAmount: string;
  purposeOfFinance: string;
  setPurposeOfFinance: (value: string) => void;
}

const FinanceDetailsPane: React.FC<FinanceDetailsPaneProps> = ({
  financeRequestType,
  setFinanceRequestType,
  financeProductType,
  setFinanceProductType,
  financeCurrency,
  setFinanceCurrency,
  financeAmountRequested,
  setFinanceAmountRequested,
  financeRequestDate,
  setFinanceRequestDate,
  financeTenureDays,
  setFinanceTenureDays,
  financeDueDate,
  setFinanceDueDate,
  interestRate,
  setInterestRate,
  interestCurrency,
  interestAmount,
  purposeOfFinance,
  setPurposeOfFinance
}) => {
  // Calculate finance due date when request date and tenure change
  useEffect(() => {
    if (financeRequestDate && financeTenureDays) {
      const requestDate = new Date(financeRequestDate);
      const dueDate = new Date(requestDate);
      dueDate.setDate(dueDate.getDate() + parseInt(financeTenureDays));
      setFinanceDueDate(dueDate.toISOString().split('T')[0]);
    }
  }, [financeRequestDate, financeTenureDays, setFinanceDueDate]);

  return (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <Card className="border border-gray-200 dark:border-gray-600 h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
            Finance Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Finance Request Type <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="financeRequestType"
                    value="partial"
                    checked={financeRequestType === 'partial'}
                    onChange={(e) => setFinanceRequestType(e.target.value)}
                    className="w-4 h-4 text-corporate-teal-500"
                  />
                  <span className="text-sm">Partial</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="financeRequestType"
                    value="full"
                    checked={financeRequestType === 'full'}
                    onChange={(e) => setFinanceRequestType(e.target.value)}
                    className="w-4 h-4 text-corporate-teal-500"
                  />
                  <span className="text-sm">Full</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Finance Product Type
              </Label>
              <Select value={financeProductType} onValueChange={setFinanceProductType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="export-financing">Export Financing</SelectItem>
                  <SelectItem value="pre-shipment">Pre-shipment Finance</SelectItem>
                  <SelectItem value="post-shipment">Post-shipment Finance</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Depends on Finance Product Type defined at Bank's back office</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Finance Currency <span className="text-red-500">*</span>
              </Label>
              <Select value={financeCurrency} onValueChange={setFinanceCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                  <SelectItem value="AED">AED</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Defaulted to Bill Currency</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Finance Amount Requested <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={financeAmountRequested}
                onChange={(e) => setFinanceAmountRequested(e.target.value)}
                placeholder="0.00"
                maxLength={15}
                disabled={financeRequestType === 'full'}
              />
              <p className="text-xs text-gray-500">
                {financeRequestType === 'partial' 
                  ? "If Finance Request Type is 'Partial' then this field should be editable"
                  : "If Finance Request Type is 'Full' then this field should be read only"
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Finance Request Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={financeRequestDate}
                onChange={(e) => setFinanceRequestDate(e.target.value)}
              />
              <p className="text-xs text-gray-500">Defaulted to Current Date but users will be able to edit</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Finance Tenure (Days) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={financeTenureDays}
                onChange={(e) => setFinanceTenureDays(e.target.value)}
                placeholder="0"
                min="0"
                max="365"
                maxLength={3}
              />
              <p className="text-xs text-gray-500">Optional: 0-365</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Finance Due Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={financeDueDate}
                readOnly
                className="bg-gray-100 dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500">Should be auto-calculated as [Finance Request Date + Numeric Value of Finance Tenure]</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Interest Rate (%)
              </Label>
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="0.00"
                step="0.01"
                max="99.99"
              />
              <p className="text-xs text-gray-500">Editable or auto-filled based on bank setup</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Interest Currency
              </Label>
              <Input
                value={interestCurrency}
                readOnly
                className="bg-gray-100 dark:bg-gray-700"
                maxLength={3}
              />
              <p className="text-xs text-gray-500">Should be defaulted to Finance currency and not editable if Interest Rate is mentioned</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Interest Amount
              </Label>
              <Input
                value={interestAmount}
                readOnly
                className="bg-gray-100 dark:bg-gray-700"
                maxLength={15}
              />
              <p className="text-xs text-gray-500">It will be calculated as following formula and read only Formula: [(Requested Finance Amount * Interest Rate * Finance Tenure)/100]</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Purpose of Finance
            </Label>
            <Textarea
              value={purposeOfFinance}
              onChange={(e) => setPurposeOfFinance(e.target.value)}
              placeholder="Enter purpose of finance"
              maxLength={255}
              rows={3}
            />
            <p className="text-xs text-gray-500">Narrative text box</p>
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
};

export default FinanceDetailsPane;
