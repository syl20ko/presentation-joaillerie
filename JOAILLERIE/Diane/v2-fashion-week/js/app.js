/* ============================================
   DIANE — V2 FASHION WEEK
   Card reveal on scroll + effects
   ============================================ */

(function () {
  'use strict';

  const reveals = document.querySelectorAll('.reveal');
  const cards = document.querySelectorAll('.card-reveal');

  // --- Card reveal on scroll ---
  function initCardReveal() {
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    cards.forEach(card => observer.observe(card));
  }

  // --- Reveal on scroll (product section, CTA, etc.) ---
  function initReveals() {
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
  }

  // --- Video autoplay fallback ---
  function initVideo() {
    const video = document.querySelector('.lk-card__video video');
    if (!video) return;

    video.play().catch(() => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.3 });
      observer.observe(video);
    });
  }

  // --- Init ---
  function init() {
    initCardReveal();
    initReveals();
    initVideo();
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

})();
