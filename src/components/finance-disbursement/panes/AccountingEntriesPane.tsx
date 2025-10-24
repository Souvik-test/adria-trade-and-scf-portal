import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AccountingEntriesPaneProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
}

const AccountingEntriesPane: React.FC<AccountingEntriesPaneProps> = ({
  formData,
  onFieldChange
}) => {
  useEffect(() => {
    // Generate accounting entries if not already set
    if (!formData.accountingEntries || formData.accountingEntries.length === 0) {
      const entries = [
        {
          entryType: 'Dr',
          account: 'Loan Account',
          glCode: '1200-001',
          amount: formData.financeAmount
        },
        {
          entryType: 'Cr',
          account: 'Suspense Account',
          glCode: '2100-001',
          amount: formData.financeAmount
        }
      ];
      onFieldChange('accountingEntries', entries);
    }

    // Generate accounting reference if not set
    if (!formData.accountingReference) {
      const ref = `ACC-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      onFieldChange('accountingReference', ref);
    }
  }, [formData.financeAmount]);

  const handleEntryChange = (index: number, field: string, value: any) => {
    const updatedEntries = [...formData.accountingEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    onFieldChange('accountingEntries', updatedEntries);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounting Entries Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Accounting Reference</Label>
          <Input
            value={formData.accountingReference}
            onChange={(e) => onFieldChange('accountingReference', e.target.value)}
            placeholder="Auto-generated reference"
          />
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>GL Code</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.accountingEntries?.map((entry: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{entry.entryType}</TableCell>
                  <TableCell>
                    <Input
                      value={entry.account}
                      onChange={(e) => handleEntryChange(index, 'account', e.target.value)}
                      className="border-0 bg-transparent p-0 h-auto"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={entry.glCode}
                      onChange={(e) => handleEntryChange(index, 'glCode', e.target.value)}
                      className="border-0 bg-transparent p-0 h-auto"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.amount.toFixed(2)} {formData.financeCurrency}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Balance Check:</span>
            <span className={`font-semibold ${
              formData.accountingEntries?.reduce((sum: number, e: any) => 
                e.entryType === 'Dr' ? sum + e.amount : sum - e.amount, 0
              ) === 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formData.accountingEntries?.reduce((sum: number, e: any) => 
                e.entryType === 'Dr' ? sum + e.amount : sum - e.amount, 0
              ) === 0 ? 'Balanced ✓' : 'Not Balanced ✗'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountingEntriesPane;