import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Disbursement } from '@/types/invoiceUpload';

interface DisbursementStatusCardProps {
  disbursements: Disbursement[];
}

const DisbursementStatusCard: React.FC<DisbursementStatusCardProps> = ({ 
  disbursements 
}) => {
  if (disbursements.length === 0) {
    return null;
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const viewAccountingEntries = (invoiceId: string) => {
    // TODO: Navigate to inquiry page with filter
    console.log('View accounting entries for:', invoiceId);
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base">Auto-Disbursement Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Loan Reference</TableHead>
                <TableHead>Program ID</TableHead>
                <TableHead className="text-right">Disbursed Amount</TableHead>
                <TableHead className="text-center">Finance %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disbursements.map((disbursement) => (
                <TableRow key={disbursement.id}>
                  <TableCell className="font-medium">
                    {disbursement.loan_reference}
                  </TableCell>
                  <TableCell className="text-sm">
                    {disbursement.program_id}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {Number(disbursement.disbursed_amount).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {disbursement.finance_percentage}%
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(disbursement.disbursement_status)}>
                      {disbursement.disbursement_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewAccountingEntries(disbursement.scf_invoice_id)}
                      className="gap-1"
                    >
                      View in Inquiry
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisbursementStatusCard;
