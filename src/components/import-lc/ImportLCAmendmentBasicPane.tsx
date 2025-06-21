
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImportLCFormData } from '@/types/importLC';
import AmendmentFieldWrapper from './AmendmentFieldWrapper';

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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Basic LC Information - Amendment
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AmendmentFieldWrapper
            fieldName="corporateReference"
            label="Corporate Reference"
            hasChanged={!!changes.corporateReference}
            originalValue={originalData.corporateReference}
          >
            <Input
              value={formData.corporateReference}
              onChange={(e) => updateField('corporateReference', e.target.value)}
              placeholder="Enter corporate reference"
            />
          </AmendmentFieldWrapper>

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
                <SelectItem value="REVOCABLE">Revocable</SelectItem>
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
              </SelectContent>
            </Select>
          </AmendmentFieldWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportLCAmendmentBasicPane;
