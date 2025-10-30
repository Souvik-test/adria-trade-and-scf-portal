import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface RequestPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInvoices: any[];
  onSuccess: () => void;
}

export const RequestPaymentModal = ({
  open,
  onOpenChange,
  selectedInvoices,
  onSuccess,
}: RequestPaymentModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [requestedPaymentDate, setRequestedPaymentDate] = useState("");

  const totalAmount = selectedInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const currency = selectedInvoices[0]?.currency || "USD";
  const programId = selectedInvoices[0]?.programId || "";

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to request payment.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('payment_requests')
        .insert({
          user_id: user.id,
          program_id: programId,
          invoice_ids: selectedInvoices.map(inv => inv.id),
          total_amount: totalAmount,
          currency,
          requested_payment_date: requestedPaymentDate || null,
          notes,
          status: 'pending',
        });

      if (error) {
        console.error('Payment request error:', error);
        throw error;
      }

      // Update invoice statuses to 'paid'
      const { error: updateError } = await supabase
        .from('scf_invoices')
        .update({ status: 'paid' })
        .in('id', selectedInvoices.map(inv => inv.id));

      if (updateError) {
        console.error('Error updating invoice statuses:', updateError);
        // Don't throw - request was created successfully
      }

      toast({
        title: "Success",
        description: "Payment request submitted successfully.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting payment request:", error);
      toast({
        title: "Error",
        description: "Failed to submit payment request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Request Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Number of Invoices</Label>
                  <p className="text-2xl font-bold">{selectedInvoices.length}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Amount</Label>
                  <p className="text-2xl font-bold text-primary">{currency} {totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice List */}
          <Card>
            <CardHeader>
              <CardTitle>Selected Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.transactionReference}</TableCell>
                      <TableCell>{invoice.currency} {invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>{invoice.dueDate || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="requested_payment_date">Requested Payment Date (Optional)</Label>
                <Input
                  id="requested_payment_date"
                  type="date"
                  value={requestedPaymentDate}
                  onChange={(e) => setRequestedPaymentDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes/Reason for Payment Request</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Please provide details about why you're requesting payment..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Payment Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
