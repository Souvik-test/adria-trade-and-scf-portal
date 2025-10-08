import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralPartyPane } from "./panes/GeneralPartyPane";
import { DisbursementRepaymentPane } from "./panes/DisbursementRepaymentPane";
import { FeeCataloguePane } from "./panes/FeeCataloguePane";
import { useProgramForm } from "@/hooks/useProgramForm";
import { FormProvider } from "react-hook-form";

interface ProgramFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit" | "view" | "delete";
  program: any;
  onSuccess: () => void;
}

export const ProgramFormDialog = ({
  open,
  onOpenChange,
  mode,
  program,
  onSuccess,
}: ProgramFormDialogProps) => {
  const { form, onSubmit, isSubmitting } = useProgramForm(mode, program, onSuccess);

  const isReadOnly = mode === "view" || mode === "delete";

  return (
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
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General & Party Details</TabsTrigger>
                  <TabsTrigger value="disbursement">Disbursement & Repayment</TabsTrigger>
                  <TabsTrigger value="fees">Fee Catalogue</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6">
                  <GeneralPartyPane isReadOnly={isReadOnly} />
                </TabsContent>

                <TabsContent value="disbursement" className="mt-6">
                  <DisbursementRepaymentPane isReadOnly={isReadOnly} />
                </TabsContent>

                <TabsContent value="fees" className="mt-6">
                  <FeeCataloguePane 
                    isReadOnly={isReadOnly} 
                    mode={mode}
                    onClose={() => onOpenChange(false)}
                    isSubmitting={isSubmitting}
                  />
                </TabsContent>
              </Tabs>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};
