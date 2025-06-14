
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

const DocumentRequirementsPane: React.FC<DocumentRequirementsPaneProps> = ({
  formData,
  updateField
}) => {
  // Merge saved and common doc types for UI; avoid duplicates
  const [customDocName, setCustomDocName] = useState('');
  const savedDocs = Array.isArray(formData.requiredDocuments) ? formData.requiredDocuments : [];
  const initialSet = new Set([...COMMON_DOC_TYPES, ...savedDocs]);
  const [docTypes, setDocTypes] = useState<string[]>(Array.from(initialSet));

  // Ensure formData.requiredDocuments is an array of strings
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

  return (
    <div className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-6 pr-2">
      <Card className="border border-gray-200 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
            Document Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <SwiftTagLabel tag={SWIFT_TAGS.requiredDocuments.tag} label={SWIFT_TAGS.requiredDocuments.label} required={SWIFT_TAGS.requiredDocuments.required} />

            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Select Required Documents
            </Label>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {docTypes.map((docType) => (
                <div key={docType} className="flex items-center space-x-2">
                  <Checkbox
                    id={docType}
                    checked={selectedDocs.includes(docType)}
                    onCheckedChange={(checked) => handleCheckboxChange(docType, checked as boolean)}
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
                value={customDocName}
                onChange={(e) => setCustomDocName(e.target.value)}
                placeholder="Enter custom document type"
                maxLength={40}
                className="flex-1"
              />
              <Button
                onClick={handleAddCustomDoc}
                className="bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white"
                disabled={!customDocName.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
          <div>
            <SwiftTagLabel tag=":48:" label="Presentation Period" />
            <Input
              value={formData.presentationPeriod}
              onChange={(e) => updateField('presentationPeriod', e.target.value)}
              placeholder="e.g., 21 days after shipment date"
            />
          </div>
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
