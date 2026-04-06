/* ============================================================
   DIANE — V1 Noir Cinématique
   La Joaillerie — Édition Spéciale
   ============================================================ */

(function () {
  'use strict';

  // --- Preloader ---
  const preloader = document.querySelector('.preloader');
  const barFill = document.querySelector('.preloader__bar-fill');
  const scrollContainer = document.querySelector('.scroll-container');
  let loadProgress = 0;

  function updatePreloader(progress) {
    loadProgress = Math.min(progress, 100);
    if (barFill) {
      barFill.style.width = loadProgress + '%';
    }
  }

  function finishPreloader() {
    updatePreloader(100);
    preloader.classList.add('stabilized');

    setTimeout(function () {
      preloader.classList.add('loaded');
      document.body.style.overflow = '';

      // Start observing scenes after preloader
      setTimeout(initObserver, 200);
    }, 600);
  }

  // Track image + video loading
  const mediaElements = document.querySelectorAll('img[src], video source[src]');
  let loaded = 0;
  const total = mediaElements.length || 1;

  function onMediaLoad() {
    loaded++;
    updatePreloader((loaded / total) * 90);
    if (loaded >= total) {
      finishPreloader();
    }
  }

  mediaElements.forEach(function (el) {
    if (el.tagName === 'IMG') {
      if (el.complete) {
        onMediaLoad();
      } else {
        el.addEventListener('load', onMediaLoad);
        el.addEventListener('error', onMediaLoad);
      }
    } else if (el.tagName === 'SOURCE') {
      const video = el.closest('video');
      if (video) {
        video.addEventListener('canplaythrough', onMediaLoad, { once: true });
        video.addEventListener('error', onMediaLoad, { once: true });
      }
    }
  });

  // Fallback: force finish after 5s
  setTimeout(function () {
    if (!preloader.classList.contains('loaded')) {
      finishPreloader();
    }
  }, 5000);

  // --- IntersectionObserver for scene reveals ---
  function initObserver() {
    const scenes = document.querySelectorAll('.scene');

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      {
        root: scrollContainer,
        threshold: 0.3,
      }
    );

    scenes.forEach(function (scene) {
      observer.observe(scene);
    });

    // Mark first scene immediately
    if (scenes.length > 0) {
      scenes[0].classList.add('in-view');
    }
  }

  // --- Letter-by-letter hero tagline ---
  function initHeroText() {
    const tagline = document.querySelector('.hero__tagline');
    if (!tagline) return;

    const text = tagline.textContent;
    tagline.textContent = '';

    const chars = [];
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.classList.add('char');
      if (text[i] === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = text[i];
      }
      span.style.transitionDelay = (0.5 + i * 0.04) + 's';
      tagline.appendChild(span);
      chars.push(span);
    }
  }

  initHeroText();

  // --- Smooth scroll indicator hide on scroll ---
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (scrollContainer && scrollIndicator) {
    scrollContainer.addEventListener('scroll', function () {
      if (scrollContainer.scrollTop > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.transition = 'opacity 0.5s';
      }
    }, { passive: true });
  }

  // --- Video autoplay on scene visibility ---
  function initVideoObserver() {
    const videos = document.querySelectorAll('.scene video');

    if (videos.length === 0) return;

    const vidObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(function () { });
          } else {
            video.pause();
          }
        });
      },
      {
        root: scrollContainer,
        threshold: 0.5,
      }
    );

    videos.forEach(function (vid) {
      vidObserver.observe(vid);
    });
  }

  initVideoObserver();

  // --- Keyboard navigation (arrow keys for snap scroll) ---
  document.addEventListener('keydown', function (e) {
    if (!scrollContainer) return;

    const sceneHeight = window.innerHeight;
    const currentScene = Math.round(scrollContainer.scrollTop / sceneHeight);

    if (e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      scrollContainer.scrollTo({
        top: (currentScene + 1) * sceneHeight,
        behavior: 'smooth',
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      scrollContainer.scrollTo({
        top: Math.max(0, (currentScene - 1) * sceneHeight),
        behavior: 'smooth',
      });
    }
  });

})();
