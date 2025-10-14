import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface UploadProgressBarProps {
  message?: string;
}

const UploadProgressBar: React.FC<UploadProgressBarProps> = ({ 
  message = 'Processing upload...' 
}) => {
  return (
    <div className="bg-muted/50 border border-border rounded-lg p-6 text-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">{message}</p>
        <p className="text-xs text-muted-foreground">
          Please wait while we validate and process your invoices
        </p>
      </div>
      <Progress value={undefined} className="h-2" />
    </div>
  );
};

export default UploadProgressBar;
