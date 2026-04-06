/* ==========================================================================
   DIANE — V3 Power Statement
   Scroll-driven immersive experience
   ========================================================================== */

(function () {
    'use strict';

    /* ------------------------------------------------------------------
       Utility: Throttle
    ------------------------------------------------------------------ */
    function throttle(fn, ms) {
        let last = 0;
        return function () {
            const now = Date.now();
            if (now - last >= ms) {
                last = now;
                fn.apply(this, arguments);
            }
        };
    }

    /* ------------------------------------------------------------------
       1. Scroll-triggered reveals (IntersectionObserver)
    ------------------------------------------------------------------ */
    function initScrollReveals() {
        // Photo reveals (clip-path)
        const photoFrames = document.querySelectorAll('.reveal-photo');
        // Text immersive phrases
        const textPhrases = document.querySelectorAll('.reveal-text');
        // Bento tiles
        const bentoTiles = document.querySelectorAll('.reveal-tile');
        // Generic fade reveals
        const fadeEls = document.querySelectorAll('.reveal-fade');

        // Observer for photo clip-path reveals
        const photoObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        photoObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );

        photoFrames.forEach((el) => photoObserver.observe(el));

        // Observer for text phrases (appear one at a time)
        const textObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        textObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4, rootMargin: '0px 0px -100px 0px' }
        );

        textPhrases.forEach((el) => textObserver.observe(el));

        // Observer for bento tiles (staggered)
        const bentoObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Stagger: add delay based on index among visible siblings
                        const allTiles = Array.from(
                            entry.target.parentElement.children
                        );
                        const idx = allTiles.indexOf(entry.target);
                        entry.target.style.transitionDelay = `${idx * 0.1}s`;
                        entry.target.classList.add('is-visible');
                        bentoObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
        );

        bentoTiles.forEach((el) => bentoObserver.observe(el));

        // Observer for generic fade elements
        const fadeObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        fadeObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
        );

        fadeEls.forEach((el) => fadeObserver.observe(el));
    }

    /* ------------------------------------------------------------------
       2. Video — Circle expand on scroll + autoplay
    ------------------------------------------------------------------ */
    function initVideoSection() {
        const container = document.getElementById('videoContainer');
        const video = document.getElementById('dianeVideo');
        if (!container || !video) return;

        let hasExpanded = false;
        let isPlaying = false;

        // Scroll-driven circle expansion
        const expandObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasExpanded) {
                        hasExpanded = true;
                        container.classList.add('is-expanded');
                    }
                });
            },
            { threshold: 0.25 }
        );

        expandObserver.observe(container);

        // Autoplay when visible
        const playObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isPlaying) {
                        isPlaying = true;
                        video.play().catch(() => {});
                    } else if (!entry.isIntersecting && isPlaying) {
                        isPlaying = false;
                        video.pause();
                    }
                });
            },
            { threshold: 0.3 }
        );

        playObserver.observe(container);
    }

    /* ------------------------------------------------------------------
       3. Magnetic CTA Button
    ------------------------------------------------------------------ */
    function initMagneticButton() {
        const btn = document.getElementById('ctaButton');
        if (!btn) return;

        const section = btn.closest('.cta') || btn.parentElement;
        const radius = 120; // px — magnetic pull radius (from center of button)
        const strength = 0.4; // how far the button moves (proportion)

        // Listen on the whole CTA section so the pull starts before the cursor reaches the button
        section.addEventListener('mousemove', function (e) {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < radius) {
                const pull = (1 - dist / radius) * strength;
                btn.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
            } else {
                btn.style.transform = 'translate(0, 0)';
            }
        });

        section.addEventListener('mouseleave', function () {
            btn.style.transform = 'translate(0, 0)';
        });
    }

    /* ------------------------------------------------------------------
       4. Product ring 3D tilt on hover
    ------------------------------------------------------------------ */
    function initRingTilt() {
        const rings = document.querySelectorAll('.product__ring');

        rings.forEach((ring) => {
            const img = ring.querySelector('img');
            if (!img) return;

            ring.addEventListener('mousemove', function (e) {
                const rect = ring.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                img.style.transform = `
                    perspective(800px)
                    rotateY(${x * 16}deg)
                    rotateX(${-y * 12}deg)
                    scale3d(1.04, 1.04, 1.04)
                `;
            });

            ring.addEventListener('mouseleave', function () {
                img.style.transform =
                    'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    /* ------------------------------------------------------------------
       5. Hero scroll indicator — fade out on scroll
    ------------------------------------------------------------------ */
    function initHeroScrollFade() {
        const scrollIndicator = document.getElementById('heroScroll');
        if (!scrollIndicator) return;

        const onScroll = throttle(function () {
            const scrollY = window.scrollY || window.pageYOffset;
            const opacity = Math.max(0, 1 - scrollY / 300);
            scrollIndicator.style.opacity = opacity * 0.5; // max was 0.5 from animation
        }, 16);

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ------------------------------------------------------------------
       6. Film grain animation — subtle position shift
    ------------------------------------------------------------------ */
    function initGrainAnimation() {
        const grain = document.querySelector('.grain');
        if (!grain) return;

        // Animate at reduced rate (~12fps) to save performance
        let lastTime = 0;
        function animateThrottled(time) {
            if (time - lastTime > 83) {
                // ~12fps
                lastTime = time;
                const x = Math.random() * 256;
                const y = Math.random() * 256;
                grain.style.backgroundPosition = `${x}px ${y}px`;
            }
            requestAnimationFrame(animateThrottled);
        }

        requestAnimationFrame(animateThrottled);
    }

    /* ------------------------------------------------------------------
       7. Smooth parallax on photo finale overlay text
    ------------------------------------------------------------------ */
    function initFinaleParallax() {
        const section = document.getElementById('photoFinale');
        const overlay = section
            ? section.querySelector('.photo-finale__title')
            : null;
        if (!overlay) return;

        const onScroll = throttle(function () {
            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;
            // When section is in view
            if (rect.top < vh && rect.bottom > 0) {
                const progress = (vh - rect.top) / (vh + rect.height);
                const translateY = (progress - 0.5) * -40;
                overlay.style.transform = `translateY(${translateY}px)`;
            }
        }, 16);

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ------------------------------------------------------------------
       Init everything on DOMContentLoaded
    ------------------------------------------------------------------ */
    document.addEventListener('DOMContentLoaded', function () {
        initScrollReveals();
        initVideoSection();
        initMagneticButton();
        initRingTilt();
        initHeroScrollFade();
        initGrainAnimation();
        initFinaleParallax();
    });
})();
