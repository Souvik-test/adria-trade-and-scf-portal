
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImportLCFormData } from '@/types/importLC';
import AmendmentFieldWrapper from './AmendmentFieldWrapper';

interface ImportLCAmendmentPartyPaneProps {
  formData: ImportLCFormData;
  originalData: ImportLCFormData;
  changes: Record<string, { original: any; current: any }>;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const ImportLCAmendmentPartyPane: React.FC<ImportLCAmendmentPartyPaneProps> = ({
  formData,
  originalData,
  changes,
  updateField
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Party Details - Amendment
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AmendmentFieldWrapper
            fieldName="applicantName"
            label="Applicant Name"
            hasChanged={!!changes.applicantName}
            originalValue={originalData.applicantName}
          >
            <Input
              value={formData.applicantName}
              onChange={(e) => updateField('applicantName', e.target.value)}
              placeholder="Enter applicant name"
            />
          </AmendmentFieldWrapper>

          <AmendmentFieldWrapper
            fieldName="beneficiaryName"
            label="Beneficiary Name"
            hasChanged={!!changes.beneficiaryName}
            originalValue={originalData.beneficiaryName}
          >
            <Input
              value={formData.beneficiaryName}
              onChange={(e) => updateField('beneficiaryName', e.target.value)}
              placeholder="Enter beneficiary name"
            />
          </AmendmentFieldWrapper>

          <div className="md:col-span-2">
            <AmendmentFieldWrapper
              fieldName="applicantAddress"
              label="Applicant Address"
              hasChanged={!!changes.applicantAddress}
              originalValue={originalData.applicantAddress}
            >
              <Textarea
                value={formData.applicantAddress}
                onChange={(e) => updateField('applicantAddress', e.target.value)}
                placeholder="Enter applicant address"
                rows={3}
              />
            </AmendmentFieldWrapper>
          </div>

          <div className="md:col-span-2">
            <AmendmentFieldWrapper
              fieldName="beneficiaryAddress"
              label="Beneficiary Address"
              hasChanged={!!changes.beneficiaryAddress}
              originalValue={originalData.beneficiaryAddress}
            >
              <Textarea
                value={formData.beneficiaryAddress}
                onChange={(e) => updateField('beneficiaryAddress', e.target.value)}
                placeholder="Enter beneficiary address"
                rows={3}
              />
            </AmendmentFieldWrapper>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportLCAmendmentPartyPane;
