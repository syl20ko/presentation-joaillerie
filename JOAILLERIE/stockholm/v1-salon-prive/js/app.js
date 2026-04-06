/* ============================================================
   LA JOAILLERIE — STOCKHOLM COLLECTION
   "Le Salon Privé" — Scroll Animations & Interactions
   ============================================================ */

(function () {
  'use strict';

  // --- Loading Screen ---
  const loadingScreen = document.querySelector('.loading-screen');
  const loadingBar = document.querySelector('.loading-bar-fill');
  const heroVideo = document.querySelector('.hero-video');

  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 15 + 5;
    if (loadProgress > 90) loadProgress = 90;
    if (loadingBar) loadingBar.style.width = loadProgress + '%';
  }, 200);

  window.addEventListener('load', () => {
    clearInterval(loadInterval);
    if (loadingBar) loadingBar.style.width = '100%';

    setTimeout(() => {
      if (loadingScreen) loadingScreen.classList.add('hidden');
      document.body.classList.add('loaded');
    }, 600);

    // Autoplay video after load
    if (heroVideo) {
      heroVideo.play().catch(() => {
        // Autoplay blocked, that's fine
      });
    }
  });

  // --- Header Scroll ---
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }

  // --- Scroll Reveal ---
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  // --- Parallax Effect ---
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    function updateParallax() {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      parallaxElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const speed = parseFloat(el.dataset.parallax) || 0.1;

        if (rect.bottom > 0 && rect.top < viewportHeight) {
          const centerOffset = rect.top - viewportHeight / 2;
          const translateY = centerOffset * speed;
          el.style.transform = `translateY(${translateY}px)`;
        }
      });
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  // --- Hero Video Parallax ---
  function initHeroParallax() {
    const heroVideoWrap = document.querySelector('.hero-video-wrap');

    function updateHeroParallax() {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      if (scrollY < vh * 1.5 && heroVideoWrap) {
        const scale = 1 + scrollY * 0.0003;
        const opacity = 1 - scrollY / vh;
        heroVideoWrap.style.transform = `scale(${scale})`;
        heroVideoWrap.style.opacity = Math.max(opacity, 0);
      }
    }

    window.addEventListener('scroll', updateHeroParallax, { passive: true });
  }

  // --- Counter Animation ---
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // --- Smooth Scroll for Anchor Links ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // --- Image Lazy Loading with Fade ---
  function initLazyImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.addEventListener('load', () => {
              img.classList.add('loaded');
            });
            imageObserver.unobserve(img);
          }
        });
      },
      { rootMargin: '200px 0px' }
    );

    lazyImages.forEach((img) => imageObserver.observe(img));
  }

  // --- Gallery Item Staggered Reveal ---
  function initGalleryReveal() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 150);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    galleryItems.forEach((item) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(40px)';
      item.style.transition = 'opacity 1s cubic-bezier(0.23, 1, 0.32, 1), transform 1s cubic-bezier(0.23, 1, 0.32, 1)';
      observer.observe(item);
    });
  }

  // Make gallery items visible when triggered
  const style = document.createElement('style');
  style.textContent = '.gallery-item.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  // --- Hero scroll indicator fade ---
  function initScrollIndicatorFade() {
    const indicator = document.querySelector('.hero-scroll-indicator');
    if (!indicator) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        indicator.style.opacity = Math.max(0, 1 - (scrollY - 100) / 200);
      }
    }, { passive: true });
  }

  // --- Cursor Glow ---
  function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // --- Statement parallax text ---
  function initStatementParallax() {
    const bgText = document.querySelector('.statement-bg-text');
    if (!bgText) return;

    window.addEventListener('scroll', () => {
      const rect = bgText.parentElement.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom > 0 && rect.top < vh) {
        const progress = (vh - rect.top) / (vh + rect.height);
        bgText.style.transform = `translate(-50%, -50%) translateX(${(progress - 0.5) * 100}px)`;
      }
    }, { passive: true });
  }

  // --- Initialize Everything ---
  document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    initScrollReveal();
    initParallax();
    initCursorGlow();
    initStatementParallax();
    initHeroParallax();
    initCounters();
    initSmoothScroll();
    initLazyImages();
    initGalleryReveal();
    initScrollIndicatorFade();
  });
})();
