import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SCFTransactionRow, ColumnConfig } from '@/types/scfTransaction';
import { CheckCircle2, XCircle, ArrowUpDown, MoreVertical, Clock, DollarSign, Send } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InvoiceViewModal } from './scf-transaction-inquiry/InvoiceViewModal';
import { FinanceDisbursementViewModal } from './scf-transaction-inquiry/FinanceDisbursementViewModal';
import { EarlyPaymentRequestModal } from './early-payment/EarlyPaymentRequestModal';
import FinanceDisbursementModal from './finance-disbursement/FinanceDisbursementModal';
import { RequestPaymentModal } from './payment-request/RequestPaymentModal';
import {
  fetchInvoiceDetails,
  fetchDisbursementDetails,
  fetchRepaymentDetails,
  determineReferenceType,
} from '@/services/scfTransactionDetailService';
import { toast } from '@/hooks/use-toast';

interface SCFTransactionInquiryTableProps {
  transactions: SCFTransactionRow[];
  loading: boolean;
  columnConfig: ColumnConfig[];
}

type SortField = keyof SCFTransactionRow | null;
type SortDirection = 'asc' | 'desc' | null;

const SCFTransactionInquiryTable: React.FC<SCFTransactionInquiryTableProps> = ({
  transactions,
  loading,
  columnConfig,
}) => {
  const visibleColumns = React.useMemo(() => columnConfig.filter(col => col.visible), [columnConfig]);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showDisbursementModal, setShowDisbursementModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [selectedDisbursement, setSelectedDisbursement] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [showEarlyPaymentModal, setShowEarlyPaymentModal] = useState(false);
  const [showFinanceDisbursementModal, setShowFinanceDisbursementModal] = useState(false);
  const [showRequestPaymentModal, setShowRequestPaymentModal] = useState(false);

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

  const renderCell = (transaction: SCFTransactionRow, columnId: string) => {
    switch (columnId) {
      case 'productType':
        return <TableCell key={columnId} className="font-medium">{transaction.productType}</TableCell>;
      
      case 'transactionReference':
        return <TableCell key={columnId}>{transaction.transactionReference}</TableCell>;
      
      case 'programId':
        return <TableCell key={columnId}>{transaction.programId}</TableCell>;
      
      case 'programName':
        return <TableCell key={columnId}>{transaction.programName}</TableCell>;
      
      case 'anchorId':
        return <TableCell key={columnId}>{transaction.anchorId}</TableCell>;
      
      case 'anchorName':
        return <TableCell key={columnId}>{transaction.anchorName}</TableCell>;
      
      case 'counterPartyId':
        return <TableCell key={columnId}>{transaction.counterPartyId}</TableCell>;
      
      case 'counterPartyName':
        return <TableCell key={columnId}>{transaction.counterPartyName}</TableCell>;
      
      case 'transactionDate':
        return (
          <TableCell key={columnId}>
            {transaction.transactionDate
              ? format(new Date(transaction.transactionDate), 'dd MMM yyyy')
              : '-'}
          </TableCell>
        );
      
      case 'dueDate':
        return (
          <TableCell key={columnId}>
            {transaction.dueDate 
              ? format(new Date(transaction.dueDate), 'dd MMM yyyy') 
              : '-'}
          </TableCell>
        );
      
      case 'currency':
        return <TableCell key={columnId}>{transaction.currency}</TableCell>;
      
      case 'amount':
        return (
          <TableCell key={columnId} className="text-right">
            {transaction.amount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </TableCell>
        );
      
      case 'financeEligible':
        return (
          <TableCell key={columnId}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    {transaction.financeEligible ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span>{transaction.financeEligible ? 'Yes' : 'No'}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {transaction.financeEligibleReason || 
                    (transaction.financeEligible 
                      ? 'This transaction is eligible for financing' 
                      : 'This transaction is not eligible for financing')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
        );
      
      case 'relatedTransactionRefs':
        return (
          <TableCell key={columnId}>
            {transaction.relatedTransactionRefs.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {transaction.relatedTransactionRefs.map((ref, idx) => (
                  <span
                    key={idx}
                    className="text-primary hover:underline cursor-pointer text-sm font-medium"
                    onClick={() => handleReferenceClick(ref)}
                  >
                    {ref}
                    {idx < transaction.relatedTransactionRefs.length - 1 && ', '}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </TableCell>
        );
      
      case 'status':
        return (
          <TableCell key={columnId}>
            <Badge variant={getStatusVariant(transaction.status)}>
              {transaction.status}
            </Badge>
          </TableCell>
        );
      
      default:
        return <TableCell key={columnId}>-</TableCell>;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const eligibleIds = paginatedTransactions
        .filter(t => t.productType === 'Invoice' && t.financeEligible && t.status !== 'Financed')
        .map(t => t.id);
      setSelectedTransactions(new Set(eligibleIds));
    } else {
      setSelectedTransactions(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelection = new Set(selectedTransactions);
    if (checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    setSelectedTransactions(newSelection);
  };

  const getSelectedInvoices = () => {
    return transactions.filter(t => selectedTransactions.has(t.id));
  };

  const validateSameProgram = (invoices: SCFTransactionRow[]) => {
    if (invoices.length === 0) return { valid: false, message: "No invoices selected" };
    const programIds = new Set(invoices.map(i => i.programId));
    if (programIds.size > 1) {
      return { valid: false, message: "Selected invoices must be from the same program" };
    }
    return { valid: true, programId: Array.from(programIds)[0] };
  };

  const canRequestEarlyPayment = (invoices: SCFTransactionRow[]) => {
    return invoices.every(inv => inv.rawData?.early_payment_discount_enabled === true);
  };

  const handleActionClick = (action: 'early_payment' | 'request_finance' | 'request_payment', transaction?: SCFTransactionRow) => {
    const invoicesToProcess = transaction ? [transaction] : getSelectedInvoices();
    const validation = validateSameProgram(invoicesToProcess);
    
    if (!validation.valid) {
      toast({
        title: "Invalid Selection",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    switch (action) {
      case 'early_payment':
        if (!canRequestEarlyPayment(invoicesToProcess)) {
          toast({
            title: "Not Eligible",
            description: "Selected invoices' programs do not have Early Payment Discount enabled",
            variant: "destructive",
          });
          return;
        }
        setShowEarlyPaymentModal(true);
        break;
      
      case 'request_finance':
        setShowFinanceDisbursementModal(true);
        break;
      
      case 'request_payment':
        setShowRequestPaymentModal(true);
        break;
    }
  };

  const handleReferenceClick = async (reference: string) => {
    setLoadingDetails(true);
    try {
      const refType = determineReferenceType(reference);

      if (refType === 'invoice') {
        const invoiceData = await fetchInvoiceDetails(reference);
        if (invoiceData) {
          setSelectedInvoice(invoiceData);
          setShowInvoiceModal(true);
        } else {
          toast({
            title: 'Not Found',
            description: `Invoice ${reference} not found`,
            variant: 'destructive',
          });
        }
      } else if (refType === 'loan') {
        const disbursementData = await fetchDisbursementDetails(reference);
        if (disbursementData) {
          setSelectedDisbursement(disbursementData);
          setShowDisbursementModal(true);
        } else {
          toast({
            title: 'Not Found',
            description: `Finance disbursement ${reference} not found`,
            variant: 'destructive',
          });
        }
      } else if (refType === 'repayment') {
        const repaymentData = await fetchRepaymentDetails(reference);
        if (repaymentData) {
          // Treat repayment like a disbursement for display purposes
          setSelectedDisbursement(repaymentData);
          setShowDisbursementModal(true);
        } else {
          toast({
            title: 'Not Found',
            description: `Repayment ${reference} not found`,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Unknown Reference Type',
          description: `Cannot determine type for ${reference}`,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error fetching reference details:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch transaction details',
        variant: 'destructive',
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    const column = columnConfig.find(col => col.id === field);
    if (!column?.sortable) {
      return <TableHead>{children}</TableHead>;
    }

    return (
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
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading transactions...</div>
      </div>
    );
  }

  return (
    <>
      <InvoiceViewModal
        open={showInvoiceModal}
        onOpenChange={setShowInvoiceModal}
        invoice={selectedInvoice}
      />
      <FinanceDisbursementViewModal
        open={showDisbursementModal}
        onOpenChange={setShowDisbursementModal}
        disbursement={selectedDisbursement}
      />
      
      <EarlyPaymentRequestModal
        open={showEarlyPaymentModal}
        onOpenChange={(open) => {
          setShowEarlyPaymentModal(open);
          if (!open) setSelectedTransactions(new Set());
        }}
        selectedInvoices={getSelectedInvoices()}
        onSuccess={() => {
          setShowEarlyPaymentModal(false);
          setSelectedTransactions(new Set());
        }}
      />

      <FinanceDisbursementModal
        isOpen={showFinanceDisbursementModal}
        onClose={() => {
          setShowFinanceDisbursementModal(false);
          setSelectedTransactions(new Set());
        }}
      />

      <RequestPaymentModal
        open={showRequestPaymentModal}
        onOpenChange={(open) => {
          setShowRequestPaymentModal(open);
          if (!open) setSelectedTransactions(new Set());
        }}
        selectedInvoices={getSelectedInvoices()}
        onSuccess={() => {
          setShowRequestPaymentModal(false);
          setSelectedTransactions(new Set());
        }}
      />
      
      <div className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedTransactions.size > 0 && selectedTransactions.size === paginatedTransactions.filter(t => t.productType === 'Invoice' && t.financeEligible && t.status !== 'Financed').length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              {visibleColumns.map(col => (
                <SortableHeader key={col.id} field={col.id as SortField}>
                  {col.label}
                </SortableHeader>
              ))}
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 2} className="text-center py-8 text-muted-foreground">
                  No transactions found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTransactions.has(transaction.id)}
                      onCheckedChange={(checked) => handleSelectRow(transaction.id, checked as boolean)}
                      disabled={
                        transaction.productType !== 'Invoice' || 
                        !transaction.financeEligible || 
                        transaction.status === 'Financed'
                      }
                    />
                  </TableCell>
                  {visibleColumns.map(col => renderCell(transaction, col.id))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={
                            transaction.productType !== 'Invoice' || 
                            !transaction.financeEligible || 
                            transaction.status === 'Financed'
                          }
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {transaction.rawData?.early_payment_discount_enabled && (
                          <DropdownMenuItem onClick={() => handleActionClick('early_payment', transaction)}>
                            <Clock className="mr-2 h-4 w-4" />
                            Early Payment Request
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleActionClick('request_finance', transaction)}>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Request Finance
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleActionClick('request_payment', transaction)}>
                          <Send className="mr-2 h-4 w-4" />
                          Request Payment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Records per page:</span>
              <Select 
                value={String(pageSize)} 
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="40">40</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, sortedTransactions.length)} of {sortedTransactions.length}{' '}
              transactions
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              « First
            </Button>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last »
            </Button>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export { SCFTransactionInquiryTable };
