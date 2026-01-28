import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { fetchEligibleInvoices, type EligibleInvoice } from '@/services/financeDisbursementService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface InvoiceSelectionPaneProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
}

const InvoiceSelectionPane: React.FC<InvoiceSelectionPaneProps> = ({
  formData,
  onFieldChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>(formData.preSelectedInvoiceIds || []);

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['eligible-invoices', formData.programId],
    queryFn: () => fetchEligibleInvoices(formData.programId),
    enabled: !!formData.programId
  });

  // Build a merged list: pre-selected invoices + other eligible invoices from program
  const mergedInvoices = React.useMemo(() => {
    const preSelectedData = formData.preSelectedInvoicesData || [];
    const eligibleInvoices = invoices || [];
    
    // If we have pre-selected invoices from Transaction Inquiry, include them
    const preSelectedMapped: EligibleInvoice[] = preSelectedData.map((inv: any) => ({
      id: inv.id,
      invoice_number: inv.transactionReference || inv.rawData?.invoice_number || '',
      buyer_id: inv.rawData?.buyer_id || '',
      buyer_name: inv.rawData?.buyer_name || inv.anchorName || '',
      seller_id: inv.rawData?.seller_id || '',
      seller_name: inv.rawData?.seller_name || inv.counterPartyName || '',
      invoice_date: inv.transactionDate || inv.rawData?.invoice_date || '',
      due_date: inv.dueDate || inv.rawData?.due_date || '',
      total_amount: inv.amount || 0,
      currency: inv.currency || 'USD',
      status: inv.status || 'submitted',
      disbursed_amount: 0,
      remaining_finance_amount: inv.amount || 0,
      disbursement_count: 0,
      is_fully_financed: false
    }));

    // Create a set of pre-selected IDs to avoid duplicates
    const preSelectedIds = new Set(preSelectedMapped.map(inv => inv.id));
    
    // Filter out duplicates from eligible invoices
    const otherEligible = eligibleInvoices.filter(inv => !preSelectedIds.has(inv.id));
    
    // Combine: pre-selected first, then other eligible
    return [...preSelectedMapped, ...otherEligible];
  }, [formData.preSelectedInvoicesData, invoices]);

  const filteredInvoices = mergedInvoices.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.seller_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedInvoiceIds, invoiceId]
      : selectedInvoiceIds.filter(id => id !== invoiceId);
    
    setSelectedInvoiceIds(newSelection);

    const selectedInvoicesData = mergedInvoices
      .filter(inv => newSelection.includes(inv.id))
      .map(inv => ({
        invoice_id: inv.id,
        invoice_number: inv.invoice_number,
        amount: inv.total_amount,
        currency: inv.currency,
        due_date: inv.due_date
      }));

    onFieldChange('selectedInvoices', selectedInvoicesData);
    
    // Calculate total and update finance amounts
    const totalAmount = selectedInvoicesData.reduce((sum, inv) => sum + inv.amount, 0);
    const financePercentage = formData.financePercentage || 100;
    const maxFinanceAmount = totalAmount * (financePercentage / 100);
    
    onFieldChange('totalInvoiceAmount', totalAmount);
    onFieldChange('maxFinanceAmount', maxFinanceAmount);
    onFieldChange('financeAmount', maxFinanceAmount);
    
    // Auto-populate invoice currency from first selected invoice
    if (selectedInvoicesData.length > 0) {
      onFieldChange('invoiceCurrency', selectedInvoicesData[0].currency);
    }
  };

  const handleSelectAll = () => {
    if (selectedInvoiceIds.length === filteredInvoices.length) {
      setSelectedInvoiceIds([]);
      onFieldChange('selectedInvoices', []);
      onFieldChange('totalInvoiceAmount', 0);
      onFieldChange('maxFinanceAmount', 0);
      onFieldChange('financeAmount', 0);
    } else {
      const allIds = filteredInvoices.map(inv => inv.id);
      setSelectedInvoiceIds(allIds);
      const selectedInvoicesData = filteredInvoices.map(inv => ({
        invoice_id: inv.id,
        invoice_number: inv.invoice_number,
        amount: inv.total_amount,
        currency: inv.currency,
        due_date: inv.due_date
      }));
      onFieldChange('selectedInvoices', selectedInvoicesData);
      
      // Calculate totals
      const totalAmount = selectedInvoicesData.reduce((sum, inv) => sum + inv.amount, 0);
      const financePercentage = formData.financePercentage || 100;
      const maxFinanceAmount = totalAmount * (financePercentage / 100);
      
      onFieldChange('totalInvoiceAmount', totalAmount);
      onFieldChange('maxFinanceAmount', maxFinanceAmount);
      onFieldChange('financeAmount', maxFinanceAmount);
      
      if (selectedInvoicesData.length > 0) {
        onFieldChange('invoiceCurrency', selectedInvoicesData[0].currency);
      }
    }
  };

  const totalAmount = mergedInvoices
    .filter(inv => selectedInvoiceIds.includes(inv.id))
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  const earliestDueDate = selectedInvoiceIds.length > 0
    ? new Date(Math.min(...mergedInvoices
        .filter(inv => selectedInvoiceIds.includes(inv.id))
        .map(inv => new Date(inv.due_date).getTime())))
    : null;

  const latestDueDate = selectedInvoiceIds.length > 0
    ? new Date(Math.max(...mergedInvoices
        .filter(inv => selectedInvoiceIds.includes(inv.id))
        .map(inv => new Date(inv.due_date).getTime())))
    : null;

  // Handle pre-selected invoices: auto-select them when component mounts
  useEffect(() => {
    if (formData.preSelectedInvoiceIds?.length > 0 && mergedInvoices.length > 0) {
      const preSelectedIds = formData.preSelectedInvoiceIds;
      setSelectedInvoiceIds(preSelectedIds);
      
      const selectedInvoicesData = mergedInvoices
        .filter(inv => preSelectedIds.includes(inv.id))
        .map(inv => ({
          invoice_id: inv.id,
          invoice_number: inv.invoice_number,
          amount: inv.total_amount,
          currency: inv.currency,
          due_date: inv.due_date
        }));
      
      if (selectedInvoicesData.length > 0) {
        onFieldChange('selectedInvoices', selectedInvoicesData);
        
        const totalAmount = selectedInvoicesData.reduce((sum, inv) => sum + inv.amount, 0);
        const financePercentage = formData.financePercentage || 100;
        const maxFinanceAmount = totalAmount * (financePercentage / 100);
        
        onFieldChange('totalInvoiceAmount', totalAmount);
        onFieldChange('maxFinanceAmount', maxFinanceAmount);
        onFieldChange('financeAmount', maxFinanceAmount);
        onFieldChange('invoiceCurrency', selectedInvoicesData[0].currency);
      }
    }
  }, [formData.preSelectedInvoiceIds, mergedInvoices.length, formData.financePercentage]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {formData.preSelectedInvoiceIds?.length > 0 && (
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-md border border-green-200 dark:border-green-800">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Pre-selected Invoices</h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              {formData.preSelectedInvoiceIds.length} invoice(s) selected from Transaction Inquiry
            </p>
            <p className="text-sm text-green-800 dark:text-green-200 font-medium mt-1">
              Total Amount: {formData.invoiceCurrency} {formData.totalInvoiceAmount?.toLocaleString()}
            </p>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by invoice number, buyer, or seller..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={handleSelectAll}>
            {selectedInvoiceIds.length === filteredInvoices.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        {isLoading && !formData.preSelectedInvoicesData?.length ? (
          <div className="text-center py-8 text-muted-foreground">Loading invoices...</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {formData.programId 
              ? 'No eligible invoices found for this program' 
              : 'Please select a program first to view eligible invoices'}
          </div>
        ) : (
          <>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Invoice Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Invoice Amount</TableHead>
                    <TableHead className="text-right">Remaining Finance</TableHead>
                    <TableHead>Currency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedInvoiceIds.includes(invoice.id)}
                          onCheckedChange={(checked) => handleSelectInvoice(invoice.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {invoice.invoice_number}
                          {(invoice.disbursement_count || 0) > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Partial ({invoice.disbursement_count}/{formData.maxDisbursementsAllowed})
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{invoice.buyer_name}</TableCell>
                      <TableCell>{invoice.seller_name}</TableCell>
                      <TableCell>{new Date(invoice.invoice_date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">{invoice.total_amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium text-primary">
                        {invoice.remaining_finance_amount !== undefined 
                          ? invoice.remaining_finance_amount.toFixed(2)
                          : (invoice.total_amount * ((formData.financePercentage || 100) / 100)).toFixed(2)}
                      </TableCell>
                      <TableCell>{invoice.currency}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {selectedInvoiceIds.length > 0 && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">Selection Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Selected Count:</span>
                    <span className="ml-2 font-medium">{selectedInvoiceIds.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="ml-2 font-medium">{totalAmount.toFixed(2)} {formData.invoiceCurrency}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Earliest Due Date:</span>
                    <span className="ml-2 font-medium">{earliestDueDate?.toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Latest Due Date:</span>
                    <span className="ml-2 font-medium">{latestDueDate?.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceSelectionPane;