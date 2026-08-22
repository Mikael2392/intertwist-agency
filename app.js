import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const configReady =
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.startsWith("DEINE_");

const form = document.getElementById("inquiryForm");
const statusEl = document.getElementById("formStatus");
const submit = document.getElementById("submitButton");

let db = null;

if (configReady) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

// Wenn jemand auf ein Paket klickt,
// wird das Anfrageformular automatisch vorbereitet.
document.querySelectorAll("[data-package]").forEach((link) => {
  link.addEventListener("click", () => {
    const service = form?.querySelector('[name="service"]');
    const message = form?.querySelector('[name="message"]');

    if (service) {
      service.value = "Komplettpaket";
    }

    if (message) {
      message.value =
        `Ich interessiere mich für: ${link.dataset.package}. `;
    }
  });
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  statusEl.className = "form__status";
  statusEl.textContent = "";

  const fd = new FormData(form);

  // Unsichtbares Honeypot-Feld gegen Bots
  if (fd.get("website")) {
    return;
  }

  // Pflichtfelder prüfen
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Prüfen, ob Firebase verbunden ist
  if (!db) {
    statusEl.textContent =
      "Firebase ist noch nicht verbunden. Bitte firebase-config.js prüfen.";
    statusEl.classList.add("error");
    return;
  }

  const inquiry = {
    name: String(fd.get("name") || "").trim(),
    email: String(fd.get("email") || "")
      .trim()
      .toLowerCase(),
    company: String(fd.get("company") || "").trim(),
    budget: String(fd.get("budget") || ""),
    service: String(fd.get("service") || ""),
    message: String(fd.get("message") || "").trim()
  };

  submit.disabled = true;
  submit.textContent = "Wird gesendet …";

  try {
    // 1. Anfrage in Firestore speichern
    await addDoc(collection(db, "inquiries"), {
      ...inquiry,
      consent: true,
      status: "new",
      source: "website",
      createdAt: serverTimestamp()
    });

    // 2. Netlify Function aufrufen
    // Diese verschickt:
    // - Mail an Mikael
    // - Mail an Paula
    // - Bestätigung an den Kunden
    const mailResponse = await fetch(
      "/.netlify/functions/send-inquiry",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inquiry)
      }
    );

    let mailResult = {};

    try {
      mailResult = await mailResponse.json();
    } catch {
      // Falls die Function keine JSON-Antwort liefert
    }

    if (!mailResponse.ok) {
      console.error("Mail Function Fehler:", mailResult);

      throw new Error(
        mailResult.error ||
        "E-Mail konnte nicht gesendet werden."
      );
    }

    // 3. Formular zurücksetzen
    form.reset();

    statusEl.textContent =
      "Danke! Deine Anfrage ist angekommen. Eine Bestätigung wurde per E-Mail versendet.";

    statusEl.classList.add("ok");

  } catch (error) {
    console.error("Intertwist Anfrage Fehler:", error);

    statusEl.textContent =
      "Die Anfrage konnte nicht vollständig verarbeitet werden. Bitte versuche es erneut.";

    statusEl.classList.add("error");

  } finally {
    submit.disabled = false;
    submit.textContent = "Anfrage senden ↗";
  }
});