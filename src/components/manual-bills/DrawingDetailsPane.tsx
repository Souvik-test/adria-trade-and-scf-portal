
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { addDays, format, isValid, parse } from 'date-fns';

interface DrawingDetailsPaneProps {
  drawingCurrency: string;
  setDrawingCurrency: (value: string) => void;
  drawingAmount: string;
  setDrawingAmount: (value: string) => void;
  drawingDate: string;
  setDrawingDate: (value: string) => void;
  tenorType: string;
  setTenorType: (value: string) => void;
  tenorDays: string;
  setTenorDays: (value: string) => void;
  billDueDate: string;
  setBillDueDate: (value: string) => void;
}

const DrawingDetailsPane: React.FC<DrawingDetailsPaneProps> = ({
  drawingCurrency,
  setDrawingCurrency,
  drawingAmount,
  setDrawingAmount,
  drawingDate,
  setDrawingDate,
  tenorType,
  setTenorType,
  tenorDays,
  setTenorDays,
  billDueDate,
  setBillDueDate
}) => {
  // Auto-calculate Bill Due Date when Drawing Date, Tenor Type, or Tenor Days change
  useEffect(() => {
    if (drawingDate && tenorType) {
      const parsedDate = new Date(drawingDate);
      
      if (isValid(parsedDate)) {
        let calculatedDueDate: Date;
        
        if (tenorType === 'sight') {
          // For Sight: Drawing Date + 5 days
          calculatedDueDate = addDays(parsedDate, 5);
        } else if (tenorType === 'usance' && tenorDays) {
          // For Usance: Drawing Date + Tenor Days (extract numeric value)
          const numericDays = parseInt(tenorDays.replace(/\D/g, ''), 10);
          if (!isNaN(numericDays)) {
            calculatedDueDate = addDays(parsedDate, numericDays);
          } else {
            return; // Don't update if we can't extract a valid number
          }
        } else {
          return; // Don't update if conditions aren't met
        }
        
        // Format the calculated date as YYYY-MM-DD for the input field
        const formattedDate = format(calculatedDueDate, 'yyyy-MM-dd');
        setBillDueDate(formattedDate);
      }
    }
  }, [drawingDate, tenorType, tenorDays, setBillDueDate]);

  return (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <Card className="border border-gray-200 dark:border-gray-600 h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
            Drawing Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drawing Currency</Label>
              <Select value={drawingCurrency} onValueChange={setDrawingCurrency}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drawing Amount</Label>
              <Input 
                value={drawingAmount}
                onChange={(e) => setDrawingAmount(e.target.value)}
                placeholder="Enter drawing amount"
                className="mt-1" 
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drawing Date</Label>
              <Input 
                type="date" 
                value={drawingDate}
                onChange={(e) => setDrawingDate(e.target.value)}
                className="mt-1" 
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tenor Type</Label>
              <Select value={tenorType} onValueChange={setTenorType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select tenor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sight">Sight</SelectItem>
                  <SelectItem value="usance">Usance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {tenorType === 'usance' && (
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tenor Days</Label>
                <Input 
                  value={tenorDays}
                  onChange={(e) => setTenorDays(e.target.value)}
                  placeholder="Enter tenor days (e.g., 90)"
                  className="mt-1" 
                />
              </div>
            )}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bill Due Date</Label>
              <Input 
                type="date"
                value={billDueDate}
                onChange={(e) => setBillDueDate(e.target.value)}
                className="mt-1" 
              />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drawing Details</Label>
            <Textarea 
              className="mt-1" 
              rows={4}
              placeholder="Enter drawing details"
            />
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
};

export default DrawingDetailsPane;
