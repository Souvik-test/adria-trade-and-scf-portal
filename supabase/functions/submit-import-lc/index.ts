
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
    const { session, formData, status } = await req.json();

    // Validate minimal session info
    if (!session || !session.user || !session.user.user_id) {
      return new Response(JSON.stringify({ error: "Missing or invalid session." }), {
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
    if (!Array.isArray(users) || !users[0] || !users[0].id) {
      return new Response(JSON.stringify({ error: "User record not found." }), {
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
    // Make sure date fields are null or string
    insertData.issue_date = insertData.issue_date || null;
    insertData.expiry_date = insertData.expiry_date || null;
    insertData.latest_shipment_date = insertData.latest_shipment_date || null;

    // Remove any extra fields that are not columns -- could optionally do a deep prune

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

    if (!lcResp.ok) {
      return new Response(JSON.stringify({ error: result?.message ?? "Insert failed." }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    return new Response(JSON.stringify({ data: result }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
