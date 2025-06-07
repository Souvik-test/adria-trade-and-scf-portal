
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface LcDetailsSectionProps {
  applicantName: string;
  setApplicantName: (value: string) => void;
  issuingBank: string;
  setIssuingBank: (value: string) => void;
  lcCurrency: string;
  setLcCurrency: (value: string) => void;
  lcAmount: string;
  setLcAmount: (value: string) => void;
  lcIssueDate: Date | null;
  setLcIssueDate: (value: Date | null) => void;
  lcExpiryDate: Date | null;
  setLcExpiryDate: (value: Date | null) => void;
  lcExpiryPlace: string;
  setLcExpiryPlace: (value: string) => void;
}

const LcDetailsSection: React.FC<LcDetailsSectionProps> = ({
  applicantName,
  setApplicantName,
  issuingBank,
  setIssuingBank,
  lcCurrency,
  setLcCurrency,
  lcAmount,
  setLcAmount,
  lcIssueDate,
  setLcIssueDate,
  lcExpiryDate,
  setLcExpiryDate,
  lcExpiryPlace,
  setLcExpiryPlace
}) => {
  return (
    <Card className="border-0 shadow-none bg-background">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-orange-400 mb-6">LC & Applicant Details</h2>
      </div>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="applicantName" className="text-sm font-medium text-foreground">
              Applicant Name
            </Label>
            <Input
              id="applicantName"
              value="Auto-populated"
              placeholder="Auto-populated"
              className="w-full h-12 border-gray-300 bg-gray-50"
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuingBank" className="text-sm font-medium text-foreground">
              Issuing Bank
            </Label>
            <Input
              id="issuingBank"
              value="Auto-populated"
              placeholder="Auto-populated"
              className="w-full h-12 border-gray-300 bg-gray-50"
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lcCurrency" className="text-sm font-medium text-foreground">
              LC Currency
            </Label>
            <Input
              id="lcCurrency"
              value="Auto-fetched"
              placeholder="Auto-fetched"
              className="w-full h-12 border-gray-300 bg-gray-50"
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lcAmount" className="text-sm font-medium text-foreground">
              LC Amount
            </Label>
            <Input
              id="lcAmount"
              value={lcAmount}
              onChange={(e) => setLcAmount(e.target.value)}
              placeholder="Format: 99999999999.99"
              className="w-full h-12 border-gray-300 focus:border-orange-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lcIssueDate" className="text-sm font-medium text-foreground">
              LC Issue Date
            </Label>
            <Input
              id="lcIssueDate"
              value="dd/mm/yyyy"
              placeholder="dd/mm/yyyy"
              className="w-full h-12 border-gray-300 bg-gray-50"
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lcExpiryDate" className="text-sm font-medium text-foreground">
              LC Expiry Date & Place
            </Label>
            <div className="flex gap-2">
              <Input
                id="lcExpiryDate"
                value="dd/mm/yyyy"
                placeholder="dd/mm/yyyy"
                className="flex-1 h-12 border-gray-300 bg-gray-50"
                disabled
              />
              <Input
                id="lcExpiryPlace"
                value={lcExpiryPlace}
                onChange={(e) => setLcExpiryPlace(e.target.value)}
                placeholder="Place"
                className="w-24 h-12 border-gray-300 focus:border-orange-400"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LcDetailsSection;
