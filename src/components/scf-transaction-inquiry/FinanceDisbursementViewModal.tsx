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

interface FinanceDisbursementViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disbursement: any;
}

export const FinanceDisbursementViewModal: React.FC<FinanceDisbursementViewModalProps> = ({
  open,
  onOpenChange,
  disbursement,
}) => {
  if (!disbursement) return null;

  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="grid grid-cols-3 gap-4 py-2">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="col-span-2 text-sm">{value || '-'}</div>
    </div>
  );

  // Calculate finance due date (using invoice due date or calculating based on tenor)
  const financeDueDate = disbursement.invoice?.due_date || null;
  const financeStartDate = disbursement.disbursed_at || null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Finance Disbursement Details - {disbursement.loan_reference}</span>
            <Badge variant="secondary">{disbursement.disbursement_status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Finance Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Finance Information</h3>
            <div className="space-y-1">
              <InfoRow label="Finance Reference No." value={disbursement.loan_reference} />
              <InfoRow
                label="Finance Amount"
                value={
                  disbursement.disbursed_amount
                    ? Number(disbursement.disbursed_amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : '-'
                }
              />
              <InfoRow
                label="Finance Percentage"
                value={disbursement.finance_percentage ? `${disbursement.finance_percentage}%` : '-'}
              />
              <InfoRow
                label="Finance Start Date"
                value={financeStartDate ? format(new Date(financeStartDate), 'dd MMM yyyy') : '-'}
              />
              <InfoRow
                label="Finance Due Date"
                value={financeDueDate ? format(new Date(financeDueDate), 'dd MMM yyyy') : '-'}
              />
            </div>
          </div>

          <Separator />

          {/* Program Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Program Information</h3>
            <div className="space-y-1">
              <InfoRow label="Program ID" value={disbursement.program_id} />
              <InfoRow label="Program Name" value={disbursement.program?.program_name || '-'} />
            </div>
          </div>

          <Separator />

          {/* Borrower Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Borrower Information</h3>
            <div className="space-y-1">
              <InfoRow
                label="Borrower ID"
                value={
                  disbursement.invoice?.seller_id ||
                  disbursement.invoice?.buyer_id ||
                  '-'
                }
              />
              <InfoRow
                label="Borrower Name"
                value={
                  disbursement.invoice?.seller_name ||
                  disbursement.invoice?.buyer_name ||
                  '-'
                }
              />
            </div>
          </div>

          <Separator />

          {/* Accounting Entries */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Accounting Entries</h3>
            <div className="space-y-1">
              <InfoRow
                label="Accounting Entry Reference"
                value={disbursement.accounting_entry_ref || 'Not generated'}
              />
              <InfoRow
                label="Debit Account"
                value={`ACC-LOAN-${disbursement.program_id}-DR`}
              />
              <InfoRow
                label="Credit Account"
                value={`ACC-LOAN-${disbursement.program_id}-CR`}
              />
            </div>
          </div>

          {/* Related Invoice */}
          {disbursement.invoice && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">Related Invoice</h3>
                <div className="space-y-1">
                  <InfoRow label="Invoice Number" value={disbursement.invoice.invoice_number} />
                  <InfoRow
                    label="Invoice Amount"
                    value={
                      disbursement.invoice.total_amount
                        ? Number(disbursement.invoice.total_amount).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : '-'
                    }
                  />
                  <InfoRow label="Currency" value={disbursement.invoice.currency} />
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
