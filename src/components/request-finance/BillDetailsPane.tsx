
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

interface BillDetailsPaneProps {
  billReference: string;
  setBillReference: (value: string) => void;
  lcReference: string;
  setLcReference: (value: string) => void;
  billCurrency: string;
  setBillCurrency: (value: string) => void;
  billAmount: string;
  setBillAmount: (value: string) => void;
  billDueDate: string;
  setBillDueDate: (value: string) => void;
  onBillSearch: () => void;
  isSearching?: boolean;
}

const BillDetailsPane: React.FC<BillDetailsPaneProps> = ({
  billReference,
  setBillReference,
  lcReference,
  setLcReference,
  billCurrency,
  setBillCurrency,
  billAmount,
  setBillAmount,
  billDueDate,
  setBillDueDate,
  onBillSearch,
  isSearching = false
}) => {
  return (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <Card className="border border-gray-200 dark:border-gray-600 h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
            Bill Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bill Reference <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  value={billReference}
                  onChange={(e) => setBillReference(e.target.value)}
                  placeholder="Search or enter bill reference"
                  className="flex-1"
                  maxLength={16}
                />
                <Button 
                  onClick={onBillSearch}
                  disabled={!billReference.trim() || isSearching}
                  className="px-4 bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white disabled:opacity-50"
                >
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">Either LC or Bill Reference is mandatory to select</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                LC Reference
              </Label>
              <Input
                value={lcReference}
                onChange={(e) => setLcReference(e.target.value)}
                className="bg-gray-100 dark:bg-gray-700"
                maxLength={16}
                readOnly
              />
              <p className="text-xs text-gray-500">LC no. will be auto-populated</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bill Currency <span className="text-red-500">*</span>
              </Label>
              <Select value={billCurrency} onValueChange={setBillCurrency}>
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
              <p className="text-xs text-gray-500">Currency will be auto-selected based on Bill ref</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bill Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="0.00"
                maxLength={15}
                readOnly
                className="bg-gray-100 dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500">Amount will be auto-populated based on Bill ref</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bill Due Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={billDueDate}
                onChange={(e) => setBillDueDate(e.target.value)}
                readOnly
                className="bg-gray-100 dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500">Date will be auto-populated based on Bill ref</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
};

export default BillDetailsPane;
