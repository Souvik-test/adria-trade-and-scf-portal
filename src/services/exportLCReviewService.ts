
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserAsync } from "./database";
import { getProductAndProcessType } from "./processTypeMapping"; // <-- Add this import

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

// Save Export LC Review (Pre-adviced) to DB and also create matching transaction manually
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

  // Compose record for review table
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

  // Insert review first
  const { data: reviewData, error: reviewError } = await supabase
    .from("export_lc_reviews")
    .insert([insertData])
    .select()
    .single();

  if (reviewError) throw reviewError;

  // Insert transaction row with correct product/process type by mapping
  const { product_type, process_type } = getProductAndProcessType({
    actionType: "review-pre-adviced-lc",
    productType: "Export LC",
  });

  const transactionInsert = {
    user_id: user.id,
    transaction_ref: lcData.lcReference,
    product_type,
    process_type, // <-- Set process_type appropriately
    status: reviewData.status || "Submitted",
    customer_name: lcData.parties?.[1]?.name || null, // Beneficiary (Exporter)
    amount: lcData.amount,
    currency: lcData.currency,
    created_by: user.email || user.id,
    initiating_channel: "Portal",
  };

  const { error: transactionError } = await supabase
    .from("transactions")
    .insert([transactionInsert]);

  if (transactionError) throw transactionError;

  return reviewData;
};
