document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     PROJEKT-BILDER
  ===================================================== */

  function applyProjectImages() {

    const cards =
      document.querySelectorAll("#work .work");

    cards.forEach(card => {

      const title =
        card
          .querySelector("h3")
          ?.textContent
          ?.trim();

      let imageUrl = "";


      if (title === "Sole Mio Apartments") {

        imageUrl =
          "https://image.thum.io/get/width/1200/crop/850/noanimate/https://solemio-apartments.com/";

      }


      if (title === "MeetKoch") {

        imageUrl =
          "https://image.thum.io/get/width/1200/crop/850/noanimate/https://github.com/Mikael2392/meetkoch";

      }


      if (title === "Wortschmiede") {

        imageUrl =
          "https://image.thum.io/get/width/1200/crop/850/noanimate/https://paula-smiri.lovable.app/";

      }


      if (title === "Garage Portfolio") {

        imageUrl =
          "https://image.thum.io/get/width/1200/crop/850/noanimate/https://mikael-garage-portfolio.netlify.app/";

      }


      if (title === "Developer / DevOps") {

        imageUrl =
          "https://image.thum.io/get/width/1200/crop/850/noanimate/https://bugshunterms.netlify.app/";

      }


      if (imageUrl) {

        card.style.setProperty(
          "--project-image",
          `url("${imageUrl}")`
        );

      }

    });

  }


  applyProjectImages();



  /* =====================================================
     PROJEKT KARUSSELL
  ===================================================== */

  const workGrid =
    document.querySelector("#work .work-grid");


  if (workGrid) {

    const originalCards =
      Array.from(workGrid.children);



    /* =================================================
       KARTEN KOPIEREN
       Für endloses Karussell
    ================================================= */

    if (!workGrid.dataset.loopReady) {

      originalCards.forEach(card => {

        const clone =
          card.cloneNode(true);


        clone.setAttribute(
          "aria-hidden",
          "true"
        );


        if (clone.matches("a")) {

          clone.tabIndex = -1;

        }


        workGrid.appendChild(clone);

      });


      workGrid.dataset.loopReady =
        "true";

    }


    applyProjectImages();



    /* =================================================
       VARIABLEN
    ================================================= */

    let position = 0;

    let loopWidth = 0;

    let pointerIsDown = false;

    let isDragging = false;

    let isHovering = false;

    let pointerStartX = 0;

    let positionStart = 0;

    let lastPointerX = 0;

    let velocity = 0;

    let resumeTime = 0;

    let activePointerId = null;

    let suppressClick = false;


    const automaticSpeed = 0.42;

    const dragThreshold = 7;



    /* =================================================
       TOUCH
    ================================================= */

    workGrid.style.touchAction =
      "pan-y";



    /* =================================================
       BREITE EINER KOMPLETTEN RUNDE
    ================================================= */

    function calculateLoopWidth() {

      const styles =
        getComputedStyle(workGrid);


      const gap =
        parseFloat(
          styles.gap ||
          styles.columnGap ||
          "0"
        );


      loopWidth = 0;


      originalCards.forEach(card => {

        loopWidth +=
          card
            .getBoundingClientRect()
            .width;

        loopWidth += gap;

      });

    }


    requestAnimationFrame(
      calculateLoopWidth
    );


    setTimeout(
      calculateLoopWidth,
      400
    );



    /* =================================================
       ENDLOS-POSITION
    ================================================= */

    function normalizePosition() {

      if (loopWidth <= 0) {
        return;
      }


      while (
        position <= -loopWidth
      ) {

        position += loopWidth;

      }


      while (
        position > 0
      ) {

        position -= loopWidth;

      }

    }



    /* =================================================
       HAUPTANIMATION
    ================================================= */

    function animate() {

      const now =
        performance.now();


      /*
        Automatisch bewegen,
        solange niemand zieht
        oder mit Maus darüber ist.
      */

      if (
        !pointerIsDown &&
        !isDragging &&
        !isHovering &&
        now > resumeTime
      ) {

        position -=
          automaticSpeed;

      }


      /*
        Nachrollen nach Drag
      */

      if (
        !pointerIsDown &&
        !isDragging &&
        Math.abs(velocity) > 0.05
      ) {

        position += velocity;

        velocity *= 0.93;

      }


      normalizePosition();


      workGrid.style.transform =
        `translate3d(${position}px, 0, 0)`;


      requestAnimationFrame(
        animate
      );

    }


    requestAnimationFrame(
      animate
    );



    /* =================================================
       MAUS DRAUF = KARUSSELL STOPP
    ================================================= */

    workGrid.addEventListener(
      "mouseenter",
      () => {

        isHovering = true;

      }
    );


    workGrid.addEventListener(
      "mouseleave",
      () => {

        if (
          !pointerIsDown &&
          !isDragging
        ) {

          isHovering = false;

          resumeTime =
            performance.now() + 700;

        }

      }
    );



    /* =================================================
       POINTER DOWN
    ================================================= */

    workGrid.addEventListener(
      "pointerdown",
      event => {

        /*
          Nur linke Maustaste.
        */

        if (
          event.pointerType === "mouse" &&
          event.button !== 0
        ) {

          return;

        }


        pointerIsDown = true;

        isDragging = false;

        suppressClick = false;

        isHovering = true;

        velocity = 0;


        pointerStartX =
          event.clientX;


        lastPointerX =
          event.clientX;


        positionStart =
          position;


        activePointerId =
          event.pointerId;


        /*
          WICHTIG:

          Hier KEIN setPointerCapture().

          Dadurch kann ein normaler Klick
          weiterhin auf dem <a>-Link landen.
        */

      }
    );



    /* =================================================
       POINTER MOVE
    ================================================= */

    workGrid.addEventListener(
      "pointermove",
      event => {

        if (!pointerIsDown) {
          return;
        }


        const difference =
          event.clientX -
          pointerStartX;


        const distance =
          Math.abs(difference);



        /* =================================================
           ERST AB 7px IST ES EIN DRAG
        ================================================= */

        if (
          distance > dragThreshold &&
          !isDragging
        ) {

          isDragging = true;

          suppressClick = true;


          workGrid.classList.add(
            "is-dragging"
          );


          /*
            Pointer Capture erst JETZT,
            wenn wirklich gezogen wird.
          */

          try {

            workGrid.setPointerCapture(
              event.pointerId
            );

          }

          catch (error) {

            /* nichts */

          }

        }



        /* =================================================
           WIRKLICH ZIEHEN
        ================================================= */

        if (!isDragging) {
          return;
        }


        position =
          positionStart +
          difference;


        const movement =
          event.clientX -
          lastPointerX;


        velocity =
          movement * 0.75;


        lastPointerX =
          event.clientX;


        normalizePosition();

      }
    );



    /* =================================================
       DRAG / CLICK ENDE
    ================================================= */

    function finishPointer(event) {

      if (!pointerIsDown) {
        return;
      }


      const wasDragging =
        isDragging;


      pointerIsDown =
        false;


      isDragging =
        false;


      workGrid.classList.remove(
        "is-dragging"
      );


      resumeTime =
        performance.now() + 1200;


      if (
        wasDragging &&
        activePointerId !== null
      ) {

        try {

          if (
            workGrid.hasPointerCapture(
              activePointerId
            )
          ) {

            workGrid.releasePointerCapture(
              activePointerId
            );

          }

        }

        catch (error) {

          /* nichts */

        }

      }


      activePointerId =
        null;


      /*
        Wenn es nur ein normaler Klick war,
        keine Geschwindigkeit nachlaufen lassen.
      */

      if (!wasDragging) {

        velocity = 0;

      }

    }


    workGrid.addEventListener(
      "pointerup",
      finishPointer
    );


    workGrid.addEventListener(
      "pointercancel",
      finishPointer
    );



    /* =================================================
       LINKS

       NORMALER KLICK:
       Projekt öffnet.

       NACH DRAG:
       Link wird NICHT geöffnet.
    ================================================= */

    workGrid.addEventListener(
      "click",
      event => {

        if (suppressClick) {

          event.preventDefault();

          event.stopPropagation();

          suppressClick = false;

          return;

        }


        /*
          Normalen Link ausdrücklich
          nicht blockieren.
        */

        const link =
          event.target.closest("a.work");


        if (link) {

          /*
            Hier machen wir absichtlich nichts.

            Der Browser öffnet ganz normal
            href + target="_blank".
          */

          return;

        }

      },
      true
    );



    /* =================================================
       BROWSER-BILD/ LINK DRAG VERHINDERN
    ================================================= */

    workGrid.addEventListener(
      "dragstart",
      event => {

        event.preventDefault();

      }
    );



    /* =================================================
       FENSTERGRÖSSE
    ================================================= */

    let resizeTimer;


    window.addEventListener(
      "resize",
      () => {

        clearTimeout(
          resizeTimer
        );


        resizeTimer =
          setTimeout(
            calculateLoopWidth,
            150
          );

      }
    );

  }



  /* =====================================================
     HERO-KARTE MAUSBEWEGUNG
  ===================================================== */

  const hero =
    document.querySelector(".hero");


  const heroCard =
    document.querySelector(
      ".hero__card"
    );


  if (
    hero &&
    heroCard
  ) {

    hero.addEventListener(
      "mousemove",
      event => {

        const rect =
          hero.getBoundingClientRect();


        const mouseX =
          (
            event.clientX -
            rect.left
          ) /
          rect.width;


        const mouseY =
          (
            event.clientY -
            rect.top
          ) /
          rect.height;


        const rotateY =
          (
            mouseX -
            0.5
          ) * 6;


        const rotateX =
          (
            0.5 -
            mouseY
          ) * 5;


        heroCard.style.transform =
          `
            perspective(1100px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
          `;

      }
    );


    hero.addEventListener(
      "mouseleave",
      () => {

        heroCard.style.transform =
          "";

      }
    );

  }

});