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