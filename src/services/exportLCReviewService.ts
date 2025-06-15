
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserAsync } from "./database";

// Save Export LC Review (Pre-adviced) to DB
export const saveExportLCReview = async ({
  action,
  comments,
  lcData,
}: {
  action: "accept" | "refuse";
  comments: string;
  lcData: any;
}) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error("User not authenticated");

  // Compose record respecting the new DB fields
  const { data, error } = await supabase
    .from("export_lc_reviews")
    .insert({
      user_id: user.id,
      lc_reference: lcData.lcReference,
      issue_date: lcData.issueDate ? new Date(lcData.issueDate) : null,
      expiry_date: lcData.expiryDate ? new Date(lcData.expiryDate) : null,
      amount: lcData.amount,
      currency: lcData.currency,
      parties: lcData.parties,
      lc_amount: lcData.lcAmount,
      shipment: lcData.shipment,
      documents: lcData.documents,
      additional_conditions: lcData.additionalConditions,
      special_instructions: lcData.specialInstructions,
      action,
      comments,
      // status is set to 'Submitted' by default
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
