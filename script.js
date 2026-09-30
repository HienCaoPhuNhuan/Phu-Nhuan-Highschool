const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");

menuBtn?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

// Reveal elements as the user scrolls.
const revealTargets = document.querySelectorAll(
  ".section > .container, .feature-card, .timeline-item, .gallery-box"
);

revealTargets.forEach((el) => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

revealTargets.forEach((el) => revealObserver.observe(el));

// Animate simple counters when they enter the viewport.
const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const pad = Number(el.dataset.pad || 0);
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      const display = String(value).padStart(pad, "0");
      el.textContent = display + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    observer.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach((el) => counterObserver.observe(el));

// Hide the video placeholder only when the local video can actually load.
const schoolVideo = document.getElementById("schoolVideo");
const videoPlaceholder = document.getElementById("videoPlaceholder");

schoolVideo?.addEventListener("loadedmetadata", () => {
  videoPlaceholder?.classList.add("hidden");
});

schoolVideo?.addEventListener("error", () => {
  videoPlaceholder?.classList.remove("hidden");
});
