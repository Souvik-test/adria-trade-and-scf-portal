import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  fetchProgramDiscountRate,
  calculateEarlyPaymentSavings,
  submitEarlyPaymentRequest,
  EarlyPaymentCalculation,
} from "@/services/earlyPaymentService";
import { format } from "date-fns";

interface EarlyPaymentRequestFormProps {
  selectedInvoices: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export const EarlyPaymentRequestForm = ({
  selectedInvoices,
  onClose,
  onSuccess,
}: EarlyPaymentRequestFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [calculations, setCalculations] = useState<EarlyPaymentCalculation[]>([]);
  const [discountRate, setDiscountRate] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [estimatedPaymentDate, setEstimatedPaymentDate] = useState("");

  useEffect(() => {
    const fetchAndCalculate = async () => {
      if (selectedInvoices.length === 0) return;

      setLoading(true);
      try {
        const programId = selectedInvoices[0].programId;
        const rate = await fetchProgramDiscountRate(programId);
        setDiscountRate(rate);

        const invoiceData = selectedInvoices.map(inv => ({
          id: inv.id,
          invoice_number: inv.transactionReference,
          original_amount: inv.amount,
          due_date: inv.dueDate || "",
          currency: inv.currency,
          program_id: inv.programId,
        }));

        const calcs = calculateEarlyPaymentSavings(invoiceData, rate);
        setCalculations(calcs);

        // Set default estimated payment date (3 days from now)
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 3);
        setEstimatedPaymentDate(futureDate.toISOString().split('T')[0]);
      } catch (error) {
        console.error("Error calculating early payment:", error);
        toast({
          title: "Error",
          description: "Failed to calculate early payment discounts.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculate();
  }, [selectedInvoices, toast]);

  const totals = calculations.reduce(
    (acc, calc) => ({
      original: acc.original + calc.invoice.original_amount,
      discounted: acc.discounted + calc.discounted_amount,
      savings: acc.savings + calc.savings,
    }),
    { original: 0, discounted: 0, savings: 0 }
  );

  const handleSubmit = async () => {
    if (calculations.length === 0) return;

    setLoading(true);
    try {
      const userId = "user_id"; // Get from auth context
      const programId = selectedInvoices[0].programId;
      const currency = selectedInvoices[0].currency;
      const invoiceData = calculations.map(c => c.invoice);
      
      const paymentDate = estimatedPaymentDate ? new Date(estimatedPaymentDate) : null;

      await submitEarlyPaymentRequest(
        userId,
        programId,
        invoiceData,
        discountRate,
        totals.original,
        totals.discounted,
        totals.savings,
        currency,
        paymentDate,
        remarks
      );

      toast({
        title: "Success",
        description: "Early payment request submitted successfully.",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: "Failed to submit early payment request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && calculations.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-muted-foreground">Total Original Amount</Label>
              <p className="text-2xl font-bold">{selectedInvoices[0]?.currency} {totals.original.toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Discount Rate</Label>
              <p className="text-2xl font-bold text-primary">{discountRate}%</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Total After Discount</Label>
              <p className="text-2xl font-bold text-green-600">{selectedInvoices[0]?.currency} {totals.discounted.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <Label className="text-green-700 font-semibold">Your Total Savings</Label>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {selectedInvoices[0]?.currency} {totals.savings.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Original Amount</TableHead>
                <TableHead>Discount %</TableHead>
                <TableHead>Discounted Amount</TableHead>
                <TableHead>Savings</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculations.map((calc, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{calc.invoice.invoice_number}</TableCell>
                  <TableCell>{calc.invoice.currency} {calc.invoice.original_amount.toLocaleString()}</TableCell>
                  <TableCell className="text-primary font-semibold">{calc.discount_percentage}%</TableCell>
                  <TableCell className="text-green-600 font-semibold">
                    {calc.invoice.currency} {calc.discounted_amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-green-600">
                    {calc.invoice.currency} {calc.savings.toLocaleString()}
                  </TableCell>
                  <TableCell>{calc.invoice.due_date ? format(new Date(calc.invoice.due_date), 'dd MMM yyyy') : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="estimated_payment_date">Estimated Payment Date</Label>
            <Input
              id="estimated_payment_date"
              type="date"
              value={estimatedPaymentDate}
              onChange={(e) => setEstimatedPaymentDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="remarks">Remarks/Notes (Optional)</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any additional notes or special instructions..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Request
        </Button>
      </div>
    </div>
  );
};
