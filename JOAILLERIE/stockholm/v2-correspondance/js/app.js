/* ============================================================
   LA CORRESPONDANCE — Collection Stockholm
   La Joaillerie — Interactive Script
   ============================================================ */

(function () {
  'use strict';

  // --- Preloader ---
  const preloader = document.querySelector('.preloader');

  function hidePreloader() {
    if (preloader) {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  // Hide preloader when page is fully loaded (images, video, etc.)
  window.addEventListener('load', function () {
    setTimeout(hidePreloader, 1800);
  });

  // Safety fallback — never block more than 4s
  setTimeout(hidePreloader, 4000);

  // Prevent scroll during preloader
  document.body.style.overflow = 'hidden';

  // --- Hero Ken Burns trigger ---
  window.addEventListener('load', function () {
    setTimeout(function () {
      const hero = document.querySelector('.hero');
      if (hero) hero.classList.add('loaded');
    }, 2000);
  });

  // --- Navbar scroll effect ---
  const nav = document.querySelector('.nav');
  const progressTrack = document.querySelector('.progress-track');

  function onScroll() {
    const scrollY = window.scrollY;

    // Nav background
    if (nav) {
      if (scrollY > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    // Progress track visibility
    if (progressTrack) {
      if (scrollY > window.innerHeight * 0.5) {
        progressTrack.classList.add('visible');
      } else {
        progressTrack.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Intersection Observer for reveal animations ---
  const revealElements = document.querySelectorAll('.reveal, .line-reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve — we want one-way reveal only
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // --- Progress dots — track active chapter ---
  const chapters = document.querySelectorAll('[data-chapter]');
  const dots = document.querySelectorAll('.progress-dot');

  const chapterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.getAttribute('data-chapter'), 10);
          dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === idx);
          });
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  chapters.forEach(function (ch) {
    chapterObserver.observe(ch);
  });

  // Dot click to scroll
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const idx = parseInt(dot.getAttribute('data-target'), 10);
      const target = document.querySelector('[data-chapter="' + idx + '"]');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Video playback control ---
  const video = document.querySelector('.ring-video');
  if (video) {
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.muted = true;

    const videoObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            video.play().catch(function () {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    videoObserver.observe(video);
  }

  // --- Subtle parallax on hero image ---
  const heroImg = document.querySelector('.hero-image-wrap img');
  let ticking = false;

  function parallaxHero() {
    if (!heroImg) return;
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
    if (scrollY < windowH * 1.2) {
      const offset = scrollY * 0.25;
      heroImg.style.transform = 'scale(' + (1.08 - scrollY * 0.00008) + ') translateY(' + offset + 'px)';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(parallaxHero);
      ticking = true;
    }
  }, { passive: true });

  // --- "Typewriter" effect for the hero quote ---
  // We use CSS reveals instead for performance, but add a gentle
  // cursor blink to the hero quote
  const heroQuote = document.querySelector('.hero-quote');
  if (heroQuote) {
    const cursor = document.createElement('span');
    cursor.style.cssText =
      'display:inline-block;width:2px;height:1.1em;background:' +
      'var(--accent-light);margin-left:4px;vertical-align:text-bottom;' +
      'animation:cursorBlink 1s step-end infinite;';
    heroQuote.appendChild(cursor);

    // Add cursor blink keyframes if not present
    const style = document.createElement('style');
    style.textContent =
      '@keyframes cursorBlink{0%,100%{opacity:1}50%{opacity:0}}';
    document.head.appendChild(style);

    // Remove cursor after a delay
    setTimeout(function () {
      cursor.style.transition = 'opacity 1s';
      cursor.style.opacity = '0';
      setTimeout(function () { cursor.remove(); }, 1000);
    }, 6000);
  }

  // --- Smooth letter-by-letter class application ---
  // For elements with data-letter-delay, stagger the word reveals
  document.querySelectorAll('.letter-reveal').forEach(function (el) {
    const words = el.querySelectorAll('.word span');
    words.forEach(function (word, i) {
      word.style.transitionDelay = (i * 0.06) + 's';
    });
  });

  // --- Gentle image tilt on mouse for ring detail cards ---
  document.querySelectorAll('.eclat-card-image').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const img = card.querySelector('img');
      if (img) {
        img.style.transform =
          'scale(1.05) rotateY(' + (x * 4) + 'deg) rotateX(' + (-y * 4) + 'deg)';
        img.style.transition = 'transform 0.3s ease-out';
      }
    });
    card.addEventListener('mouseleave', function () {
      const img = card.querySelector('img');
      if (img) {
        img.style.transform = '';
        img.style.transition = 'transform 0.8s var(--ease-out-quart)';
      }
    });
  });

})();
