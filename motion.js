document.addEventListener(
  "DOMContentLoaded",
  () => {

    /* =====================================================
       PROJEKT SCREENSHOTS
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


          let imageUrl = "";


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
       ENDLOSES PROJEKTBAND
    ===================================================== */

    const workSection =
      document.querySelector(
        "#work"
      );


    const workGrid =
      document.querySelector(
        "#work .work-grid"
      );


    if (
      workGrid &&
      workSection
    ) {

      let originalCards =
        Array.from(
          workGrid.children
        );


      /* -----------------------------------------------------
         KARTEN EINMAL KOPIEREN
      ----------------------------------------------------- */

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

      }


      applyProjectImages();


      /* -----------------------------------------------------
         EXAKTE BREITE EINER RUNDE
      ----------------------------------------------------- */

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
              card
                .getBoundingClientRect()
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


      /* =====================================================
         3D RAD EFFEKT
      ===================================================== */

      function update3DCarousel() {

        const sectionRect =
          workSection.getBoundingClientRect();


        /*
          Mittelpunkt des sichtbaren Browsers.
        */

        const screenCenter =
          window.innerWidth / 2;


        const cards =
          workGrid.querySelectorAll(
            ".work"
          );


        let closestCard =
          null;


        let closestDistance =
          Infinity;


        cards.forEach(
          card => {

            /*
              Wenn mit Maus drauf:
              JS verändert diese Karte nicht.
            */

            if (
              card.classList.contains(
                "is-hovered"
              )
            ) {

              return;

            }


            const rect =
              card.getBoundingClientRect();


            const cardCenter =
              rect.left +
              rect.width / 2;


            const difference =
              cardCenter -
              screenCenter;


            /*
              -1 = weit links
               0 = Mitte
               1 = weit rechts
            */

            const normalized =
              Math.max(
                -1,
                Math.min(
                  1,
                  difference /
                  (
                    window.innerWidth *
                    0.55
                  )
                )
              );


            /*
              Je weiter seitlich,
              desto stärker drehen.
            */

            const rotateY =
              normalized *
              -52;


            /*
              Mitte kommt nach vorne,
              Seiten nach hinten.
            */

            const centerPower =
              1 -
              Math.min(
                1,
                Math.abs(
                  normalized
                )
              );


            const translateZ =
              -120 +
              centerPower *
              190;


            /*
              Mitte größer.
            */

            const scale =
              0.82 +
              centerPower *
              0.22;


            /*
              Seiten etwas dunkler.
            */

            const opacity =
              0.5 +
              centerPower *
              0.5;


            const brightness =
              0.48 +
              centerPower *
              0.4;


            card.style.setProperty(
              "--card-rotate-y",
              `${rotateY}deg`
            );


            card.style.setProperty(
              "--card-z",
              `${translateZ}px`
            );


            card.style.setProperty(
              "--card-scale",
              scale.toFixed(3)
            );


            card.style.setProperty(
              "--card-opacity",
              opacity.toFixed(3)
            );


            card.style.setProperty(
              "--card-brightness",
              brightness.toFixed(3)
            );


            /*
              Welche Karte ist am nächsten
              an der Mitte?
            */

            const absoluteDistance =
              Math.abs(
                difference
              );


            if (
              absoluteDistance <
              closestDistance
            ) {

              closestDistance =
                absoluteDistance;

              closestCard =
                card;

            }

          }
        );


        /*
          Nur mittlere Karte markieren.
        */

        cards.forEach(
          card => {

            card.classList.remove(
              "is-center"
            );

          }
        );


        if (closestCard) {

          closestCard.classList.add(
            "is-center"
          );

        }


        requestAnimationFrame(
          update3DCarousel
        );

      }


      requestAnimationFrame(
        update3DCarousel
      );


      /* =====================================================
         HOVER = KARUSSELL STOPPEN
      ===================================================== */

      function setupCardHover() {

        const cards =
          workGrid.querySelectorAll(
            ".work"
          );


        cards.forEach(
          card => {

            card.addEventListener(
              "mouseenter",
              () => {

                workGrid.classList.add(
                  "is-paused"
                );


                card.classList.add(
                  "is-hovered"
                );

              }
            );


            card.addEventListener(
              "mouseleave",
              () => {

                card.classList.remove(
                  "is-hovered"
                );


                workGrid.classList.remove(
                  "is-paused"
                );

              }
            );

          }
        );

      }


      setupCardHover();


      /* =====================================================
         FENSTERGRÖSSE
      ===================================================== */

      let resizeTimer;


      window.addEventListener(
        "resize",
        () => {

          clearTimeout(
            resizeTimer
          );


          resizeTimer =
            setTimeout(
              () => {

                updateLoopDistance();

              },
              150
            );

        }
      );

    }


    /* =====================================================
       HERO 3D MAUS
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
            6;


          const rotateX =
            (
              0.5 -
              mouseY
            )
            *
            5;


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