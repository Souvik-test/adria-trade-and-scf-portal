
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface DocumentUploadSectionProps {
  documents: Document[];
  onDocumentsChange: (documents: Document[]) => void;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  documents,
  onDocumentsChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newDocuments: Document[] = [];
    
    Array.from(files).forEach(file => {
      const document: Document = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type
      };
      newDocuments.push(document);
    });

    onDocumentsChange([...documents, ...newDocuments]);
    
    toast({
      title: "Success",
      description: `${newDocuments.length} document(s) uploaded successfully`,
      variant: "default"
    });

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== documentId);
    onDocumentsChange(updatedDocuments);
    
    toast({
      title: "Document Removed",
      description: "Document has been removed successfully",
      variant: "default"
    });
  };

  const formatFileSize = (bytes: number) => {
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
          <FileText className="w-5 h-5" />
          Supporting Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-4">
            Click to upload or drag and drop your documents here
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mb-2"
          >
            Choose Files
          </Button>
          <p className="text-xs text-gray-500">
            Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB each)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Document List */}
        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Uploaded Documents:</h4>
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{document.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(document.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDocument(document.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploadSection;
