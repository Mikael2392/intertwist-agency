document.addEventListener(
  "DOMContentLoaded",
  () => {

    /* =====================================================
       PROJEKT-BILDER
    ===================================================== */

    function applyProjectImages() {

      const cards =
        document.querySelectorAll(
          "#work .work"
        );


      cards.forEach(
        card => {

          const title =
            card
              .querySelector("h3")
              ?.textContent
              ?.trim();


          let imageUrl =
            "";


          if (
            title ===
            "Sole Mio Apartments"
          ) {

            imageUrl =
              "https://image.thum.io/get/width/1200/crop/850/noanimate/https://solemio-apartments.com/";

          }


          if (
            title ===
            "MeetKoch"
          ) {

            imageUrl =
              "https://image.thum.io/get/width/1200/crop/850/noanimate/https://github.com/Mikael2392/meetkoch";

          }


          if (
            title ===
            "Wortschmiede"
          ) {

            imageUrl =
              "https://image.thum.io/get/width/1200/crop/850/noanimate/https://paula-smiri.lovable.app/";

          }


          if (
            title ===
            "Garage Portfolio"
          ) {

            imageUrl =
              "https://image.thum.io/get/width/1200/crop/850/noanimate/https://mikael-garage-portfolio.netlify.app/";

          }


          if (
            title ===
            "Developer / DevOps"
          ) {

            imageUrl =
              "https://image.thum.io/get/width/1200/crop/850/noanimate/https://bugshunterms.netlify.app/";

          }


          if (imageUrl) {

            card.style.setProperty(
              "--project-image",
              `url("${imageUrl}")`
            );

          }

        }
      );

    }


    applyProjectImages();


    /* =====================================================
       PROJEKT KARUSSELL
    ===================================================== */

    const workGrid =
      document.querySelector(
        "#work .work-grid"
      );


    if (workGrid) {

      const originalCards =
        Array.from(
          workGrid.children
        );


      /* =================================================
         KARTEN KOPIEREN
         Damit links/rechts endlos funktioniert
      ================================================= */

      if (
        !workGrid.dataset.loopReady
      ) {

        originalCards.forEach(
          card => {

            const clone =
              card.cloneNode(true);


            clone.setAttribute(
              "aria-hidden",
              "true"
            );


            if (
              clone.matches("a")
            ) {

              clone.tabIndex =
                -1;

            }


            workGrid.appendChild(
              clone
            );

          }
        );


        workGrid.dataset.loopReady =
          "true";

      }


      applyProjectImages();


      /* =================================================
         VARIABLEN
      ================================================= */

      let position =
        0;


      let loopWidth =
        0;


      let isDragging =
        false;


      let isHovering =
        false;


      let pointerStartX =
        0;


      let positionStart =
        0;


      let lastPointerX =
        0;


      let velocity =
        0;


      let resumeTime =
        0;


      const automaticSpeed =
        0.42;


      /* =================================================
         BREITE EINER KOMPLETTEN RUNDE
      ================================================= */

      function calculateLoopWidth() {

        const styles =
          getComputedStyle(
            workGrid
          );


        const gap =
          parseFloat(
            styles.gap ||
            styles.columnGap ||
            "0"
          );


        loopWidth =
          0;


        originalCards.forEach(
          card => {

            loopWidth +=
              card
                .getBoundingClientRect()
                .width;

            loopWidth +=
              gap;

          }
        );

      }


      requestAnimationFrame(
        calculateLoopWidth
      );


      setTimeout(
        calculateLoopWidth,
        400
      );


      /* =================================================
         ENDLOS POSITION KORRIGIEREN
      ================================================= */

      function normalizePosition() {

        if (
          loopWidth <= 0
        ) {

          return;

        }


        while (
          position <=
          -loopWidth
        ) {

          position +=
            loopWidth;

        }


        while (
          position > 0
        ) {

          position -=
            loopWidth;

        }

      }


      /* =================================================
         HAUPT-ANIMATION
      ================================================= */

      function animate() {

        const now =
          performance.now();


        /*
          Automatisch laufen:

          - nicht beim Ziehen
          - nicht beim Hover
          - erst nach kurzer Pause
        */

        if (
          !isDragging &&
          !isHovering &&
          now > resumeTime
        ) {

          position -=
            automaticSpeed;

        }


        /*
          kleines Nachrollen
          nach dem Ziehen
        */

        if (
          !isDragging &&
          Math.abs(velocity) >
          0.05
        ) {

          position +=
            velocity;


          velocity *=
            0.93;

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
         MAUS DRAUF = STOPP
      ================================================= */

      workGrid.addEventListener(
        "mouseenter",
        () => {

          isHovering =
            true;

        }
      );


      workGrid.addEventListener(
        "mouseleave",
        () => {

          if (
            !isDragging
          ) {

            isHovering =
              false;


            resumeTime =
              performance.now() +
              700;

          }

        }
      );


      /* =================================================
         MAUS / TOUCH DRAG START
      ================================================= */

      workGrid.addEventListener(
        "pointerdown",
        event => {

          isDragging =
            true;


          isHovering =
            true;


          velocity =
            0;


          pointerStartX =
            event.clientX;


          lastPointerX =
            event.clientX;


          positionStart =
            position;


          workGrid.classList.add(
            "is-dragging"
          );


          workGrid.setPointerCapture(
            event.pointerId
          );

        }
      );


      /* =================================================
         ZIEHEN NACH LINKS / RECHTS
      ================================================= */

      workGrid.addEventListener(
        "pointermove",
        event => {

          if (
            !isDragging
          ) {

            return;

          }


          const difference =
            event.clientX -
            pointerStartX;


          position =
            positionStart +
            difference;


          /*
            Geschwindigkeit merken,
            damit es nach dem Loslassen
            etwas nachrollt.
          */

          const movement =
            event.clientX -
            lastPointerX;


          velocity =
            movement *
            0.75;


          lastPointerX =
            event.clientX;


          normalizePosition();

        }
      );


      /* =================================================
         LOSLASSEN
      ================================================= */

      function finishDrag(
        event
      ) {

        if (
          !isDragging
        ) {

          return;

        }


        isDragging =
          false;


        workGrid.classList.remove(
          "is-dragging"
        );


        resumeTime =
          performance.now() +
          1200;


        if (
          event.pointerId !==
          undefined
        ) {

          try {

            workGrid.releasePointerCapture(
              event.pointerId
            );

          }

          catch (error) {

            /* nichts */

          }

        }

      }


      workGrid.addEventListener(
        "pointerup",
        finishDrag
      );


      workGrid.addEventListener(
        "pointercancel",
        finishDrag
      );


      /* =================================================
         VERHINDERT LINK-ÖFFNEN,
         WENN MAN NUR GEZOGEN HAT
      ================================================= */

      let dragDistance =
        0;


      workGrid.addEventListener(
        "pointerdown",
        () => {

          dragDistance =
            0;

        }
      );


      workGrid.addEventListener(
        "pointermove",
        event => {

          if (
            isDragging
          ) {

            dragDistance +=
              Math.abs(
                event.movementX || 0
              );

          }

        }
      );


      workGrid.addEventListener(
        "click",
        event => {

          if (
            dragDistance >
            10
          ) {

            event.preventDefault();

            event.stopPropagation();

          }

        },
        true
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
       HERO MIKAEL / PAULA MAUSBEWEGUNG
    ===================================================== */

    const hero =
      document.querySelector(
        ".hero"
      );


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

  }
);