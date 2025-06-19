
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const debugLogs: any = {};
    const { session, formData, status } = await req.json();

    // Accept either session.user.id or session.user.user_id for compatibility
    const sessionUserId = session?.user?.user_id || session?.user?.id || null;

    debugLogs.session_present = !!session;
    debugLogs.session_user = !!session?.user;
    debugLogs.session_user_id = sessionUserId;
    debugLogs.session_token_short = session?.access_token ? `${session.access_token.slice(0, 10)}...` : null;
    debugLogs.status = status;
    debugLogs.formData_keys = formData ? Object.keys(formData) : null;

    // Validate minimal session info
    if (!session || !session.user || !sessionUserId) {
      console.log("DEBUG: Invalid session info:", debugLogs);
      return new Response(JSON.stringify({ error: "Missing or invalid session.", debug: debugLogs }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // Use service role to access custom_users
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Step 1: find the user (get UUID to insert as user_id foreign key)
    const userResp = await fetch(
      `${supabaseUrl}/rest/v1/custom_users?user_id=eq.${encodeURIComponent(sessionUserId)}`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );
    const users = await userResp.json();
    debugLogs.num_custom_users_found = Array.isArray(users) ? users.length : null;

    if (!Array.isArray(users) || !users[0] || !users[0].id) {
      console.log("DEBUG: User fetch failure:", debugLogs);
      return new Response(JSON.stringify({ error: "User record not found.", debug: debugLogs }), {
        status: 401,
        headers: corsHeaders,
      });
    }
    const dbUserId = users[0].id;
    const userFullName = users[0].full_name || "";

    // Prepare row to insert
    const insertData = {
      ...formData,
      user_id: dbUserId,
      status: status || "submitted"
    };

    // Defensive clean-up and type fixes
    insertData.lc_amount = Number(insertData.lc_amount ?? 0);
    insertData.required_documents = Array.isArray(insertData.required_documents)
      ? insertData.required_documents.filter((doc) => typeof doc === "string")
      : [];
    insertData.issue_date = insertData.issue_date || null;
    insertData.expiry_date = insertData.expiry_date || null;
    insertData.latest_shipment_date = insertData.latest_shipment_date || null;

    // Insert into import_lc_requests
    const lcResp = await fetch(
      `${supabaseUrl}/rest/v1/import_lc_requests`,
      {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify([insertData]),
      }
    );
    const lcResult = await lcResp.json();

    debugLogs.lcResp_ok = lcResp.ok;
    debugLogs.lcResp_status = lcResp.status;
    debugLogs.lcResp_result = lcResult && typeof lcResult === "object" ? Object.keys(lcResult) : null;

    if (!lcResp.ok) {
      console.log("DEBUG: Insert failed:", debugLogs);
      return new Response(JSON.stringify({ error: lcResult?.message ?? "Insert failed.", debug: debugLogs }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // ---- INSERT INTO TRANSACTIONS (for dashboard + notification) ----
    // Only do this for 'submitted' status, not drafts
    if ((status || "submitted") === "submitted") {
      const lcRow = Array.isArray(lcResult) ? lcResult[0] : lcResult[0] || lcResult.data?.[0] || lcResult.data;

      const transactionInsertData = {
        user_id: dbUserId,
        transaction_ref: formData.corporate_reference || "",
        product_type: "Import LC",
        process_type: "Request Issuance", // Consistently set process_type for Import LC
        status: "Submitted",
        customer_name: formData.applicant_name || "",
        amount: Number(formData.lc_amount ?? 0),
        currency: formData.currency || "USD",
        created_by: userFullName,
        initiating_channel: "Portal"
      };

      const txnResp = await fetch(
        `${supabaseUrl}/rest/v1/transactions`,
        {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify([transactionInsertData]),
        }
      );
      const txnResult = await txnResp.json();
      debugLogs.txnResp_ok = txnResp.ok;
      debugLogs.txnResp_status = txnResp.status;
      debugLogs.txnResp_result = txnResult;
      if (!txnResp.ok) {
        // Log but do not fail the LC request if this fails, it's a secondary action
        debugLogs.txn_error = txnResult?.message ?? "Insert failed.";
      }
    }

    // Notification is auto-generated from transactions trigger

    console.log("DEBUG: Success!", debugLogs);
    return new Response(JSON.stringify({ data: lcResult, debug: debugLogs }), { headers: corsHeaders });
  } catch (error) {
    console.error("DEBUG: Error in function:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
