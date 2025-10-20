import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TemplateDownloader from './TemplateDownloader';
import ScannedInvoiceUploader from './ScannedInvoiceUploader';
import ExcelInvoiceUploader from './ExcelInvoiceUploader';
import UploadProgressBar from './UploadProgressBar';
import UploadErrorDisplay from './UploadErrorDisplay';
import ValidationSummaryCard from './ValidationSummaryCard';
import InvoiceUploadTable from './InvoiceUploadTable';
import DisbursementStatusCard from './DisbursementStatusCard';
import RejectionReportDownloader from './RejectionReportDownloader';
import { UploadResult } from '@/types/invoiceUpload';

interface InvoiceUploadFormProps {
  open: boolean;
  onClose: () => void;
}

const InvoiceUploadForm: React.FC<InvoiceUploadFormProps> = ({ open, onClose }) => {
  const [uploadMethod, setUploadMethod] = useState<'excel' | 'scan'>('excel');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResults, setUploadResults] = useState<UploadResult | null>(null);
  const [uploadError, setUploadError] = useState<Error | null>(null);

  const handleUploadComplete = (result: UploadResult) => {
    setUploadResults(result);
    setUploadError(null);
    setIsProcessing(false);
  };

  const handleUploadError = (error: Error) => {
    setUploadError(error);
    setUploadResults(null);
    setIsProcessing(false);
  };

  const handleScanComplete = () => {
    // Handle scanned document completion
    setIsProcessing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Invoice Data</DialogTitle>
          <DialogDescription>
            Maximum 100 rows allowed, multiple programs supported
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Download Template */}
          <TemplateDownloader />

          {/* Step 2: Choose upload method */}
          <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="excel">Upload Excel</TabsTrigger>
              <TabsTrigger value="scan">Upload Scanned Invoice</TabsTrigger>
            </TabsList>

            <TabsContent value="excel" className="space-y-4 mt-4">
              {uploadError && <UploadErrorDisplay error={uploadError} />}
              <ExcelInvoiceUploader 
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
              />
            </TabsContent>

            <TabsContent value="scan" className="mt-4">
              <ScannedInvoiceUploader onUploadComplete={handleScanComplete} />
            </TabsContent>
          </Tabs>

          {/* Progress indicator */}
          {isProcessing && <UploadProgressBar />}

          {/* Results */}
          {uploadResults && (
            <div className="space-y-4">
              <ValidationSummaryCard results={uploadResults} />
              
              {uploadResults.invoices.length > 0 && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-foreground">
                      Successfully Uploaded Invoices ({uploadResults.invoices.length})
                    </h3>
                    <InvoiceUploadTable data={uploadResults.invoices} />
                  </div>

                  {uploadResults.disbursements.length > 0 && (
                    <DisbursementStatusCard disbursements={uploadResults.disbursements} />
                  )}
                </>
              )}

              {uploadResults.rejections.length > 0 && (
                <RejectionReportDownloader rejections={uploadResults.rejections} />
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceUploadForm;
