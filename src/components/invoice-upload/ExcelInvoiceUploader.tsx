import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { processUpload } from '@/services/invoiceUploadService';
import { UploadResult } from '@/types/invoiceUpload';

interface ExcelInvoiceUploaderProps {
  onUploadComplete: (result: UploadResult) => void;
  onUploadError?: (error: Error) => void;
}

const ExcelInvoiceUploader: React.FC<ExcelInvoiceUploaderProps> = ({
  onUploadComplete,
  onUploadError
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      toast({
        title: 'Invalid File Format',
        description: 'Please upload an Excel file (.xlsx or .xls)',
        variant: 'destructive'
      });
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    // Check if user is authenticated
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to upload invoices.',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      setProgress(30);

      const result = await processUpload(file, user.id);

      setProgress(100);

      toast({
        title: 'Upload Complete',
        description: `${result.invoices.length} invoices uploaded successfully. ${result.rejections.length} rejected.`,
        variant: result.rejections.length > 0 ? 'default' : 'default'
      });

      onUploadComplete(result);
    } catch (error) {
      console.error('Upload error:', error);
      
      // Display detailed error message
      let errorMessage = 'Failed to process upload';
      let errorTitle = 'Upload Failed';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide more specific error messages
        if (error.message.includes('Failed to create upload batch')) {
          errorTitle = 'Database Error';
          errorMessage = 'Unable to create upload batch. Please check your connection and permissions.';
        } else if (error.message.includes('exceed 100 rows')) {
          errorTitle = 'Row Limit Exceeded';
          errorMessage = 'Upload cannot exceed 100 rows. Please reduce the number of invoices and try again.';
        } else if (error.message.includes('Invalid')) {
          errorTitle = 'Validation Error';
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
        duration: 10000 // Show error for 10 seconds
      });
      
      // Pass error to parent component for detailed display
      if (onUploadError && error instanceof Error) {
        onUploadError(error);
      }
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setFile(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-border rounded-lg p-6">
        <input
          type="file"
          id="excel-upload"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />
        
        {!file ? (
          <label htmlFor="excel-upload" className="cursor-pointer block text-center">
            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground mb-1">
              Upload Excel File
            </p>
            <p className="text-xs text-muted-foreground">
              Up to 100 invoices
            </p>
          </label>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(2)} KB
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={handleUpload}
                disabled={isProcessing}
                size="sm"
              >
                {isProcessing ? 'Processing...' : 'Process Upload'}
              </Button>
              <Button
                onClick={() => setFile(null)}
                variant="outline"
                size="sm"
                disabled={isProcessing}
              >
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>

      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Processing...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
};

export default ExcelInvoiceUploader;
