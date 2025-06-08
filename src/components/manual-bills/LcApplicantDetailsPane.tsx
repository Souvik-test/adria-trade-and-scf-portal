
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

interface LcApplicantDetailsPaneProps {
  lcReference: string;
  setLcReference: (value: string) => void;
  corporateReference: string;
  lcCurrency: string;
  setLcCurrency: (value: string) => void;
  applicantName: string;
  setApplicantName: (value: string) => void;
  onLcSearch: () => void;
}

const LcApplicantDetailsPane: React.FC<LcApplicantDetailsPaneProps> = ({
  lcReference,
  setLcReference,
  corporateReference,
  lcCurrency,
  setLcCurrency,
  applicantName,
  setApplicantName,
  onLcSearch
}) => {
  return (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <Card className="border border-gray-200 dark:border-gray-600 h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
            LC & Applicant Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">LC Reference Number</Label>
              <div className="relative mt-1">
                <Input 
                  value={lcReference}
                  onChange={(e) => setLcReference(e.target.value)}
                  placeholder="Enter LC Reference"
                  className="pr-10"
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
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Corporate Reference Number</Label>
              <Input readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" value={corporateReference} />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">LC Currency</Label>
              <Select value={lcCurrency} onValueChange={setLcCurrency}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">LC Amount</Label>
              <Input readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">LC Expiry Place</Label>
              <Input readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">LC Expiry Date</Label>
              <Input type="date" readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Applicant Name</Label>
              <Input 
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="mt-1" 
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Issuing Bank</Label>
              <Input readOnly className="mt-1 bg-gray-100 dark:bg-gray-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
};

export default LcApplicantDetailsPane;
