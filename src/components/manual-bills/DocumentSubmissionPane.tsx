
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UploadedDocument {
  id: string;
  name: string;
  reference: string;
  date: string;
  type: string;
  file: File;
}

interface DocumentSubmissionPaneProps {
  documentTypes: string[];
  selectedDocuments: string[];
  customDocumentName: string;
  setCustomDocumentName: (value: string) => void;
  uploadedDocuments: UploadedDocument[];
  onDocumentSelect: (docType: string, checked: boolean) => void;
  onAddCustomDocumentType: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDocumentDelete: (id: string) => void;
}

const DocumentSubmissionPane: React.FC<DocumentSubmissionPaneProps> = ({
  documentTypes,
  selectedDocuments,
  customDocumentName,
  setCustomDocumentName,
  uploadedDocuments,
  onDocumentSelect,
  onAddCustomDocumentType,
  onFileSelect,
  onDocumentDelete
}) => {
  return (
    <ScrollArea className="h-full" style={{ scrollbarWidth: 'auto' }}>
      <div className="space-y-6 pr-4">
        <Card className="border border-gray-200 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
              Document Submission Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Documents Submitted <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {documentTypes.map((docType) => (
                  <div key={docType} className="flex items-center space-x-2">
                    <Checkbox
                      id={docType}
                      checked={selectedDocuments.includes(docType)}
                      onCheckedChange={(checked) => onDocumentSelect(docType, checked as boolean)}
                    />
                    <Label htmlFor={docType} className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {docType}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Document Type</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={customDocumentName}
                  onChange={(e) => setCustomDocumentName(e.target.value)}
                  placeholder="Enter custom document type"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={onAddCustomDocumentType}
                  disabled={!customDocumentName.trim()}
                  className="bg-corporate-teal-100 hover:bg-corporate-teal-200 text-corporate-teal-700 border-corporate-teal-300 disabled:opacity-50"
                >
                  Add
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Upload Documents <span className="text-red-500">*</span>
              </Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                <div className="text-gray-600 dark:text-gray-400 mb-2">
                  Multiple uploads - With restrictions
                </div>
                <input
                  type="file"
                  id="document-upload"
                  className="hidden"
                  onChange={onFileSelect}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('document-upload')?.click()}
                  className="mb-4"
                  disabled={selectedDocuments.length === 0}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
                <div className="text-sm text-red-500">
                  {selectedDocuments.length === 0 ? 'Select documents to enable upload' : ''}
                </div>
              </div>
            </div>

            {uploadedDocuments.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                  Uploaded Documents ({uploadedDocuments.length})
                </Label>
                <div className="space-y-2">
                  {uploadedDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-corporate-teal-500" />
                        <span className="text-sm font-medium">{doc.name}</span>
                        <span className="text-xs text-gray-500">({doc.type})</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDocumentDelete(doc.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
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

export default DocumentSubmissionPane;
