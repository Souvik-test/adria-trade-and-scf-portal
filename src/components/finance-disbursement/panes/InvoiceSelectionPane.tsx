import React, { useState } from 'react';
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
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['eligible-invoices', formData.programId],
    queryFn: () => fetchEligibleInvoices(formData.programId),
    enabled: !!formData.programId
  });

  const filteredInvoices = invoices?.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.seller_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedInvoiceIds, invoiceId]
      : selectedInvoiceIds.filter(id => id !== invoiceId);
    
    setSelectedInvoiceIds(newSelection);

    const selectedInvoicesData = filteredInvoices
      .filter(inv => newSelection.includes(inv.id))
      .map(inv => ({
        invoice_id: inv.id,
        invoice_number: inv.invoice_number,
        amount: inv.total_amount,
        currency: inv.currency,
        due_date: inv.due_date
      }));

    onFieldChange('selectedInvoices', selectedInvoicesData);
    
    // Auto-populate invoice currency from first selected invoice
    if (selectedInvoicesData.length > 0) {
      onFieldChange('invoiceCurrency', selectedInvoicesData[0].currency);
    }
  };

  const handleSelectAll = () => {
    if (selectedInvoiceIds.length === filteredInvoices.length) {
      setSelectedInvoiceIds([]);
      onFieldChange('selectedInvoices', []);
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
      if (selectedInvoicesData.length > 0) {
        onFieldChange('invoiceCurrency', selectedInvoicesData[0].currency);
      }
    }
  };

  const totalAmount = filteredInvoices
    .filter(inv => selectedInvoiceIds.includes(inv.id))
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  const earliestDueDate = selectedInvoiceIds.length > 0
    ? new Date(Math.min(...filteredInvoices
        .filter(inv => selectedInvoiceIds.includes(inv.id))
        .map(inv => new Date(inv.due_date).getTime())))
    : null;

  const latestDueDate = selectedInvoiceIds.length > 0
    ? new Date(Math.max(...filteredInvoices
        .filter(inv => selectedInvoiceIds.includes(inv.id))
        .map(inv => new Date(inv.due_date).getTime())))
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading invoices...</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No eligible invoices found for this program
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