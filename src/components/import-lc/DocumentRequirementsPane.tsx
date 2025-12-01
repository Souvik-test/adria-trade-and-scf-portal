import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImportLCFormData, SWIFT_TAGS } from '@/types/importLC';
import SwiftTagLabel from './SwiftTagLabel';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { FilePlus } from "lucide-react";
import ImportLCSupportingDocumentUpload from './ImportLCSupportingDocumentUpload';

interface DocumentRequirementsPaneProps {
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const COMMON_DOC_TYPES = [
  'Invoice',
  'Packing List',
  'Bill of Lading',
  'Insurance Certificate',
  'Certificate of Origin',
  "Beneficiary’s Certificate"
];

// Predefined supporting docs for upload
const SUPPORTING_DOC_LABELS = [
  { key: 'lcApplication', label: 'LC Application' },
  { key: 'purchaseOrder', label: 'Purchase Order' },
  { key: 'proformaInvoice', label: 'Pro-forma Invoice' },
  { key: 'contract', label: 'Contract' },
];

const DocumentRequirementsPane: React.FC<DocumentRequirementsPaneProps> = ({
  formData,
  updateField
}) => {
  // UI state for custom doc selection (checkbox add)
  const [customDocName, setCustomDocName] = useState('');
  const savedDocs = Array.isArray(formData.requiredDocuments) ? formData.requiredDocuments : [];
  const initialSet = new Set([...COMMON_DOC_TYPES, ...savedDocs]);
  const [docTypes, setDocTypes] = useState<string[]>(Array.from(initialSet));

  const selectedDocs: string[] = Array.isArray(formData.requiredDocuments) ? formData.requiredDocuments : [];

  const handleCheckboxChange = (docType: string, checked: boolean) => {
    let updated: string[];
    if (checked) {
      updated = [...selectedDocs, docType];
    } else {
      updated = selectedDocs.filter((d) => d !== docType);
    }
    updateField('requiredDocuments', updated);
  };

  const handleAddCustomDoc = () => {
    const trimmed = customDocName.trim();
    if (trimmed && !docTypes.includes(trimmed)) {
      setDocTypes(types => [...types, trimmed]);
      updateField('requiredDocuments', [...selectedDocs, trimmed]);
    }
    setCustomDocName('');
  };

  // Custom upload state
  const [customDocUploads, setCustomDocUploads] = useState<{ label: string; key: string }[]>([]);
  const [customDocUploadName, setCustomDocUploadName] = useState('');

  const handleAddCustomUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customDocUploadName.trim();
    if (trimmed && !customDocUploads.some(d => d.label === trimmed)) {
      setCustomDocUploads(u => [...u, { label: trimmed, key: `custom-${u.length + 1}` }]);
      setCustomDocUploadName('');
    }
  };

  return (
    <div className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-6 pr-2">
      <Card className="border border-corporate-teal-100 dark:border-corporate-teal-800 shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-600 dark:text-corporate-teal-300">
            Document Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-7">

          {/* Required Document Checkboxes */}
          <div>
            <SwiftTagLabel tag={SWIFT_TAGS.requiredDocuments.tag} label={SWIFT_TAGS.requiredDocuments.label} required={SWIFT_TAGS.requiredDocuments.required} />
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Select required presentation documents:
            </Label>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {COMMON_DOC_TYPES.map((docType) => (
                <div key={docType} className="flex items-center space-x-2">
                  <Checkbox
                    id={docType}
                    checked={Array.isArray(formData.requiredDocuments) && formData.requiredDocuments.includes(docType)}
                    onCheckedChange={(checked) => {
                      let updated: string[] = Array.isArray(formData.requiredDocuments) ? [...formData.requiredDocuments] : [];
                      if (checked) {
                        updated = [...updated, docType];
                      } else {
                        updated = updated.filter((d) => d !== docType);
                      }
                      updateField('requiredDocuments', updated);
                    }}
                  />
                  <Label htmlFor={docType} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    {docType}
                  </Label>
                </div>
              ))}
            </div>
            {/* Add Custom Document Type */}
            <div className="flex gap-2 mt-4">
              <Input
                value={customDocUploadName}
                onChange={(e) => setCustomDocUploadName(e.target.value)}
                placeholder="Add custom document type"
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
          </div>

          {/* Supporting Document Uploads, much more visually attractive, includes custom option */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-base font-semibold text-corporate-teal-700 dark:text-corporate-teal-200">
                Upload Supporting Documents
              </Label>
              <span className="text-xs text-corporate-teal-500">
                PDF, DOC, or Image. Required for verification.
              </span>
            </div>
            <div className="text-xs text-gray-600 mb-2 max-w-lg">
              Attach key files supporting your LC request. Upload the most relevant standard documents below, or add a custom supporting document if needed.
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
            <div className="text-xs text-gray-500 mt-2 leading-snug">
              <strong>Tip:</strong> Use the &quot;Add custom document type&quot; field above to create a unique upload for less common files (e.g., Insurance Addendum).
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Presentation Period Card */}
      <Card className="border border-corporate-teal-100 dark:border-corporate-teal-800 shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-600 dark:text-corporate-teal-300">
            Presentation Period & Additional Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Presentation Period */}
          <div>
            <SwiftTagLabel tag=":48:" label="Presentation Period" />
            <Input
              value={formData.presentationPeriod}
              onChange={(e) => updateField('presentationPeriod', e.target.value)}
              placeholder="e.g., 21 days after shipment date"
            />
          </div>
          {/* Additional Conditions */}
          <div>
            <SwiftTagLabel tag=":47A:" label="Additional Conditions" />
            <Textarea
              value={formData.additionalConditions}
              onChange={(e) => updateField('additionalConditions', e.target.value)}
              placeholder="Enter any additional conditions for the LC"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentRequirementsPane;
