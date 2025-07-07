
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, Paperclip } from 'lucide-react';

interface DemandSupportingDocumentsProps {
  documents: File[];
  onDocumentsChange: (documents: File[]) => void;
}

const DemandSupportingDocuments: React.FC<DemandSupportingDocumentsProps> = ({
  documents,
  onDocumentsChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const updatedDocuments = [...documents, ...newFiles];
      onDocumentsChange(updatedDocuments);
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveDocument = (index: number) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    onDocumentsChange(updatedDocuments);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paperclip className="w-5 h-5" />
          Supporting Documents (Tag: 77D)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mb-2"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Supporting Documents
              </Button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Upload demand-related documents (PDF, DOC, DOCX, JPG, PNG, XLS, XLSX)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Maximum file size: 10MB per file
            </p>
          </div>
        </div>

        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">
              Uploaded Documents ({documents.length})
            </h4>
            <div className="space-y-2">
              {documents.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md border"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDocument(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
          <strong>Note:</strong> Supporting documents should include:
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Original demand notice</li>
            <li>Proof of non-performance (if applicable)</li>
            <li>Contract/Agreement documents</li>
            <li>Correspondence related to the claim</li>
            <li>Any other relevant supporting evidence</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandSupportingDocuments;
