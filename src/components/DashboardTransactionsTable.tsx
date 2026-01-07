import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import TransactionViewModal from "@/components/TransactionViewModal";
import TransactionWorkflowModal from "@/components/TransactionWorkflowModal";
import RejectionReasonModal from "@/components/RejectionReasonModal";
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
  // Handle "<Stage Name> Rejected" format
  if (normalizedStatus.endsWith(' rejected')) return "text-destructive";
  if (normalizedStatus === "rejected") return "text-destructive";
  if (normalizedStatus === "issued") return "text-green-600";
  if (normalizedStatus.endsWith(" completed")) return "text-blue-600";
  if (normalizedStatus === "sent to bank") return "text-purple-600";
  if (normalizedStatus === "pending") return "text-orange-600";
  return "text-muted-foreground";
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
    'Remittance': 'REM',
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
    'Customer Credit Transfer (pacs.008)': 'PIO',
    'FI Credit Transfer (pacs.009)': 'PIO',
    'Financial Institution Transfer (pacs.009)': 'PIO',
  };
  return mapping[processType || 'Issuance'] || 'ISS';
};

// Extract completed stage name from status
// Handles new format "<Stage Name> Completed-<Channel>" and legacy format "<Stage Name> Completed"
const getCompletedStageName = (status: string): string | null => {
  const normalizedStatus = status.toLowerCase();
  
  if (normalizedStatus === 'sent to bank') return 'Authorization';
  if (normalizedStatus === 'issued') return '__ALL_COMPLETE__';
  if (normalizedStatus === 'rejected' || normalizedStatus === 'draft') return null;
  // Handle "<Stage Name> Rejected" format - not a completed stage
  if (normalizedStatus.endsWith(' rejected')) return null;
  
  // NEW: Handle format "<Stage Name> Completed-<Channel>" (e.g., "Data Entry Completed-Portal")
  const completedWithChannelMatch = status.match(/^(.+) Completed-(.+)$/i);
  if (completedWithChannelMatch) {
    return completedWithChannelMatch[1]; // Return just the stage name
  }
  
  // Legacy format: "<Stage Name> Completed" (without channel suffix)
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

// Get current business application from login context
const getCurrentBusinessApp = (): string => {
  return localStorage.getItem('businessCentre') || 'Adria TSCF Client';
};

// Get channel from current business application (for access control)
const getChannelFromCurrentApp = (): string => {
  const app = getCurrentBusinessApp().toLowerCase();
  if (app.includes('orchestrator') || app.includes('bank')) return 'Bank';
  return 'Portal';
};

// Determine trigger type from TRANSACTION STATUS with embedded channel
// Status format: "<Stage Name> Completed-<Channel>" (e.g., "Data Entry Completed-Portal")
// This ensures Next Stage is calculated based on where the transaction currently is in its lifecycle
const getTriggerTypeFromTransactionStatus = (status: string, initiatingChannel: string): string => {
  const normalizedStatus = status.toLowerCase();
  
  // Bank phase statuses - always use Manual (Bank) workflow
  const bankPhaseStatuses = ['sent to bank', 'bank processing', 'limit checked', 'issued'];
  if (bankPhaseStatuses.some(s => normalizedStatus.includes(s))) {
    return 'Manual';
  }
  
  // NEW: Parse channel from status format "<Stage Name> Completed-<Channel>"
  const completedWithChannelMatch = status.match(/^(.+) Completed-(.+)$/i);
  if (completedWithChannelMatch) {
    const channel = completedWithChannelMatch[2].toLowerCase();
    // Bank channels: Product Processor, Back Office, Bank
    if (channel.includes('processor') || channel.includes('office') || channel === 'bank') {
      return 'Manual';
    }
    // Portal channel
    return 'ClientPortal';
  }
  
  // Legacy format: "<Stage Name> Completed" (without channel suffix)
  if (normalizedStatus.endsWith(' completed')) {
    const stageName = status.slice(0, -' Completed'.length).toLowerCase();
    
    // Bank-specific stages - use Manual workflow
    const bankStages = ['domiciliaion', 'domiciliation', 'limit check', 'final approval', 'checker review', 'sanction check'];
    if (bankStages.some(stage => stageName.includes(stage))) {
      return 'Manual';
    }
    
    // Portal-specific stages - use ClientPortal workflow
    const portalStages = ['data entry', 'authorization', 'review'];
    if (portalStages.some(stage => stageName.includes(stage)) && initiatingChannel === 'Portal') {
      return 'ClientPortal';
    }
  }
  
  // Default based on originating channel
  return initiatingChannel === 'Bank' ? 'Manual' : 'ClientPortal';
};

// Determine next stage for a transaction based on workflow template
const getNextStageForTransaction = async (transaction: Transaction): Promise<string> => {
  const status = transaction.status;
  const normalizedStatus = status.toLowerCase();
  
  // Terminal statuses
  if (normalizedStatus === 'issued') return 'Completed';
  if (normalizedStatus === 'rejected') return '-';
  if (normalizedStatus === 'draft') return 'Data Entry';
  
  // Handle "<Stage Name> Rejected" format - return the reject target stage
  const rejectedMatch = status.match(/^(.+) Rejected$/i);
  if (rejectedMatch) {
    const rejectedFromStageName = rejectedMatch[1];
    const productCode = mapProductTypeToCode(transaction.product_type);
    const eventCode = mapProcessTypeToEventCode(transaction.process_type);
    const triggerType = getTriggerTypeFromTransactionStatus(status, transaction.initiating_channel);
    
    try {
      const template = await findWorkflowTemplate(productCode, eventCode, triggerType);
      if (!template) return 'Data Entry';
      
      const stages = await getTemplateStages(template.id);
      
      // Find the stage that was rejected
      const rejectedStage = stages.find(s => 
        s.stage_name.toLowerCase() === rejectedFromStageName.toLowerCase()
      );
      
      if (rejectedStage?.reject_to_stage_id) {
        // Find the target stage by ID
        const targetStage = stages.find(s => s.id === rejectedStage.reject_to_stage_id);
        return targetStage?.stage_name || 'Data Entry';
      }
      
      return 'Data Entry'; // Default fallback
    } catch (error) {
      console.error('Error getting reject target stage:', error);
      return 'Data Entry';
    }
  }
  
  const productCode = mapProductTypeToCode(transaction.product_type);
  const eventCode = mapProcessTypeToEventCode(transaction.process_type);
  
  // Use TRANSACTION STATUS to determine which workflow to fetch for Next Stage calculation
  // This ensures accuracy regardless of where the user is currently logged in
  const triggerType = getTriggerTypeFromTransactionStatus(status, transaction.initiating_channel);
  
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
    
    // If last stage completed, transaction is complete
    if (completedIndex === stages.length - 1) return 'Completed';
    
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
  
  // State for rejection reason modal
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionDetails, setRejectionDetails] = useState<{
    transactionRef: string;
    status: string;
    rejectionReason?: string;
    rejectedFromStage?: string;
    rejectedAt?: string;
    rejectedBy?: string;
    targetStage?: string;
  } | null>(null);
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

  // Handler to open rejection reason modal
  const handleStatusClick = (transaction: Transaction) => {
    // Parse operations/form_data to get rejection details
    let formData: any = {};
    try {
      if (transaction.operations) {
        formData = JSON.parse(transaction.operations);
      }
    } catch (e) {
      console.error('Error parsing form data:', e);
    }
    
    setRejectionDetails({
      transactionRef: transaction.transaction_ref,
      status: transaction.status,
      rejectionReason: formData.rejection_reason,
      rejectedFromStage: formData.rejected_from_stage,
      rejectedAt: formData.rejected_at,
      rejectedBy: formData.rejected_by,
      targetStage: nextStageCache[transaction.id],
    });
    setIsRejectionModalOpen(true);
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
                    <th className="pb-2">Originating Channel</th>
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
                        <td className={`py-2 font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status.toLowerCase().endsWith(' rejected') ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusClick(transaction);
                              }}
                              className="text-destructive hover:underline cursor-pointer flex items-center gap-1"
                            >
                              {transaction.status}
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          ) : (
                            transaction.status
                          )}
                        </td>
                        <td className="py-2 text-purple-600 font-medium">{nextStageCache[transaction.id] || 'Loading...'}</td>
                        <td className="py-2">{formatDate(transaction.created_date)}</td>
                        <td className="py-2">{getChannelLabel(transaction.initiating_channel, transaction.business_application)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-gray-500 dark:text-gray-400">
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
          {rejectionDetails && (
            <RejectionReasonModal
              isOpen={isRejectionModalOpen}
              onClose={() => setIsRejectionModalOpen(false)}
              transactionRef={rejectionDetails.transactionRef}
              status={rejectionDetails.status}
              rejectionReason={rejectionDetails.rejectionReason}
              rejectedFromStage={rejectionDetails.rejectedFromStage}
              rejectedAt={rejectionDetails.rejectedAt}
              rejectedBy={rejectionDetails.rejectedBy}
              targetStage={rejectionDetails.targetStage}
            />
          )}
        </>
      )}
    </>
  );
};

export default DashboardTransactionsTable;
