import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, FileText, Clock, AlertTriangle, CheckCircle, Users, Building, Banknote, CreditCard, PieChart, BarChart3, ExternalLink } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchTransactions } from '@/services/database';
import { useToast } from '@/hooks/use-toast';
import TransactionViewModal from '@/components/TransactionViewModal';

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

  // Add a function to filter transactions by product type
  const filteredTransactions = transactions.filter((transaction) => {
    if (transactionFilter === 'all') return true;
    // Consider "Import LC" as one filter and so forth
    if (transactionFilter === 'import-lc') return transaction.product_type === 'Import LC';
    if (transactionFilter === 'po') return transaction.product_type === 'PO';
    if (transactionFilter === 'pi') return transaction.product_type === 'PI';
    if (transactionFilter === 'invoice') return transaction.product_type === 'Invoice';
    if (transactionFilter === 'bg') return transaction.product_type === 'BG';
    // Fallback: show all if unknown filter
    return true;
  });

  const widgets = [
    {
      title: 'Transaction Status',
      type: 'chart',
      component: (
        <div className="space-y-2">
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
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Approved</span>
              <span className="text-green-600">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-[45%]"></div>
            </div>
            <div className="flex justify-between text-xs">
              <span>Pending</span>
              <span className="text-orange-600">30%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full w-[30%]"></div>
            </div>
            <div className="flex justify-between text-xs">
              <span>In Process</span>
              <span className="text-blue-600">25%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full w-[25%]"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Products',
      type: 'pie',
      component: (
        <div className="space-y-2">
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">1 Month</SelectItem>
              <SelectItem value="lc">3 Months</SelectItem>
              <SelectItem value="bg">6 Months</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-center">
            <PieChart className="w-16 h-16 text-corporate-blue" />
          </div>
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>LC</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Buyer's Credit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Guarantee</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Limit',
      type: 'status',
      component: (
        <div className="space-y-2">
          <Select value={limitFilter} onValueChange={setLimitFilter}>
            <SelectTrigger className="w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Unutilized & Available</SelectItem>
              <SelectItem value="utilized">Utilized</SelectItem>
              <SelectItem value="available">Available</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">06</div>
              <div className="text-gray-600">Import</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">64</div>
              <div className="text-gray-600">Bills</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'LC',
      type: 'dual',
      component: (
        <div className="space-y-2">
          <div className="text-xs text-gray-600">1 Month</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">06</div>
              <div className="text-gray-600">Export</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">64</div>
              <div className="text-gray-600">Outward Bank</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">64</div>
              <div className="text-gray-600">Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">64</div>
              <div className="text-gray-600">Inward Bank</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const bigWidgets = [
    {
      title: 'Insights by Watsaxi AI',
      content: (
        <div className="p-4 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500 mt-1" />
            <div className="text-sm">
              <div className="font-semibold">Alert: Credit Limit Review</div>
              <div className="text-xs text-gray-600">Credit limit has not been reviewed in 6 months. You can apply for Credit Limit Increase.</div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded">Liquidate your FD</button>
            <button className="px-3 py-1 bg-green-500 text-white text-xs rounded">Apply for Credit Limit</button>
          </div>
        </div>
      )
    },
    {
      title: 'News & Promotions',
      content: (
        <div className="p-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 text-white text-sm">
            <div className="font-semibold">UAE Foreign Trade hit record $517bn in 2024</div>
          </div>
        </div>
      )
    },
    {
      title: 'Notes',
      content: (
        <div className="p-4 space-y-2">
          <div className="text-xs text-gray-600">Add New</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Call today's schedule for pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Meet Credit Limit Officer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Check Pending Transactions</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Trade Finance Dashboard</h2>
      
      {/* My Transactions Table */}
      <Card className="cursor-move" draggable>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            My Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                        <td className="py-2">{transaction.customer_name || '-'}</td>
                        <td className="py-2">{formatAmount(transaction.amount, transaction.currency)}</td>
                        <td className={`py-2 font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </td>
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

      {/* Small Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map((widget, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-move" draggable>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {widget.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              {widget.component}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Large Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bigWidgets.map((widget, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-move" draggable>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {widget.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {widget.content}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transaction View Modal */}
      {selectedTransaction && (
        <TransactionViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};

export default DashboardWidgets;
