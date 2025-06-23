
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BillReferenceSearchDropdown from './BillReferenceSearchDropdown';

interface ExportLCBill {
  id: string;
  bill_reference: string;
  lc_reference: string;
  corporate_reference: string;
  applicant_name: string;
  issuing_bank: string;
  status: string;
}

interface GeneralDetailsPaneProps {
  billReference: string;
  setBillReference: (value: string) => void;
  lcReference: string;
  setLcReference: (value: string) => void;
  corporateReference: string;
  setCorporateReference: (value: string) => void;
  applicantName: string;
  setApplicantName: (value: string) => void;
  issuingBank: string;
  setIssuingBank: (value: string) => void;
  discrepancyNotificationDate: string;
  setDiscrepancyNotificationDate: (value: string) => void;
  onBillSearch: () => void;
}

export const GeneralDetailsPane: React.FC<GeneralDetailsPaneProps> = ({
  billReference,
  setBillReference,
  lcReference,
  setLcReference,
  corporateReference,
  setCorporateReference,
  applicantName,
  setApplicantName,
  issuingBank,
  setIssuingBank,
  discrepancyNotificationDate,
  setDiscrepancyNotificationDate,
  onBillSearch
}) => {
  const handleBillSelect = (selectedBillReference: string, billData: ExportLCBill) => {
    console.log('Selected Bill:', selectedBillReference, billData);
    
    // Auto-populate fields based on selected bill
    setBillReference(selectedBillReference);
    setLcReference(billData.lc_reference || '');
    setCorporateReference(billData.corporate_reference || '');
    setApplicantName(billData.applicant_name || '');
    setIssuingBank(billData.issuing_bank || '');
  };

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
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bill Reference Number <span className="text-red-500">*</span>
            </Label>
            <div className="mt-1">
              <BillReferenceSearchDropdown
                value={billReference}
                onSelect={handleBillSelect}
                placeholder="Search and select Bill Reference..."
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">LC Reference Number</Label>
            <Input 
              value={lcReference}
              onChange={(e) => setLcReference(e.target.value)}
              readOnly
              className="mt-1 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              placeholder="Auto-populated from Bill"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Corporate Reference Number</Label>
            <Input 
              value={corporateReference}
              onChange={(e) => setCorporateReference(e.target.value)}
              readOnly 
              className="mt-1 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              placeholder="Auto-populated from Bill"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Buyer/Applicant Name</Label>
            <Input 
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              readOnly 
              className="mt-1 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              placeholder="Auto-populated from Bill"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Issuing Bank Name</Label>
            <Input 
              value={issuingBank}
              onChange={(e) => setIssuingBank(e.target.value)}
              readOnly 
              className="mt-1 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              placeholder="Auto-populated from Bill"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Discrepancy Notification Date</Label>
            <Input 
              type="date" 
              value={discrepancyNotificationDate}
              onChange={(e) => setDiscrepancyNotificationDate(e.target.value)}
              className="mt-1" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
