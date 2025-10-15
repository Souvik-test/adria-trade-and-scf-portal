import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

// Product code to name mapping
const PRODUCT_CODE_MAPPING: Record<string, string> = {
  "INV_FIN": "Invoice Financing",
  "PO_FIN": "Purchase Order Financing",
  "DIS_FIN": "Distributor Financing",
  "VEN_FIN": "Vendor Financing",
  "DYN_DISC": "Dynamic Discounting",
};

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
  min_tenor_years: z.coerce.number().min(0).optional(),
  min_tenor_months: z.coerce.number().min(0, "Months must be 0-11").max(11, "Months must be 0-11").optional(),
  min_tenor_days: z.coerce.number().min(0, "Days must be 0-30").max(30, "Days must be 0-30").optional(),
  max_tenor_years: z.coerce.number().min(0).optional(),
  max_tenor_months: z.coerce.number().min(0, "Months must be 0-11").max(11, "Months must be 0-11").optional(),
  max_tenor_days: z.coerce.number().min(0, "Days must be 0-30").max(30, "Days must be 0-30").optional(),
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
  multiple_disbursement: z.boolean().default(false),
  max_disbursements_allowed: z.number().min(1).max(100).default(1),
  auto_disbursement: z.boolean().default(false),
  holiday_treatment: z.string().default("Next Business Day"),
  repayment_by: z.string().default("Buyer"),
  debit_account_number: z.string().optional(),
  auto_repayment: z.boolean().default(false),
  part_payment_allowed: z.boolean().default(false),
  pre_payment_allowed: z.boolean().default(false),
  charge_penalty_on_prepayment: z.boolean().default(false),
  appropriation_sequence_after_due: z.array(z.any()).default([]),
  appropriation_sequence_before_due: z.array(z.any()).default([]),
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
  onSuccess: () => void,
  selectedProductCode?: string,
  onValidationError?: (errors: string[]) => void
) => {
  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      program_id: "",
      program_name: "",
      product_code: selectedProductCode || "",
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
      min_tenor_years: 0,
      min_tenor_months: 0,
      min_tenor_days: 0,
      max_tenor_years: 0,
      max_tenor_months: 0,
      max_tenor_days: 0,
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
      multiple_disbursement: false,
      max_disbursements_allowed: 1,
      auto_disbursement: false,
      holiday_treatment: "Next Business Day",
      repayment_by: "Buyer",
      debit_account_number: "",
      auto_repayment: false,
      part_payment_allowed: false,
      pre_payment_allowed: false,
      charge_penalty_on_prepayment: false,
      appropriation_sequence_after_due: [],
      appropriation_sequence_before_due: [],
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
    } else if (selectedProductCode && mode === "add") {
      // Pre-populate product code when coming from Product Definition
      form.setValue("product_code", selectedProductCode);
      // Fetch and set product name from database
      const fetchProductName = async () => {
        const { data } = await supabase
          .from("scf_product_definitions")
          .select("product_name")
          .eq("product_code", selectedProductCode)
          .single();
        if (data) {
          form.setValue("product_name", data.product_name);
        }
      };
      fetchProductName();
    }
  }, [program, mode, form, selectedProductCode]);

  // Auto-populate fields when values change (only in add mode)
  useEffect(() => {
    if (mode === "add") {
      const subscription = form.watch((value, { name }) => {
        if (name === "program_limit") {
          form.setValue("available_limit", value.program_limit || 0);
        }
        if (name === "program_currency") {
          form.setValue("anchor_limit_currency", value.program_currency || "USD");
        }
        if (name === "anchor_name") {
          form.setValue("anchor_party", value.anchor_name || "");
        }
        if (name === "product_code") {
          const productName = PRODUCT_CODE_MAPPING[value.product_code as string] || "";
          form.setValue("product_name", productName);
        }
        if (name === "anchor_limit") {
          form.setValue("anchor_available_limit", value.anchor_limit || 0);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [mode, form]);

  // Transform form data to match database schema
  const transformFormDataForDB = (data: ProgramFormValues) => {
    // Calculate total days from individual year/month/day fields
    const minTenorTotalDays = (data.min_tenor_years || 0) * 365 + 
                              (data.min_tenor_months || 0) * 30 + 
                              (data.min_tenor_days || 0);
    const maxTenorTotalDays = (data.max_tenor_years || 0) * 365 + 
                              (data.max_tenor_months || 0) * 30 + 
                              (data.max_tenor_days || 0);

    // Combine appropriation sequences
    const appropriation_sequence = {
      after_due: data.appropriation_sequence_after_due || [],
      before_due: data.appropriation_sequence_before_due || []
    };
    
    // Map to database schema
    return {
      program_id: data.program_id,
      program_name: data.program_name,
      product_code: data.product_code,
      product_name: data.product_name,
      program_description: data.program_description,
      program_limit: data.program_limit,
      available_limit: data.available_limit,
      effective_date: data.effective_date,
      expiry_date: data.expiry_date,
      program_currency: data.program_currency,
      anchor_id: data.anchor_id,
      anchor_name: data.anchor_name,
      anchor_account: data.anchor_account,
      anchor_limit: data.anchor_limit,
      anchor_available_limit: data.anchor_available_limit,
      anchor_limit_currency: data.anchor_limit_currency,
      anchor_party: data.anchor_party,
      counter_parties: data.counter_parties,
      borrower_selection: data.borrower_selection,
      finance_tenor: data.finance_tenor,
      finance_tenor_unit: data.finance_tenor_unit,
      min_tenor_years: data.min_tenor_years || 0,
      min_tenor_months: data.min_tenor_months || 0,
      min_tenor_days: data.min_tenor_days || 0,
      max_tenor_years: data.max_tenor_years || 0,
      max_tenor_months: data.max_tenor_months || 0,
      max_tenor_days: data.max_tenor_days || 0,
      min_tenor_total_days: minTenorTotalDays,
      max_tenor_total_days: maxTenorTotalDays,
      min_tenor: minTenorTotalDays,
      max_tenor: maxTenorTotalDays,
      margin_percentage: data.margin_percentage,
      finance_percentage: data.finance_percentage,
      grace_days: data.grace_days,
      stale_period: data.stale_period,
      assignment_enabled: data.assignment_enabled,
      assignment_percentage: data.assignment_percentage,
      unaccepted_invoice_finance_enabled: data.unaccepted_invoice_finance_enabled,
      unaccepted_invoice_percentage: data.unaccepted_invoice_percentage,
      recourse_enabled: data.recourse_enabled,
      recourse_percentage: data.recourse_percentage,
      appropriation_sequence: appropriation_sequence,
      insurance_required: data.insurance_required,
      insurance_policies: data.insurance_policies,
      fee_catalogue: data.fee_catalogue,
      flat_fee_config: data.flat_fee_config,
      status: data.status,
      multiple_disbursement: data.multiple_disbursement,
      max_disbursements_allowed: data.max_disbursements_allowed,
      auto_disbursement: data.auto_disbursement,
      holiday_treatment: data.holiday_treatment,
      repayment_by: data.repayment_by,
      debit_account_number: data.debit_account_number,
      auto_repayment: data.auto_repayment,
      part_payment_allowed: data.part_payment_allowed,
      pre_payment_allowed: data.pre_payment_allowed,
      charge_penalty_on_prepayment: data.charge_penalty_on_prepayment,
      appropriation_sequence_after_due: data.appropriation_sequence_after_due,
      appropriation_sequence_before_due: data.appropriation_sequence_before_due,
    };
  };

  const onSubmit = async (data: ProgramFormValues) => {
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Form data received:', data);
    console.log('Form validation state:', form.formState);
    console.log('Form errors:', form.formState.errors);
    
    // Pre-flight validation check
    const errors = form.formState.errors;
    const errorKeys = Object.keys(errors);
    
    if (errorKeys.length > 0) {
      console.error('❌ Validation errors found:', errors);
      
      const errorMessages = errorKeys.map(key => {
        const error = errors[key as keyof typeof errors];
        const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `${fieldName}: ${error?.message || 'Invalid value'}`;
      });
      
      // Call the error callback if provided (for AlertDialog)
      if (onValidationError) {
        onValidationError(errorMessages);
      } else {
        // Fallback to toast if no callback provided
        toast({
          title: "Validation Failed",
          description: `Please fix: ${errorMessages.slice(0, 3).join('; ')}${errorMessages.length > 3 ? '...' : ''}`,
          variant: "destructive",
        });
      }
      return;
    }
    
    // Calculate total days for validation
    const minTenorTotalDays = (data.min_tenor_years || 0) * 365 + 
                              (data.min_tenor_months || 0) * 30 + 
                              (data.min_tenor_days || 0);
    const maxTenorTotalDays = (data.max_tenor_years || 0) * 365 + 
                              (data.max_tenor_months || 0) * 30 + 
                              (data.max_tenor_days || 0);
    
    // Validate tenor range
    if (maxTenorTotalDays > 0 && minTenorTotalDays > maxTenorTotalDays) {
      const errorMsg = `Minimum Tenor (${data.min_tenor_years || 0}Y ${data.min_tenor_months || 0}M ${data.min_tenor_days || 0}D = ${minTenorTotalDays} days) cannot exceed Maximum Tenor (${data.max_tenor_years || 0}Y ${data.max_tenor_months || 0}M ${data.max_tenor_days || 0}D = ${maxTenorTotalDays} days)`;
      if (onValidationError) {
        onValidationError([errorMsg]);
      } else {
        toast({
          title: "Validation Failed",
          description: errorMsg,
          variant: "destructive",
        });
      }
      return;
    }
    
    try {
      console.log('✓ Validation passed, authenticating user...');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('❌ Authentication failed: No user');
        throw new Error("User not authenticated");
      }
      console.log('✓ User authenticated:', user.id);

      // Transform form data to match database schema
      console.log('Transforming form data to database schema...');
      const transformedData = transformFormDataForDB(data);
      console.log('✓ Transformed data:', transformedData);

      if (mode === "add") {
        console.log('Mode: ADD - Inserting new program...');
        const insertData = {
          ...transformedData,
          user_id: user.id,
        };
        console.log('Insert payload:', insertData);
        
        const { error } = await supabase
          .from("scf_program_configurations")
          .insert(insertData);

        if (error) {
          console.error("❌ Database insert error:", error);
          console.error("Error code:", error.code);
          console.error("Error details:", error.details);
          console.error("Error hint:", error.hint);
          
          // Handle specific error cases
          if (error.code === '23505') {
            const errorMsg = `Program ID "${data.program_id}" already exists. Please use a different ID.`;
            if (onValidationError) {
              onValidationError([errorMsg]);
            } else {
              toast({
                title: "Duplicate Program ID",
                description: errorMsg,
                variant: "destructive",
              });
            }
            return;
          }
          
          throw new Error(`Database error: ${error.message}${error.details ? ` - ${error.details}` : ''}`);
        }

        console.log('✓ Program created successfully');
        toast({
          title: "Success",
          description: "Program configuration created successfully",
        });
      } else if (mode === "edit") {
        console.log('Mode: EDIT - Updating program:', program.id);
        const { error } = await supabase
          .from("scf_program_configurations")
          .update(transformedData)
          .eq("id", program.id);

        if (error) {
          console.error("❌ Database update error:", error);
          console.error("Error code:", error.code);
          console.error("Error details:", error.details);
          
          // Handle specific error cases for update
          if (error.code === '23505') {
            const errorMsg = `Program ID "${data.program_id}" already exists. Please use a different ID.`;
            if (onValidationError) {
              onValidationError([errorMsg]);
            } else {
              toast({
                title: "Duplicate Program ID",
                description: errorMsg,
                variant: "destructive",
              });
            }
            return;
          }
          
          throw new Error(`Database error: ${error.message}${error.details ? ` - ${error.details}` : ''}`);
        }

        console.log('✓ Program updated successfully');
        toast({
          title: "Success",
          description: "Program configuration updated successfully",
        });
      }

      console.log('Calling onSuccess callback...');
      onSuccess();
      console.log('=== FORM SUBMISSION COMPLETED SUCCESSFULLY ===');
    } catch (error: any) {
      console.error("=== FORM SUBMISSION FAILED ===");
      console.error("Error:", error);
      console.error("Error stack:", error?.stack);
      
      const errorMsg = error.message || "Failed to save program configuration";
      if (onValidationError) {
        onValidationError([errorMsg]);
      } else {
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};
