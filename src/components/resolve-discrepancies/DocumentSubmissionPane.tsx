
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileText, Edit, Trash2 } from 'lucide-react';
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
  editingDocument: string | null;
  setEditingDocument: (id: string | null) => void;
  onDocumentSelect: (docType: string, checked: boolean) => void;
  onAddCustomDocumentType: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDocumentEdit: (id: string, field: string, value: string) => void;
  onDocumentDelete: (id: string) => void;
}

export const DocumentSubmissionPane: React.FC<DocumentSubmissionPaneProps> = ({
  documentTypes,
  selectedDocuments,
  customDocumentName,
  setCustomDocumentName,
  uploadedDocuments,
  editingDocument,
  setEditingDocument,
  onDocumentSelect,
  onAddCustomDocumentType,
  onFileSelect,
  onDocumentEdit,
  onDocumentDelete
}) => {
  return (
    <div className="space-y-6">
      <Card className="border border-gray-200 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-orange-500 dark:text-orange-400">
            Document Submission Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Documents Submitted <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-4">
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
                className="bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300 disabled:opacity-50"
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
                multiple
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
        </CardContent>
      </Card>

      {uploadedDocuments.length > 0 && (
        <Card className="border border-gray-200 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
              Uploaded Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-3 pr-4">
                {uploadedDocuments.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-800 dark:text-white truncate">
                          {doc.name}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingDocument(editingDocument === doc.id ? null : doc.id)}
                          className="hover:bg-blue-100 text-blue-600"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDocumentDelete(doc.id)}
                          className="hover:bg-red-100 text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {editingDocument === doc.id && (
                      <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div>
                          <Label className="text-xs text-gray-600 dark:text-gray-400">Document ID</Label>
                          <Input
                            value={doc.reference}
                            onChange={(e) => onDocumentEdit(doc.id, 'reference', e.target.value)}
                            className="h-8 text-xs"
                            placeholder="Enter document ID"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600 dark:text-gray-400">Document Date</Label>
                          <Input
                            type="date"
                            value={doc.date}
                            onChange={(e) => onDocumentEdit(doc.id, 'date', e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Type: {doc.type}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
