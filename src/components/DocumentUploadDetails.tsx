
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface DocumentUploadDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (details: DocumentDetails) => void;
  fileName: string;
  selectedDocuments: string[];
}

interface DocumentDetails {
  type: string;
  id: string;
  date: string;
}

const DocumentUploadDetails: React.FC<DocumentUploadDetailsProps> = ({
  isOpen,
  onClose,
  onUpload,
  fileName,
  selectedDocuments
}) => {
  const [documentType, setDocumentType] = useState('Commercial Invoice');
  const [documentId, setDocumentId] = useState('');
  const [documentDate, setDocumentDate] = useState('2025-06-08');

  const handleUpload = () => {
    onUpload({
      type: documentType,
      id: documentId,
      date: documentDate
    });
  };

  const handleCancel = () => {
    setDocumentId('');
    setDocumentDate('2025-06-08');
    onClose();
  };

  const isUploadEnabled = documentId.trim() !== '' && documentDate.trim() !== '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
            Document Upload Details
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Document Type
            </Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger className="border-orange-300 focus:border-orange-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectedDocuments.map((docType) => (
                  <SelectItem key={docType} value={docType}>{docType}</SelectItem>
                ))}
                <SelectItem value="Commercial Invoice">Commercial Invoice</SelectItem>
                <SelectItem value="Packing List">Packing List</SelectItem>
                <SelectItem value="Bill of Lading">Bill of Lading</SelectItem>
                <SelectItem value="Certificate of Origin">Certificate of Origin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Document ID
            </Label>
            <Input
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              placeholder="Enter document ID"
              className="border-gray-300 focus:border-corporate-teal-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Document Date
            </Label>
            <Input
              type="date"
              value={documentDate}
              onChange={(e) => setDocumentDate(e.target.value)}
              className="border-gray-300 focus:border-corporate-teal-500"
            />
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Selected file: {fileName}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!isUploadEnabled}
              className="px-6 bg-orange-400 hover:bg-orange-500 text-white disabled:opacity-50"
            >
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDetails;
