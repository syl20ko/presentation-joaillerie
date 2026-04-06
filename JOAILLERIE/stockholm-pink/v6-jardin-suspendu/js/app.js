/* ═══════════════════════════════════════════════════════════════
   LA JOAILLERIE — Stockholm "Jardin Suspendu" V6
   Vanilla JS — Kinetic Type, Horizontal Scroll, Cursor, Reveals
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Utilities ──────────────────────────────────────────────
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const isMobile = () => window.matchMedia('(hover: none)').matches || window.innerWidth < 769;

  // ── State ──────────────────────────────────────────────────
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let cursorPos = { x: mouse.x, y: mouse.y };
  let ringPos = { x: mouse.x, y: mouse.y };
  let explorePos = { x: mouse.x, y: mouse.y };
  let isHoveringImage = false;
  let scrollY = 0;
  let ticking = false;

  // ── Preloader ──────────────────────────────────────────────
  function initPreloader() {
    const preloader = qs('.preloader');
    const bar = qs('.preloader-bar-fill');
    if (!preloader) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress > 95) progress = 95;
      bar.style.width = progress + '%';
    }, 200);

    window.addEventListener('load', () => {
      clearInterval(interval);
      bar.style.width = '100%';
      setTimeout(() => {
        preloader.classList.add('hidden');
        // Trigger hero animations
        setTimeout(initHeroReveal, 300);
      }, 600);
    });
  }

  // ── Kinetic Typography — Hero ──────────────────────────────
  function initHeroReveal() {
    const eyebrow = qs('.hero-eyebrow');
    const subtitle = qs('.hero-subtitle');
    const price = qs('.hero-price');
    const heroBg = qs('.hero-bg');
    const letters = qsa('.hero-title .letter');

    if (heroBg) {
      heroBg.classList.add('loaded');
      // After the zoom-in transition, enable parallax
      setTimeout(() => heroBg.classList.add('parallax-ready'), 3200);
    }
    if (eyebrow) eyebrow.classList.add('visible');

    // Stagger letters
    letters.forEach((letter, i) => {
      setTimeout(() => {
        letter.classList.add('visible');
      }, 100 + i * 70);
    });

    // Subtitle + price after title
    const totalLetterTime = 100 + letters.length * 70 + 300;
    setTimeout(() => {
      if (subtitle) subtitle.classList.add('visible');
    }, totalLetterTime);
    setTimeout(() => {
      if (price) price.classList.add('visible');
    }, totalLetterTime + 300);
  }

  // ── Watermark Horizontal Marquee ───────────────────────────
  function initWatermark() {
    const wm = qs('.watermark');
    if (!wm) return;
    let offset = 0;

    function tick() {
      offset -= 0.4; // pixels per frame
      if (Math.abs(offset) > wm.scrollWidth / 2) offset = 0;
      wm.style.transform = `translateY(-50%) translateX(${offset}px)`;
      requestAnimationFrame(tick);
    }
    tick();
  }

  // ── Word-by-Word Reveal (Poetic Section) ───────────────────
  function initPoeticReveal() {
    const words = qsa('.poetic-text .word');
    const wavy = qs('.wavy-line');
    if (!words.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const wordEls = qsa('.word', entry.target);
          wordEls.forEach((w, i) => {
            setTimeout(() => w.classList.add('visible'), i * 60);
          });
          if (wavy) {
            setTimeout(() => wavy.classList.add('visible'), wordEls.length * 60 + 200);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const container = qs('.poetic-text');
    if (container) observer.observe(container);
  }

  // ── Gallery Grid Reveal ────────────────────────────────────
  function initGalleryReveal() {
    const items = qsa('.reveal-gallery');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const siblings = Array.from(el.parentElement.children);
          const idx = siblings.indexOf(el);
          setTimeout(() => el.classList.add('visible'), idx * 150);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(item => observer.observe(item));
  }

  // ── IntersectionObserver Reveals ───────────────────────────
  function initReveals() {
    const reveals = qsa('.reveal, .reveal-scale, .glass-card, .spec');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger if inside a parent with multiple reveals
          const parent = entry.target.parentElement;
          const siblings = qsa('.glass-card, .spec', parent);
          const idx = siblings.indexOf(entry.target);

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx > 0 ? idx * 120 : 0);

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
  }

  // ── Custom Cursor ─────────────────────────────────────────
  function initCursor() {
    if (isMobile()) return;

    const dot = qs('.cursor-dot');
    const ring = qs('.cursor-ring');
    const explore = qs('.cursor-explore');
    if (!dot || !ring) return;

    // Trail particles pool
    const trailPool = [];
    const TRAIL_COUNT = 12;
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const el = document.createElement('div');
      el.className = 'cursor-trail';
      document.body.appendChild(el);
      trailPool.push({ el, x: mouse.x, y: mouse.y, life: 0 });
    }
    let trailIdx = 0;
    let lastTrailTime = 0;

    // Mouse move
    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Emit trail particle every ~40ms
      const now = performance.now();
      if (now - lastTrailTime > 40) {
        const p = trailPool[trailIdx % TRAIL_COUNT];
        p.x = mouse.x;
        p.y = mouse.y;
        p.life = 1;
        p.el.style.left = p.x + 'px';
        p.el.style.top = p.y + 'px';
        p.el.style.opacity = 0.35;
        p.el.style.transform = `translate(-50%, -50%) scale(1)`;
        trailIdx++;
        lastTrailTime = now;
      }
    });

    // Hover detection on images and buttons
    const hoverTargets = qsa('.gallery-item, .product-card, .video-container');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        isHoveringImage = true;
        dot.classList.add('hovering');
        ring.classList.add('hovering');
        if (explore) explore.classList.add('visible');
      });
      el.addEventListener('mouseleave', () => {
        isHoveringImage = false;
        dot.classList.remove('hovering');
        ring.classList.remove('hovering');
        if (explore) explore.classList.remove('visible');
      });
    });

    // Animate cursor
    function animateCursor() {
      cursorPos.x = lerp(cursorPos.x, mouse.x, 0.2);
      cursorPos.y = lerp(cursorPos.y, mouse.y, 0.2);
      ringPos.x = lerp(ringPos.x, mouse.x, 0.1);
      ringPos.y = lerp(ringPos.y, mouse.y, 0.1);
      explorePos.x = lerp(explorePos.x, mouse.x, 0.08);
      explorePos.y = lerp(explorePos.y, mouse.y, 0.08);

      dot.style.left = cursorPos.x + 'px';
      dot.style.top = cursorPos.y + 'px';
      ring.style.left = ringPos.x + 'px';
      ring.style.top = ringPos.y + 'px';

      if (explore) {
        explore.style.left = explorePos.x + 'px';
        explore.style.top = explorePos.y + 'px';
      }

      // Decay trail particles
      trailPool.forEach(p => {
        if (p.life > 0) {
          p.life -= 0.03;
          p.el.style.opacity = Math.max(0, p.life * 0.35);
          const s = p.life * 1;
          p.el.style.transform = `translate(-50%, -50%) scale(${s})`;
          if (p.life <= 0) {
            p.el.style.opacity = 0;
          }
        }
      });

      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // ── Magnetic Button ───────────────────────────────────────
  function initMagneticButton() {
    const btn = qs('.btn-magnetic');
    if (!btn || isMobile()) return;

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  }

  // ── Parallax Subtle ───────────────────────────────────────
  function initParallax() {
    const blobs = qsa('.blob');
    const heroImg = qs('.hero-bg img');
    const scrollIndicator = qs('.scroll-indicator');

    window.addEventListener('scroll', () => {
      const sy = window.pageYOffset;

      // Blobs
      blobs.forEach((b, i) => {
        const speed = 0.03 + i * 0.015;
        b.style.transform = `translateY(${sy * speed}px)`;
      });

      // Hero image subtle parallax (only after initial zoom finishes)
      const heroBg = qs('.hero-bg');
      if (heroImg && heroBg && heroBg.classList.contains('parallax-ready') && sy < window.innerHeight) {
        heroImg.style.transform = `scale(${1 + sy * 0.0001}) translateY(${sy * 0.15}px)`;
      }

      // Fade out scroll indicator
      if (scrollIndicator) {
        const opacity = clamp(1 - sy / 200, 0, 1);
        scrollIndicator.style.opacity = opacity;
      }

      // Nav transition
      const nav = qs('.nav-float');
      if (nav) {
        if (sy > window.innerHeight * 0.8) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }
    }, { passive: true });
  }

  // ── Video Autoplay ────────────────────────────────────────
  function initVideo() {
    const video = qs('.section-video video');
    if (!video) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(video);
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    initPreloader();
    initWatermark();
    initPoeticReveal();
    initGalleryReveal();
    initReveals();
    initCursor();
    initMagneticButton();
    initParallax();
    initVideo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
