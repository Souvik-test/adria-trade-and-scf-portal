
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, FileText, X } from 'lucide-react';
import { AssignmentFormData } from '@/types/exportLCAssignment';

interface DocumentsPaneProps {
  form: AssignmentFormData;
  updateField: (updates: Partial<AssignmentFormData>) => void;
}

const DEFAULT_REQUIRED_DOCUMENTS = [
  'Assignment Agreement',
  'Copy of Original LC',
  'Assignee Bank Confirmation',
  'Board Resolution (if applicable)',
  'Power of Attorney (if applicable)'
];

const DocumentsPane: React.FC<DocumentsPaneProps> = ({ form, updateField }) => {
  const handleDocumentCheckChange = (document: string, checked: boolean) => {
    const updatedChecked = {
      ...form.requiredDocumentsChecked,
      [document]: checked
    };
    updateField({ requiredDocumentsChecked: updatedChecked });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      updateField({
        supportingDocuments: [...form.supportingDocuments, ...newFiles]
      });
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = form.supportingDocuments.filter((_, i) => i !== index);
    updateField({ supportingDocuments: updatedFiles });
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-1 pb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">Check Required Documents</Label>
                {DEFAULT_REQUIRED_DOCUMENTS.map((document) => (
                  <div key={document} className="flex items-center space-x-2">
                    <Checkbox
                      id={document}
                      checked={form.requiredDocumentsChecked[document] || false}
                      onCheckedChange={(checked) => handleDocumentCheckChange(document, checked as boolean)}
                    />
                    <Label
                      htmlFor={document}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {document}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Upload Supporting Documents</Label>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                          Click to upload files
                        </span>
                        <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                          PDF, DOC, DOCX up to 10MB each
                        </span>
                      </Label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>
                </div>

                {form.supportingDocuments.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Uploaded Files:</Label>
                    {form.supportingDocuments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DocumentsPane;
