
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Trash2 } from 'lucide-react';
import { AssignmentFormData } from '@/types/exportLCAssignment';

interface DocumentsPaneProps {
  form: AssignmentFormData;
  updateField: (updates: Partial<AssignmentFormData>) => void;
}

const requiredDocuments = [
  'Assignment Notice',
  'Original Export LC',
  'Commercial Invoice',
  'Packing List',
  'Bill of Lading',
  'Certificate of Origin',
  'Insurance Certificate',
  'Inspection Certificate'
];

const DocumentsPane: React.FC<DocumentsPaneProps> = ({ form, updateField }) => {
  const handleDocumentCheck = (docName: string, checked: boolean) => {
    updateField({
      requiredDocumentsChecked: {
        ...form.requiredDocumentsChecked,
        [docName]: checked
      }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    updateField({
      supportingDocuments: [...form.supportingDocuments, ...files]
    });
  };

  const removeFile = (index: number) => {
    const newFiles = form.supportingDocuments.filter((_, i) => i !== index);
    updateField({ supportingDocuments: newFiles });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Required Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredDocuments.map((doc) => (
              <div key={doc} className="flex items-center space-x-2">
                <Checkbox
                  id={doc}
                  checked={form.requiredDocumentsChecked[doc] || false}
                  onCheckedChange={(checked) => handleDocumentCheck(doc, checked as boolean)}
                />
                <Label htmlFor={doc} className="text-sm font-medium">
                  {doc}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Supporting Documents Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="font-medium text-corporate-blue hover:text-corporate-blue/80">
                    Click to upload
                  </span>
                  {' '}or drag and drop
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB each</p>
            </div>
          </div>

          {form.supportingDocuments.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800 dark:text-white">Uploaded Files:</h4>
              {form.supportingDocuments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsPane;
