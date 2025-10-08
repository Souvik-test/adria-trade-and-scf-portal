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
  program_description: z.string().optional(),
  program_limit: z.number().min(0, "Program limit must be positive"),
  available_limit: z.number().min(0, "Available limit must be positive"),
  effective_date: z.string().min(1, "Effective date is required"),
  expiry_date: z.string().min(1, "Expiry date is required"),
  program_currency: z.string().default("USD"),
  anchor_name: z.string().min(1, "Anchor name is required"),
  anchor_account: z.string().optional(),
  counter_parties: z.array(z.any()).default([]),
  finance_tenor: z.number().optional(),
  finance_tenor_unit: z.string().default("days"),
  margin_percentage: z.number().default(0),
  finance_percentage: z.number().default(100),
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
      program_description: "",
      program_limit: 0,
      available_limit: 0,
      effective_date: "",
      expiry_date: "",
      program_currency: "USD",
      anchor_name: "",
      anchor_account: "",
      counter_parties: [],
      finance_tenor: 0,
      finance_tenor_unit: "days",
      margin_percentage: 0,
      finance_percentage: 100,
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
