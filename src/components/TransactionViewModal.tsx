
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Building, CreditCard, FileText, MapPin } from 'lucide-react';
// import { fetchTransactions } from '@/services/database';
import { fetchTransactions } from '@/services/transactionService';
import { useToast } from '@/hooks/use-toast';

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

interface TransactionViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction;
  transactionRef?: string;
}

const TransactionViewModal: React.FC<TransactionViewModalProps> = ({
  isOpen,
  onClose,
  transaction: propTransaction,
  transactionRef
}) => {
  const [transaction, setTransaction] = useState<Transaction | null>(propTransaction || null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && transactionRef && !propTransaction) {
      loadTransactionByRef(transactionRef);
    } else if (propTransaction) {
      setTransaction(propTransaction);
    }
  }, [isOpen, transactionRef, propTransaction]);

  const loadTransactionByRef = async (ref: string) => {
    setIsLoading(true);
    try {
      const transactions = await fetchTransactions();
      const foundTransaction = transactions.find(t => t.transaction_ref === ref);
      if (foundTransaction) {
        setTransaction(foundTransaction);
      } else {
        toast({
          title: "Error",
          description: "Transaction not found",
          variant: "destructive"
        });
        onClose();
      }
    } catch (error) {
      console.error('Error loading transaction:', error);
      toast({
        title: "Error",
        description: "Failed to load transaction details",
        variant: "destructive"
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number | null, currency: string) => {
    if (!amount) return 'Not specified';
    return `${currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProductTypeIcon = (productType: string) => {
    switch (productType) {
      case 'PO':
        return <FileText className="w-5 h-5" />;
      case 'PI':
        return <FileText className="w-5 h-5" />;
      case 'Invoice':
        return <FileText className="w-5 h-5" />;
      case 'LC':
        return <CreditCard className="w-5 h-5" />;
      case 'BG':
        return <Building className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="text-center py-8">
            <div className="text-gray-500">Loading transaction details...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!transaction) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            {getProductTypeIcon(transaction.product_type)}
            Transaction Details: {transaction.transaction_ref}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Transaction Reference:</span>
                <span className="font-mono text-blue-600">{transaction.transaction_ref}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Product Type:</span>
                <Badge variant="outline" className="text-sm">
                  {transaction.product_type}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Status:</span>
                <Badge className={getStatusColor(transaction.status)}>
                  {transaction.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Amount:</span>
                <span className="font-semibold text-green-600">
                  {formatAmount(transaction.amount, transaction.currency)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Customer Name:</span>
                <span>{transaction.customer_name || 'Not specified'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Customer Reference:</span>
                <span>{transaction.customer_ref || 'Not specified'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Bank Reference:</span>
                <span>{transaction.bank_ref || 'Not specified'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Created Date:</span>
                <span>{formatDate(transaction.created_date)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Created By:</span>
                <span>{transaction.created_by}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Initiating Channel:</span>
                <span>{transaction.initiating_channel}</span>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="w-5 h-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Party Form:</span>
                <span>{transaction.party_form || 'Not specified'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Operations:</span>
                <span>{transaction.operations || 'Not specified'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Currency:</span>
                <span className="font-mono">{transaction.currency}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action buttons could be added here for future functionality */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionViewModal;
