
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ImportLCFormData } from '@/types/importLC';
import AmendmentFieldWrapper from './AmendmentFieldWrapper';
import SwiftTagLabel from './SwiftTagLabel';

interface ImportLCAmendmentDocumentsPaneProps {
  formData: ImportLCFormData;
  originalData: ImportLCFormData;
  changes: Record<string, { original: any; current: any }>;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const ImportLCAmendmentDocumentsPane: React.FC<ImportLCAmendmentDocumentsPaneProps> = ({
  formData,
  originalData,
  changes,
  updateField
}) => {
  const documentOptions = [
    'Commercial Invoice',
    'Packing List',
    'Bill of Lading',
    'Certificate of Origin',
    'Insurance Certificate',
    'Inspection Certificate',
    'Beneficiary Certificate',
    'Transport Document'
  ];

  const handleDocumentChange = (document: string, checked: boolean) => {
    const currentDocs = formData.requiredDocuments || [];
    if (checked) {
      updateField('requiredDocuments', [...currentDocs, document]);
    } else {
      updateField('requiredDocuments', currentDocs.filter(doc => doc !== document));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Document Requirements - Amendment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AmendmentFieldWrapper
            fieldName="requiredDocuments"
            label="Required Documents"
            hasChanged={!!changes.requiredDocuments}
            originalValue={originalData.requiredDocuments}
          >
            <SwiftTagLabel tag=":46A:" label="Required Documents" required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentOptions.map((doc) => (
                <div key={doc} className="flex items-center space-x-2">
                  <Checkbox
                    id={doc}
                    checked={(formData.requiredDocuments || []).includes(doc)}
                    onCheckedChange={(checked) => handleDocumentChange(doc, checked as boolean)}
                  />
                  <label
                    htmlFor={doc}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {doc}
                  </label>
                </div>
              ))}
            </div>
          </AmendmentFieldWrapper>

          <AmendmentFieldWrapper
            fieldName="additionalConditions"
            label="Additional Conditions"
            hasChanged={!!changes.additionalConditions}
            originalValue={originalData.additionalConditions}
          >
            <SwiftTagLabel tag=":47A:" label="Additional Conditions" />
            <Textarea
              value={formData.additionalConditions}
              onChange={(e) => updateField('additionalConditions', e.target.value)}
              placeholder="Enter additional conditions or special instructions"
              rows={4}
            />
          </AmendmentFieldWrapper>

          <AmendmentFieldWrapper
            fieldName="presentationPeriod"
            label="Presentation Period"
            hasChanged={!!changes.presentationPeriod}
            originalValue={originalData.presentationPeriod}
          >
            <SwiftTagLabel tag=":48:" label="Presentation Period" />
            <Textarea
              value={formData.presentationPeriod}
              onChange={(e) => updateField('presentationPeriod', e.target.value)}
              placeholder="Enter presentation period details"
              rows={2}
            />
          </AmendmentFieldWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportLCAmendmentDocumentsPane;
