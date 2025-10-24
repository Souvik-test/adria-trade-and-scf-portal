import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

interface ReviewSubmitPaneProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
}

const ReviewSubmitPane: React.FC<ReviewSubmitPaneProps> = ({ formData }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Program & Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Program ID:</span>
              <p className="font-medium">{formData.programId}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Program Name:</span>
              <p className="font-medium">{formData.programName}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Product Code:</span>
              <p className="font-medium">{formData.productCode}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Product Name:</span>
              <p className="font-medium">{formData.productName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selected Invoices ({formData.selectedInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Currency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.selectedInvoices.map((invoice: any) => (
                  <TableRow key={invoice.invoice_id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>{invoice.currency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 bg-muted p-3 rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium">Total Amount:</span>
              <span className="font-semibold">
                {formData.selectedInvoices.reduce((sum: number, inv: any) => sum + inv.amount, 0).toFixed(2)} {formData.invoiceCurrency}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Finance Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Finance Date:</span>
              <p className="font-medium">{new Date(formData.financeDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Finance Due Date:</span>
              <p className="font-medium">{new Date(formData.financeDueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Finance Tenor:</span>
              <p className="font-medium">{formData.financeTenorDays} days</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Invoice Currency:</span>
              <p className="font-medium">{formData.invoiceCurrency}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Finance Currency:</span>
              <p className="font-medium">{formData.financeCurrency}</p>
            </div>
            {formData.exchangeRate && (
              <div>
                <span className="text-sm text-muted-foreground">Exchange Rate:</span>
                <p className="font-medium">1 {formData.invoiceCurrency} = {formData.exchangeRate.toFixed(6)} {formData.financeCurrency}</p>
              </div>
            )}
            <div>
              <span className="text-sm text-muted-foreground">Finance Amount:</span>
              <p className="font-medium">{formData.financeAmount.toFixed(2)} {formData.financeCurrency}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Interest Rate:</span>
              <p className="font-medium">{formData.interestRate.toFixed(2)}%</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Interest Amount:</span>
              <p className="font-medium">{formData.interestAmount.toFixed(2)} {formData.financeCurrency}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Total Repayment:</span>
              <p className="font-semibold text-lg">{formData.totalRepaymentAmount.toFixed(2)} {formData.financeCurrency}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Repayment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Auto Repayment:</span>
              <p className="font-medium">{formData.autoRepaymentEnabled ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Repayment Mode:</span>
              <p className="font-medium capitalize">{formData.repaymentMode}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Repayment Party:</span>
              <p className="font-medium">{formData.repaymentParty}</p>
            </div>
            {formData.repaymentAccount && (
              <div>
                <span className="text-sm text-muted-foreground">Repayment Account:</span>
                <p className="font-medium">{formData.repaymentAccount}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accounting Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Accounting Reference:</span>
              <p className="font-medium">{formData.accountingReference}</p>
            </div>
            <Separator className="my-2" />
            <div className="space-y-1">
              {formData.accountingEntries?.map((entry: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">
                    <span className="font-medium">{entry.entryType}</span> {entry.account} ({entry.glCode})
                  </span>
                  <span className="font-medium">{entry.amount.toFixed(2)} {formData.financeCurrency}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSubmitPane;