
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ImportLCFormData } from '@/types/importLC';
import AmendmentFieldWrapper from './AmendmentFieldWrapper';

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
            fieldName="additionalConditions"
            label="Additional Conditions"
            hasChanged={!!changes.additionalConditions}
            originalValue={originalData.additionalConditions}
          >
            <Textarea
              value={formData.additionalConditions}
              onChange={(e) => updateField('additionalConditions', e.target.value)}
              placeholder="Enter additional conditions"
              rows={4}
            />
          </AmendmentFieldWrapper>

          <AmendmentFieldWrapper
            fieldName="presentationPeriod"
            label="Presentation Period"
            hasChanged={!!changes.presentationPeriod}
            originalValue={originalData.presentationPeriod}
          >
            <Textarea
              value={formData.presentationPeriod}
              onChange={(e) => updateField('presentationPeriod', e.target.value)}
              placeholder="Enter presentation period"
              rows={2}
            />
          </AmendmentFieldWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportLCAmendmentDocumentsPane;
