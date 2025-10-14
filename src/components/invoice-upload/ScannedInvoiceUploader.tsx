import React, { useState, useCallback } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ScannedInvoiceUploaderProps {
  onUploadComplete?: (fileData: any) => void;
}

const ScannedInvoiceUploader: React.FC<ScannedInvoiceUploaderProps> = ({ 
  onUploadComplete 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = useCallback((selectedFile: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload PDF, JPG, or PNG files only',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'File size must be less than 10MB',
        variant: 'destructive'
      });
      return;
    }

    setFile(selectedFile);

    // Generate preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    // Auto-extract invoice number from filename
    const match = selectedFile.name.match(/INV-\d{4}-\d{3}/i);
    if (match) {
      setInvoiceNumber(match[0]);
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const handleUpload = async () => {
    if (!file || !invoiceNumber) {
      toast({
        title: 'Missing Information',
        description: 'Please select a file and provide invoice number',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Supabase Storage
      const filePath = `${invoiceNumber}_${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('invoice-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data: document, error: docError } = await supabase
        .from('invoice_scanned_documents')
        .insert({
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type
        })
        .select()
        .single();

      if (docError) throw docError;

      toast({
        title: 'Upload Successful',
        description: `Invoice document ${invoiceNumber} uploaded successfully`
      });

      onUploadComplete?.(document);
      
      // Reset form
      setFile(null);
      setPreview(null);
      setInvoiceNumber('');
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload document',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setInvoiceNumber('');
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, JPG, or PNG (Max 10MB)
            </p>
          </label>
        </div>
      ) : (
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-start gap-4">
            {preview ? (
              <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded" />
            ) : (
              <div className="w-24 h-24 bg-muted rounded flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3 space-y-2">
                <div>
                  <Label htmlFor="invoice-number" className="text-xs">
                    Invoice Number
                  </Label>
                  <Input
                    id="invoice-number"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="INV-2025-001"
                    className="h-8 mt-1"
                  />
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || !invoiceNumber}
                  size="sm"
                  className="w-full"
                >
                  {isUploading ? 'Uploading...' : 'Upload Document'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannedInvoiceUploader;
