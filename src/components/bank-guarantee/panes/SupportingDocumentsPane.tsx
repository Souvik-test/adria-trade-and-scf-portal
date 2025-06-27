
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';
import { OutwardBGFormData } from '@/types/outwardBankGuarantee';

interface SupportingDocumentsPaneProps {
  formData: OutwardBGFormData;
  onFieldChange: (field: string, value: any) => void;
}

const SupportingDocumentsPane: React.FC<SupportingDocumentsPaneProps> = ({
  formData,
  onFieldChange
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const existingFiles = formData.supportingDocuments || [];
      onFieldChange('supportingDocuments', [...existingFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const existingFiles = formData.supportingDocuments || [];
    const updatedFiles = existingFiles.filter((_: any, i: number) => i !== index);
    onFieldChange('supportingDocuments', updatedFiles);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Supporting Documents Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </span>
                  </Button>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Upload supporting documents (PDF, DOC, DOCX, JPG, PNG)
              </p>
            </div>
          </div>

          {formData.supportingDocuments && formData.supportingDocuments.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Uploaded Files:</h4>
              {formData.supportingDocuments.map((file: File, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
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

export default SupportingDocumentsPane;
