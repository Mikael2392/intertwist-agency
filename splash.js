/* =========================================================
   INTERTWIST CINEMATIC SPLASH
========================================================= */


document.addEventListener(
  "DOMContentLoaded",
  () => {


    /* =====================================================
       SCROLLEN WÄHREND SPLASH SPERREN
    ===================================================== */

    document
      .documentElement
      .classList
      .add(
        "intertwist-splash-lock"
      );


    /* =====================================================
       SPLASH ERSTELLEN
    ===================================================== */

    const splash =
      document.createElement(
        "div"
      );


    splash.className =
      "intertwist-splash";


    splash.setAttribute(
      "aria-hidden",
      "true"
    );


    splash.innerHTML = `

      <div class="intertwist-splash__brand">


        <!--
          ORIGINAL INFINITY SYMBOL

          Es wird das komplette originale
          Logo geladen.

          CSS zeigt davon aber NUR
          den linken Infinity-Bereich.
        -->

        <div class="intertwist-splash__symbol">

          <img
            src="./assets/intertwist-logo.png"
            alt=""
          >

        </div>



        <!--
          NEUER TEXT
        -->

        <div class="intertwist-splash__name">


          <!-- INTER bleibt ruhig -->

          <span
            class="intertwist-splash__inter"
          >
            Inter
          </span>


          <!--
            NUR TWIST wird animiert
          -->

          <span
            id="intertwistCasinoWord"
            class="intertwist-splash__twist"
          >
            twist
          </span>


        </div>


      </div>

    `;


    document
      .body
      .appendChild(
        splash
      );


    /* =====================================================
       TWIST ELEMENT
    ===================================================== */

    const twist =
      document
        .getElementById(
          "intertwistCasinoWord"
        );


    if (!twist) {

      document
        .documentElement
        .classList
        .remove(
          "intertwist-splash-lock"
        );

      return;

    }


    /* =====================================================
       CASINO ZEICHEN
    ===================================================== */

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


    /*
      Zielwort.
    */

    const finalWord =
      "twist";


    /*
      Farben gelten NUR
      für den animierten twist-Teil.
    */

    const casinoColors = [

      "#eaff00",

      "#ffffff",

      "#fff45c",

      "#dfff3f",

      "#eaff00",

      "#f4ff85"

    ];


    /* =====================================================
       ZEIT
    ===================================================== */

    const startTime =
      performance.now();


    /*
      Random-Buchstaben laufen
      6,2 Sekunden.
    */

    const casinoDuration =
      6200;


    /*
      Alle 48 Millisekunden
      neues Wort.

      Sehr schnell:
      Man kann die Random-Wörter
      praktisch nicht lesen.
    */

    const changeEvery =
      48;


    let lastChange =
      0;


    /* =====================================================
       RANDOM BUCHSTABE
    ===================================================== */

    function randomCharacter() {

      const index =
        Math.floor(

          Math.random() *

          characters.length

        );


      return characters[
        index
      ]
      .toLowerCase();

    }


    /* =====================================================
       RANDOM 5-BUCHSTABEN-WORT
    ===================================================== */

    function randomWord() {

      let result =
        "";


      for (
        let i = 0;
        i < finalWord.length;
        i++
      ) {

        result +=
          randomCharacter();

      }


      return result;

    }


    /* =====================================================
       TWIST ANIMATION
    ===================================================== */

    function animateTwist(
      time
    ) {

      const elapsed =
        time -
        startTime;


      /*
        Nur alle 48ms ändern.
      */

      if (
        time -
        lastChange >=
        changeEvery
      ) {

        lastChange =
          time;


        /* neues Random Wort */

        twist.textContent =
          randomWord();


        /* =================================================
           KLEINE 3D DREHUNG
        ================================================= */

        const rotateX =
          (
            Math.random() *
            6
          ) -
          3;


        const rotateY =
          (
            Math.random() *
            12
          ) -
          6;


        const rotateZ =
          (
            Math.random() *
            2
          ) -
          1;


        const scale =
          0.99 +
          (
            Math.random() *
            0.025
          );


        twist.style.transform =
          `
            perspective(900px)

            rotateX(
              ${rotateX}deg
            )

            rotateY(
              ${rotateY}deg
            )

            rotateZ(
              ${rotateZ}deg
            )

            scale(
              ${scale}
            )
          `;


        /* =================================================
           CASINO FARBE
        ================================================= */

        const color =
          casinoColors[

            Math.floor(

              Math.random() *

              casinoColors.length

            )

          ];


        twist.style.color =
          color;


        /* =================================================
           GLOW
        ================================================= */

        twist.style.filter =
          `

            drop-shadow(
              0 0 9px
              ${color}
            )

            drop-shadow(
              0 0 20px
              ${color}
            )

          `;

      }


      /* =================================================
         WEITER ANIMIEREN
      ================================================= */

      if (
        elapsed <
        casinoDuration
      ) {

        requestAnimationFrame(
          animateTwist
        );

      }


      /* =================================================
         FINALE
      ================================================= */

      else {

        /*
          Random hört SOFORT auf.

          Jetzt erscheint sauber:

          twist
        */

        twist.textContent =
          finalWord;


        twist.style.color =
          "";


        twist.style.filter =
          "";


        twist.style.transform =
          "";


        twist
          .classList
          .add(
            "is-finished"
          );

      }

    }


    requestAnimationFrame(
      animateTwist
    );


    /* =====================================================
       ZEITPLAN
    ===================================================== */

    /*
      0 – 6.2 Sek:
      Casino + Wachstum

      6.2 – 9 Sek:
      fertiges Logo ruhig sichtbar

      9 Sek:
      Splash blendet aus

      10.4 Sek:
      Splash wird entfernt
    */


    const leaveTime =
      9000;


    const removeTime =
      10400;


    /* =====================================================
       AUSBLENDEN
    ===================================================== */

    setTimeout(
      () => {

        splash
          .classList
          .add(
            "is-leaving"
          );

      },

      leaveTime
    );


    /* =====================================================
       SPLASH ENTFERNEN
    ===================================================== */

    setTimeout(
      () => {

        splash.remove();


        document
          .documentElement
          .classList
          .remove(
            "intertwist-splash-lock"
          );


        document
          .body
          .classList
          .remove(
            "intro-lock"
          );

      },

      removeTime
    );


  }
);