import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  corporate_reference: string;
  form_of_documentary_credit: string;
  beneficiary_name?: string;
  lc_amount?: number;
  currency?: string;
  issue_date?: string;
  status?: string;
}

interface TransactionSearchResultsProps {
  transactions: Transaction[];
  onSelect: (transaction: Transaction) => void;
  isLoading?: boolean;
}

const TransactionSearchResults: React.FC<TransactionSearchResultsProps> = ({
  transactions,
  onSelect,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Searching transactions...
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transactions found. Try different search criteria.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Search Results ({transactions.length} found)</h3>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Beneficiary</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell className="font-medium">{txn.corporate_reference}</TableCell>
                <TableCell>{txn.beneficiary_name || '-'}</TableCell>
                <TableCell>
                  {txn.lc_amount && txn.currency
                    ? `${txn.currency} ${txn.lc_amount.toLocaleString()}`
                    : '-'}
                </TableCell>
                <TableCell className="text-sm">
                  {txn.issue_date ? format(new Date(txn.issue_date), 'dd MMM yyyy') : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={txn.status === 'approved' ? 'default' : 'secondary'}>
                    {txn.status || 'draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelect(txn)}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionSearchResults;
