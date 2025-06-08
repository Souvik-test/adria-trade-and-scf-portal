
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import DocumentUploadDetails from './DocumentUploadDetails';

interface UploadedDocument {
  id: string;
  name: string;
  reference: string;
  date: string;
  type: string;
  file: File;
}

interface DocumentUploadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  uploadedDocuments: UploadedDocument[];
  selectedDocuments: string[];
  onDocumentEdit: (id: string, field: string, value: string) => void;
  onDocumentDelete: (id: string) => void;
}

const DocumentUploadPopup: React.FC<DocumentUploadPopupProps> = ({
  isOpen,
  onClose,
  uploadedDocuments,
  selectedDocuments,
  onDocumentEdit,
  onDocumentDelete
}) => {
  const [showUploadDetails, setShowUploadDetails] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isDocumentUploadEnabled = (doc: UploadedDocument) => {
    return doc.reference.trim() !== '' && doc.date.trim() !== '';
  };

  const handleUploadClick = (doc: UploadedDocument) => {
    setSelectedFile(doc.file);
    setShowUploadDetails(true);
  };

  const handleUploadComplete = (details: any) => {
    console.log('Upload completed with details:', details);
    setShowUploadDetails(false);
    setSelectedFile(null);
  };

  const handleUploadDetailsClose = () => {
    setShowUploadDetails(false);
    setSelectedFile(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
              Document Upload Details
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-3">
              {uploadedDocuments.map((doc) => (
                <div key={doc.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-corporate-teal-500" />
                      <span className="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {doc.name}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
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
                  
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-gray-600 dark:text-gray-400">Document Type</Label>
                      <Select value={doc.type} onValueChange={(value) => onDocumentEdit(doc.id, 'type', value)}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedDocuments.map((docType) => (
                            <SelectItem key={docType} value={docType}>{docType}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        disabled={!isDocumentUploadEnabled(doc)}
                        onClick={() => handleUploadClick(doc)}
                        className="bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white disabled:opacity-50"
                      >
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DocumentUploadDetails
        isOpen={showUploadDetails}
        onClose={handleUploadDetailsClose}
        onUpload={handleUploadComplete}
        fileName={selectedFile?.name || ''}
        selectedDocuments={selectedDocuments}
      />
    </>
  );
};

export default DocumentUploadPopup;
