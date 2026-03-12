/**
 * Browser-side proof renderer.
 * Given a DomainProofViewModel (serialised as JSON), produces the full
 * proof DOM that matches the Astro cold-render markup in DomainPage.astro.
 *
 * This runs only after a successful unlock — the page never ships proof
 * HTML in the initial cold load.
 */

import type { DomainProofViewModel, ResolvedFlagship, ResolvedScreenshot, ResolvedSupportingItem } from "../../data/domains/domain-view-model";

/* ── tiny DOM helpers ──────────────────────────────── */

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      node.setAttribute(k, v);
    }
  }
  for (const child of children) {
    node.append(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

function ul(items: string[], listClass?: string): HTMLUListElement {
  const list = el("ul", listClass ? { class: listClass } : undefined);
  for (const item of items) {
    list.append(el("li", undefined, item));
  }
  return list;
}

function proofLinksFragment(links: { label: string; href: string }[], linkAttr: string): DocumentFragment {
  const frag = document.createDocumentFragment();
  frag.append(el("strong", undefined, "proof:"), " ");
  links.forEach((link, i) => {
    frag.append(el("a", { [linkAttr]: "", href: link.href }, link.label));
    if (i < links.length - 1) frag.append(", ");
  });
  return frag;
}

/* ── section renderers ─────────────────────────────── */

function renderScreenshotGallery(screenshots: ResolvedScreenshot[]): HTMLElement {
  const figure = el("figure", { class: "screenshot-gallery", "data-screenshot-gallery": "" });

  // Viewport with track and slides
  const viewport = el("div", { class: "screenshot-gallery__viewport", "data-gallery-viewport": "" });
  const track = el("ul", { class: "screenshot-gallery__track", "data-gallery-track": "" });

  for (const shot of screenshots) {
    const trigger = el("button", {
      class: "screenshot-gallery__trigger",
      type: "button",
      "data-gallery-trigger": "",
      "data-full-src": shot.src,
      "data-full-alt": shot.alt,
      "data-caption": shot.caption || shot.alt,
    });
    trigger.append(
      el("img", {
        class: "screenshot-gallery__image",
        src: shot.src,
        alt: shot.alt,
        loading: "lazy",
        decoding: "async",
      }),
    );

    const slide = el("li", { class: "screenshot-gallery__slide" });
    slide.append(trigger);
    if (shot.caption) {
      slide.append(el("span", { class: "screenshot-gallery__slide-caption" }, shot.caption));
    }
    track.append(slide);
  }

  viewport.append(track);
  figure.append(viewport);

  // Nav: prev arrow, dots, next arrow
  const nav = el("nav", {
    class: "screenshot-gallery__nav",
    "data-gallery-nav": "",
    "aria-label": "Screenshot navigation",
  });

  const prevBtn = el("button", {
    class: "screenshot-gallery__arrow screenshot-gallery__arrow--prev",
    type: "button",
    "data-gallery-prev": "",
    "aria-label": "Previous screenshots",
    disabled: "",
  });
  prevBtn.innerHTML = "&larr;";

  const dots = el("div", { class: "screenshot-gallery__dots", "data-gallery-dots": "" });

  const nextBtn = el("button", {
    class: "screenshot-gallery__arrow screenshot-gallery__arrow--next",
    type: "button",
    "data-gallery-next": "",
    "aria-label": "Next screenshots",
  });
  nextBtn.innerHTML = "&rarr;";

  nav.append(prevBtn, dots, nextBtn);
  figure.append(nav);

  // Lightbox dialog
  const lightbox = el("dialog", {
    class: "screenshot-gallery__lightbox",
    "data-gallery-lightbox": "",
  });

  const closeBtn = el("button", {
    class: "screenshot-gallery__lightbox-close",
    type: "button",
    "data-gallery-lightbox-close": "",
    "aria-label": "Close lightbox",
  });
  closeBtn.innerHTML = "&times;";

  lightbox.append(
    closeBtn,
    el("img", { class: "screenshot-gallery__lightbox-image", "data-gallery-lightbox-img": "", src: "", alt: "" }),
    el("p", { class: "screenshot-gallery__lightbox-caption", "data-gallery-lightbox-caption": "" }),
  );
  figure.append(lightbox);

  return figure;
}

function renderFlagship(f: ResolvedFlagship): HTMLElement {
  const article = el("article", {
    class: "supporting-work__item flagship",
    id: `flagship-${f.slug}`,
    "data-flagship": "",
  });

  // header
  const header = el("header", { class: "flagship__header" });
  header.append(
    el("h3", { class: "supporting-work__title flagship__title", "data-flagship-title": "" }, f.title),
    el("p", { class: "supporting-work__context flagship__summary" }, f.summary),
  );
  article.append(header);

  // facts
  const facts = el("div", { class: "flagship__facts" });
  const problemP = el("p", { class: "domain-page__scope flagship__line", "data-flagship-problem": "" });
  problemP.append(el("strong", undefined, "problem:"), " " + f.problem);
  const roleP = el("p", { class: "domain-page__scope flagship__line", "data-flagship-role": "" });
  roleP.append(el("strong", undefined, "role:"), " " + f.role);
  facts.append(problemP, roleP);
  article.append(facts);

  // grid
  const grid = el("div", { class: "flagship__grid" });
  const gridSections: [string, string, string[]][] = [
    ["constraints", "data-flagship-constraints", f.constraints],
    ["decisions", "data-flagship-decisions", f.decisions],
    ["outcomes", "data-flagship-outcomes", f.outcomes],
    ["stack", "data-flagship-stack", f.stack],
  ];
  for (const [label, attr, items] of gridSections) {
    const section = el("section", { class: "flagship__group", [attr]: "" });
    const labelP = el("p", { class: "flagship__label" });
    labelP.append(el("strong", undefined, `${label}:`));
    section.append(labelP, ul(items, "domain-page__list flagship__list"));
    grid.append(section);
  }
  article.append(grid);

  // proof links
  if (f.proofLinks.length > 0) {
    const p = el("p", { class: "supporting-work__links flagship__links", "data-flagship-proof-links": "" });
    p.append(proofLinksFragment(f.proofLinks, "data-flagship-proof-link"));
    article.append(p);
  }

  // visual (non-mermaid only — mermaid diagrams are server-rendered)
  if (f.visual && !f.visual.mermaid && f.visual.src) {
    const figure = el("figure", { class: "flagship__figure", "data-flagship-visual": "" });
    figure.append(
      el("img", {
        class: "flagship__image",
        src: f.visual.src,
        alt: f.visual.alt,
        loading: "lazy",
        decoding: "async",
      }),
    );
    if (f.visual.caption) {
      figure.append(el("figcaption", { class: "flagship__caption" }, f.visual.caption));
    }
    article.append(figure);
  }

  // screenshot gallery
  if (f.screenshots.length > 0) {
    article.append(renderScreenshotGallery(f.screenshots));
  }

  return article;
}

function renderSupportingItem(item: ResolvedSupportingItem): HTMLElement {
  const article = el("article", { class: "supporting-work__item", "data-supporting-item": "" });
  article.append(
    el("h3", { class: "supporting-work__title" }, item.title),
    el("p", { class: "supporting-work__context" }, item.context),
  );

  if (item.proofLinks.length > 0) {
    const p = el("p", { class: "supporting-work__links" });
    p.append(proofLinksFragment(item.proofLinks, "data-proof-link"));
    article.append(p);
  }

  if (item.overlapNote || item.relatedEntries.length > 0) {
    const p = el("p", { class: "supporting-work__overlap" });
    p.append(el("strong", undefined, "overlap:"), " ");
    p.append(item.overlapNote ? `${item.overlapNote} ` : "also touches ");
    item.relatedEntries.forEach((entry, i) => {
      p.append(el("a", { href: entry.href }, entry.title));
      if (i < item.relatedEntries.length - 1) p.append(", ");
    });
    if (item.relatedEntries.length > 0) p.append(".");
    article.append(p);
  }

  return article;
}

/* ── main export ───────────────────────────────────── */

export function renderDomainProof(vm: DomainProofViewModel, homePath: string): HTMLElement {
  const article = el("article", {
    class: "domain-page",
    "data-domain-page": "",
    "data-route-visibility": "protected",
    "data-gate-state": "open",
  });

  // back link
  const backP = el("p", { class: "domain-page__back" });
  backP.append(el("a", { class: "domain-page__back-link", "data-back-home": "", href: homePath }, "back home"));
  article.append(backP);

  // intro
  const header = el("header", { class: "domain-page__intro" });
  header.append(
    el("h1", { class: "domain-page__title" }, vm.title),
    el("p", { class: "domain-page__thesis", "data-domain-thesis": "" }, vm.thesis),
  );
  article.append(header);

  // belongs-here
  const belongsSection = el("section", { class: "domain-page__section", "aria-labelledby": "belongs-here-heading" });
  belongsSection.append(
    el("h2", { class: "domain-page__section-title", id: "belongs-here-heading" }, "the kind of work i do here"),
    ul(vm.belongsHere, "domain-page__list"),
  );
  const scopeP = el("p", { class: "domain-page__scope" });
  scopeP.append(el("strong", undefined, "scope:"), " " + vm.scope);
  belongsSection.append(scopeP);
  article.append(belongsSection);

  // flagships
  if (vm.flagships.length > 0) {
    const section = el("section", {
      class: "domain-page__section flagship-highlights",
      "aria-labelledby": "flagship-highlights-heading",
      "data-flagship-highlights": "",
    });
    section.append(el("h2", { class: "domain-page__section-title", id: "flagship-highlights-heading" }, "flagship highlights"));
    for (const f of vm.flagships) section.append(renderFlagship(f));
    article.append(section);
  }

  // supporting work
  const supportSection = el("section", {
    class: "domain-page__section supporting-work",
    "aria-labelledby": "supporting-work-heading",
    "data-supporting-work": "",
  });
  supportSection.append(el("h2", { class: "domain-page__section-title", id: "supporting-work-heading" }, "supporting work"));
  for (const item of vm.supportingItems) supportSection.append(renderSupportingItem(item));
  article.append(supportSection);

  // related domains
  if (vm.relatedDomains.length > 0) {
    const section = el("section", { class: "domain-page__section", "aria-labelledby": "related-domains-heading" });
    section.append(el("h2", { class: "domain-page__section-title", id: "related-domains-heading" }, "nearby domains"));
    const p = el("p", { class: "domain-page__nearby" });
    p.append("when a project crosses boundaries, it usually lands closest to ");
    vm.relatedDomains.forEach((entry, i) => {
      p.append(el("a", { href: entry.href }, entry.title));
      if (i < vm.relatedDomains.length - 1) p.append(", ");
    });
    p.append(".");
    section.append(p);
    article.append(section);
  }

  return article;
}
