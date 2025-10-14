import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { generateInvoiceUploadTemplate } from '@/services/excelTemplateService';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const TemplateDownloader: React.FC = () => {
  const handleDownload = () => {
    generateInvoiceUploadTemplate();
  };

  return (
    <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-foreground">
            Download Invoice Upload Template
          </h3>
          <p className="text-xs text-muted-foreground">
            Use this standardized Excel template to upload invoice data
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download Template
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download standard format for bulk invoice upload</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TemplateDownloader;
