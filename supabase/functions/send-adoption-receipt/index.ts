import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: adopter } = await supabase
      .from("Adopters")
      .select("name, email")
      .eq("email", email)
      .single();

    const { data: plants } = await supabase
      .from("AdoptedPlants")
      .select("plant_type, inventory_requested")
      .eq("requester", email);

    if (!adopter || !plants || plants.length === 0) {
      return new Response(JSON.stringify({ error: "No adoption found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const plantListHtml = plants
      .map((p) => `<li>${p.plant_type} x ${p.inventory_requested}</li>`)
      .join("\n");

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: Deno.env.get("SMTP_USER")!,
          password: Deno.env.get("SMTP_PASS")!,
        },
      },
    });

    await client.send({
      from: Deno.env.get("SMTP_FROM")!,
      to: adopter.email,
      subject: "Your Pine Corner Plant Adoption Receipt",
      html: `<p>Hi ${adopter.name},</p>

<p>Thank you for adopting plants from Pine Corner Greenhouse!</p>

<p>Here's what you reserved:</p>
<ul>
${plantListHtml}
</ul>

<p>- Marian</p>`,
    });

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
