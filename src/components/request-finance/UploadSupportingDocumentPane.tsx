
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Upload, Trash2 } from 'lucide-react';

interface UploadedDocument {
  id: string;
  name: string;
  reference: string;
  date: string;
  type: string;
  file: File;
}

interface UploadSupportingDocumentPaneProps {
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

const UploadSupportingDocumentPane: React.FC<UploadSupportingDocumentPaneProps> = ({
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
      <Card className="border border-gray-200 dark:border-gray-600 h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
            Upload Supporting Document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Document Types
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {documentTypes.map((docType) => (
                  <div key={docType} className="flex items-center space-x-2">
                    <Checkbox
                      id={docType}
                      checked={selectedDocuments.includes(docType)}
                      onCheckedChange={(checked) => onDocumentSelect(docType, checked as boolean)}
                    />
                    <Label htmlFor={docType} className="text-sm cursor-pointer">
                      {docType}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                value={customDocumentName}
                onChange={(e) => setCustomDocumentName(e.target.value)}
                placeholder="Enter custom document type"
                maxLength={20}
                className="flex-1"
              />
              <Button 
                onClick={onAddCustomDocumentType}
                className="px-4 bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white"
                disabled={!customDocumentName.trim()}
              >
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Document Reference
              </Label>
              <Input
                placeholder="Enter document ID or No."
                maxLength={20}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Document Date
              </Label>
              <Input
                type="date"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload Document
              </Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={onFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Button
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white"
                  disabled={selectedDocuments.length === 0}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
                <span className="text-sm text-gray-500">
                  User will click this button to browse and attach supporting documents if required
                </span>
              </div>
            </div>
          </div>

          {uploadedDocuments.length > 0 && (
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Uploaded Document Details
              </Label>
              <div className="space-y-3">
                {uploadedDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-xs">
                        {doc.type}
                      </Badge>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{doc.name}</span>
                        <span className="text-xs text-gray-500">
                          Ref: {doc.reference} | Date: {doc.date}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDocumentDelete(doc.id)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
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
    </ScrollArea>
  );
};

export default UploadSupportingDocumentPane;
