
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImportLCFormData } from '@/types/importLC';
import AmendmentFieldWrapper from './AmendmentFieldWrapper';
import SwiftTagLabel from './SwiftTagLabel';

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
            Party Information - Amendment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AmendmentFieldWrapper
              fieldName="applicantName"
              label="Applicant Name"
              hasChanged={!!changes.applicantName}
              originalValue={originalData.applicantName}
            >
              <SwiftTagLabel tag=":50:" label="Applicant Name" required />
              <Input
                value={formData.applicantName}
                onChange={(e) => updateField('applicantName', e.target.value)}
                placeholder="Enter applicant name"
              />
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="applicantAccountNumber"
              label="Applicant Account Number"
              hasChanged={!!changes.applicantAccountNumber}
              originalValue={originalData.applicantAccountNumber}
            >
              <SwiftTagLabel tag=":50:" label="Applicant Account Number" />
              <Input
                value={formData.applicantAccountNumber}
                onChange={(e) => updateField('applicantAccountNumber', e.target.value)}
                placeholder="Enter account number"
              />
            </AmendmentFieldWrapper>
          </div>

          <AmendmentFieldWrapper
            fieldName="applicantAddress"
            label="Applicant Address"
            hasChanged={!!changes.applicantAddress}
            originalValue={originalData.applicantAddress}
          >
            <SwiftTagLabel tag=":50:" label="Applicant Address" />
            <Textarea
              value={formData.applicantAddress}
              onChange={(e) => updateField('applicantAddress', e.target.value)}
              placeholder="Enter applicant address"
              rows={3}
            />
          </AmendmentFieldWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AmendmentFieldWrapper
              fieldName="beneficiaryName"
              label="Beneficiary Name"
              hasChanged={!!changes.beneficiaryName}
              originalValue={originalData.beneficiaryName}
            >
              <SwiftTagLabel tag=":59:" label="Beneficiary Name" required />
              <Input
                value={formData.beneficiaryName}
                onChange={(e) => updateField('beneficiaryName', e.target.value)}
                placeholder="Enter beneficiary name"
              />
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="beneficiaryBankSwiftCode"
              label="Beneficiary Bank SWIFT Code"
              hasChanged={!!changes.beneficiaryBankSwiftCode}
              originalValue={originalData.beneficiaryBankSwiftCode}
            >
              <SwiftTagLabel tag=":57A:" label="Beneficiary Bank SWIFT Code" />
              <Input
                value={formData.beneficiaryBankSwiftCode}
                onChange={(e) => updateField('beneficiaryBankSwiftCode', e.target.value)}
                placeholder="Enter SWIFT code"
              />
            </AmendmentFieldWrapper>
          </div>

          <AmendmentFieldWrapper
            fieldName="beneficiaryAddress"
            label="Beneficiary Address"
            hasChanged={!!changes.beneficiaryAddress}
            originalValue={originalData.beneficiaryAddress}
          >
            <SwiftTagLabel tag=":59:" label="Beneficiary Address" />
            <Textarea
              value={formData.beneficiaryAddress}
              onChange={(e) => updateField('beneficiaryAddress', e.target.value)}
              placeholder="Enter beneficiary address"
              rows={3}
            />
          </AmendmentFieldWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AmendmentFieldWrapper
              fieldName="beneficiaryBankName"
              label="Beneficiary Bank Name"
              hasChanged={!!changes.beneficiaryBankName}
              originalValue={originalData.beneficiaryBankName}
            >
              <SwiftTagLabel tag=":57A:" label="Beneficiary Bank Name" />
              <Input
                value={formData.beneficiaryBankName}
                onChange={(e) => updateField('beneficiaryBankName', e.target.value)}
                placeholder="Enter bank name"
              />
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="advisingBankSwiftCode"
              label="Advising Bank SWIFT Code"
              hasChanged={!!changes.advisingBankSwiftCode}
              originalValue={originalData.advisingBankSwiftCode}
            >
              <SwiftTagLabel tag=":53A:" label="Advising Bank SWIFT Code" />
              <Input
                value={formData.advisingBankSwiftCode}
                onChange={(e) => updateField('advisingBankSwiftCode', e.target.value)}
                placeholder="Enter SWIFT code"
              />
            </AmendmentFieldWrapper>
          </div>

          <AmendmentFieldWrapper
            fieldName="beneficiaryBankAddress"
            label="Beneficiary Bank Address"
            hasChanged={!!changes.beneficiaryBankAddress}
            originalValue={originalData.beneficiaryBankAddress}
          >
            <SwiftTagLabel tag=":57A:" label="Beneficiary Bank Address" />
            <Textarea
              value={formData.beneficiaryBankAddress}
              onChange={(e) => updateField('beneficiaryBankAddress', e.target.value)}
              placeholder="Enter bank address"
              rows={3}
            />
          </AmendmentFieldWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportLCAmendmentPartyPane;
