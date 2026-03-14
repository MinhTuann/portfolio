/* ══════════════════════════════
   PORTFOLIO — script.js
══════════════════════════════ */

// ── NAVBAR ────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── HAMBURGER ─────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  const s = hamburger.querySelectorAll('span');
  s[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  s[1].style.opacity   = open ? '0' : '1';
  s[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
}));

// ── SCROLL REVEAL ─────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── COUNTERS ──────────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.dataset.target);
        const dur = 1600;
        const start = performance.now();
        const tick = t => {
          const p = Math.min((t - start) / dur, 1);
          const e = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(e * target);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        };
        requestAnimationFrame(tick);
      });
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ── PARTICLES ─────────────────
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [], raf;

const resize = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; };
resize();

const mkParticle = () => ({
  x: Math.random() * W, y: Math.random() * H,
  vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
  r: Math.random() * 1.4 + .3,
  o: Math.random() * .45 + .05,
  c: Math.random() > .5 ? '99,102,241' : '139,92,246'
});

const init = () => { particles = []; const n = Math.min(70, Math.floor(W*H/15000)); for(let i=0;i<n;i++) particles.push(mkParticle()); };
init();

const draw = () => {
  ctx.clearRect(0,0,W,H);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if(p.x < -10) p.x = W+10; if(p.x > W+10) p.x = -10;
    if(p.y < -10) p.y = H+10; if(p.y > H+10) p.y = -10;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle = `rgba(${p.c},${p.o})`; ctx.fill();
  });
  for(let i=0;i<particles.length;i++) for(let j=i+1;j<particles.length;j++) {
    const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
    const d=Math.sqrt(dx*dx+dy*dy);
    if(d<120){ ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.strokeStyle=`rgba(99,102,241,${.05*(1-d/120)})`; ctx.lineWidth=.5; ctx.stroke(); }
  }
  raf = requestAnimationFrame(draw);
};
draw();

// Pause when hero not visible
const heroObserver = new IntersectionObserver(([e]) => {
  if(e.isIntersecting){ if(!raf) draw(); } else { cancelAnimationFrame(raf); raf=null; }
});
const heroEl = document.getElementById('hero');
if(heroEl) heroObserver.observe(heroEl);

window.addEventListener('resize', () => { resize(); init(); }, { passive: true });

// ── SMOOTH SCROLL ─────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if(t){ e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── TIMELINE CARD ACCENT ──────
// Dynamically connect card border accent to indigo on hover — handled by CSS
// Add active nav link highlighting based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const scrollSpy = () => {
  let cur = '';
  sections.forEach(s => { if(window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navLinkEls.forEach(l => {
    l.style.color = l.getAttribute('href') === `#${cur}` ? 'var(--indigo)' : '';
  });
};
window.addEventListener('scroll', scrollSpy, { passive: true });
