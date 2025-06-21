
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImportLCFormData } from '@/types/importLC';
import AmendmentFieldWrapper from './AmendmentFieldWrapper';
import ImportLCSearchDropdown from '../export-lc/ImportLCSearchDropdown';

interface ImportLCAmendmentBasicPaneProps {
  formData: ImportLCFormData;
  originalData: ImportLCFormData;
  changes: Record<string, { original: any; current: any }>;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const ImportLCAmendmentBasicPane: React.FC<ImportLCAmendmentBasicPaneProps> = ({
  formData,
  originalData,
  changes,
  updateField
}) => {
  const handleLCSelect = (lc: any) => {
    // Auto-populate fields when LC is selected
    updateField('corporateReference', lc.corporate_reference);
    updateField('applicantName', lc.applicant_name);
    updateField('beneficiaryName', lc.beneficiary_name);
    updateField('lcAmount', lc.lc_amount);
    updateField('currency', lc.currency);
    updateField('issueDate', lc.issue_date);
    updateField('expiryDate', lc.expiry_date);
    updateField('issuingBank', lc.issuing_bank);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Basic LC Information - Amendment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AmendmentFieldWrapper
              fieldName="formOfDocumentaryCredit"
              label="Form of Documentary Credit"
              hasChanged={!!changes.formOfDocumentaryCredit}
              originalValue={originalData.formOfDocumentaryCredit}
            >
              <Select 
                value={formData.formOfDocumentaryCredit} 
                onValueChange={(value) => updateField('formOfDocumentaryCredit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IRREVOCABLE">Irrevocable</SelectItem>
                  <SelectItem value="IRREVOCABLE TRANSFERABLE">Irrevocable Transferable</SelectItem>
                </SelectContent>
              </Select>
            </AmendmentFieldWrapper>

            <div>
              <Label htmlFor="corporateReference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Corporate Reference (Search)
              </Label>
              <ImportLCSearchDropdown
                value={formData.corporateReference}
                onSelect={handleLCSelect}
                placeholder="Search and select LC Reference..."
              />
              {changes.corporateReference && (
                <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded border-l-4 border-red-400 mt-2">
                  <span className="font-medium text-red-600 dark:text-red-400">Original: </span>
                  <span className="line-through">{String(originalData.corporateReference)}</span>
                </div>
              )}
            </div>

            <AmendmentFieldWrapper
              fieldName="applicableRules"
              label="Applicable Rules"
              hasChanged={!!changes.applicableRules}
              originalValue={originalData.applicableRules}
            >
              <Select 
                value={formData.applicableRules} 
                onValueChange={(value) => updateField('applicableRules', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select applicable rules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UCP Latest Version">UCP Latest Version</SelectItem>
                  <SelectItem value="UCP 600">UCP 600</SelectItem>
                  <SelectItem value="ISBP">ISBP</SelectItem>
                  <SelectItem value="eUCP">eUCP</SelectItem>
                </SelectContent>
              </Select>
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="lcType"
              label="LC Type"
              hasChanged={!!changes.lcType}
              originalValue={originalData.lcType}
            >
              <Select 
                value={formData.lcType} 
                onValueChange={(value) => updateField('lcType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select LC type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="At Sight">At Sight</SelectItem>
                  <SelectItem value="Usance">Usance</SelectItem>
                  <SelectItem value="Deferred Payment">Deferred Payment</SelectItem>
                  <SelectItem value="Acceptance">Acceptance</SelectItem>
                </SelectContent>
              </Select>
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="issueDate"
              label="Issue Date"
              hasChanged={!!changes.issueDate}
              originalValue={originalData.issueDate}
            >
              <Input
                type="date"
                value={formData.issueDate}
                onChange={(e) => updateField('issueDate', e.target.value)}
              />
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="expiryDate"
              label="Expiry Date"
              hasChanged={!!changes.expiryDate}
              originalValue={originalData.expiryDate}
            >
              <Input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => updateField('expiryDate', e.target.value)}
              />
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="placeOfExpiry"
              label="Place of Expiry"
              hasChanged={!!changes.placeOfExpiry}
              originalValue={originalData.placeOfExpiry}
            >
              <Input
                value={formData.placeOfExpiry}
                onChange={(e) => updateField('placeOfExpiry', e.target.value)}
                placeholder="Enter place of expiry"
              />
            </AmendmentFieldWrapper>

            <AmendmentFieldWrapper
              fieldName="issuingBank"
              label="Issuing Bank"
              hasChanged={!!changes.issuingBank}
              originalValue={originalData.issuingBank}
            >
              <Input
                value={formData.issuingBank || ''}
                onChange={(e) => updateField('issuingBank', e.target.value)}
                placeholder="Enter issuing bank name"
              />
            </AmendmentFieldWrapper>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportLCAmendmentBasicPane;
