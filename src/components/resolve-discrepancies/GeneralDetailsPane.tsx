
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface GeneralDetailsPaneProps {
  lcReference: string;
  setLcReference: (value: string) => void;
  billReference: string;
  setBillReference: (value: string) => void;
  onLcSearch: () => void;
  onBillSearch: () => void;
}

export const GeneralDetailsPane: React.FC<GeneralDetailsPaneProps> = ({
  lcReference,
  setLcReference,
  billReference,
  setBillReference,
  onLcSearch,
  onBillSearch
}) => {
  return (
    <Card className="border border-gray-200 dark:border-gray-600 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-corporate-teal-600 dark:text-corporate-teal-400">
          General Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">LC Reference Number</Label>
            <div className="relative mt-1">
              <Input 
                placeholder="Search LC Reference" 
                className="pr-10" 
                value={lcReference}
                onChange={(e) => setLcReference(e.target.value)}
              />
              <button 
                onClick={onLcSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded p-1 transition-colors"
              >
                <Search className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bill Reference Number</Label>
            <div className="relative mt-1">
              <Input 
                placeholder="Search Bill Reference" 
                className="pr-10" 
                value={billReference}
                onChange={(e) => setBillReference(e.target.value)}
              />
              <button 
                onClick={onBillSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded p-1 transition-colors"
              >
                <Search className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Corporate Reference Number</Label>
            <Input readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Buyer/Applicant Name</Label>
            <Input readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Issuing Bank Name</Label>
            <Input readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Discrepancy Notification Date</Label>
            <Input type="date" className="mt-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
