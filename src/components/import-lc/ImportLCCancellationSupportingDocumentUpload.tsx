
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, File, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CancellationFormData {
  lcReference: string;
  cancellationReason: string;
  supportingDocuments: any[];
  lcDetails?: {
    corporate_reference: string;
    beneficiary_name: string;
    lc_amount: number;
    currency: string;
    expiry_date: string;
    issuing_bank: string;
  };
}

interface ImportLCCancellationSupportingDocumentUploadProps {
  docKey: string;
  label: string;
  lcId: string;
  updateField: (field: keyof CancellationFormData, value: any) => void;
  formData: CancellationFormData;
  isCustom?: boolean;
}

const ImportLCCancellationSupportingDocumentUpload: React.FC<ImportLCCancellationSupportingDocumentUploadProps> = ({
  docKey,
  label,
  lcId,
  updateField,
  formData,
  isCustom = false
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, DOC, DOCX, or image files only.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDocument = {
        id: Date.now().toString(),
        docKey,
        label,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString()
      };

      const updatedDocuments = [...(formData.supportingDocuments || []), newDocument];
      updateField('supportingDocuments', updatedDocuments);

      toast({
        title: "Upload successful",
        description: `${label} has been uploaded successfully.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    const updatedDocuments = (formData.supportingDocuments || []).filter(doc => doc.docKey !== docKey);
    updateField('supportingDocuments', updatedDocuments);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const existingDoc = (formData.supportingDocuments || []).find(doc => doc.docKey === docKey);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </Label>
        {isCustom && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Custom
          </span>
        )}
      </div>
      
      {existingDoc || uploadedFile ? (
        <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
          <div className="flex items-center space-x-2">
            <File className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-800 dark:text-green-200">
              {existingDoc?.fileName || uploadedFile?.name}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            className="hidden"
            disabled={isUploading}
          />
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 mb-3">
            PDF, DOC, DOCX, or images up to 10MB
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-corporate-teal-600 border-corporate-teal-300 hover:bg-corporate-teal-50"
          >
            {isUploading ? 'Uploading...' : 'Choose File'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImportLCCancellationSupportingDocumentUpload;
