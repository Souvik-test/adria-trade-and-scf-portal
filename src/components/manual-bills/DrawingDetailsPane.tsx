
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DrawingDetailsPaneProps {
  drawingAmount: string;
  setDrawingAmount: (value: string) => void;
  tenorType: string;
  setTenorType: (value: string) => void;
  tenorDays: string;
  setTenorDays: (value: string) => void;
}

const DrawingDetailsPane: React.FC<DrawingDetailsPaneProps> = ({
  drawingAmount,
  setDrawingAmount,
  tenorType,
  setTenorType,
  tenorDays,
  setTenorDays
}) => {
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
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drawing Amount</Label>
              <Input 
                value={drawingAmount}
                onChange={(e) => setDrawingAmount(e.target.value)}
                placeholder="Enter drawing amount"
                className="mt-1" 
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drawing Currency</Label>
              <Select>
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
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drawing Date</Label>
              <Input type="date" className="mt-1" />
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
          {tenorType === 'usance' && (
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tenor Days</Label>
                <Input 
                  value={tenorDays}
                  onChange={(e) => setTenorDays(e.target.value)}
                  placeholder="Enter tenor days"
                  className="mt-1" 
                />
              </div>
            </div>
          )}
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
