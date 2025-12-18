import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import bcrypt from "https://esm.sh/bcryptjs@2.4.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, password, userData } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === "signup") {
      console.log("Processing signup for user:", userData?.userId);
      
      // Hash password securely with bcrypt
      const salt = bcrypt.genSaltSync(12);
      const passwordHash = bcrypt.hashSync(userData.password, salt);

      // Insert new user with secure hash
      const { data: insertData, error: insertError } = await supabase
        .from("custom_users")
        .insert({
          user_id: userData.userId,
          password_hash: passwordHash,
          full_name: userData.fullName,
          user_login_id: userData.userLoginId,
          role_type: userData.roleType,
          product_linkage: userData.productLinkage,
          corporate_id: userData.corporateId || "TC001",
        })
        .select("id, user_id, full_name, user_login_id, corporate_id, role_type, product_linkage, created_at, updated_at")
        .single();

      if (insertError) {
        console.error("Signup error:", insertError);
        return new Response(
          JSON.stringify({ error: insertError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Signup successful for user:", insertData?.user_id);
      return new Response(
        JSON.stringify({ user: insertData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "signin") {
      console.log("Processing signin for user:", userId);
      
      // Get user with password hash for verification
      const { data: users, error: fetchError } = await supabase
        .from("custom_users")
        .select("id, user_id, password_hash, full_name, user_login_id, corporate_id, role_type, product_linkage, corporate_name, client_id, created_at, updated_at")
        .eq("user_id", userId)
        .limit(1);

      if (fetchError || !users || users.length === 0) {
        console.log("User not found:", userId);
        return new Response(
          JSON.stringify({ error: "Invalid credentials" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const user = users[0];
      let isValid = false;
      let needsHashUpgrade = false;
      
      // Check if password_hash is a bcrypt hash (starts with $2a$, $2b$, or $2y$)
      const isBcryptHash = user.password_hash && user.password_hash.startsWith("$2");
      
      if (isBcryptHash) {
        // Verify password with bcrypt
        isValid = bcrypt.compareSync(password, user.password_hash);
      } else {
        // Legacy: plain text or simple hash comparison
        isValid = user.password_hash === password;
        if (isValid) {
          needsHashUpgrade = true;
          console.log("Legacy password detected for user:", userId, "- will upgrade to bcrypt");
        }
      }
      
      if (!isValid) {
        console.log("Invalid password for user:", userId);
        return new Response(
          JSON.stringify({ error: "Invalid credentials" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Upgrade legacy password to bcrypt hash
      if (needsHashUpgrade) {
        const salt = bcrypt.genSaltSync(12);
        const newHash = bcrypt.hashSync(password, salt);
        await supabase
          .from("custom_users")
          .update({ password_hash: newHash })
          .eq("id", user.id);
        console.log("Password upgraded to bcrypt for user:", userId);
      }

      // Generate a secure session token (signed with timestamp and user id)
      const sessionPayload = {
        userId: user.user_id,
        dbId: user.id,
        timestamp: Date.now(),
        exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hour expiry
      };
      
      // Create HMAC signature for the token
      const encoder = new TextEncoder();
      const secretKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secretKey),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      
      const payloadString = JSON.stringify(sessionPayload);
      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(payloadString)
      );
      
      const signatureHex = Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
      
      const sessionToken = btoa(JSON.stringify({
        payload: sessionPayload,
        signature: signatureHex,
      }));

      // Return user data without password hash
      const { password_hash: _, ...safeUser } = user;

      console.log("Signin successful for user:", userId);
      return new Response(
        JSON.stringify({
          user: safeUser,
          session_token: sessionToken,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify") {
      // Verify a session token
      try {
        const tokenData = JSON.parse(atob(password)); // password field contains the token
        const { payload, signature } = tokenData;
        
        // Check expiry
        if (payload.exp < Date.now()) {
          return new Response(
            JSON.stringify({ error: "Session expired", valid: false }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        // Verify signature
        const encoder = new TextEncoder();
        const secretKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
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
          return new Response(
            JSON.stringify({ error: "Invalid token", valid: false }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(
          JSON.stringify({ valid: true, userId: payload.userId, dbId: payload.dbId }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch {
        return new Response(
          JSON.stringify({ error: "Invalid token format", valid: false }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Auth error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
