/* =========================================================
   INTERTWIST - GOOGLE ANALYTICS 4
   Mess-ID: G-PSYM0XN811

   Analytics wird erst nach Zustimmung geladen.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const GA_ID = "G-PSYM0XN811";

  const CONSENT_KEY =
    "intertwist_analytics_consent";


  /* =====================================================
     GOOGLE ANALYTICS LADEN
  ===================================================== */

  function loadGoogleAnalytics() {

    if (window.intertwistAnalyticsLoaded) {
      return;
    }

    window.intertwistAnalyticsLoaded = true;


    /* Google Analytics Script laden */

    const googleScript =
      document.createElement("script");

    googleScript.async = true;

    googleScript.src =
      `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

    document.head.appendChild(
      googleScript
    );


    /* Data Layer */

    window.dataLayer =
      window.dataLayer || [];


    function gtag() {

      window.dataLayer.push(
        arguments
      );

    }


    window.gtag = gtag;


    /* Analytics starten */

    gtag(
      "js",
      new Date()
    );


    gtag(
      "config",
      GA_ID,
      {
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      }
    );


    console.log(
      "✅ Intertwist Google Analytics aktiviert"
    );

  }


  /* =====================================================
     GESPEICHERTE EINSTELLUNG LESEN
  ===================================================== */

  const savedConsent =
    localStorage.getItem(
      CONSENT_KEY
    );


  /* Besucher hat schon zugestimmt */

  if (savedConsent === "accepted") {

    loadGoogleAnalytics();

    return;

  }


  /* Besucher hat schon abgelehnt */

  if (savedConsent === "declined") {

    return;

  }


  /* =====================================================
     COOKIE / ANALYTICS BANNER
  ===================================================== */

  const banner =
    document.createElement("div");


  banner.id =
    "intertwist-cookie-banner";


  banner.innerHTML = `

    <div class="intertwist-cookie-box">

      <div class="intertwist-cookie-text">

        <strong>
          Datenschutz & Analytics
        </strong>

        <p>
          Wir verwenden Google Analytics,
          um zu verstehen, wie unsere Website
          genutzt wird.

          Analytics wird erst aktiviert,
          wenn du zustimmst.
        </p>

        <a
          href="./datenschutz.html"
          target="_blank"
          rel="noopener"
        >
          Datenschutzerklärung
        </a>

      </div>


      <div class="intertwist-cookie-actions">

        <button
          type="button"
          id="intertwist-cookie-decline"
        >
          Ablehnen
        </button>

        <button
          type="button"
          id="intertwist-cookie-accept"
        >
          Akzeptieren
        </button>

      </div>

    </div>

  `;


  /* =====================================================
     BANNER DESIGN
  ===================================================== */

  const style =
    document.createElement("style");


  style.textContent = `

    #intertwist-cookie-banner {

      position: fixed;

      left: 0;
      right: 0;
      bottom: 0;

      z-index: 99999999;

      display: flex;

      justify-content: center;

      padding: 18px;

      pointer-events: none;

    }


    .intertwist-cookie-box {

      width:
        min(
          920px,
          calc(100vw - 32px)
        );

      display: flex;

      align-items: center;

      justify-content:
        space-between;

      gap: 28px;

      padding:
        20px 22px;

      background:
        rgba(
          8,
          8,
          8,
          0.97
        );

      color:
        #ffffff;

      border:
        1px solid
        rgba(
          255,
          255,
          255,
          0.15
        );

      border-radius:
        16px;

      box-shadow:
        0 20px 60px
        rgba(
          0,
          0,
          0,
          0.65
        );

      backdrop-filter:
        blur(18px);

      font-family:
        "Inter",
        Arial,
        sans-serif;

      pointer-events:
        auto;

    }


    .intertwist-cookie-text {

      max-width: 620px;

    }


    .intertwist-cookie-text strong {

      display: block;

      margin-bottom: 8px;

      color: #ffffff;

      font-size: 16px;

      font-weight: 700;

    }


    .intertwist-cookie-text p {

      margin:
        0 0 8px 0;

      color:
        rgba(
          255,
          255,
          255,
          0.72
        );

      font-size: 13px;

      line-height: 1.55;

    }


    .intertwist-cookie-text a {

      color: #eaff00;

      font-size: 12px;

      text-decoration: none;

    }


    .intertwist-cookie-text a:hover {

      text-decoration: underline;

    }


    .intertwist-cookie-actions {

      display: flex;

      gap: 10px;

      flex-shrink: 0;

    }


    .intertwist-cookie-actions button {

      min-height: 44px;

      padding:
        0 19px;

      border-radius:
        999px;

      font-family:
        inherit;

      font-size:
        13px;

      font-weight:
        700;

      cursor:
        pointer;

      transition:
        transform 0.2s ease,
        opacity 0.2s ease;

    }


    .intertwist-cookie-actions button:hover {

      transform:
        translateY(-1px);

    }


    #intertwist-cookie-decline {

      background:
        transparent;

      color:
        #ffffff;

      border:
        1px solid
        rgba(
          255,
          255,
          255,
          0.28
        );

    }


    #intertwist-cookie-accept {

      background:
        #eaff00;

      color:
        #050505;

      border:
        1px solid
        #eaff00;

    }


    @media (max-width: 700px) {

      #intertwist-cookie-banner {

        padding: 10px;

      }


      .intertwist-cookie-box {

        width: 100%;

        flex-direction:
          column;

        align-items:
          stretch;

        gap: 16px;

        padding: 18px;

      }


      .intertwist-cookie-actions {

        width: 100%;

      }


      .intertwist-cookie-actions button {

        flex: 1;

      }

    }

  `;


  document.head.appendChild(
    style
  );


  document.body.appendChild(
    banner
  );


  /* =====================================================
     BUTTONS
  ===================================================== */

  const acceptButton =
    document.getElementById(
      "intertwist-cookie-accept"
    );


  const declineButton =
    document.getElementById(
      "intertwist-cookie-decline"
    );


  /* =====================================================
     AKZEPTIEREN
  ===================================================== */

  acceptButton.addEventListener(
    "click",
    () => {

      localStorage.setItem(
        CONSENT_KEY,
        "accepted"
      );


      loadGoogleAnalytics();


      banner.remove();

    }
  );


  /* =====================================================
     ABLEHNEN
  ===================================================== */

  declineButton.addEventListener(
    "click",
    () => {

      localStorage.setItem(
        CONSENT_KEY,
        "declined"
      );


      banner.remove();

    }
  );

});