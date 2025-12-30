import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImportLCFormData } from '@/types/importLC';
import { CheckCircle, Calculator, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AccountingEntriesPaneProps {
  formData: ImportLCFormData;
}

const AccountingEntriesPane: React.FC<AccountingEntriesPaneProps> = ({ formData }) => {
  const currency = formData.currency || 'USD';
  const lcAmount = formData.lcAmount || 0;
  
  // Calculate charges (mock values - in production from fee schedule)
  const issuanceCharge = lcAmount * 0.00125; // 0.125%
  const swiftCharges = 50;
  const handlingFee = 25;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Mock accounting entries
  const liabilityEntries = [
    {
      id: '1',
      entryType: 'debit' as const,
      accountNumber: '1810001',
      accountDescription: 'Customer LC Liability - Contra',
      currency: currency,
      amount: lcAmount
    },
    {
      id: '2',
      entryType: 'credit' as const,
      accountNumber: '2810001',
      accountDescription: 'LC Liability - Customer',
      currency: currency,
      amount: lcAmount
    }
  ];

  const chargesEntries = [
    {
      id: '3',
      entryType: 'debit' as const,
      accountNumber: '1001001',
      accountDescription: 'Customer Current Account',
      currency: currency,
      amount: issuanceCharge + swiftCharges + handlingFee
    },
    {
      id: '4',
      entryType: 'credit' as const,
      accountNumber: '4510001',
      accountDescription: 'LC Issuance Commission Income',
      currency: currency,
      amount: issuanceCharge
    },
    {
      id: '5',
      entryType: 'credit' as const,
      accountNumber: '4520001',
      accountDescription: 'SWIFT Charges Income',
      currency: currency,
      amount: swiftCharges
    },
    {
      id: '6',
      entryType: 'credit' as const,
      accountNumber: '4530001',
      accountDescription: 'Handling Fee Income',
      currency: currency,
      amount: handlingFee
    }
  ];

  const totalDebits = [...liabilityEntries, ...chargesEntries]
    .filter(e => e.entryType === 'debit')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalCredits = [...liabilityEntries, ...chargesEntries]
    .filter(e => e.entryType === 'credit')
    .reduce((sum, e) => sum + e.amount, 0);

  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  const renderEntryTable = (entries: typeof liabilityEntries, title: string) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Type</TableHead>
              <TableHead>Account No.</TableHead>
              <TableHead>Account Description</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {entry.entryType === 'debit' ? (
                      <>
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                        <span className="text-red-600 font-medium">Dr</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownLeft className="h-4 w-4 text-green-500" />
                        <span className="text-green-600 font-medium">Cr</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{entry.accountNumber}</TableCell>
                <TableCell>{entry.accountDescription}</TableCell>
                <TableCell>{entry.currency}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatAmount(entry.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Accounting Entries</h3>
        <Badge variant={isBalanced ? 'default' : 'destructive'} className="gap-1">
          {isBalanced ? (
            <>
              <CheckCircle className="h-3 w-3" />
              Balanced
            </>
          ) : (
            'Unbalanced'
          )}
        </Badge>
      </div>

      {/* Liability Entries */}
      {renderEntryTable(liabilityEntries, 'LC Liability Entries')}

      {/* Charges & Fees Entries */}
      {renderEntryTable(chargesEntries, 'Charges & Fees Entries')}

      {/* Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Entry Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-xs text-red-600 dark:text-red-400 mb-1">Total Debits</p>
              <p className="text-lg font-semibold text-red-700 dark:text-red-300">
                {currency} {formatAmount(totalDebits)}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-xs text-green-600 dark:text-green-400 mb-1">Total Credits</p>
              <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                {currency} {formatAmount(totalCredits)}
              </p>
            </div>
            <div className={`p-4 rounded-lg border ${isBalanced ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'}`}>
              <p className={`text-xs mb-1 ${isBalanced ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>Difference</p>
              <p className={`text-lg font-semibold ${isBalanced ? 'text-blue-700 dark:text-blue-300' : 'text-amber-700 dark:text-amber-300'}`}>
                {currency} {formatAmount(Math.abs(totalDebits - totalCredits))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charges Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Charges & Fees Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">LC Issuance Commission (0.125%)</span>
              <span className="font-medium">{currency} {formatAmount(issuanceCharge)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">SWIFT Charges</span>
              <span className="font-medium">{currency} {formatAmount(swiftCharges)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Handling Fee</span>
              <span className="font-medium">{currency} {formatAmount(handlingFee)}</span>
            </div>
            <div className="flex justify-between py-2 font-semibold">
              <span>Total Charges</span>
              <span>{currency} {formatAmount(issuanceCharge + swiftCharges + handlingFee)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountingEntriesPane;
