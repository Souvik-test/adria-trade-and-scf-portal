
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SubmissionSectionProps {
  submissionType: string;
  setSubmissionType: (value: string) => void;
  submissionReference: string;
  setSubmissionReference: (value: string) => void;
  submissionDate: Date | null;
  lcReferenceNumber: string;
  setLcReferenceNumber: (value: string) => void;
  corporateReference: string;
  setCorporateReference: (value: string) => void;
}

const SubmissionSection: React.FC<SubmissionSectionProps> = ({
  submissionType,
  setSubmissionType,
  submissionReference,
  setSubmissionReference,
  submissionDate,
  lcReferenceNumber,
  setLcReferenceNumber,
  corporateReference,
  setCorporateReference
}) => {
  const submissionTypes = ['Pre-Check', 'Final'];

  return (
    <Card className="border-0 shadow-none bg-background">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-orange-400 mb-6">Submission Type and Export LC Selection</h2>
      </div>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <Label htmlFor="submissionType" className="text-sm font-medium text-foreground">
              Submission Type <span className="text-red-500">*</span>
            </Label>
            <Select value={submissionType} onValueChange={setSubmissionType}>
              <SelectTrigger className="w-full h-12 border-orange-300 focus:border-orange-400">
                <SelectValue placeholder="Pre-Check" />
              </SelectTrigger>
              <SelectContent>
                {submissionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="submissionReference" className="text-sm font-medium text-foreground">
              Submission Reference
            </Label>
            <Input
              id="submissionReference"
              value={submissionReference}
              onChange={(e) => setSubmissionReference(e.target.value)}
              placeholder="Enter reference"
              className="w-full h-12 border-gray-300 focus:border-orange-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="submissionDate" className="text-sm font-medium text-foreground">
              Submission Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="submissionDate"
              value={submissionDate ? "07/06/2025" : ""}
              placeholder="07/06/2025"
              className="w-full h-12 border-gray-300 bg-gray-50"
              disabled
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="lcReference" className="text-sm font-medium text-foreground">
              LC Reference Number <span className="text-red-500">*</span>
            </Label>
            <Select value={lcReferenceNumber} onValueChange={setLcReferenceNumber}>
              <SelectTrigger className="w-full h-12 border-orange-300 focus:border-orange-400">
                <SelectValue placeholder="Select LC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LC001">LC001 - Sample LC</SelectItem>
                <SelectItem value="LC002">LC002 - Another LC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="corporateReference" className="text-sm font-medium text-foreground">
              Corporate Reference Number
            </Label>
            <Input
              id="corporateReference"
              value={corporateReference}
              onChange={(e) => setCorporateReference(e.target.value)}
              placeholder="Internal use only"
              className="w-full h-12 border-gray-300 focus:border-orange-400"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionSection;
