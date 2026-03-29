import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

Deno.serve(async (req) => {
  try {
    const { record } = await req.json();

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
      to: record.email,
      subject: "Garden Party RSVP Confirmed!",
      content: `Hi ${record.name},

Thanks for your RSVP! We're excited to see you at the Spring Garden Party.

Date: Saturday, May 2
Time: 3pm - 5pm
Location: 5 Farrwood Avenue
  down the garden gate steps
  no stairs access down the driveway

Party size: ${record.party_size}

See you there!`,
    });

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
