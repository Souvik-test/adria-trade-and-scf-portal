import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadResult } from '@/types/invoiceUpload';

interface ValidationSummaryCardProps {
  results: UploadResult;
}

const ValidationSummaryCard: React.FC<ValidationSummaryCardProps> = ({ results }) => {
  const totalRows = results.batch.total_rows;
  const acceptedCount = results.batch.successful_rows;
  const rejectedCount = results.batch.rejected_rows;

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Limit Validation Completed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{totalRows}</p>
            <p className="text-xs text-muted-foreground">Total Rows</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
            </div>
            <p className="text-xs text-muted-foreground">Accepted</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <XCircle className="h-4 w-4 text-destructive" />
              <p className="text-2xl font-bold text-destructive">{rejectedCount}</p>
            </div>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </div>
        </div>

        {rejectedCount > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
            <p className="text-xs text-destructive font-medium">
              {rejectedCount} {rejectedCount === 1 ? 'invoice was' : 'invoices were'} rejected due to validation errors.
              Download the rejection report for details.
            </p>
          </div>
        )}

        {acceptedCount > 0 && rejectedCount === 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
            <p className="text-xs text-green-700 dark:text-green-400 font-medium">
              All invoices passed validation successfully!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ValidationSummaryCard;
