export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405
    });
  }

  try {
    const body = await request.json();

    const {
      name,
      email,
      company,
      budget,
      service,
      message
    } = body;

    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
      return new Response(
        JSON.stringify({
          error: "RESEND_API_KEY fehlt"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const internalHtml = `
      <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;">
        <h2>Neue Intertwist-Anfrage</h2>

        <p>
          <strong>Name:</strong><br>
          ${name || "-"}
        </p>

        <p>
          <strong>E-Mail:</strong><br>
          ${email || "-"}
        </p>

        <p>
          <strong>Unternehmen:</strong><br>
          ${company || "-"}
        </p>

        <p>
          <strong>Budget:</strong><br>
          ${budget || "-"}
        </p>

        <p>
          <strong>Leistung:</strong><br>
          ${service || "-"}
        </p>

        <p>
          <strong>Nachricht:</strong><br>
          ${message || "-"}
        </p>

        <hr>

        <p>
          Status:
          <strong>Neue Anfrage</strong>
        </p>
      </div>
    `;

    const customerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;">
        <h2>Hallo ${name || ""},</h2>

        <p>
          vielen Dank für deine Anfrage bei
          <strong>Intertwist</strong>.
        </p>

        <p>
          Wir haben deine Anfrage erhalten und prüfen dein Projekt.
        </p>

        <p>
          Wir melden uns persönlich bei dir.
        </p>

        <br>

        <p>
          Viele Grüße<br>
          <strong>Intertwist</strong>
        </p>
      </div>
    `;

    const sendMail = async (payload) => {
      const response = await fetch(
        "https://api.resend.com/emails",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json"
          },

          body: JSON.stringify(payload)
        }
      );

      const resultText = await response.text();

      if (!response.ok) {
        throw new Error(
          `Resend Fehler ${response.status}: ${resultText}`
        );
      }

      try {
        return JSON.parse(resultText);
      } catch {
        return resultText;
      }
    };

    // TEST:
    // Alle drei E-Mails gehen erstmal nur an Mikael.
    // So prüfen wir, ob Resend + Netlify Function funktionieren.

    const results = await Promise.all([
      sendMail({
        from: "Intertwist <onboarding@resend.dev>",

        to: [
          "mikaelsmiri@gmail.com"
        ],

        subject:
          `TEST 1 – Neue Intertwist-Anfrage – ${service || "Projekt"} – ${name || "Kunde"}`,

        html: internalHtml
      }),

      sendMail({
        from: "Intertwist <onboarding@resend.dev>",

        to: [
          "mikaelsmiri@gmail.com"
        ],

        subject:
          `TEST 2 – Paula Benachrichtigung – ${service || "Projekt"} – ${name || "Kunde"}`,

        html: internalHtml
      }),

      sendMail({
        from: "Intertwist <onboarding@resend.dev>",

        to: [
          "mikaelsmiri@gmail.com"
        ],

        subject:
          "TEST 3 – Deine Anfrage bei Intertwist ist angekommen",

        html: customerHtml
      })
    ]);

    console.log(
      "Resend erfolgreich:",
      results
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Test-E-Mails wurden verschickt."
      }),
      {
        status: 200,

        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    console.error(
      "SEND-INQUIRY ERROR:",
      error
    );

    return new Response(
      JSON.stringify({
        error:
          "E-Mail konnte nicht gesendet werden",

        details:
          error?.message || String(error)
      }),
      {
        status: 500,

        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};