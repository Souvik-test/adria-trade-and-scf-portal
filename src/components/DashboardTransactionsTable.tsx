
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import TransactionViewModal from "@/components/TransactionViewModal";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  transaction_ref: string;
  product_type: string;
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
}

interface Props {
  transactions: Transaction[];
  isLoading: boolean;
  transactionFilter: string;
  setTransactionFilter: (val: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "submitted":
      return "text-blue-600";
    case "pending":
      return "text-orange-600";
    case "approved":
      return "text-green-600";
    case "rejected":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const formatAmount = (amount: number | null, currency: string) => {
  if (!amount) return "-";
  return `${currency} ${amount.toLocaleString()}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const DashboardTransactionsTable: React.FC<Props> = ({
  transactions,
  isLoading,
  transactionFilter,
  setTransactionFilter,
}) => {
  const { toast } = useToast();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Fix: Support correct filtering for Import LCs by matching value and label
  const filteredTransactions = transactions.filter((transaction) => {
    if (transactionFilter === "all") return true;
    if (transactionFilter === "import-lc") return transaction.product_type === "Import LC";
    if (transactionFilter === "po") return transaction.product_type === "PO";
    if (transactionFilter === "pi") return transaction.product_type === "PI";
    if (transactionFilter === "invoice") return transaction.product_type === "Invoice";
    if (transactionFilter === "bg") return transaction.product_type === "BG";
    return true;
  });

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
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
                <SelectItem value="po">Purchase Order (PO)</SelectItem>
                <SelectItem value="pi">Proforma Invoice (PI)</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
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
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2">Transaction Ref</th>
                    <th className="pb-2">Product Type</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Created Date</th>
                    <th className="pb-2">Created By</th>
                    <th className="pb-2">Channel</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
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
                        <td className="py-2">{transaction.customer_name || "-"}</td>
                        <td className="py-2">{formatAmount(transaction.amount, transaction.currency)}</td>
                        <td className={`py-2 font-medium ${getStatusColor(transaction.status)}`}>{transaction.status}</td>
                        <td className="py-2">{formatDate(transaction.created_date)}</td>
                        <td className="py-2">{transaction.created_by}</td>
                        <td className="py-2">{transaction.initiating_channel}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-500 dark:text-gray-400">
                        No transactions found. Create your first PO, PI, Invoice, or Import LC to see them here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      {selectedTransaction && (
        <TransactionViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          transaction={selectedTransaction}
        />
      )}
    </>
  );
};

export default DashboardTransactionsTable;
