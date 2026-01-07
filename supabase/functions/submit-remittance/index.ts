import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Verify custom session token (same pattern as submit-import-lc)
async function verifyCustomToken(token: string, secretKey: string): Promise<{ valid: boolean; userId?: string; dbId?: string }> {
  try {
    const tokenData = JSON.parse(atob(token));
    const { payload, signature } = tokenData;
    
    if (payload.exp < Date.now()) {
      return { valid: false };
    }
    
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
    
    const authHeader = req.headers.get("Authorization");
    let verifiedUserId: string | null = null;
    let verifiedDbId: string | null = null;

    // Try Supabase JWT first
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const supabaseClient = createClient(supabaseUrl, supabaseKey);
      const { data: { user }, error } = await supabaseClient.auth.getUser(token);
      
      if (user && !error) {
        verifiedUserId = user.id;
        verifiedDbId = user.id;
        debugLogs.auth_method = "supabase_jwt";
      }
    }

    // Parse request body
    const { session, action, formData, existingId, parentPacs008Id, transactionId, reason, businessApplication, initiatingChannel } = await req.json();
    debugLogs.action = action;

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
      console.log("DEBUG: Authentication failed");
      return new Response(
        JSON.stringify({ error: "Authentication required. Please sign in again.", debug: debugLogs }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    debugLogs.verified_user_id = verifiedUserId;
    debugLogs.verified_db_id = verifiedDbId;

    // Try to get user info from custom_users
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
    
    let dbUserId = verifiedDbId;
    let userFullName = "";
    
    if (Array.isArray(customUsers) && customUsers[0]) {
      dbUserId = customUsers[0].id;
      userFullName = customUsers[0].full_name || "";
    }

    debugLogs.db_user_id = dbUserId;

    // Handle different actions
    switch (action) {
      case "saveDraftPacs008":
      case "submitPacs008": {
        const status = action === "saveDraftPacs008" ? "draft" : "Pending Approval";
        const currentStage = action === "saveDraftPacs008" ? "Data Entry" : "Approval";
        
        const { paymentHeader, orderingCustomer, beneficiaryCustomer, amountCharges, routingSettlement, regulatoryCompliance, remittanceInfo } = formData;
        
        const record = {
          user_id: dbUserId,
          transfer_type: "customer",
          direction: "outward",
          status,
          current_stage: currentStage,
          business_application: businessApplication || "Adria TSCF Client",
          initiating_channel: initiatingChannel || "Portal",
          msg_ref: paymentHeader?.msgRef || null,
          uetr: paymentHeader?.uetr || null,
          cre_dt: paymentHeader?.creDt || null,
          sttlm_mtd: paymentHeader?.sttlmMtd || null,
          ord_name: orderingCustomer?.ordName || null,
          ord_acct: orderingCustomer?.ordAcct || null,
          ord_country: orderingCustomer?.ordCountry || null,
          ord_state: orderingCustomer?.ordState || null,
          ord_city: orderingCustomer?.ordCity || null,
          ord_addr1: orderingCustomer?.ordAddr1 || null,
          ord_addr2: orderingCustomer?.ordAddr2 || null,
          ord_post_code: orderingCustomer?.ordPostCode || null,
          ben_name: beneficiaryCustomer?.benName || null,
          ben_acct: beneficiaryCustomer?.benAcct || null,
          ben_country: beneficiaryCustomer?.benCountry || null,
          ben_state: beneficiaryCustomer?.benState || null,
          ben_city: beneficiaryCustomer?.benCity || null,
          ben_addr1: beneficiaryCustomer?.benAddr1 || null,
          ben_addr2: beneficiaryCustomer?.benAddr2 || null,
          ben_post_code: beneficiaryCustomer?.benPostCode || null,
          ben_bic: beneficiaryCustomer?.benBic || null,
          inst_amt: amountCharges?.instAmt ? Number(amountCharges.instAmt) : null,
          ccy: amountCharges?.ccy || null,
          xchg_rate: amountCharges?.fxRate ? Number(amountCharges.fxRate) : null,
          chg_br: amountCharges?.chgBr || null,
          instg_agt_bic: routingSettlement?.instgAgtBic || null,
          instd_agt_bic: routingSettlement?.instdAgtBic || null,
          intrmdy_agt_bic: routingSettlement?.intrmyBic || null,
          purp_cd: regulatoryCompliance?.purpCd || null,
          src_funds: regulatoryCompliance?.srcFunds || null,
          decl_flg: regulatoryCompliance?.declFlg || null,
          rmt_info: remittanceInfo?.rmtInfo || null,
          inv_ref: remittanceInfo?.invRef || null,
          form_data: formData,
          created_by: userFullName,
          ...(status === "Pending Approval" ? { submitted_at: new Date().toISOString() } : {}),
        };

        let result;
        if (existingId) {
          const resp = await fetch(
            `${supabaseUrl}/rest/v1/remittance_transactions?id=eq.${encodeURIComponent(existingId)}`,
            {
              method: "PATCH",
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                "Content-Type": "application/json",
                Prefer: "return=representation",
              },
              body: JSON.stringify(record),
            }
          );
          result = await resp.json();
          debugLogs.update_status = resp.status;
        } else {
          const resp = await fetch(
            `${supabaseUrl}/rest/v1/remittance_transactions`,
            {
              method: "POST",
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                "Content-Type": "application/json",
                Prefer: "return=representation",
              },
              body: JSON.stringify([record]),
            }
          );
          result = await resp.json();
          debugLogs.insert_status = resp.status;
        }

        if (!Array.isArray(result) || result.length === 0) {
          return new Response(
            JSON.stringify({ error: result?.message || "Failed to save PACS.008", debug: debugLogs }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const pacs008 = result[0];
        let pacs009Result = null;

        // Auto-create PACS.009 for COVE settlement on submit
        if (action === "submitPacs008" && paymentHeader?.sttlmMtd === "COVE") {
          const pacs009Record = {
            user_id: dbUserId,
            transfer_type: "fi",
            direction: "outward",
            status: "Pending Approval",
            current_stage: "Approval",
            parent_pacs008_id: pacs008.id,
            business_application: businessApplication || "Adria TSCF Client",
            initiating_channel: initiatingChannel || "Portal",
            uetr: paymentHeader?.uetr || null,
            cre_dt: paymentHeader?.creDt || null,
            sttlm_mtd: paymentHeader?.sttlmMtd || null,
            instg_agt_name: "Ordering Bank",
            instg_agt_bic: routingSettlement?.instgAgtBic || null,
            instd_agt_name: "Correspondent Bank",
            instd_agt_bic: routingSettlement?.intrmyBic || routingSettlement?.instdAgtBic || null,
            sttlm_amt: amountCharges?.instAmt ? Number(amountCharges.instAmt) : null,
            ccy: amountCharges?.ccy || null,
            linked_pacs008_ref: pacs008.transaction_ref,
            linked_uetr: paymentHeader?.uetr || null,
            form_data: {},
            created_by: userFullName,
            submitted_at: new Date().toISOString(),
          };

          const pacs009Resp = await fetch(
            `${supabaseUrl}/rest/v1/interbank_settlements`,
            {
              method: "POST",
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                "Content-Type": "application/json",
                Prefer: "return=representation",
              },
              body: JSON.stringify([pacs009Record]),
            }
          );
          const pacs009Data = await pacs009Resp.json();

          if (Array.isArray(pacs009Data) && pacs009Data[0]) {
            pacs009Result = pacs009Data[0];
            
            // Update PACS.008 with linked PACS.009 ID
            await fetch(
              `${supabaseUrl}/rest/v1/remittance_transactions?id=eq.${encodeURIComponent(pacs008.id)}`,
              {
                method: "PATCH",
                headers: {
                  apikey: supabaseKey,
                  Authorization: `Bearer ${supabaseKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ linked_pacs009_id: pacs009Result.id }),
              }
            );
          }
        }

        console.log("DEBUG: PACS.008 saved successfully", debugLogs);
        return new Response(
          JSON.stringify({
            success: true,
            pacs008Id: pacs008.id,
            pacs008Ref: pacs008.transaction_ref,
            pacs009Id: pacs009Result?.id,
            pacs009Ref: pacs009Result?.settlement_ref,
            debug: debugLogs,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "saveDraftPacs009":
      case "submitPacs009": {
        const status = action === "saveDraftPacs009" ? "draft" : "Pending Approval";
        const currentStage = action === "saveDraftPacs009" ? "Data Entry" : "Approval";
        
        const { settlementHeader, instructingAgent, instructedAgent, settlementAmount, coverLinkage, settlementInstructions } = formData;
        
        const record = {
          user_id: dbUserId,
          transfer_type: "fi",
          direction: "outward",
          status,
          current_stage: currentStage,
          parent_pacs008_id: parentPacs008Id || null,
          business_application: businessApplication || "Adria TSCF Client",
          initiating_channel: initiatingChannel || "Portal",
          uetr: settlementHeader?.uetr || null,
          cre_dt: settlementHeader?.creDt || null,
          sttlm_mtd: settlementHeader?.sttlmMtd || null,
          instg_agt_name: instructingAgent?.instgAgtName || null,
          instg_agt_bic: instructingAgent?.instgAgtBic || null,
          instd_agt_name: instructedAgent?.instdAgtName || null,
          instd_agt_bic: instructedAgent?.instdAgtBic || null,
          sttlm_amt: settlementAmount?.sttlmAmt ? Number(settlementAmount.sttlmAmt) : null,
          ccy: settlementAmount?.ccy || null,
          val_dt: settlementAmount?.valDt || null,
          linked_pacs008_ref: coverLinkage?.linkedPacs008Ref || null,
          linked_uetr: coverLinkage?.linkedUetr || null,
          instr_cd: settlementInstructions?.instrCd || null,
          addtl_info: settlementInstructions?.addtlInfo || null,
          form_data: formData,
          created_by: userFullName,
          ...(status === "Pending Approval" ? { submitted_at: new Date().toISOString() } : {}),
        };

        let result;
        if (existingId) {
          const resp = await fetch(
            `${supabaseUrl}/rest/v1/interbank_settlements?id=eq.${encodeURIComponent(existingId)}`,
            {
              method: "PATCH",
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                "Content-Type": "application/json",
                Prefer: "return=representation",
              },
              body: JSON.stringify(record),
            }
          );
          result = await resp.json();
        } else {
          const resp = await fetch(
            `${supabaseUrl}/rest/v1/interbank_settlements`,
            {
              method: "POST",
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                "Content-Type": "application/json",
                Prefer: "return=representation",
              },
              body: JSON.stringify([record]),
            }
          );
          result = await resp.json();
        }

        if (!Array.isArray(result) || result.length === 0) {
          return new Response(
            JSON.stringify({ error: result?.message || "Failed to save PACS.009", debug: debugLogs }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log("DEBUG: PACS.009 saved successfully", debugLogs);
        return new Response(
          JSON.stringify({
            success: true,
            id: result[0].id,
            settlementRef: result[0].settlement_ref,
            debug: debugLogs,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "approve": {
        const resp = await fetch(
          `${supabaseUrl}/rest/v1/remittance_transactions?id=eq.${encodeURIComponent(transactionId)}`,
          {
            method: "PATCH",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
              Prefer: "return=representation",
            },
            body: JSON.stringify({
              status: "Approved",
              current_stage: "Completed",
              approved_at: new Date().toISOString(),
              approved_by: dbUserId,
            }),
          }
        );
        const result = await resp.json();
        
        return new Response(
          JSON.stringify({ success: resp.ok, data: result, debug: debugLogs }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "reject": {
        const resp = await fetch(
          `${supabaseUrl}/rest/v1/remittance_transactions?id=eq.${encodeURIComponent(transactionId)}`,
          {
            method: "PATCH",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
              Prefer: "return=representation",
            },
            body: JSON.stringify({
              status: "Rejected",
              current_stage: "Completed",
              rejected_at: new Date().toISOString(),
              rejected_by: dbUserId,
              rejection_reason: reason || "",
            }),
          }
        );
        const result = await resp.json();
        
        return new Response(
          JSON.stringify({ success: resp.ok, data: result, debug: debugLogs }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("DEBUG: Error in submit-remittance:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
