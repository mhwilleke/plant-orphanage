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
      html: `<p>Hi ${record.name},</p>

<p>Thanks for your RSVP! We're excited to see you at the Spring Garden Party.</p>

<p>
<strong>Date:</strong> Saturday, May 2<br>
<strong>Time:</strong> 3pm - 5pm<br>
<strong>Location:</strong> 5 Farrwood Avenue<br>
<em>&nbsp;&nbsp;down the garden gate steps</em><br>
<em>&nbsp;&nbsp;or use driveway for no stairs access</em>
</p>

<p>See you there!</p>`,
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
