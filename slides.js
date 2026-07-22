(() => {
  "use strict";

  const slides = Array.from(document.querySelectorAll("[data-slide]"));
  const previousButton = document.querySelector("#previous-slide");
  const nextButton = document.querySelector("#next-slide");
  const counter = document.querySelector("#slide-counter");
  const progress = document.querySelector("#slide-progress");
  const progressBar = document.querySelector("#progress-bar");
  const announcement = document.querySelector("#slide-announcement");
  const stage = document.querySelector("#slide-stage");

  if (
    slides.length === 0 ||
    !previousButton ||
    !nextButton ||
    !counter ||
    !progress ||
    !progressBar ||
    !announcement ||
    !stage
  ) {
    throw new Error("The presentation controls or slides are missing.");
  }

  let currentIndex = 0;
  let touchStart = null;

  const slideIndexFromHash = () => {
    const match = window.location.hash.match(/^#slide-(\d+)$/);
    const slideNumber = match ? Number.parseInt(match[1], 10) : 1;

    return slideNumber >= 1 && slideNumber <= slides.length ? slideNumber - 1 : 0;
  };

  const updateHistory = (index, mode) => {
    if (mode === "none") {
      return;
    }

    const hash = `#slide-${index + 1}`;
    const state = { slide: index + 1 };

    if (mode === "replace") {
      window.history.replaceState(state, "", hash);
    } else if (window.location.hash !== hash) {
      window.history.pushState(state, "", hash);
    }
  };

  const showSlide = (index, options = {}) => {
    const { historyMode = "push", announce = true } = options;
    const nextIndex = Math.max(0, Math.min(index, slides.length - 1));

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === nextIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
      slide.inert = !isActive;
    });

    currentIndex = nextIndex;

    const slideNumber = currentIndex + 1;
    const paddedNumber = String(slideNumber).padStart(2, "0");
    const paddedTotal = String(slides.length).padStart(2, "0");
    const title = slides[currentIndex].dataset.title || `Slide ${slideNumber}`;

    counter.textContent = `${paddedNumber} / ${paddedTotal}`;
    progressBar.style.width = `${(slideNumber / slides.length) * 100}%`;
    progress.setAttribute("aria-valuenow", String(slideNumber));
    progress.setAttribute("aria-valuetext", `Slide ${slideNumber} of ${slides.length}`);
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;
    document.title = `${title} | Fitness data journey`;

    updateHistory(currentIndex, historyMode);

    if (announce) {
      announcement.textContent = `Slide ${slideNumber} of ${slides.length}: ${title}`;
    }
  };

  const goToPreviousSlide = () => {
    showSlide(currentIndex - 1);
  };

  const goToNextSlide = () => {
    showSlide(currentIndex + 1);
  };

  const isEditableTarget = (target) =>
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT");

  previousButton.addEventListener("click", goToPreviousSlide);
  nextButton.addEventListener("click", goToNextSlide);

  document.addEventListener("keydown", (event) => {
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      isEditableTarget(event.target)
    ) {
      return;
    }

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        goToPreviousSlide();
        break;
      case "ArrowRight":
      case " ":
        event.preventDefault();
        goToNextSlide();
        break;
      case "Home":
        event.preventDefault();
        showSlide(0);
        break;
      case "End":
        event.preventDefault();
        showSlide(slides.length - 1);
        break;
      default:
        break;
    }
  });

  stage.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) {
        touchStart = null;
        return;
      }

      const touch = event.touches[0];
      touchStart = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    },
    { passive: true },
  );

  stage.addEventListener(
    "touchend",
    (event) => {
      if (!touchStart || event.changedTouches.length !== 1) {
        touchStart = null;
        return;
      }

      const touch = event.changedTouches[0];
      const horizontalDistance = touch.clientX - touchStart.x;
      const verticalDistance = touch.clientY - touchStart.y;
      const elapsed = Date.now() - touchStart.time;
      touchStart = null;

      if (
        elapsed > 800 ||
        Math.abs(horizontalDistance) < 50 ||
        Math.abs(horizontalDistance) <= Math.abs(verticalDistance) * 1.2
      ) {
        return;
      }

      if (horizontalDistance < 0) {
        goToNextSlide();
      } else {
        goToPreviousSlide();
      }
    },
    { passive: true },
  );

  const syncSlideToLocation = () => {
    const nextIndex = slideIndexFromHash();

    if (nextIndex !== currentIndex) {
      showSlide(nextIndex, { historyMode: "none" });
    } else if (window.location.hash !== `#slide-${nextIndex + 1}`) {
      showSlide(nextIndex, { historyMode: "replace", announce: false });
    }
  };

  window.addEventListener("popstate", syncSlideToLocation);
  window.addEventListener("hashchange", syncSlideToLocation);

  showSlide(slideIndexFromHash(), { historyMode: "replace", announce: false });
})();
