
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

    debugLogs.session_present = !!session;
    debugLogs.session_user = !!session?.user;
    debugLogs.session_user_id = session?.user?.user_id || null;
    debugLogs.session_token_short = session?.access_token ? `${session.access_token.slice(0, 10)}...` : null;
    debugLogs.status = status;
    debugLogs.formData_keys = formData ? Object.keys(formData) : null;

    // Validate minimal session info
    if (!session || !session.user || !session.user.user_id) {
      console.log("DEBUG: Invalid session info:", debugLogs);
      return new Response(JSON.stringify({ error: "Missing or invalid session.", debug: debugLogs }), {
        status: 401,
        headers: corsHeaders,
      });
    }
    // Use service role to access custom_users
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const { user_id } = session.user;

    // Step 1: find the user (get UUID to insert as user_id foreign key)
    const userResp = await fetch(
      `${supabaseUrl}/rest/v1/custom_users?user_id=eq.${encodeURIComponent(user_id)}`,
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
    const result = await lcResp.json();

    debugLogs.lcResp_ok = lcResp.ok;
    debugLogs.lcResp_status = lcResp.status;
    debugLogs.lcResp_result = result && typeof result === "object" ? Object.keys(result) : null;

    if (!lcResp.ok) {
      console.log("DEBUG: Insert failed:", debugLogs);
      return new Response(JSON.stringify({ error: result?.message ?? "Insert failed.", debug: debugLogs }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    console.log("DEBUG: Success!", debugLogs);
    return new Response(JSON.stringify({ data: result, debug: debugLogs }), { headers: corsHeaders });
  } catch (error) {
    console.error("DEBUG: Error in function:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
