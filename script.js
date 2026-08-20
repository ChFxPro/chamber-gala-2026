const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxCurrent = document.querySelector("[data-lightbox-current]");
const lightboxTotal = document.querySelector("[data-lightbox-total]");
const lightboxCloseControls = document.querySelectorAll("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
const mockupTriggers = [...document.querySelectorAll("[data-lightbox-src]")];
const pageProgress = document.querySelector(".page-progress span");
let activeMockupIndex = 0;
let lastFocusedElement = null;

const uniqueMockups = mockupTriggers.reduce((items, trigger) => {
  const src = trigger.dataset.lightboxSrc;
  if (!items.some((item) => item.src === src)) {
    items.push({
      src,
      title: trigger.dataset.lightboxTitle || "Mockup Preview",
      caption: trigger.dataset.lightboxCaption || "",
      alt: trigger.querySelector("img")?.alt || trigger.dataset.lightboxTitle || "Mockup preview",
    });
  }
  return items;
}, []);

if (lightboxTotal) {
  lightboxTotal.textContent = uniqueMockups.length;
}

function showMockup(index) {
  const item = uniqueMockups[index];
  if (!item) return;
  activeMockupIndex = index;
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  lightboxTitle.textContent = item.title;
  lightboxCaption.textContent = item.caption;
  if (lightboxCurrent) lightboxCurrent.textContent = index + 1;
}

function openLightbox(src) {
  const index = Math.max(0, uniqueMockups.findIndex((item) => item.src === src));
  lastFocusedElement = document.activeElement;
  showMockup(index);
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  lightbox.querySelector(".lightbox__close").focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
  lightboxImage.removeAttribute("src");
  if (lastFocusedElement) lastFocusedElement.focus();
}

function stepLightbox(direction) {
  const nextIndex = (activeMockupIndex + direction + uniqueMockups.length) % uniqueMockups.length;
  showMockup(nextIndex);
}

mockupTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openLightbox(trigger.dataset.lightboxSrc));
});

lightboxCloseControls.forEach((control) => {
  control.addEventListener("click", closeLightbox);
});

lightboxPrev.addEventListener("click", () => stepLightbox(-1));
lightboxNext.addEventListener("click", () => stepLightbox(1));

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") stepLightbox(-1);
  if (event.key === "ArrowRight") stepLightbox(1);
  if (event.key === "Tab") {
    const focusable = [
      ...lightbox.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])"),
    ].filter((element) => !element.disabled && element.offsetParent !== null);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  document.body.style.setProperty("--scroll-progress", `${Math.min(100, Math.max(0, progress))}%`);
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

const sectionNavLinks = [...document.querySelectorAll(".section-nav a[href^='#']")];
const sectionTargets = sectionNavLinks
  .map((link) => ({
    link,
    target: document.querySelector(link.getAttribute("href")),
  }))
  .filter((item) => item.target);

function updateActiveSection() {
  const offset = window.innerHeight * 0.35;
  let activeItem = sectionTargets[0];

  sectionTargets.forEach((item) => {
    if (item.target.getBoundingClientRect().top <= offset) {
      activeItem = item;
    }
  });

  sectionNavLinks.forEach((link) => link.classList.remove("is-active"));
  activeItem?.link.classList.add("is-active");
}

window.addEventListener("scroll", updateActiveSection, { passive: true });
window.addEventListener("resize", updateActiveSection);
updateActiveSection();

const strategyStatements = {
  Past: "Past: honoring the businesses, institutions, and community builders that shaped Transylvania County.",
  Present: "Present: spotlighting the members, sponsors, partners, and volunteers moving the Chamber story now.",
  Future: "Future: pointing toward economic vitality, collaboration, workforce, resilience, and next-generation leadership.",
};

const statement = document.querySelector(".statement");
const timeCards = [...document.querySelectorAll(".time-card")];

timeCards.forEach((card) => {
  const marker = card.querySelector(".time-card__marker")?.textContent?.trim();
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-pressed", "false");
  card.addEventListener("click", () => {
    timeCards.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-pressed", "false");
    });
    card.classList.add("is-active");
    card.setAttribute("aria-pressed", "true");
    statement.textContent = strategyStatements[marker] || "Celebrating local legacy. Powering what's next.";
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      card.click();
    }
  });
});

timeCards[0]?.click();

const tiers = [...document.querySelectorAll(".tier")];
tiers.forEach((tier) => {
  tier.setAttribute("role", "button");
  tier.setAttribute("aria-pressed", "false");
  tier.addEventListener("click", () => {
    tiers.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-pressed", "false");
    });
    tier.classList.add("is-active");
    tier.setAttribute("aria-pressed", "true");
  });
  tier.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      tier.click();
    }
  });
});

tiers[0]?.click();

const decisionItems = [...document.querySelectorAll(".decision-list article")];
const decisionCount = document.querySelector("[data-decision-count]");
const decisionTotal = document.querySelector("[data-decision-total]");
const decisionStorageKey = document.body.dataset.decisionStorage || `gala2026-decisions:${location.pathname}`;

function updateDecisionProgress() {
  if (decisionCount) {
    decisionCount.textContent = decisionItems.filter((item) => item.classList.contains("is-checked")).length;
  }
  if (decisionTotal) {
    decisionTotal.textContent = decisionItems.length;
  }
}

decisionItems.forEach((item) => {
  item.setAttribute("role", "button");
  item.addEventListener("click", () => {
    const isChecked = item.classList.toggle("is-checked");
    item.setAttribute("aria-pressed", String(isChecked));

    const savedDecisions = JSON.parse(localStorage.getItem(decisionStorageKey) || "[]");
    const itemText = item.textContent.trim();
    if (isChecked) {
      if (!savedDecisions.includes(itemText)) {
        savedDecisions.push(itemText);
      }
    } else {
      const index = savedDecisions.indexOf(itemText);
      if (index > -1) {
        savedDecisions.splice(index, 1);
      }
    }
    localStorage.setItem(decisionStorageKey, JSON.stringify(savedDecisions));

    updateDecisionProgress();
  });
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      item.click();
    }
  });
});

updateDecisionProgress();

const savedDecisions = JSON.parse(localStorage.getItem(decisionStorageKey) || "[]");
decisionItems.forEach((item) => {
  if (savedDecisions.includes(item.textContent.trim())) {
    item.classList.add("is-checked");
    item.setAttribute("aria-pressed", "true");
  }
});
updateDecisionProgress();

const revealItems = [
  ...document.querySelectorAll(
    ".section, .summary-grid article, .time-card, .visual-list article, .poster-card, .tier, .plate-media, .stage-list li, .principle-list li, .decision-list article, .hub-card, .resource-item, .vendor-row, .timeline-list li, .asset-tile"
  ),
];

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal");
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const sponsorForm = document.querySelector(".sponsor-form");

if (sponsorForm) {
  const statusEl = sponsorForm.querySelector("[data-form-status]");
  const submitButton = sponsorForm.querySelector("button[type='submit']");

  function setFormStatus(message, state) {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.className = `form-status is-${state}`;
  }

  if (new URLSearchParams(window.location.search).get("sent") === "1") {
    setFormStatus(
      "Thanks! Your sponsorship interest has been sent to the Chamber. We'll follow up soon.",
      "success"
    );
  }

  sponsorForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFormStatus("Sending your inquiry…", "pending");
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch(sponsorForm.action, {
        method: "POST",
        body: new FormData(sponsorForm),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Form submission failed");

      sponsorForm.reset();
      setFormStatus(
        "Thanks! Your sponsorship interest has been sent to the Chamber. We'll follow up soon.",
        "success"
      );
    } catch (error) {
      setFormStatus(
        "Something went wrong sending this form. Please email tamika@brevardncchamber.org directly instead.",
        "error"
      );
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

const resourceList = document.querySelector("[data-resource-list]");
const resourceCount = document.querySelector("[data-resource-count]");
const resourceLabel = document.querySelector("[data-resource-label]");
const resourceFilters = [...document.querySelectorAll("[data-resource-filter]")];

if (resourceList && resourceCount) {
  const totalResources = resourceList.querySelectorAll(".resource-item").length;
  resourceCount.textContent = totalResources;
  if (resourceLabel) resourceLabel.textContent = totalResources === 1 ? "resource" : "resources";
}

if (resourceList && resourceFilters.length) {
  const resources = [...resourceList.querySelectorAll(".resource-item")];
  resourceFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const selected = filter.dataset.resourceFilter;
      resourceFilters.forEach((item) => item.classList.toggle("is-active", item === filter));
      resources.forEach((resource) => {
        const shouldShow = selected === "all" || resource.dataset.resourceCategory === selected;
        resource.hidden = !shouldShow;
      });
      if (resourceCount) {
        const visibleResources = resources.filter((resource) => !resource.hidden).length;
        resourceCount.textContent = visibleResources;
        if (resourceLabel) resourceLabel.textContent = visibleResources === 1 ? "resource" : "resources";
      }
    });
  });
}
