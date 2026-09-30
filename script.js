const sections=[...document.querySelectorAll(".panel")];
const navLinks=[...document.querySelectorAll(".main-nav a")];
const progress=document.getElementById("scrollProgress");

const revealTargets=document.querySelectorAll(".reveal-up,.reveal-left,.reveal-right,.reveal-scale,.activity-card");
const revealObserver=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add("is-visible");
  });
},{threshold:.18});
revealTargets.forEach(el=>revealObserver.observe(el));

const sectionObserver=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const id="#"+entry.target.id;
    navLinks.forEach(link=>link.classList.toggle("active",link.getAttribute("href")===id));
  });
},{threshold:.55});
sections.forEach(section=>sectionObserver.observe(section));

window.addEventListener("scroll",()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  const pct=max>0?(window.scrollY/max)*100:0;
  if(progress) progress.style.width=pct+"%";

  const heroArt=document.querySelector(".hero-art");
  if(heroArt && window.scrollY<window.innerHeight){
    heroArt.style.transform=`translateY(${window.scrollY*.08}px) rotate(${window.scrollY*.002}deg)`;
  }
},{passive:true});

const counters=[...document.querySelectorAll(".counter")];
const counterObserver=new IntersectionObserver((entries,observer)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const el=entry.target;
    const target=Number(el.dataset.count||0);
    const start=performance.now();
    const duration=1100;
    const tick=(now)=>{
      const p=Math.min((now-start)/duration,1);
      const eased=1-Math.pow(1-p,3);
      el.textContent=Math.round(target*eased);
      if(p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    observer.unobserve(el);
  });
},{threshold:.6});
counters.forEach(el=>counterObserver.observe(el));

const video=document.getElementById("schoolVideo");
const placeholder=document.getElementById("videoPlaceholder");
video?.addEventListener("loadedmetadata",()=>placeholder?.classList.add("hidden"));
video?.addEventListener("error",()=>placeholder?.classList.remove("hidden"));

navLinks.forEach(link=>{
  link.addEventListener("click",(e)=>{
    const target=document.querySelector(link.getAttribute("href"));
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior:"smooth",block:"start"});
  });
});

// Desktop section-by-section wheel navigation.
let wheelLocked = false;
let currentSectionIndex = 0;
const desktopQuery = window.matchMedia("(min-width: 981px)");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const syncCurrentSection = () => {
  let bestIndex = 0;
  let bestDistance = Infinity;

  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const distance = Math.abs(rect.top - 72);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  currentSectionIndex = bestIndex;
};

const goToSection = (index) => {
  const clamped = Math.max(0, Math.min(sections.length - 1, index));
  currentSectionIndex = clamped;

  sections[clamped].scrollIntoView({
    behavior: reducedMotionQuery.matches ? "auto" : "smooth",
    block: "start"
  });

  wheelLocked = true;
  window.setTimeout(() => {
    wheelLocked = false;
  }, reducedMotionQuery.matches ? 100 : 850);
};

window.addEventListener("wheel", (event) => {
  if (!desktopQuery.matches) return;
  if (wheelLocked) {
    event.preventDefault();
    return;
  }

  const target = event.target;
  if (target.closest("video, input, textarea, select, [contenteditable='true']")) return;

  if (Math.abs(event.deltaY) < 8) return;

  syncCurrentSection();

  if (event.deltaY > 0 && currentSectionIndex < sections.length - 1) {
    event.preventDefault();
    goToSection(currentSectionIndex + 1);
  } else if (event.deltaY < 0 && currentSectionIndex > 0) {
    event.preventDefault();
    goToSection(currentSectionIndex - 1);
  }
}, { passive: false });

window.addEventListener("resize", syncCurrentSection);
window.addEventListener("load", syncCurrentSection);
