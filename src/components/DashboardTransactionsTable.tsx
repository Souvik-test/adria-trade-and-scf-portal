import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import TransactionViewModal from "@/components/TransactionViewModal";
import TransactionWorkflowModal from "@/components/TransactionWorkflowModal";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { findWorkflowTemplate, getTemplateStages } from '@/services/workflowTemplateService';

interface Transaction {
  id: string;
  transaction_ref: string;
  product_type: string;
  process_type?: string;
  status: string;
  customer_name: string | null;
  amount: number | null;
  currency: string;
  created_date: string;
  created_by: string;
  initiating_channel: string;
  bank_ref: string | null;
  customer_ref: string | null;
  party_form: string | null;
  operations: string | null;
  business_application: string | null;
  form_data?: any;
}

interface Props {
  transactions: Transaction[];
  isLoading: boolean;
  transactionFilter: string;
  setTransactionFilter: (val: string) => void;
  onRefresh?: () => void;
}

const getStatusColor = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus === "rejected") return "text-red-600";
  if (normalizedStatus === "issued") return "text-green-600";
  if (normalizedStatus.endsWith(" completed")) return "text-blue-600";
  if (normalizedStatus === "sent to bank") return "text-purple-600";
  if (normalizedStatus === "pending") return "text-orange-600";
  return "text-gray-600";
};

const formatAmount = (amount: number | null, currency: string) => {
  if (!amount) return "-";
  return `${currency} ${amount.toLocaleString()}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getChannelLabel = (initiatingChannel: string, businessApplication: string | null) => {
  const app = (businessApplication || '').toLowerCase();
  if (app.includes('orchestrator') || app.includes('tscf bank')) return 'Bank';
  return initiatingChannel || 'Portal';
};

// Map product_type to product code for workflow lookup
const mapProductTypeToCode = (productType: string): string => {
  const mapping: Record<string, string> = {
    'Import LC': 'ILC',
    'Export LC': 'ELC',
    'Bank Guarantee': 'IBG',
    'Documentary Collection': 'ODC',
    'BG': 'OBG',
  };
  return mapping[productType] || productType;
};

// Map process_type to event code for workflow lookup
const mapProcessTypeToEventCode = (processType: string | undefined): string => {
  const mapping: Record<string, string> = {
    'Issuance': 'ISS',
    'Create': 'ISS',
    'Amendment': 'AMD',
    'Cancellation': 'CAN',
    'LC Transfer': 'TRF',
    'Assignment Request': 'ASG',
  };
  return mapping[processType || 'Issuance'] || 'ISS';
};

// Extract completed stage name from status
const getCompletedStageName = (status: string): string | null => {
  const normalizedStatus = status.toLowerCase();
  
  if (normalizedStatus === 'sent to bank') return 'Authorization';
  if (normalizedStatus === 'issued') return '__ALL_COMPLETE__';
  if (normalizedStatus === 'rejected' || normalizedStatus === 'draft') return null;
  
  // Dynamic parsing: "<Stage Name> Completed" → "<Stage Name>"
  if (normalizedStatus.endsWith(' completed')) {
    return status.slice(0, -' Completed'.length);
  }
  
  // Legacy status support
  const legacyMapping: Record<string, string> = {
    'submitted': 'Data Entry',
    'bank processing': 'Data Entry',
    'limit checked': 'Limit Check',
    'checker reviewed': 'Checker Review',
    'approved': 'Final Approval',
  };
  
  return legacyMapping[normalizedStatus] || null;
};

// Determine next stage for a transaction based on workflow template
const getNextStageForTransaction = async (transaction: Transaction): Promise<string> => {
  const status = transaction.status;
  const normalizedStatus = status.toLowerCase();
  
  // Terminal statuses
  if (normalizedStatus === 'issued') return 'Completed';
  if (normalizedStatus === 'rejected') return '-';
  if (normalizedStatus === 'draft') return 'Data Entry';
  
  const productCode = mapProductTypeToCode(transaction.product_type);
  const eventCode = mapProcessTypeToEventCode(transaction.process_type);
  const channelLabel = getChannelLabel(transaction.initiating_channel, transaction.business_application);
  const triggerType = channelLabel === 'Bank' ? 'Manual' : 'ClientPortal';
  
  try {
    const template = await findWorkflowTemplate(productCode, eventCode, triggerType);
    if (!template) return 'Unknown';
    
    const stages = await getTemplateStages(template.id);
    if (!stages.length) return 'Unknown';
    
    const completedStageName = getCompletedStageName(status);
    
    // If no completed stage, first stage is next
    if (!completedStageName) {
      return stages[0]?.stage_name || 'Data Entry';
    }
    
    if (completedStageName === '__ALL_COMPLETE__') return 'Completed';
    
    // Find completed stage index and return next stage
    const completedIndex = stages.findIndex(s => 
      s.stage_name.toLowerCase() === completedStageName.toLowerCase()
    );
    
    if (completedIndex >= 0 && completedIndex < stages.length - 1) {
      return stages[completedIndex + 1].stage_name;
    }
    
    // If last stage completed, it's done
    if (completedIndex === stages.length - 1) return 'Final Approval';
    
    return stages[0]?.stage_name || 'Unknown';
  } catch (error) {
    console.error('Error getting next stage:', error);
    return 'Unknown';
  }
};

const PAGE_SIZE = 10;

const DashboardTransactionsTable: React.FC<Props> = ({
  transactions,
  isLoading,
  transactionFilter,
  setTransactionFilter,
  onRefresh,
}) => {
  const { toast } = useToast();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [nextStageCache, setNextStageCache] = useState<Record<string, string>>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Load next stages for all transactions
  useEffect(() => {
    const loadNextStages = async () => {
      const cache: Record<string, string> = {};
      for (const transaction of transactions) {
        try {
          cache[transaction.id] = await getNextStageForTransaction(transaction);
        } catch {
          cache[transaction.id] = 'Unknown';
        }
      }
      setNextStageCache(cache);
    };
    if (transactions.length > 0) {
      loadNextStages();
    }
  }, [transactions]);

  // Updated filtering to include Documentary Collection
  const filteredTransactions = transactions.filter((transaction) => {
    if (transactionFilter === "all") return true;
    if (transactionFilter === "import-lc") return transaction.product_type === "Import LC";
    if (transactionFilter === "export-lc") return transaction.product_type === "Export LC";
    if (transactionFilter === "export-lc-bills") return transaction.product_type === "EXPORT LC BILLS";
    if (transactionFilter === "resolve-discrepancies") return transaction.product_type === "EXPORT LC BILLS" && transaction.process_type === "RESOLVE DISCREPANCIES";
    if (transactionFilter === "lc-transfer") return transaction.product_type === "Export LC" && transaction.process_type === "LC Transfer";
    if (transactionFilter === "assignment-request") return transaction.product_type === "Export LC" && transaction.process_type === "Assignment Request";
    if (transactionFilter === "documentary-collection") return transaction.product_type === "Documentary Collection";
    if (transactionFilter === "po") return transaction.product_type === "PO";
    if (transactionFilter === "pi") return transaction.product_type === "PI";
    if (transactionFilter === "invoice") return transaction.product_type === "Invoice";
    if (transactionFilter === "credit-note") return transaction.product_type === "Credit Note";
    if (transactionFilter === "debit-note") return transaction.product_type === "Debit Note";
    if (transactionFilter === "bg") return transaction.product_type === "BG";
    return true;
  });

  // Calculate pagination variables
  const total = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pagedTransactions =
    filteredTransactions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset pagination when filter changes or new data
  React.useEffect(() => {
    setCurrentPage(1);
  }, [transactionFilter, transactions.length]);

  // Check if transaction is workflow-eligible (can be continued in workflow)
  const isWorkflowEligible = (transaction: Transaction): boolean => {
    const status = transaction.status.toLowerCase();
    // Only allow workflow for transactions that haven't been fully processed
    return status !== 'issued' && status !== 'rejected' && status !== 'cancelled';
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    
    // If transaction is workflow-eligible, open workflow modal
    // Otherwise, open view-only modal
    if (isWorkflowEligible(transaction)) {
      setIsWorkflowModalOpen(true);
    } else {
      setIsViewModalOpen(true);
    }
  };

  const handleTransactionUpdated = () => {
    // Trigger a refresh of the transactions list
    setRefreshTrigger(prev => prev + 1);
    if (onRefresh) onRefresh();
  };

  // Handler for changing page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Card className="cursor-move" draggable>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            My Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 max-w-xs">
            <Select value={transactionFilter} onValueChange={setTransactionFilter}>
              <SelectTrigger className="w-full text-xs">
                <SelectValue placeholder="Filter Transactions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="import-lc">Import Letter of Credit</SelectItem>
                <SelectItem value="export-lc">Export Letter of Credit</SelectItem>
                <SelectItem value="export-lc-bills">Export LC Bills</SelectItem>
                <SelectItem value="resolve-discrepancies">Resolve Discrepancies</SelectItem>
                <SelectItem value="lc-transfer">LC Transfer</SelectItem>
                <SelectItem value="assignment-request">Assignment Request</SelectItem>
                <SelectItem value="documentary-collection">Documentary Collection</SelectItem>
                <SelectItem value="po">Purchase Order (PO)</SelectItem>
                <SelectItem value="pi">Proforma Invoice (PI)</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="credit-note">Credit Note</SelectItem>
                <SelectItem value="debit-note">Debit Note</SelectItem>
                <SelectItem value="bg">Bank Guarantee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Loading transactions...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                {`Showing ${(total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1)}-${
                  Math.min(currentPage * PAGE_SIZE, total)
                } of ${total} transactions`}
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2">Transaction Ref</th>
                    <th className="pb-2">Product Type</th>
                    <th className="pb-2">Process</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Next Stage</th>
                    <th className="pb-2">Created Date</th>
                    <th className="pb-2">Business Application</th>
                    <th className="pb-2">Channel</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {pagedTransactions.length > 0 ? (
                    pagedTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-2">
                          <button
                            onClick={() => handleTransactionClick(transaction)}
                            className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                          >
                            {transaction.transaction_ref}
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>
                        <td className="py-2">{transaction.product_type}</td>
                        <td className="py-2">{transaction.process_type || "-"}</td>
                        <td className="py-2">{transaction.customer_name || "-"}</td>
                        <td className="py-2">{formatAmount(transaction.amount, transaction.currency)}</td>
                        <td className={`py-2 font-medium ${getStatusColor(transaction.status)}`}>{transaction.status}</td>
                        <td className="py-2 text-purple-600 font-medium">{nextStageCache[transaction.id] || 'Loading...'}</td>
                        <td className="py-2">{formatDate(transaction.created_date)}</td>
                        <td className="py-2">{transaction.business_application || 'Adria TSCF Client'}</td>
                        <td className="py-2">{getChannelLabel(transaction.initiating_channel, transaction.business_application)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-gray-500 dark:text-gray-400">
                        No transactions found. Create your first PO, PI, Invoice, Import LC, Export LC Bills, Documentary Collection, LC Transfer, or Assignment Request to see them here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        aria-disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {/* Show numbered page links */}
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={i + 1 === currentPage}
                          onClick={e => {
                            e.preventDefault();
                            handlePageChange(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        aria-disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {selectedTransaction && (
        <>
          <TransactionViewModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            transaction={selectedTransaction}
          />
          <TransactionWorkflowModal
            isOpen={isWorkflowModalOpen}
            onClose={() => setIsWorkflowModalOpen(false)}
            transaction={selectedTransaction}
            onTransactionUpdated={handleTransactionUpdated}
          />
        </>
      )}
    </>
  );
};

export default DashboardTransactionsTable;
