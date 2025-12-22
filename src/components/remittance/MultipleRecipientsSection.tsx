import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Upload, FileSpreadsheet, Download } from 'lucide-react';
import { toast } from 'sonner';
import { RecipientEntry, CURRENCY_OPTIONS } from '@/types/remittance';

interface MultipleRecipientsSectionProps {
  recipients: RecipientEntry[];
  currency: string;
  onRecipientsChange: (recipients: RecipientEntry[]) => void;
  onCurrencyChange: (currency: string) => void;
}

const MultipleRecipientsSection: React.FC<MultipleRecipientsSectionProps> = ({
  recipients,
  currency,
  onRecipientsChange,
  onCurrencyChange,
}) => {
  const [entryMode, setEntryMode] = useState<'manual' | 'upload'>('manual');
  const [newRecipient, setNewRecipient] = useState<Omit<RecipientEntry, 'id'>>({
    creditAccount: '',
    recipientName: '',
    amount: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addRecipient = () => {
    if (!newRecipient.creditAccount || !newRecipient.recipientName || newRecipient.amount <= 0) {
      toast.error('Please fill in all recipient fields');
      return;
    }

    const recipient: RecipientEntry = {
      id: `REC-${Date.now()}`,
      ...newRecipient,
    };

    onRecipientsChange([...recipients, recipient]);
    setNewRecipient({ creditAccount: '', recipientName: '', amount: 0 });
    toast.success('Recipient added');
  };

  const removeRecipient = (id: string) => {
    onRecipientsChange(recipients.filter((r) => r.id !== id));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    // Simulated file parsing - in production, use xlsx library
    toast.success(`File "${file.name}" uploaded. Processing...`);
    
    // Mock data for demonstration
    const mockParsedRecipients: RecipientEntry[] = [
      { id: `REC-${Date.now()}-1`, creditAccount: '1234567890', recipientName: 'John Doe', amount: 1000 },
      { id: `REC-${Date.now()}-2`, creditAccount: '0987654321', recipientName: 'Jane Smith', amount: 2500 },
    ];

    setTimeout(() => {
      onRecipientsChange([...recipients, ...mockParsedRecipients]);
      toast.success(`${mockParsedRecipients.length} recipients imported successfully`);
    }, 1000);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    toast.info('Downloading Excel template...');
    // In production, generate and download actual Excel file
  };

  const totalAmount = recipients.reduce((sum, r) => sum + r.amount, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Multiple Recipients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={entryMode} onValueChange={(v) => setEntryMode(v as 'manual' | 'upload')}>
          <TabsList className="grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="recipientAccount">Account Number</Label>
                <Input
                  id="recipientAccount"
                  value={newRecipient.creditAccount}
                  onChange={(e) => setNewRecipient({ ...newRecipient, creditAccount: e.target.value })}
                  placeholder="Account number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientName">Account Name</Label>
                <Input
                  id="recipientName"
                  value={newRecipient.recipientName}
                  onChange={(e) => setNewRecipient({ ...newRecipient, recipientName: e.target.value })}
                  placeholder="Recipient name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientAmount">Amount</Label>
                <Input
                  id="recipientAmount"
                  type="number"
                  value={newRecipient.amount || ''}
                  onChange={(e) => setNewRecipient({ ...newRecipient, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="Amount"
                  min={0}
                />
              </div>
              <Button onClick={addRecipient} className="mb-0.5">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop an Excel file here, or click to browse
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Excel
                </Button>
                <Button variant="ghost" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Recipients Table */}
        {recipients.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipients.map((recipient) => (
                  <TableRow key={recipient.id}>
                    <TableCell className="font-mono">{recipient.creditAccount}</TableCell>
                    <TableCell>{recipient.recipientName}</TableCell>
                    <TableCell className="text-right font-mono">
                      {recipient.amount.toLocaleString()} {currency}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRecipient(recipient.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Summary */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Total Recipients: <strong>{recipients.length}</strong>
            </span>
            <div className="flex items-center gap-2">
              <Label htmlFor="bulkCurrency" className="text-sm text-muted-foreground">Currency:</Label>
              <Select value={currency} onValueChange={onCurrencyChange}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((cur) => (
                    <SelectItem key={cur.value} value={cur.value}>
                      {cur.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-muted-foreground">Total Amount: </span>
            <strong className="text-lg">
              {totalAmount.toLocaleString()} {currency}
            </strong>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultipleRecipientsSection;
