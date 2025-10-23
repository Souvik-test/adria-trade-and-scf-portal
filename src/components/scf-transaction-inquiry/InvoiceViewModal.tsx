import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface InvoiceViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
}

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  open,
  onOpenChange,
  invoice,
}) => {
  if (!invoice) return null;

  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="grid grid-cols-3 gap-4 py-2">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="col-span-2 text-sm">{value || '-'}</div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Invoice Details - {invoice.invoice_number}</span>
            <Badge variant="secondary">{invoice.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="space-y-1">
              <InfoRow label="Invoice Number" value={invoice.invoice_number} />
              <InfoRow label="Invoice Type" value={invoice.invoice_type} />
              <InfoRow
                label="Invoice Date"
                value={invoice.invoice_date ? format(new Date(invoice.invoice_date), 'dd MMM yyyy') : '-'}
              />
              <InfoRow
                label="Due Date"
                value={invoice.due_date ? format(new Date(invoice.due_date), 'dd MMM yyyy') : '-'}
              />
              <InfoRow label="Currency" value={invoice.currency} />
              <InfoRow
                label="Total Amount"
                value={
                  invoice.total_amount
                    ? Number(invoice.total_amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : '-'
                }
              />
            </div>
          </div>

          <Separator />

          {/* Program Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Program Information</h3>
            <div className="space-y-1">
              <InfoRow label="Program ID" value={invoice.program_id} />
              <InfoRow label="Program Name" value={invoice.program_name} />
            </div>
          </div>

          <Separator />

          {/* Party Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Party Information</h3>
            <div className="space-y-1">
              <InfoRow label="Buyer ID" value={invoice.buyer_id} />
              <InfoRow label="Buyer Name" value={invoice.buyer_name} />
              <InfoRow label="Seller ID" value={invoice.seller_id} />
              <InfoRow label="Seller Name" value={invoice.seller_name} />
            </div>
          </div>

          {/* Additional Details if available */}
          {invoice.invoice_description && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-sm whitespace-pre-wrap">{invoice.invoice_description}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
