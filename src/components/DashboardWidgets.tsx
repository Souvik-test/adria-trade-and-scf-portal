import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, FileText, Clock, AlertTriangle, CheckCircle, Users, Building, Banknote, CreditCard, PieChart, BarChart3, ExternalLink } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchTransactions } from '@/services/transactionService';
import { useToast } from '@/hooks/use-toast';
import TransactionViewModal from '@/components/TransactionViewModal';
import DashboardTransactionsTable from '@/components/DashboardTransactionsTable';
import DashboardSmallWidgets from '@/components/DashboardSmallWidgets';
import DashboardBigWidgets from '@/components/DashboardBigWidgets';

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

const DashboardWidgets: React.FC = () => {
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [limitFilter, setLimitFilter] = useState('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const formatAmount = (amount: number | null, currency: string) => {
    if (!amount) return '-';
    return `${currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'text-blue-600';
      case 'pending':
        return 'text-orange-600';
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Trade Finance Dashboard</h2>

      {/* Transactions Table Component */}
      <DashboardTransactionsTable
        transactions={transactions}
        isLoading={isLoading}
        transactionFilter={transactionFilter}
        setTransactionFilter={setTransactionFilter}
      />

      {/* Small Widgets */}
      <DashboardSmallWidgets
        transactionFilter={transactionFilter}
        setTransactionFilter={setTransactionFilter}
        productFilter={productFilter}
        setProductFilter={setProductFilter}
        limitFilter={limitFilter}
        setLimitFilter={setLimitFilter}
      />

      {/* Big Widgets */}
      <DashboardBigWidgets />
    </div>
  );
};

export default DashboardWidgets;
