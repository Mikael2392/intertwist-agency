/* =========================================================
   INTERTWIST CINEMATIC SPLASH
   KURZE VERSION
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


        <!-- ORIGINAL INFINITY SYMBOL -->

        <div class="intertwist-splash__symbol">

          <img
            src="./assets/intertwist-logo.png"
            alt=""
          >

        </div>



        <!-- INTERTWIST TEXT -->

        <div class="intertwist-splash__name">


          <!-- INTER BLEIBT RUHIG -->

          <span
            class="intertwist-splash__inter"
          >
            Inter
          </span>


          <!-- NUR TWIST WIRD ANIMIERT -->

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


    const finalWord =
      "twist";


    const casinoColors = [

      "#eaff00",

      "#ffffff",

      "#fff45c",

      "#dfff3f",

      "#eaff00",

      "#f4ff85"

    ];


    /* =====================================================
       ZEITEN
    ===================================================== */

    const startTime =
      performance.now();


    /*
      Casino nur noch 1,8 Sekunden.
    */

    const casinoDuration =
      1800;


    /*
      Schnelle Buchstabenwechsel.
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
       RANDOM WORT
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


      if (
        time -
        lastChange >=
        changeEvery
      ) {

        lastChange =
          time;


        /* =================================================
           RANDOM TEXT
        ================================================= */

        twist.textContent =
          randomWord();


        /* =================================================
           KLEINE 3D ROTATION
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
         FINALES TWIST
      ================================================= */

      else {

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
       KURZER ZEITPLAN

       0 - 1,8 Sek.
       Casino

       1,8 - 2,4 Sek.
       fertiges Intertwist

       ab 2,4 Sek.
       Ausblenden

       bei 3,6 Sek.
       Website komplett frei
    ===================================================== */


    const leaveTime =
      2400;


    const removeTime =
      3600;


    /* =====================================================
       SPLASH AUSBLENDEN
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