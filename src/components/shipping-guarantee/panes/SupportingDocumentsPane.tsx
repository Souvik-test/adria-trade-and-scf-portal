import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, X } from 'lucide-react';
import { ShippingGuaranteeFormData } from '@/types/shippingGuarantee';

interface SupportingDocumentsPaneProps {
  formData: ShippingGuaranteeFormData;
  onFieldChange: (field: string, value: any) => void;
}

const SupportingDocumentsPane: React.FC<SupportingDocumentsPaneProps> = ({
  formData,
  onFieldChange
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const currentFiles = formData.supportingDocuments || [];
    onFieldChange('supportingDocuments', [...currentFiles, ...files]);
  };

  const removeFile = (index: number) => {
    const currentFiles = formData.supportingDocuments || [];
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    onFieldChange('supportingDocuments', updatedFiles);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Supporting Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              Upload Supporting Documents
            </p>
            <p className="text-muted-foreground mb-4">
              Upload relevant documents such as Bill of Lading, Commercial Invoice, Insurance Certificate, etc.
            </p>
            <Button variant="outline" className="relative">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              Choose Files
            </Button>
          </div>

          {formData.supportingDocuments && formData.supportingDocuments.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Uploaded Documents:</h4>
              <div className="space-y-2">
                {formData.supportingDocuments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <File className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-foreground">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Required Documents
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Bill of Lading (Original or Copy)</li>
              <li>• Commercial Invoice</li>
              <li>• Insurance Certificate (if applicable)</li>
              <li>• Cargo Manifest</li>
              <li>• Letter of Indemnity</li>
              <li>• Any other relevant shipping documents</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportingDocumentsPane;