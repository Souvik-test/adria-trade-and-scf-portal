
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserAsync } from "./database";

// Helper to ISO format date strings as YYYY-MM-DD or null
function toPgDate(date: string | null | undefined): string | null {
  if (!date) return null;
  // Accepts "DD/MM/YYYY" or "YYYY-MM-DD". Always returns "YYYY-MM-DD".
  if (date.includes("/")) {
    const [d, m, y] = date.split("/");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return date;
}

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

  // Compose record respecting the Insert type (fields must be present in type)
  const insertData = {
    user_id: user.id,
    lc_reference: lcData.lcReference,
    issue_date: toPgDate(lcData.issueDate),
    expiry_date: toPgDate(lcData.expiryDate),
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
    // status auto-set on insert
  };

  // Insert as a single-row array for strict typing; Supabase expects this.
  const { data, error } = await supabase
    .from("export_lc_reviews")
    .insert([insertData])
    .select()
    .single();

  if (error) throw error;
  return data;
};
