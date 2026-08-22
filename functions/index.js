const { initializeApp } = require("firebase-admin/app");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret, defineString } = require("firebase-functions/params");

initializeApp();

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");
const FROM_EMAIL = defineString("FROM_EMAIL");
const CONTACT_TO_EMAIL = defineString("CONTACT_TO_EMAIL");

async function sendEmail({ to, subject, html }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY.value()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ from: FROM_EMAIL.value(), to: [to], subject, html })
  });
  if (!response.ok) throw new Error(`Resend error ${response.status}: ${await response.text()}`);
}

exports.onInquiryCreated = onDocumentCreated(
  { document: "inquiries/{inquiryId}", secrets: [RESEND_API_KEY], region: "europe-west1" },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const safeName = String(data.name || "Interessent").replace(/[<>]/g, "");
    const safeService = String(data.service || "Digitalprojekt").replace(/[<>]/g, "");

    await Promise.all([
      sendEmail({
        to: data.email,
        subject: "Deine Anfrage bei Intertwist ist angekommen",
        html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto"><h2>Hallo ${safeName},</h2><p>vielen Dank für deine Anfrage bei <strong>Intertwist</strong>.</p><p>Wir haben deine Anfrage zum Thema <strong>${safeService}</strong> erhalten und melden uns persönlich bei dir.</p><p>Viele Grüße<br><strong>Intertwist</strong></p></div>`
      }),
      sendEmail({
        to: CONTACT_TO_EMAIL.value(),
        subject: `Neue Intertwist-Anfrage: ${safeService}`,
        html: `<div style="font-family:Arial,sans-serif"><h2>Neue Website-Anfrage</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>E-Mail:</strong> ${data.email}</p><p><strong>Unternehmen:</strong> ${data.company || "–"}</p><p><strong>Budget:</strong> ${data.budget || "–"}</p><p><strong>Leistung:</strong> ${safeService}</p><p><strong>Nachricht:</strong><br>${String(data.message || "").replace(/[<>]/g, "")}</p></div>`
      })
    ]);
  }
);