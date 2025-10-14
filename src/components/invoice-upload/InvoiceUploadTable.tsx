import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InvoiceUploadTableProps {
  data: any[];
}

const InvoiceUploadTable: React.FC<InvoiceUploadTableProps> = ({ data }) => {
  if (data.length === 0) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">Status</TableHead>
              <TableHead>Invoice No.</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Successfully uploaded and validated</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                <TableCell className="text-sm">{invoice.program_name}</TableCell>
                <TableCell className="text-sm">{invoice.buyer_name}</TableCell>
                <TableCell className="text-sm">{invoice.seller_name}</TableCell>
                <TableCell className="text-right font-medium">
                  {Number(invoice.total_amount).toLocaleString()}
                </TableCell>
                <TableCell>{invoice.currency}</TableCell>
                <TableCell className="text-sm">
                  {new Date(invoice.invoice_date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InvoiceUploadTable;
