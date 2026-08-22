import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { firebaseConfig }
from "./firebase-config.js";


/* =========================
   FIREBASE
========================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


/* =========================
   ADMINS
========================= */

const ALLOWED_ADMINS = {

  "mikaelsmiri@gmail.com": "Mikael",

  "smiripaula96@gmail.com": "Paula"

};


/* =========================
   STATUS
========================= */

const STATUS_LABELS = {

  new: "Neu",

  reviewing: "In Prüfung",

  accepted: "Auftrag aufgenommen",

  offer_sent: "Angebot gesendet",

  active: "Auftrag läuft",

  completed: "Abgeschlossen",

  rejected: "Abgelehnt"

};


/* =========================
   HTML ELEMENTE
========================= */

const loginView =
  document.getElementById("loginView");

const dashboardView =
  document.getElementById("dashboardView");


const loginForm =
  document.getElementById("loginForm");

const loginEmail =
  document.getElementById("loginEmail");

const loginPassword =
  document.getElementById("loginPassword");

const loginButton =
  document.getElementById("loginButton");

const loginStatus =
  document.getElementById("loginStatus");


const logoutButton =
  document.getElementById("logoutButton");


const signedInAs =
  document.getElementById("signedInAs");


const dashboardStatus =
  document.getElementById("dashboardStatus");


const inquiryList =
  document.getElementById("inquiryList");


const statusFilter =
  document.getElementById("statusFilter");


const statNew =
  document.getElementById("statNew");

const statReviewing =
  document.getElementById("statReviewing");

const statActive =
  document.getElementById("statActive");

const statCompleted =
  document.getElementById("statCompleted");


/* =========================
   DATEN
========================= */

let inquiries = [];

let currentAdmin = null;

let unsubscribeInquiries = null;


/* =========================
   SICHERER TEXT
========================= */

function escapeHtml(value = "") {

  return String(value)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");
}


/* =========================
   DATUM
========================= */

function formatDate(timestamp) {

  if (!timestamp?.toDate) {
    return "-";
  }

  return timestamp
    .toDate()
    .toLocaleString(
      "de-DE",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );
}


/* =========================
   LOGIN ANZEIGEN
========================= */

function showLogin() {

  loginView.classList.remove("hidden");

  dashboardView.classList.add("hidden");

}


/* =========================
   DASHBOARD ANZEIGEN
========================= */

function showDashboard(user) {

  loginView.classList.add("hidden");

  dashboardView.classList.remove("hidden");


  currentAdmin =
    ALLOWED_ADMINS[user.email.toLowerCase()];


  signedInAs.textContent =
    `Eingeloggt als ${currentAdmin} · ${user.email}`;

}


/* =========================
   STATISTIK
========================= */

function updateStats() {

  statNew.textContent =
    inquiries.filter(
      item => item.status === "new"
    ).length;


  statReviewing.textContent =
    inquiries.filter(
      item => item.status === "reviewing"
    ).length;


  statActive.textContent =
    inquiries.filter(
      item =>
        item.status === "accepted" ||
        item.status === "offer_sent" ||
        item.status === "active"
    ).length;


  statCompleted.textContent =
    inquiries.filter(
      item => item.status === "completed"
    ).length;

}


/* =========================
   TICKETS ANZEIGEN
========================= */

function renderTickets() {

  updateStats();


  const selectedStatus =
    statusFilter.value;


  const filtered =

    selectedStatus === "all"

      ? inquiries

      : inquiries.filter(
          item =>
            item.status === selectedStatus
        );


  if (!filtered.length) {

    inquiryList.innerHTML = `

      <div class="empty">

        Keine Anfragen in diesem Bereich.

      </div>

    `;

    return;
  }


  inquiryList.innerHTML = filtered
    .map(item => {

      const status =
        item.status || "new";


      const owner =
        item.owner || "Noch niemand";


      const email =
        item.email || "";


      return `

        <article
          class="ticket"
          data-id="${item.id}"
        >

          <div class="ticket-head">

            <div>

              <h2 class="ticket-title">

                ${escapeHtml(
                  item.name || "Unbekannter Kunde"
                )}

              </h2>


              <div class="ticket-meta">

                ${escapeHtml(
                  item.service || "Keine Leistung"
                )}

                ·

                ${formatDate(item.createdAt)}

              </div>

            </div>


            <div
              class="badge ${status}"
            >

              ${escapeHtml(
                STATUS_LABELS[status] || status
              )}

            </div>

          </div>


          <div class="ticket-body">


            <div class="ticket-grid">


              <div class="info">

                <small>
                  E-Mail
                </small>

                <a
                  href="mailto:${encodeURIComponent(email)}"
                >

                  ${escapeHtml(email || "-")}

                </a>

              </div>


              <div class="info">

                <small>
                  Unternehmen
                </small>

                ${escapeHtml(
                  item.company || "-"
                )}

              </div>


              <div class="info">

                <small>
                  Budget
                </small>

                ${escapeHtml(
                  item.budget || "-"
                )}

              </div>


            </div>


            <div>

              <small class="muted">

                Nachricht

              </small>


              <div class="message">

                ${escapeHtml(
                  item.message || "-"
                )}

              </div>

            </div>


            <div>

              Zuständig:

              <span class="assignee">

                ${escapeHtml(owner)}

              </span>

            </div>


            <div class="ticket-actions">


              <button
                data-action="take"
                data-owner="Mikael"
              >

                Mikael übernimmt

              </button>


              <button
                data-action="take"
                data-owner="Paula"
              >

                Paula übernimmt

              </button>


              <button
                data-action="status"
                data-status="reviewing"
              >

                In Prüfung

              </button>


              <button
                data-action="status"
                data-status="accepted"
              >

                Auftrag aufgenommen

              </button>


              <button
                data-action="status"
                data-status="offer_sent"
              >

                Angebot gesendet

              </button>


              <button
                data-action="status"
                data-status="active"
              >

                Auftrag gestartet

              </button>


              <button
                data-action="status"
                data-status="completed"
              >

                Abschließen

              </button>


              <button
                class="danger"
                data-action="status"
                data-status="rejected"
              >

                Ablehnen

              </button>


            </div>

          </div>

        </article>

      `;

    })
    .join("");

}


/* =========================
   FIRESTORE LIVE LADEN
========================= */

function loadInquiries() {

  dashboardStatus.textContent =
    "Anfragen werden geladen …";


  if (unsubscribeInquiries) {
    unsubscribeInquiries();
  }


  unsubscribeInquiries =
    onSnapshot(

      collection(db, "inquiries"),

      snapshot => {

        inquiries =
          snapshot.docs.map(
            documentSnapshot => ({

              id: documentSnapshot.id,

              ...documentSnapshot.data()

            })
          );


        /* Neueste zuerst */

        inquiries.sort((a, b) => {

          const dateA =
            a.createdAt?.seconds || 0;

          const dateB =
            b.createdAt?.seconds || 0;

          return dateB - dateA;

        });


        dashboardStatus.textContent = "";

        renderTickets();

      },

      error => {

        console.error(
          "Firestore Fehler:",
          error
        );


        dashboardStatus.textContent =
          `Fehler beim Laden: ${error.message}`;


        dashboardStatus
          .classList
          .add("error");

      }

    );

}


/* =========================
   STATUS ÄNDERN
========================= */

async function changeStatus(
  inquiryId,
  newStatus
) {

  try {

    await updateDoc(

      doc(
        db,
        "inquiries",
        inquiryId
      ),

      {

        status: newStatus,

        updatedAt:
          serverTimestamp(),

        updatedBy:
          currentAdmin

      }

    );

  }

  catch (error) {

    console.error(error);


    alert(

      "Status konnte nicht geändert werden:\n\n" +

      error.message

    );

  }

}


/* =========================
   AUFTRAG ÜBERNEHMEN
========================= */

async function takeInquiry(
  inquiryId,
  owner
) {

  try {

    await updateDoc(

      doc(
        db,
        "inquiries",
        inquiryId
      ),

      {

        owner: owner,

        status: "reviewing",

        updatedAt:
          serverTimestamp(),

        updatedBy:
          currentAdmin

      }

    );

  }

  catch (error) {

    console.error(error);


    alert(

      "Anfrage konnte nicht übernommen werden:\n\n" +

      error.message

    );

  }

}


/* =========================
   LOGIN
========================= */

loginForm.addEventListener(

  "submit",

  async event => {

    event.preventDefault();


    loginStatus.textContent = "";

    loginStatus
      .classList
      .remove("error");


    loginButton.disabled = true;

    loginButton.textContent =
      "Login …";


    try {

      const email =
        loginEmail
          .value
          .trim()
          .toLowerCase();


      if (!ALLOWED_ADMINS[email]) {

        throw new Error(

          "Diese E-Mail ist nicht als Intertwist-Admin freigeschaltet."

        );

      }


      await signInWithEmailAndPassword(

        auth,

        email,

        loginPassword.value

      );

    }

    catch (error) {

      console.error(
        "Login Fehler:",
        error
      );


      loginStatus.textContent =
        "Login fehlgeschlagen. Bitte E-Mail und Passwort prüfen.";


      loginStatus
        .classList
        .add("error");

    }

    finally {

      loginButton.disabled = false;

      loginButton.textContent =
        "Einloggen";

    }

  }

);


/* =========================
   LOGOUT
========================= */

logoutButton.addEventListener(

  "click",

  async () => {

    await signOut(auth);

  }

);


/* =========================
   FILTER
========================= */

statusFilter.addEventListener(

  "change",

  renderTickets

);


/* =========================
   BUTTONS DER TICKETS
========================= */

inquiryList.addEventListener(

  "click",

  async event => {

    const button =
      event.target.closest(
        "button[data-action]"
      );


    if (!button) {
      return;
    }


    const ticket =
      button.closest(".ticket");


    const inquiryId =
      ticket?.dataset.id;


    if (!inquiryId) {
      return;
    }


    button.disabled = true;


    try {

      if (
        button.dataset.action ===
        "take"
      ) {

        await takeInquiry(

          inquiryId,

          button.dataset.owner

        );

      }


      if (
        button.dataset.action ===
        "status"
      ) {

        await changeStatus(

          inquiryId,

          button.dataset.status

        );

      }

    }

    finally {

      button.disabled = false;

    }

  }

);


/* =========================
   AUTH STATUS
========================= */

onAuthStateChanged(

  auth,

  async user => {

    if (!user) {

      currentAdmin = null;

      if (unsubscribeInquiries) {

        unsubscribeInquiries();

        unsubscribeInquiries = null;

      }

      showLogin();

      return;

    }


    const email =
      user.email?.toLowerCase();


    if (!ALLOWED_ADMINS[email]) {

      await signOut(auth);

      showLogin();


      loginStatus.textContent =
        "Dieses Konto ist nicht als Admin freigeschaltet.";


      loginStatus
        .classList
        .add("error");


      return;

    }


    showDashboard(user);

    loadInquiries();

  }

);