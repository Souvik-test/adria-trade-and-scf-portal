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

  // Document requirements with original/copy counts
  const documentRequirements = Array.isArray(formData.documentRequirements) ? formData.documentRequirements : [];

  const handleCheckboxChange = (docType: string, checked: boolean) => {
    if (checked) {
      // Add document with default counts
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: docType,
        original: 1,
        copies: 0
      };
      updateField('documentRequirements', [...documentRequirements, newDoc]);
    } else {
      // Remove document
      updateField('documentRequirements', documentRequirements.filter(d => d.name !== docType));
    }
  };

  const handleCountChange = (docType: string, field: 'original' | 'copies', value: number) => {
    const updated = documentRequirements.map(doc =>
      doc.name === docType ? { ...doc, [field]: Math.max(0, value) } : doc
    );
    updateField('documentRequirements', updated);
  };

  const handleAddCustomDoc = () => {
    const trimmed = customDocName.trim();
    if (trimmed && !docTypes.includes(trimmed)) {
      setDocTypes(types => [...types, trimmed]);
      // Add as document requirement with default counts
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: trimmed,
        original: 1,
        copies: 0
      };
      updateField('documentRequirements', [...documentRequirements, newDoc]);
    }
    setCustomDocName('');
  };

  const isDocSelected = (docType: string) => {
    return documentRequirements.some(d => d.name === docType);
  };

  const getDocCounts = (docType: string) => {
    const doc = documentRequirements.find(d => d.name === docType);
    return doc ? { original: doc.original, copies: doc.copies } : { original: 1, copies: 0 };
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

          {/* Required Document Checkboxes with Original/Copy Counts */}
          <div>
            <SwiftTagLabel tag={SWIFT_TAGS.requiredDocuments.tag} label={SWIFT_TAGS.requiredDocuments.label} required={SWIFT_TAGS.requiredDocuments.required} />
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-3">
              Select required presentation documents:
            </Label>
            <div className="space-y-3">
              {COMMON_DOC_TYPES.map((docType) => {
                const counts = getDocCounts(docType);
                const isChecked = isDocSelected(docType);
                return (
                  <div key={docType} className="flex items-center gap-4">
                    <div className="flex items-center space-x-2 min-w-[250px]">
                      <Checkbox
                        id={docType}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleCheckboxChange(docType, checked as boolean)}
                      />
                      <Label htmlFor={docType} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                        {docType}
                      </Label>
                    </div>
                    {isChecked && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-gray-600 dark:text-gray-400">Original:</Label>
                          <Input
                            type="number"
                            min="0"
                            value={counts.original}
                            onChange={(e) => handleCountChange(docType, 'original', parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-gray-600 dark:text-gray-400">Copies:</Label>
                          <Input
                            type="number"
                            min="0"
                            value={counts.copies}
                            onChange={(e) => handleCountChange(docType, 'copies', parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Custom documents */}
              {docTypes.filter(dt => !COMMON_DOC_TYPES.includes(dt)).map((docType) => {
                const counts = getDocCounts(docType);
                const isChecked = isDocSelected(docType);
                return (
                  <div key={docType} className="flex items-center gap-4">
                    <div className="flex items-center space-x-2 min-w-[250px]">
                      <Checkbox
                        id={docType}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleCheckboxChange(docType, checked as boolean)}
                      />
                      <Label htmlFor={docType} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                        {docType}
                      </Label>
                    </div>
                    {isChecked && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-gray-600 dark:text-gray-400">Original:</Label>
                          <Input
                            type="number"
                            min="0"
                            value={counts.original}
                            onChange={(e) => handleCountChange(docType, 'original', parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-gray-600 dark:text-gray-400">Copies:</Label>
                          <Input
                            type="number"
                            min="0"
                            value={counts.copies}
                            onChange={(e) => handleCountChange(docType, 'copies', parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Add Custom Document Type */}
            <div className="flex gap-2 mt-4">
              <Input
                value={customDocName}
                onChange={(e) => setCustomDocName(e.target.value)}
                placeholder="Add custom document type"
                maxLength={40}
                className="flex-1"
              />
              <Button
                onClick={handleAddCustomDoc}
                className="bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white"
                disabled={!customDocName.trim()}
                type="button"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Supporting Document Uploads - only predefined documents */}
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
              Attach key files supporting your LC request. These are standard supporting documents for the issuance process.
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
