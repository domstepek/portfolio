/**
 * Initialises all screenshot gallery instances on the page.
 * Handles carousel navigation, dot indicators, and lightbox open/close.
 *
 * Shared between ScreenshotGallery.astro (static render) and
 * domain-gate-client.ts (dynamic mount after unlock).
 */

export function initGalleries() {
  document.querySelectorAll<HTMLElement>("[data-screenshot-gallery]").forEach((gallery) => {
    // Skip galleries that are already initialised
    if (gallery.hasAttribute("data-gallery-init")) return;
    gallery.setAttribute("data-gallery-init", "");

    const viewport = gallery.querySelector<HTMLElement>("[data-gallery-viewport]")!;
    const track = gallery.querySelector<HTMLElement>("[data-gallery-track]")!;
    const prevBtn = gallery.querySelector<HTMLButtonElement>("[data-gallery-prev]")!;
    const nextBtn = gallery.querySelector<HTMLButtonElement>("[data-gallery-next]")!;
    const dotsContainer = gallery.querySelector<HTMLElement>("[data-gallery-dots]")!;
    const lightbox = gallery.querySelector<HTMLDialogElement>("[data-gallery-lightbox]")!;
    const lightboxImg = gallery.querySelector<HTMLImageElement>("[data-gallery-lightbox-img]")!;
    const lightboxCaption = gallery.querySelector<HTMLParagraphElement>("[data-gallery-lightbox-caption]")!;
    const lightboxClose = gallery.querySelector<HTMLButtonElement>("[data-gallery-lightbox-close]")!;
    const triggers = gallery.querySelectorAll<HTMLButtonElement>("[data-gallery-trigger]");
    const slides = track.querySelectorAll<HTMLElement>(".screenshot-gallery__slide");

    if (slides.length === 0) return;

    const mobileQuery = window.matchMedia("(max-width: 40rem)");
    let visibleCount = mobileQuery.matches ? 1 : 3;

    function getPageCount() {
      return Math.max(1, Math.ceil(slides.length / visibleCount));
    }

    function getScrollMetrics() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const stepSize = (slideWidth + gap) * visibleCount;
      return { slideWidth, gap, stepSize };
    }

    function getCurrentPage() {
      if (slides.length === 0) return 0;
      const { stepSize } = getScrollMetrics();
      const scrollPos = viewport.scrollLeft;
      return Math.round(scrollPos / stepSize);
    }

    function buildDots() {
      const pageCount = getPageCount();
      dotsContainer.innerHTML = "";
      if (pageCount <= 1) return;
      for (let i = 0; i < pageCount; i++) {
        const dot = document.createElement("button");
        dot.className = "screenshot-gallery__dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Go to page ${i + 1}`);
        dot.addEventListener("click", () => scrollToPage(i));
        dotsContainer.appendChild(dot);
      }
      updateState();
    }

    function scrollToPage(page: number) {
      const { stepSize } = getScrollMetrics();
      viewport.scrollTo({ left: page * stepSize, behavior: "smooth" });
    }

    function updateState() {
      const scrollPos = viewport.scrollLeft;
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      const threshold = 5;

      const atStart = scrollPos <= threshold;
      const atEnd = scrollPos >= maxScroll - threshold;

      prevBtn.disabled = atStart;
      nextBtn.disabled = atEnd;

      const page = getCurrentPage();
      const dots = dotsContainer.querySelectorAll<HTMLButtonElement>(".screenshot-gallery__dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("screenshot-gallery__dot--active", i === page);
      });
    }

    // Hide nav if not enough slides to scroll
    function updateNavVisibility() {
      const nav = gallery.querySelector<HTMLElement>("[data-gallery-nav]")!;
      nav.style.display = slides.length <= visibleCount ? "none" : "";
    }

    prevBtn.addEventListener("click", () => {
      const { stepSize } = getScrollMetrics();
      viewport.scrollBy({ left: -stepSize, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      const { stepSize } = getScrollMetrics();
      viewport.scrollBy({ left: stepSize, behavior: "smooth" });
    });

    viewport.addEventListener("scroll", () => updateState(), { passive: true });
    viewport.addEventListener("scrollend", () => updateState(), { passive: true });

    mobileQuery.addEventListener("change", (e) => {
      visibleCount = e.matches ? 1 : 3;
      buildDots();
      updateNavVisibility();
    });

    // Lightbox
    function openLightbox(trigger: HTMLButtonElement) {
      lightboxImg.src = trigger.dataset.fullSrc || "";
      lightboxImg.alt = trigger.dataset.fullAlt || "";
      lightboxCaption.textContent = trigger.dataset.caption || "";
      document.documentElement.style.overflow = "hidden";
      lightbox.showModal();
    }

    function closeLightbox() {
      lightbox.close();
      document.documentElement.style.overflow = "";
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => openLightbox(trigger));
    });

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("close", () => {
      document.documentElement.style.overflow = "";
    });

    buildDots();
    updateNavVisibility();
  });
}
