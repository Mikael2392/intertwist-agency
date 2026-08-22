document.addEventListener(
  "DOMContentLoaded",
  () => {

    /* =========================================
       PROJEKT-SCREENSHOTS
    ========================================= */

    function applyProjectImages(scope) {

      const cards =
        scope.querySelectorAll(
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


    applyProjectImages(
      document
    );


    /* =========================================
       PROJEKTBAND ENDLOS
    ========================================= */

    const workGrid =
      document.querySelector(
        "#work .work-grid"
      );


    if (
      workGrid &&
      !workGrid.dataset.loopReady
    ) {

      const originalCards =
        Array.from(
          workGrid.children
        );


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


          clone
            .querySelectorAll(
              "a, button, input, select, textarea"
            )
            .forEach(
              element => {

                element.tabIndex =
                  -1;

              }
            );


          workGrid.appendChild(
            clone
          );

        }
      );


      workGrid.dataset.loopReady =
        "true";


      applyProjectImages(
        document
      );


      /* =====================================
         EXAKTE BREITE EINER PROJEKTRUNDE
      ===================================== */

      function updateLoopDistance() {

        const styles =
          getComputedStyle(
            workGrid
          );


        const gap =
          parseFloat(
            styles.columnGap ||
            styles.gap ||
            "0"
          );


        let distance =
          0;


        originalCards.forEach(
          card => {

            distance +=
              card.getBoundingClientRect()
                .width;

            distance +=
              gap;

          }
        );


        workGrid.style.setProperty(
          "--project-loop-distance",
          `${distance}px`
        );

      }


      requestAnimationFrame(
        updateLoopDistance
      );


      setTimeout(
        updateLoopDistance,
        500
      );


      let resizeTimer;


      window.addEventListener(
        "resize",
        () => {

          clearTimeout(
            resizeTimer
          );


          resizeTimer =
            setTimeout(
              updateLoopDistance,
              150
            );

        }
      );

    }


    /* =========================================
       HERO MIKAEL / PAULA 3D MAUSBEWEGUNG
    ========================================= */

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
            )
            /
            rect.width;


          const mouseY =
            (
              event.clientY -
              rect.top
            )
            /
            rect.height;


          const rotateY =
            (
              mouseX -
              0.5
            )
            *
            5;


          const rotateX =
            (
              0.5 -
              mouseY
            )
            *
            4;


          heroCard.style.transform =
            `
              perspective(1000px)
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