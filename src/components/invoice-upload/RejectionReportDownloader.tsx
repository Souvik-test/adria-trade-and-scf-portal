import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RejectedRow } from '@/types/invoiceUpload';
import { generateRejectionReport } from '@/services/invoiceUploadService';

interface RejectionReportDownloaderProps {
  rejections: RejectedRow[];
}

const RejectionReportDownloader: React.FC<RejectionReportDownloaderProps> = ({ 
  rejections 
}) => {
  if (rejections.length === 0) {
    return null;
  }

  const handleDownload = () => {
    generateRejectionReport(rejections);
  };

  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-destructive">
            Rejection Report Available
          </h3>
          <p className="text-xs text-muted-foreground">
            {rejections.length} {rejections.length === 1 ? 'invoice was' : 'invoices were'} rejected. 
            Download the detailed report to view reasons and correct the data.
          </p>
        </div>
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>
    </div>
  );
};

export default RejectionReportDownloader;
