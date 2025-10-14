import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface UploadTypeSelectorProps {
  value: 'single' | 'bulk';
  onChange: (value: 'single' | 'bulk') => void;
}

const UploadTypeSelector: React.FC<UploadTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3 mb-6">
      <Label className="text-sm font-medium text-foreground">Upload Type</Label>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as 'single' | 'bulk')}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="single" id="single" />
          <Label htmlFor="single" className="cursor-pointer font-normal">
            Upload Single Invoice
            <span className="block text-xs text-muted-foreground">1 row Excel file</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="bulk" id="bulk" />
          <Label htmlFor="bulk" className="cursor-pointer font-normal">
            Upload Bulk Invoices
            <span className="block text-xs text-muted-foreground">Up to 100 rows</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default UploadTypeSelector;
