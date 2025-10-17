import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Download, Search, X, FileSpreadsheet } from 'lucide-react';
import { fetchSCFTransactions, exportToCSV, exportToExcel } from '@/services/scfTransactionInquiryService';
import { TransactionFilters, SCFTransactionRow } from '@/types/scfTransaction';
import SCFTransactionInquiryTable from './SCFTransactionInquiryTable';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const SCFTransactionInquiry: React.FC = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<SCFTransactionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [filters, setFilters] = useState<TransactionFilters>({
    productType: '',
    transactionReference: '',
    programId: '',
    anchorId: '',
    counterPartyId: '',
    status: '',
    fromDate: '',
    toDate: '',
  });

  const handleFilterChange = (field: keyof TransactionFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await fetchSCFTransactions(filters);
      setTransactions(data);
      toast({
        title: 'Success',
        description: `Found ${data.length} transactions`,
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      productType: '',
      transactionReference: '',
      programId: '',
      anchorId: '',
      counterPartyId: '',
      status: '',
      fromDate: '',
      toDate: '',
    });
  };

  const handleExportCSV = () => {
    try {
      exportToCSV(transactions);
      toast({
        title: 'Success',
        description: 'Transactions exported to CSV',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export CSV',
        variant: 'destructive',
      });
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportToExcel(transactions);
      toast({
        title: 'Success',
        description: 'Transactions exported to Excel',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export Excel',
        variant: 'destructive',
      });
    }
  };

  // Load data on mount with default filters (last 6 months)
  useEffect(() => {
    handleSearch();
  }, []);

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="space-y-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Transaction Inquiry - Supply Chain Finance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter Panel */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <div className="flex items-center justify-between">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>
                    Filters {activeFilterCount > 0 && `(${activeFilterCount} active)`}
                  </span>
                  <span className="text-xs">
                    {filtersOpen ? '▲ Hide' : '▼ Show'}
                  </span>
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Product Type</Label>
                  <Select
                    value={filters.productType}
                    onValueChange={value => handleFilterChange('productType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Invoice">Invoice</SelectItem>
                      <SelectItem value="Credit Note">Credit Note</SelectItem>
                      <SelectItem value="Debit Note">Debit Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Transaction Reference</Label>
                  <Input
                    placeholder="Search reference..."
                    value={filters.transactionReference}
                    onChange={e => handleFilterChange('transactionReference', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Program ID</Label>
                  <Input
                    placeholder="Enter program ID..."
                    value={filters.programId}
                    onChange={e => handleFilterChange('programId', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Anchor ID</Label>
                  <Input
                    placeholder="Enter anchor ID..."
                    value={filters.anchorId}
                    onChange={e => handleFilterChange('anchorId', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Counter Party ID</Label>
                  <Input
                    placeholder="Enter counter party ID..."
                    value={filters.counterPartyId}
                    onChange={e => handleFilterChange('counterPartyId', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Input
                    type="date"
                    value={filters.fromDate}
                    onChange={e => handleFilterChange('fromDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Input
                    type="date"
                    value={filters.toDate}
                    onChange={e => handleFilterChange('toDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={value => handleFilterChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="Lodged">Lodged</SelectItem>
                      <SelectItem value="Financed">Financed</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Disbursed">Disbursed</SelectItem>
                      <SelectItem value="Repaid">Repaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button onClick={handleSearch} disabled={loading} className="flex-1">
                  <Search className="mr-2 h-4 w-4" />
                  {loading ? 'Searching...' : 'Search'}
                </Button>
                <Button onClick={handleClearFilters} variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Export Buttons */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-sm text-muted-foreground">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExportCSV} variant="outline" size="sm" disabled={transactions.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={handleExportExcel} variant="outline" size="sm" disabled={transactions.length === 0}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </div>

          {/* Transaction Table */}
          <SCFTransactionInquiryTable transactions={transactions} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SCFTransactionInquiry;
