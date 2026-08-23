/* =========================================================
   INTERTWIST CINEMATIC SPLASH
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /* Seite während Splash sperren */

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

        <div class="intertwist-splash__symbol">

          <img
            src="./assets/intertwist-logo.png"
            alt=""
          >

        </div>


        <div class="intertwist-splash__name">

          <span class="intertwist-splash__inter">
            Inter
          </span>

          <span
            id="intertwistCasinoWord"
            class="intertwist-splash__twist"
          >
            twist
          </span>

        </div>

      </div>
    `;


    document.body.appendChild(
      splash
    );


    /* =====================================================
       TWIST
    ===================================================== */

    const twist =
      document.getElementById(
        "intertwistCasinoWord"
      );


    if (!twist) {
      return;
    }


    /* =====================================================
       RANDOM BUCHSTABEN
    ===================================================== */

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


    const colors = [

      "#eaff00",

      "#ffffff",

      "#fff45c",

      "#dfff3f",

      "#eaff00"

    ];


    /* =====================================================
       ZEITEN
    ===================================================== */

    const startTime =
      performance.now();


    /*
      Die Casino-Buchstaben laufen
      lange, aber SEHR schnell.

      Dadurch kann man die einzelnen
      Zufallswörter nicht lesen.
    */

    const casinoDuration =
      6200;


    /*
      Alle 55 Millisekunden
      neue Buchstaben.

      Vorher waren es ca. 180 ms.
    */

    const changeEvery =
      55;


    let lastChange =
      0;


    /* =====================================================
       ZUFÄLLIGER BUCHSTABE
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
       5 RANDOM BUCHSTABEN
    ===================================================== */

    function randomWord() {

      let word =
        "";


      for (
        let i = 0;
        i < 5;
        i++
      ) {

        word +=
          randomCharacter();

      }


      return word;

    }


    /* =====================================================
       CASINO ANIMATION
    ===================================================== */

    function animateTwist(
      time
    ) {

      const elapsed =
        time -
        startTime;


      /*
        Alle 55ms komplett
        neues Zufallswort
      */

      if (
        time -
        lastChange >=
        changeEvery
      ) {

        lastChange =
          time;


        twist.textContent =
          randomWord();


        /* sehr kleine Rotation */

        const rotateY =
          (
            Math.random() *
            8
          ) -
          4;


        const rotateX =
          (
            Math.random() *
            5
          ) -
          2.5;


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
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            rotateZ(${rotateZ}deg)
            scale(${scale})
          `;


        /* Casino-Farbe */

        const color =
          colors[
            Math.floor(
              Math.random() *
              colors.length
            )
          ];


        twist.style.color =
          color;


        twist.style.filter =
          `
            drop-shadow(
              0 0 17px
              ${color}
            )
          `;

      }


      /* =================================================
         RANDOM WEITERLAUFEN
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
         STOPP → SOFORT TWIST
      ================================================= */

      else {

        /*
          Keine einzelnen Buchstaben
          nacheinander.

          Das ganze Wort rastet
          gleichzeitig auf TWIST ein.
        */

        twist.textContent =
          "twist";


        twist.style.color =
          "";


        twist.style.filter =
          "";


        twist.style.transform =
          "";


        twist.classList.add(
          "is-finished"
        );

      }

    }


    requestAnimationFrame(
      animateTwist
    );


    /* =====================================================
       SPLASH BLEIBT RUHIG STEHEN
    ===================================================== */

    /*
      6,2 Sekunden Casino

      danach fast 3 Sekunden
      fertiges:

      ∞ Intertwist

      ruhig sichtbar.
    */

    const leaveTime =
      9000;


    const removeTime =
      10350;


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
       ENTFERNEN → WEBSITE
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


        document.body
          .classList
          .remove(
            "intro-lock"
          );

      },

      removeTime
    );

  }
);