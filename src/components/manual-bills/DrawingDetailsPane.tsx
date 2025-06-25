import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { addDays, format, isValid } from 'date-fns';
import { cn } from '@/lib/utils';

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
  lcCurrency?: string;
  lcAmount?: number;
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
  setBillDueDate,
  lcCurrency,
  lcAmount
}) => {
  // Auto-populate Drawing Currency and Amount from LC details
  useEffect(() => {
    if (lcCurrency && !drawingCurrency) {
      setDrawingCurrency(lcCurrency);
    }
  }, [lcCurrency, drawingCurrency, setDrawingCurrency]);

  useEffect(() => {
    if (lcAmount && !drawingAmount) {
      setDrawingAmount(lcAmount.toString());
    }
  }, [lcAmount, drawingAmount, setDrawingAmount]);

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
          const numericDays = parseInt(tenorDays, 10);
          if (!isNaN(numericDays) && numericDays > 0) {
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

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDrawingDate(format(date, 'yyyy-MM-dd'));
    }
  };

  const handleBillDueDateSelect = (date: Date | undefined) => {
    if (date) {
      setBillDueDate(format(date, 'yyyy-MM-dd'));
    }
  };

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
              {lcCurrency && (
                <p className="text-xs text-gray-500 mt-1">Auto-populated from LC Currency</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drawing Amount</Label>
              <Input 
                value={drawingAmount}
                onChange={(e) => setDrawingAmount(e.target.value)}
                placeholder="Enter drawing amount"
                className="mt-1" 
              />
              {lcAmount && (
                <p className="text-xs text-gray-500 mt-1">Auto-populated from LC Amount</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drawing Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "mt-1 w-full justify-start text-left font-normal",
                      !drawingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {drawingDate ? format(new Date(drawingDate), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={drawingDate ? new Date(drawingDate) : undefined}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
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
                  type="number"
                  value={tenorDays}
                  onChange={(e) => setTenorDays(e.target.value)}
                  placeholder="Enter tenor days (e.g., 90)"
                  className="mt-1"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">Enter number of days for usance period</p>
              </div>
            )}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bill Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "mt-1 w-full justify-start text-left font-normal",
                      !billDueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {billDueDate ? format(new Date(billDueDate), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={billDueDate ? new Date(billDueDate) : undefined}
                    onSelect={handleBillDueDateSelect}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500 mt-1">
                {tenorType === 'sight' 
                  ? 'Auto-calculated based on drawing date + 5 days' 
                  : 'Auto-calculated based on drawing date + tenor days'
                }
              </p>
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
