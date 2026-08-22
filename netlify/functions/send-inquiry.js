export default async (request) => {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "Method not allowed"
      }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
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

    if (!email) {
      return new Response(
        JSON.stringify({
          error: "Kunden-E-Mail fehlt"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const internalHtml = `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 650px;
        margin: auto;
        color: #111;
      ">

        <h2>Neue Anfrage bei Intertwist</h2>

        <p>
          Eine neue Projektanfrage wurde über
          <strong>intertwist.de</strong> gesendet.
        </p>

        <hr>

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
          <strong>Leistung:</strong><br>
          ${service || "-"}
        </p>

        <p>
          <strong>Budget:</strong><br>
          ${budget || "-"}
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

        <p>
          Bitte intern abstimmen, wer die Anfrage übernimmt.
        </p>

      </div>
    `;

    const customerHtml = `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 650px;
        margin: auto;
        color: #111;
      ">

        <h2>
          Hallo ${name || ""},
        </h2>

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
          <strong>Intertwist</strong><br>
          intertwist.de
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

    // 1. Interne Benachrichtigung
    // geht gleichzeitig an Mikael und Paula
    const internalMail = sendMail({
      from: "Intertwist <anfrage@intertwist.de>",

      to: [
        "mikaelsmiri@gmail.com",
        "smiripaula96@gmail.com"
      ],

      reply_to: email,

      subject:
        `Neue Anfrage – ${service || "Projekt"} – ${name || "Kunde"}`,

      html: internalHtml
    });

    // 2. Bestätigung an den Kunden
    const customerMail = sendMail({
      from: "Intertwist <anfrage@intertwist.de>",

      to: [
        email
      ],

      subject:
        "Deine Anfrage bei Intertwist ist angekommen",

      html: customerHtml
    });

    const results = await Promise.all([
      internalMail,
      customerMail
    ]);

    console.log(
      "Intertwist E-Mails erfolgreich verschickt:",
      results
    );

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Anfrage gespeichert und E-Mails erfolgreich verschickt."
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