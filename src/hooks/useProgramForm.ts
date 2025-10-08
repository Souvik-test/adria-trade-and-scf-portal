import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

const programSchema = z.object({
  program_id: z.string().min(1, "Program ID is required"),
  program_name: z.string().min(1, "Program name is required"),
  product_code: z.string().min(1, "Product code is required"),
  product_name: z.string().optional(),
  program_description: z.string().optional(),
  program_limit: z.number().min(0, "Program limit must be positive"),
  available_limit: z.number().min(0, "Available limit must be positive"),
  effective_date: z.string().min(1, "Effective date is required"),
  expiry_date: z.string().min(1, "Expiry date is required"),
  program_currency: z.string().default("USD"),
  anchor_id: z.string().optional(),
  anchor_name: z.string().min(1, "Anchor name is required"),
  anchor_account: z.string().optional(),
  anchor_limit: z.number().min(0, "Anchor limit must be positive").optional(),
  anchor_available_limit: z.number().min(0, "Anchor available limit must be positive").optional(),
  anchor_limit_currency: z.string().default("USD"),
  anchor_party: z.string().optional(),
  counter_parties: z.array(z.any()).default([]),
  borrower_selection: z.string().default("Anchor Party"),
  finance_tenor: z.number().optional(),
  finance_tenor_unit: z.string().default("days"),
  min_tenor: z.number().min(0, "Minimum tenor must be positive").optional(),
  min_tenor_unit: z.string().default("days"),
  max_tenor: z.number().min(0, "Maximum tenor must be positive").optional(),
  max_tenor_unit: z.string().default("days"),
  margin_percentage: z.number().default(0),
  finance_percentage: z.number().min(0).max(100, "Finance percentage cannot exceed 100%").default(100),
  grace_days: z.number().min(0, "Grace days cannot be negative").default(0),
  stale_period: z.number().min(0, "Stale period cannot be negative").default(0),
  assignment_enabled: z.boolean().default(false),
  assignment_percentage: z.number().min(0).max(100).default(0),
  unaccepted_invoice_finance_enabled: z.boolean().default(false),
  unaccepted_invoice_percentage: z.number().min(0).max(100).default(0),
  recourse_enabled: z.boolean().default(false),
  recourse_percentage: z.number().min(0).max(100).default(0),
  disbursement_mode: z.string().optional(),
  disbursement_account: z.string().optional(),
  disbursement_conditions: z.string().optional(),
  repayment_mode: z.string().optional(),
  repayment_account: z.string().optional(),
  appropriation_sequence: z.array(z.any()).default([]),
  insurance_required: z.boolean().default(false),
  insurance_policies: z.array(z.any()).default([]),
  fee_catalogue: z.array(z.any()).default([]),
  flat_fee_config: z.any().default({}),
  status: z.string().default("active"),
});

type ProgramFormValues = z.infer<typeof programSchema>;

export const useProgramForm = (
  mode: "add" | "edit" | "view" | "delete",
  program: any,
  onSuccess: () => void
) => {
  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      program_id: "",
      program_name: "",
      product_code: "",
      product_name: "",
      program_description: "",
      program_limit: 0,
      available_limit: 0,
      effective_date: "",
      expiry_date: "",
      program_currency: "USD",
      anchor_id: "",
      anchor_name: "",
      anchor_account: "",
      anchor_limit: 0,
      anchor_available_limit: 0,
      anchor_limit_currency: "USD",
      anchor_party: "",
      counter_parties: [],
      borrower_selection: "Anchor Party",
      finance_tenor: 0,
      finance_tenor_unit: "days",
      min_tenor: 0,
      min_tenor_unit: "days",
      max_tenor: 0,
      max_tenor_unit: "days",
      margin_percentage: 0,
      finance_percentage: 100,
      grace_days: 0,
      stale_period: 0,
      assignment_enabled: false,
      assignment_percentage: 0,
      unaccepted_invoice_finance_enabled: false,
      unaccepted_invoice_percentage: 0,
      recourse_enabled: false,
      recourse_percentage: 0,
      disbursement_mode: "",
      disbursement_account: "",
      disbursement_conditions: "",
      repayment_mode: "",
      repayment_account: "",
      appropriation_sequence: [],
      insurance_required: false,
      insurance_policies: [],
      fee_catalogue: [],
      flat_fee_config: {},
      status: "active",
    },
  });

  useEffect(() => {
    if (program && (mode === "edit" || mode === "view" || mode === "delete")) {
      form.reset({
        ...program,
        counter_parties: program.counter_parties || [],
        appropriation_sequence: program.appropriation_sequence || [],
        insurance_policies: program.insurance_policies || [],
        fee_catalogue: program.fee_catalogue || [],
        flat_fee_config: program.flat_fee_config || {},
      });
    }
  }, [program, mode, form]);

  // Auto-populate available limit when program limit changes (only in add mode)
  useEffect(() => {
    if (mode === "add") {
      const subscription = form.watch((value, { name }) => {
        if (name === "program_limit") {
          form.setValue("available_limit", value.program_limit || 0);
        }
        if (name === "program_currency") {
          form.setValue("anchor_limit_currency", value.program_currency || "USD");
        }
        if (name === "anchor_name" && !form.getValues("anchor_party")) {
          form.setValue("anchor_party", value.anchor_name || "");
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [mode, form]);

  const onSubmit = async (data: ProgramFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (mode === "add") {
        const insertData = {
          ...data,
          user_id: user.id,
        };
        
        const { error } = await supabase
          .from("scf_program_configurations")
          .insert(insertData as any);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Program configuration created successfully",
        });
      } else if (mode === "edit") {
        const { error } = await supabase
          .from("scf_program_configurations")
          .update(data)
          .eq("id", program.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Program configuration updated successfully",
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving program:", error);
      toast({
        title: "Error",
        description: "Failed to save program configuration",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};
