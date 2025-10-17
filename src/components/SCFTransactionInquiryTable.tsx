import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SCFTransactionRow } from '@/types/scfTransaction';
import { CheckCircle2, XCircle, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

interface SCFTransactionInquiryTableProps {
  transactions: SCFTransactionRow[];
  loading: boolean;
}

type SortField = keyof SCFTransactionRow | null;
type SortDirection = 'asc' | 'desc' | null;

const SCFTransactionInquiryTable: React.FC<SCFTransactionInquiryTableProps> = ({
  transactions,
  loading,
}) => {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTransactions = React.useMemo(() => {
    if (!sortField || !sortDirection) return transactions;

    return [...transactions].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [transactions, sortField, sortDirection]);

  const paginatedTransactions = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedTransactions.slice(startIndex, startIndex + pageSize);
  }, [sortedTransactions, currentPage]);

  const totalPages = Math.ceil(sortedTransactions.length / pageSize);

  const getStatusVariant = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('financed') || lowerStatus.includes('disbursed') || lowerStatus.includes('repaid')) {
      return 'default';
    }
    if (lowerStatus.includes('lodged') || lowerStatus.includes('submitted')) {
      return 'secondary';
    }
    if (lowerStatus.includes('failed') || lowerStatus.includes('rejected')) {
      return 'destructive';
    }
    if (lowerStatus.includes('pending') || lowerStatus.includes('draft')) {
      return 'outline';
    }
    return 'secondary';
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => handleSort(field)}
        className="h-8 px-2 font-semibold hover:bg-muted"
      >
        {children}
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    </TableHead>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="productType">Product Type</SortableHeader>
              <SortableHeader field="transactionReference">Transaction Ref</SortableHeader>
              <SortableHeader field="programId">Program ID</SortableHeader>
              <TableHead>Program Name</TableHead>
              <TableHead>Anchor ID</TableHead>
              <TableHead>Anchor Name</TableHead>
              <TableHead>Counter Party ID</TableHead>
              <TableHead>Counter Party Name</TableHead>
              <SortableHeader field="transactionDate">Transaction Date</SortableHeader>
              <TableHead>Due Date</TableHead>
              <TableHead>Currency</TableHead>
              <SortableHeader field="amount">Amount</SortableHeader>
              <TableHead>Finance Eligible</TableHead>
              <TableHead>Related Refs</TableHead>
              <SortableHeader field="status">Status</SortableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={15} className="text-center py-8 text-muted-foreground">
                  No transactions found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.productType}</TableCell>
                <TableCell>{transaction.transactionReference}</TableCell>
                <TableCell>{transaction.programId}</TableCell>
                <TableCell>{transaction.programName}</TableCell>
                <TableCell>{transaction.anchorId}</TableCell>
                <TableCell>{transaction.anchorName}</TableCell>
                <TableCell>{transaction.counterPartyId}</TableCell>
                <TableCell>{transaction.counterPartyName}</TableCell>
                <TableCell>
                  {transaction.transactionDate
                    ? format(new Date(transaction.transactionDate), 'dd MMM yyyy')
                    : '-'}
                </TableCell>
                <TableCell>
                  {transaction.dueDate ? format(new Date(transaction.dueDate), 'dd MMM yyyy') : '-'}
                </TableCell>
                <TableCell>{transaction.currency}</TableCell>
                <TableCell className="text-right">
                  {transaction.amount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>
                  {transaction.productType === 'Invoice' ||
                  transaction.productType === 'Credit Note' ||
                  transaction.productType === 'Debit Note' ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {transaction.financeEligible ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          {transaction.financeEligible
                            ? 'Eligible for financing'
                            : transaction.financeEligibleReason || 'Not eligible'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {transaction.relatedTransactionRefs.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {transaction.relatedTransactionRefs.map((ref, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {ref}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(transaction.status)}>{transaction.status}</Badge>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedTransactions.length)} of {sortedTransactions.length}{' '}
            transactions
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              {totalPages > 5 && <span className="px-2">...</span>}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { SCFTransactionInquiryTable };
