
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImportLCFormData } from '@/types/importLC';

interface ApplicantInformationPaneProps {
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const ApplicantInformationPane: React.FC<ApplicantInformationPaneProps> = ({
  formData,
  updateField
}) => {
  return (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <div className="space-y-6 pr-4">
        <Card className="border border-gray-200 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
              Applicant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Applicant Name */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Applicant Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.applicantName}
                onChange={(e) => updateField('applicantName', e.target.value)}
                placeholder="Enter applicant name"
              />
            </div>

            {/* Applicant Address */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Applicant Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={formData.applicantAddress}
                onChange={(e) => updateField('applicantAddress', e.target.value)}
                placeholder="Enter complete applicant address"
                rows={4}
              />
            </div>

            {/* Applicant Account Number */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Applicant Account Number
              </Label>
              <Input
                value={formData.applicantAccountNumber}
                onChange={(e) => updateField('applicantAccountNumber', e.target.value)}
                placeholder="Enter account number"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default ApplicantInformationPane;
