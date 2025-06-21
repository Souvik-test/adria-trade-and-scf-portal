
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImportLCFormData } from '@/types/importLC';
import AmendmentFieldWrapper from './AmendmentFieldWrapper';
import SwiftTagLabel from './SwiftTagLabel';
import ImportLCSupportingDocumentUpload from './ImportLCSupportingDocumentUpload';
import { Plus, FilePlus } from 'lucide-react';

interface ImportLCAmendmentDocumentsPaneProps {
  formData: ImportLCFormData;
  originalData: ImportLCFormData;
  changes: Record<string, { original: any; current: any }>;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const SUPPORTING_DOC_LABELS = [
  { key: 'amendmentRequest', label: 'Amendment Request Letter' },
  { key: 'justification', label: 'Justification Document' },
  { key: 'updatedContract', label: 'Updated Contract' },
  { key: 'correspondences', label: 'Bank Correspondences' },
];

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

  const [customDocUploads, setCustomDocUploads] = useState<{ label: string; key: string }[]>([]);
  const [customDocUploadName, setCustomDocUploadName] = useState('');

  const handleDocumentChange = (document: string, checked: boolean) => {
    const currentDocs = formData.requiredDocuments || [];
    if (checked) {
      updateField('requiredDocuments', [...currentDocs, document]);
    } else {
      updateField('requiredDocuments', currentDocs.filter(doc => doc !== document));
    }
  };

  const handleAddCustomUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customDocUploadName.trim();
    if (trimmed && !customDocUploads.some(d => d.label === trimmed)) {
      setCustomDocUploads(u => [...u, { label: trimmed, key: `custom-${u.length + 1}` }]);
      setCustomDocUploadName('');
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

          {/* Supporting Document Uploads */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-base font-semibold text-corporate-teal-700 dark:text-corporate-teal-200">
                Upload Supporting Documents
              </Label>
              <span className="text-xs text-corporate-teal-500">
                PDF, DOC, or Image. Required for amendment verification.
              </span>
            </div>
            <div className="text-xs text-gray-600 mb-2 max-w-lg">
              Attach documents supporting your amendment request. Upload relevant documents below, or add a custom supporting document if needed.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SUPPORTING_DOC_LABELS.map((doc) => (
                <ImportLCSupportingDocumentUpload
                  key={doc.key}
                  docKey={doc.key}
                  label={doc.label}
                  lcId={formData.corporateReference || ""}
                  updateField={updateField}
                  formData={formData}
                />
              ))}
              {/* Custom Uploads */}
              {customDocUploads.map((c) => (
                <ImportLCSupportingDocumentUpload
                  key={c.key}
                  docKey={c.key}
                  label={c.label}
                  lcId={formData.corporateReference || ""}
                  updateField={updateField}
                  formData={formData}
                  isCustom
                />
              ))}
            </div>
            {/* Add Custom Document Upload */}
            <div className="flex gap-2 mt-4">
              <Input
                value={customDocUploadName}
                onChange={(e) => setCustomDocUploadName(e.target.value)}
                placeholder="Add custom supporting document"
                maxLength={40}
                className="flex-1"
              />
              <Button
                onClick={handleAddCustomUpload}
                className="bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white"
                disabled={!customDocUploadName.trim()}
                type="button"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {customDocUploads.map((c) => (
                <span key={c.key} className="inline-flex items-center px-2 py-1 rounded bg-corporate-teal-100 text-xs text-corporate-teal-700 gap-1 shadow border border-corporate-teal-200">
                  <FilePlus className="w-3 h-3 mr-0.5 text-corporate-teal-500" />
                  {c.label}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2 leading-snug">
              <strong>Tip:</strong> Use the &quot;Add custom supporting document&quot; field above to create a unique upload for specific amendment documents.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportLCAmendmentDocumentsPane;
