import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EarlyPaymentRequestForm } from "./EarlyPaymentRequestForm";

interface EarlyPaymentRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInvoices: any[];
  onSuccess: () => void;
}

export const EarlyPaymentRequestModal = ({
  open,
  onOpenChange,
  selectedInvoices,
  onSuccess,
}: EarlyPaymentRequestModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Early Payment Request</DialogTitle>
        </DialogHeader>
        <EarlyPaymentRequestForm
          selectedInvoices={selectedInvoices}
          onClose={() => onOpenChange(false)}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};
