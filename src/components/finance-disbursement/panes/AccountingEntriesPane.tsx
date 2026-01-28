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
  const isAdvance = formData.interestTreatment === 'advance';
  const isFromClientAccount = formData.interestDeductionMethod === 'client_account';

  useEffect(() => {
    // Generate accounting entries based on interest treatment
    const baseEntries = [
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

    // Add interest entries for Interest in Advance + From Client's Account
    if (isAdvance && isFromClientAccount && formData.interestAmount > 0) {
      baseEntries.push(
        {
          entryType: 'Dr',
          account: 'Client Interest Account',
          glCode: '1300-001',
          amount: formData.interestAmount
        },
        {
          entryType: 'Cr',
          account: 'Interest Income Account',
          glCode: '4100-001',
          amount: formData.interestAmount
        }
      );
    }

    onFieldChange('accountingEntries', baseEntries);

    // Generate accounting reference if not set
    if (!formData.accountingReference) {
      const ref = `ACC-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      onFieldChange('accountingReference', ref);
    }
  }, [formData.financeAmount, formData.interestAmount, formData.interestTreatment, formData.interestDeductionMethod]);

  const handleEntryChange = (index: number, field: string, value: any) => {
    const updatedEntries = [...formData.accountingEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    onFieldChange('accountingEntries', updatedEntries);
  };

  // Calculate balance check
  const balanceCheck = formData.accountingEntries?.reduce((sum: number, e: any) => 
    e.entryType === 'Dr' ? sum + e.amount : sum - e.amount, 0
  ) || 0;

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

        {isAdvance && isFromClientAccount && (
          <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg">
            <p className="text-sm text-primary font-medium">
              Additional entries for interest collection from client's account are included below.
            </p>
          </div>
        )}

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
                <TableRow key={index} className={index >= 2 ? 'bg-primary/5' : ''}>
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
              balanceCheck === 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {balanceCheck === 0 ? 'Balanced ✓' : 'Not Balanced ✗'}
            </span>
          </div>
        </div>

        {isAdvance && (
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h5 className="font-medium text-sm">Interest Treatment Summary</h5>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Treatment Type:</span>
                <span>Interest in Advance</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deduction Method:</span>
                <span>{isFromClientAccount ? "From Client's Account" : "From Proceeds"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest Amount:</span>
                <span>{formData.interestAmount.toFixed(2)} {formData.financeCurrency}</span>
              </div>
              {!isFromClientAccount && (
                <div className="flex justify-between text-primary">
                  <span className="text-muted-foreground">Net Proceeds:</span>
                  <span className="font-medium">
                    {(formData.financeAmount - formData.interestAmount).toFixed(2)} {formData.financeCurrency}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountingEntriesPane;
