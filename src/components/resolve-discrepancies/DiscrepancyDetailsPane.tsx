
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DiscrepancyDetailsPaneProps {
  documentTypes: string[];
}

export const DiscrepancyDetailsPane: React.FC<DiscrepancyDetailsPaneProps> = ({
  documentTypes
}) => {
  return (
    <Card className="border border-gray-200 dark:border-gray-600 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-orange-500 dark:text-orange-400">
          Discrepancy Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Discrepancy Type</Label>
            <Input placeholder="Enter discrepancy type" className="mt-1" />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Document Type</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Discrepancy Description</Label>
          <Textarea 
            className="mt-1" 
            rows={4}
            placeholder="Enter discrepancy description (max 500 characters)"
            maxLength={500}
          />
        </div>
      </CardContent>
    </Card>
  );
};
