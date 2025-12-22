import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Eye, Pencil, Send, FileSignature, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { TransferRecord, TransferStatus } from '@/types/remittance';
import { format } from 'date-fns';

// Mock data for demonstration
const MOCK_TRANSFERS: TransferRecord[] = [
  {
    id: '1',
    reference: 'TRF-2024-001',
    direction: 'outward',
    outwardType: 'a2a',
    amount: 5000,
    currency: 'USD',
    status: 'draft',
    createdAt: '2024-12-20T10:30:00Z',
    debitAccount: 'Current Account - 1234567890',
    creditAccount: 'Savings Account - 0987654321',
    executionType: 'immediate',
  },
  {
    id: '2',
    reference: 'TRF-2024-002',
    direction: 'outward',
    outwardType: 'beneficiary',
    amount: 15000,
    currency: 'EUR',
    status: 'submitted',
    createdAt: '2024-12-19T14:45:00Z',
    debitAccount: 'Business Account - 5678901234',
    beneficiary: 'John Doe - HSBC Bank',
    executionType: 'deferred',
    executionDate: '2024-12-25',
  },
  {
    id: '3',
    reference: 'TRF-2024-003',
    direction: 'inward',
    amount: 8500,
    currency: 'GBP',
    status: 'signed',
    createdAt: '2024-12-18T09:15:00Z',
    creditAccount: 'Current Account - 1234567890',
    executionType: 'immediate',
  },
  {
    id: '4',
    reference: 'TRF-2024-004',
    direction: 'outward',
    outwardType: 'international',
    amount: 25000,
    currency: 'USD',
    status: 'completed',
    createdAt: '2024-12-17T16:20:00Z',
    debitAccount: 'Business Account - 5678901234',
    beneficiary: 'Acme Corp - Deutsche Bank',
    executionType: 'immediate',
  },
  {
    id: '5',
    reference: 'TRF-2024-005',
    direction: 'outward',
    outwardType: 'multiple',
    amount: 50000,
    currency: 'USD',
    status: 'processed',
    createdAt: '2024-12-16T11:00:00Z',
    debitAccount: 'Current Account - 1234567890',
    executionType: 'immediate',
  },
];

const getStatusBadge = (status: TransferStatus) => {
  const config: Record<TransferStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    draft: { variant: 'secondary', label: 'Draft' },
    submitted: { variant: 'default', label: 'Submitted' },
    signed: { variant: 'default', label: 'Signed' },
    processed: { variant: 'default', label: 'Processed' },
    completed: { variant: 'default', label: 'Completed' },
    failed: { variant: 'destructive', label: 'Failed' },
    scheduled: { variant: 'outline', label: 'Scheduled' },
  };

  const { variant, label } = config[status];
  
  return (
    <Badge 
      variant={variant}
      className={
        status === 'completed' || status === 'processed' 
          ? 'bg-green-500 hover:bg-green-600 text-white' 
          : status === 'signed' 
            ? 'bg-purple-500 hover:bg-purple-600 text-white'
            : ''
      }
    >
      {label}
    </Badge>
  );
};

const TransferHistorySection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRecord | null>(null);
  const [showSignDialog, setShowSignDialog] = useState(false);
  const [signFormData, setSignFormData] = useState({
    eSignPortal: '',
    name: '',
    location: '',
  });

  const filteredTransfers = MOCK_TRANSFERS.filter(
    (t) =>
      t.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.direction.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (transfer: TransferRecord) => {
    setSelectedTransfer(transfer);
  };

  const handleModify = (transfer: TransferRecord) => {
    toast.info(`Modifying transfer ${transfer.reference}`);
  };

  const handleSubmit = (transfer: TransferRecord) => {
    toast.success(`Transfer ${transfer.reference} submitted`);
  };

  const handleSign = (transfer: TransferRecord) => {
    setSelectedTransfer(transfer);
    setShowSignDialog(true);
  };

  const handleConfirm = (transfer: TransferRecord) => {
    toast.success(`Transfer ${transfer.reference} confirmed`);
  };

  const submitSignature = () => {
    if (!signFormData.name) {
      toast.error('Please enter your name');
      return;
    }
    toast.success(`Transfer ${selectedTransfer?.reference} signed successfully`);
    setShowSignDialog(false);
    setSignFormData({ eSignPortal: '', name: '', location: '' });
    setSelectedTransfer(null);
  };

  const getTypeLabel = (transfer: TransferRecord) => {
    if (transfer.direction === 'inward') return 'Inward';
    const typeLabels: Record<string, string> = {
      a2a: 'A2A',
      beneficiary: 'Beneficiary',
      multiple: 'Multiple',
      international: 'International',
    };
    return typeLabels[transfer.outwardType || 'a2a'] || 'Outward';
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card>
        <CardContent className="pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by reference or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Transfers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-medium">{transfer.reference}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getTypeLabel(transfer)}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {transfer.amount.toLocaleString()} {transfer.currency}
                    </TableCell>
                    <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                    <TableCell>{format(new Date(transfer.createdAt), 'dd MMM yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(transfer)}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {transfer.status === 'draft' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleModify(transfer)}
                              title="Modify"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSubmit(transfer)}
                              title="Submit"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {transfer.status === 'submitted' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSign(transfer)}
                            title="Sign"
                          >
                            <FileSignature className="h-4 w-4" />
                          </Button>
                        )}

                        {transfer.status === 'signed' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleConfirm(transfer)}
                            title="Confirm"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={!!selectedTransfer && !showSignDialog} onOpenChange={() => setSelectedTransfer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Details - {selectedTransfer?.reference}</DialogTitle>
          </DialogHeader>
          {selectedTransfer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Direction</Label>
                  <p className="font-medium capitalize">{selectedTransfer.direction}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium">{getTypeLabel(selectedTransfer)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className="font-medium font-mono">
                    {selectedTransfer.amount.toLocaleString()} {selectedTransfer.currency}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p>{getStatusBadge(selectedTransfer.status)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Execution</Label>
                  <p className="font-medium capitalize">{selectedTransfer.executionType}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created</Label>
                  <p className="font-medium">
                    {format(new Date(selectedTransfer.createdAt), 'dd MMM yyyy HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Sign Dialog */}
      <Dialog open={showSignDialog} onOpenChange={setShowSignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Transfer - {selectedTransfer?.reference}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eSignPortal">E-Sign Portal</Label>
              <Input
                id="eSignPortal"
                type="url"
                placeholder="https://e-sign-portal.example.com"
                value={signFormData.eSignPortal}
                onChange={(e) => setSignFormData({ ...signFormData, eSignPortal: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signerName">Name *</Label>
              <Input
                id="signerName"
                placeholder="Enter your full name"
                value={signFormData.name}
                onChange={(e) => setSignFormData({ ...signFormData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signerLocation">Location</Label>
              <Input
                id="signerLocation"
                placeholder="Enter signing location"
                value={signFormData.location}
                onChange={(e) => setSignFormData({ ...signFormData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Date & Time</Label>
              <Input value={format(new Date(), 'dd MMM yyyy HH:mm:ss')} disabled />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowSignDialog(false)}>
                Cancel
              </Button>
              <Button onClick={submitSignature}>
                <FileSignature className="h-4 w-4 mr-2" />
                Sign Transfer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransferHistorySection;
