import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Verify custom session token
async function verifyCustomToken(token: string, secretKey: string): Promise<{ valid: boolean; userId?: string; dbId?: string }> {
  try {
    const tokenData = JSON.parse(atob(token));
    const { payload, signature } = tokenData;
    
    // Check expiry
    if (payload.exp < Date.now()) {
      return { valid: false };
    }
    
    // Verify HMAC signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secretKey),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    
    const signatureBytes = new Uint8Array(
      signature.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16))
    );
    
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      encoder.encode(JSON.stringify(payload))
    );
    
    if (!isValid) {
      return { valid: false };
    }
    
    return { valid: true, userId: payload.userId, dbId: payload.dbId };
  } catch {
    return { valid: false };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const debugLogs: Record<string, unknown> = {};
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Get Authorization header for JWT verification
    const authHeader = req.headers.get("Authorization");
    let verifiedUserId: string | null = null;
    let verifiedDbId: string | null = null;

    // Try Supabase JWT first
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      
      // Try to verify as Supabase JWT
      const supabaseClient = createClient(supabaseUrl, supabaseKey);
      const { data: { user }, error } = await supabaseClient.auth.getUser(token);
      
      if (user && !error) {
        verifiedUserId = user.id;
        verifiedDbId = user.id;
        debugLogs.auth_method = "supabase_jwt";
      }
    }

    // Parse request body
    const { session, formData, status } = await req.json();

    // If no Supabase auth, try custom token verification
    if (!verifiedUserId && session?.access_token) {
      const verification = await verifyCustomToken(session.access_token, supabaseKey);
      if (verification.valid) {
        verifiedUserId = verification.userId!;
        verifiedDbId = verification.dbId!;
        debugLogs.auth_method = "custom_token";
      }
    }

    // Require verified authentication
    if (!verifiedUserId || !verifiedDbId) {
      console.log("DEBUG: Authentication failed - no valid token");
      return new Response(
        JSON.stringify({ error: "Authentication required. Please sign in again.", debug: debugLogs }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    debugLogs.verified_user_id = verifiedUserId;
    debugLogs.status = status;
    debugLogs.formData_keys = formData ? Object.keys(formData) : null;

    // Use service role to access user_profiles
    const userResp = await fetch(
      `${supabaseUrl}/rest/v1/user_profiles?id=eq.${encodeURIComponent(verifiedDbId)}`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );
    const users = await userResp.json();
    debugLogs.num_user_profiles_found = Array.isArray(users) ? users.length : null;

    // If user profile not found, try custom_users table
    let dbUserId = verifiedDbId;
    let userFullName = "";
    
    if (Array.isArray(users) && users[0]) {
      dbUserId = users[0].id;
      userFullName = users[0].full_name || "";
    } else {
      // Try custom_users table
      const customUserResp = await fetch(
        `${supabaseUrl}/rest/v1/custom_users?id=eq.${encodeURIComponent(verifiedDbId)}`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      const customUsers = await customUserResp.json();
      
      if (Array.isArray(customUsers) && customUsers[0]) {
        dbUserId = customUsers[0].id;
        userFullName = customUsers[0].full_name || "";
      }
    }

    // Prepare row to insert
    const insertData = {
      ...formData,
      user_id: dbUserId,
      status: status || "submitted"
    };

    // Defensive clean-up and type fixes
    insertData.lc_amount = Number(insertData.lc_amount ?? 0);
    insertData.required_documents = Array.isArray(insertData.required_documents)
      ? insertData.required_documents.filter((doc: unknown) => typeof doc === "string")
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

    if (!lcResp.ok) {
      console.log("DEBUG: Insert failed:", debugLogs);
      return new Response(
        JSON.stringify({ error: lcResult?.message ?? "Insert failed.", debug: debugLogs }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // INSERT INTO TRANSACTIONS (for dashboard + notification) - only for 'submitted' status
    if ((status || "submitted") === "submitted") {
      const transactionInsertData = {
        user_id: dbUserId,
        transaction_ref: formData.corporate_reference || "",
        product_type: "Import LC",
        process_type: "Request Issuance",
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
      if (!txnResp.ok) {
        debugLogs.txn_error = txnResult?.message ?? "Insert failed.";
      }
    }

    console.log("DEBUG: Success!", debugLogs);
    return new Response(
      JSON.stringify({ data: lcResult, debug: debugLogs }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("DEBUG: Error in function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
