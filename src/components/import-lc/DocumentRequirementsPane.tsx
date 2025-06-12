
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileText, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImportLCFormData } from '@/hooks/useImportLCForm';

interface DocumentRequirementsPaneProps {
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const DocumentRequirementsPane: React.FC<DocumentRequirementsPaneProps> = ({
  formData,
  updateField
}) => {
  const [customDocument, setCustomDocument] = useState('');

  const standardDocuments = [
    'Commercial Invoice',
    'Packing List',
    'Bill of Lading',
    'Insurance Certificate',
    'Certificate of Origin',
    'Inspection Certificate',
    'Beneficiary Certificate',
    'Weight Certificate',
    'Quality Certificate'
  ];

  const handleDocumentSelect = (document: string, checked: boolean) => {
    const updatedDocuments = checked
      ? [...formData.requiredDocuments, document]
      : formData.requiredDocuments.filter(doc => doc !== document);
    updateField('requiredDocuments', updatedDocuments);
  };

  const handleAddCustomDocument = () => {
    if (customDocument.trim() && !formData.requiredDocuments.includes(customDocument.trim())) {
      updateField('requiredDocuments', [...formData.requiredDocuments, customDocument.trim()]);
      setCustomDocument('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      updateField('supportingDocuments', [...formData.supportingDocuments, ...files]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = formData.supportingDocuments.filter((_, i) => i !== index);
    updateField('supportingDocuments', updatedFiles);
  };

  return (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <div className="space-y-6 pr-4">
        <Card className="border border-gray-200 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
              Document Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Required Documents */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Required Documents <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {standardDocuments.map((doc) => (
                  <div key={doc} className="flex items-center space-x-2">
                    <Checkbox
                      id={doc}
                      checked={formData.requiredDocuments.includes(doc)}
                      onCheckedChange={(checked) => handleDocumentSelect(doc, checked as boolean)}
                    />
                    <Label htmlFor={doc} className="text-sm text-gray-700 dark:text-gray-300">
                      {doc}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Document */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Add Custom Document
              </Label>
              <div className="flex gap-2">
                <Input
                  value={customDocument}
                  onChange={(e) => setCustomDocument(e.target.value)}
                  placeholder="Enter custom document name"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={handleAddCustomDocument}
                  disabled={!customDocument.trim()}
                  className="bg-corporate-teal-100 hover:bg-corporate-teal-200 text-corporate-teal-700 border-corporate-teal-300"
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Selected Documents Display */}
            {formData.requiredDocuments.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Selected Documents ({formData.requiredDocuments.length})
                </Label>
                <div className="flex flex-wrap gap-2">
                  {formData.requiredDocuments.map((doc, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-corporate-teal-100 text-corporate-teal-800 dark:bg-corporate-teal-900 dark:text-corporate-teal-200"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Conditions */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Additional Conditions & Special Instructions
              </Label>
              <Textarea
                value={formData.additionalConditions}
                onChange={(e) => updateField('additionalConditions', e.target.value)}
                placeholder="Enter any additional conditions or special instructions"
                rows={4}
              />
            </div>

            {/* Supporting Documents Upload */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Upload Supporting Documents
              </Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                <div className="text-gray-600 dark:text-gray-400 mb-2">
                  Upload supporting documents
                </div>
                <input
                  type="file"
                  id="supporting-docs-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  multiple
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('supporting-docs-upload')?.click()}
                  className="mb-2"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
                <div className="text-xs text-gray-500">
                  Accepted formats: PDF, DOC, DOCX, PNG, JPG, JPEG
                </div>
              </div>
            </div>

            {/* Uploaded Files Display */}
            {formData.supportingDocuments.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                  Uploaded Files ({formData.supportingDocuments.length})
                </Label>
                <div className="space-y-2">
                  {formData.supportingDocuments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-corporate-teal-500" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default DocumentRequirementsPane;
