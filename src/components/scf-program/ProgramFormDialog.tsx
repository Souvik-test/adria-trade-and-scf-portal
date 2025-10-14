import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralPartyPane } from "./panes/GeneralPartyPane";
import { DisbursementRepaymentPane } from "./panes/DisbursementRepaymentPane";
import { FeeCataloguePane } from "./panes/FeeCataloguePane";
import { useProgramForm } from "@/hooks/useProgramForm";
import { FormProvider } from "react-hook-form";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface ProgramFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit" | "view" | "delete";
  program: any;
  onSuccess: () => void;
  selectedProductCode?: string;
}

export const ProgramFormDialog = ({
  open,
  onOpenChange,
  mode,
  program,
  onSuccess,
  selectedProductCode,
}: ProgramFormDialogProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const handleValidationError = (errors: string[]) => {
    setValidationErrors(errors);
    setShowErrorDialog(true);
  };

  const { form, onSubmit, isSubmitting } = useProgramForm(
    mode,
    program,
    onSuccess,
    selectedProductCode,
    handleValidationError
  );

  const isReadOnly = mode === "view" || mode === "delete";

  const handleNext = () => {
    if (activeTab === "general") {
      setActiveTab("disbursement");
    } else if (activeTab === "disbursement") {
      setActiveTab("fees");
    }
  };

  const handlePrevious = () => {
    if (activeTab === "fees") {
      setActiveTab("disbursement");
    } else if (activeTab === "disbursement") {
      setActiveTab("general");
    }
  };

  return (
    <>
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Validation Error
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p className="font-medium">Please fix the following issues:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">
              {mode === "add" && "Add Program Configuration"}
              {mode === "edit" && "Edit Program Configuration"}
              {mode === "view" && "View Program Configuration"}
              {mode === "delete" && "Delete Program Configuration"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "add" && "Create a new SCF program configuration"}
              {mode === "edit" && "Update program configuration details"}
              {mode === "view" && "Review program configuration details"}
              {mode === "delete" && "Review details before deletion"}
            </p>
          </div>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General & Party Details</TabsTrigger>
                  <TabsTrigger value="disbursement">Disbursement & Repayment</TabsTrigger>
                  <TabsTrigger value="fees">Fee Catalogue</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6">
                  <GeneralPartyPane isReadOnly={isReadOnly} onNext={handleNext} />
                </TabsContent>

                <TabsContent value="disbursement" className="mt-6">
                  <DisbursementRepaymentPane 
                    isReadOnly={isReadOnly} 
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                  />
                </TabsContent>

                <TabsContent value="fees" className="mt-6">
                  <FeeCataloguePane 
                    isReadOnly={isReadOnly} 
                    mode={mode}
                    onClose={() => onOpenChange(false)}
                    isSubmitting={isSubmitting}
                    onPrevious={handlePrevious}
                  />
                </TabsContent>
              </Tabs>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};
