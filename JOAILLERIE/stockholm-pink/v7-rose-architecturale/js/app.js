/* ============================================================
   STOCKHOLM — ROSE ARCHITECTURALE
   La Joaillerie Nice — Collection 2026
   JS: Preloader, Cursor, Tilt, Magnetic, Scroll Reveals, Scramble
   ============================================================ */

(function () {
    'use strict';

    // --- PRELOADER ---
    const preloader = document.getElementById('preloader');
    const preloaderFill = preloader?.querySelector('.preloader-bar-fill');
    let loadProgress = 0;

    function advancePreloader(target) {
        const step = () => {
            loadProgress += (target - loadProgress) * 0.12;
            if (preloaderFill) preloaderFill.style.width = loadProgress + '%';
            if (loadProgress < target - 0.5) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    advancePreloader(40);

    // Preload hero image
    const heroImg = document.querySelector('.hero-bg-image img');
    if (heroImg) {
        if (heroImg.complete) {
            advancePreloader(80);
        } else {
            heroImg.addEventListener('load', () => advancePreloader(80), { once: true });
        }
    }

    window.addEventListener('load', () => {
        advancePreloader(100);
        setTimeout(() => {
            if (preloader) preloader.classList.add('loaded');
            document.querySelector('.hero')?.classList.add('is-visible');
            initAfterLoad();
        }, 600);
    });

    // Fallback — don't block forever
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('loaded')) {
            advancePreloader(100);
            setTimeout(() => {
                preloader.classList.add('loaded');
                document.querySelector('.hero')?.classList.add('is-visible');
                initAfterLoad();
            }, 200);
        }
    }, 4000);

    // --- CUSTOM CURSOR ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    let cursorX = 0, cursorY = 0;
    let ringX = 0, ringY = 0;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && cursorDot && cursorRing) {
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            cursorDot.style.transform = `translate(${cursorX - 3}px, ${cursorY - 3}px)`;
        });

        function animateRing() {
            ringX += (cursorX - ringX) * 0.12;
            ringY += (cursorY - ringY) * 0.12;
            cursorRing.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover state on interactive elements
        const hoverTargets = 'a, button, .magnetic-btn, .bento-tile';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverTargets)) {
                document.body.classList.add('cursor-hover');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverTargets)) {
                document.body.classList.remove('cursor-hover');
            }
        });
    }

    // --- INIT AFTER LOAD ---
    function initAfterLoad() {
        initScrollReveals();
        initTilt();
        initMagnetic();
        initScramble();
    }

    // --- SCROLL REVEAL (IntersectionObserver) ---
    function initScrollReveals() {
        const revealElements = document.querySelectorAll(
            '.bento-tile[data-scroll-reveal], .citation-inner, .video-container, .video-caption, .cta-text, .cta-button-wrap, .cta-address'
        );

        if (!revealElements.length) return;

        let staggerIndex = 0;
        let lastBatchTime = 0;

        const observer = new IntersectionObserver((entries) => {
            const now = Date.now();
            if (now - lastBatchTime > 300) staggerIndex = 0;
            lastBatchTime = now;

            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = staggerIndex * 120;
                    staggerIndex++;

                    setTimeout(() => {
                        el.classList.add('is-visible');
                    }, delay);

                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach((el) => observer.observe(el));
    }

    // --- 3D TILT ---
    function initTilt() {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        if (isTouchDevice || !tiltElements.length) return;

        tiltElements.forEach((el) => {
            let raf;

            el.addEventListener('mousemove', (e) => {
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = ((y - centerY) / centerY) * -4;
                    const rotateY = ((x - centerX) / centerX) * 4;

                    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
                });
            });

            el.addEventListener('mouseleave', () => {
                cancelAnimationFrame(raf);
                el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
                el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => {
                    el.style.transition = '';
                }, 600);
            });

            el.addEventListener('mouseenter', () => {
                el.style.transition = 'transform 0.1s ease-out';
                setTimeout(() => {
                    el.style.transition = '';
                }, 100);
            });
        });
    }

    // --- MAGNETIC BUTTON ---
    function initMagnetic() {
        const magneticBtns = document.querySelectorAll('[data-magnetic]');
        if (isTouchDevice || !magneticBtns.length) return;

        magneticBtns.forEach((btn) => {
            const strength = 0.35;
            let raf;

            btn.addEventListener('mousemove', (e) => {
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;

                    const textEl = btn.querySelector('.magnetic-btn-text');
                    if (textEl) {
                        textEl.style.transform = `translate(${x * strength * 0.3}px, ${y * strength * 0.3}px)`;
                    }
                });
            });

            btn.addEventListener('mouseleave', () => {
                cancelAnimationFrame(raf);
                btn.style.transform = '';
                btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';

                const textEl = btn.querySelector('.magnetic-btn-text');
                if (textEl) {
                    textEl.style.transform = '';
                    textEl.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                }

                setTimeout(() => {
                    btn.style.transition = '';
                    if (textEl) textEl.style.transition = '';
                }, 500);
            });

            btn.addEventListener('mouseenter', () => {
                btn.style.transition = '';
                const textEl = btn.querySelector('.magnetic-btn-text');
                if (textEl) textEl.style.transition = '';
            });
        });
    }

    // --- TEXT SCRAMBLE ---
    function initScramble() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,';
        const scrambleElements = document.querySelectorAll('[data-scramble]');
        let delayIndex = 0;

        scrambleElements.forEach((el) => {
            // Only scramble leaf text (no child elements with their own structure)
            if (el.children.length > 0 && !el.classList.contains('tile-stat-number')) return;

            const originalText = el.textContent.trim();
            if (!originalText) return;

            let hasScrambled = false;
            const elDelay = delayIndex * 200;
            delayIndex++;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasScrambled) {
                        hasScrambled = true;
                        setTimeout(() => {
                            scrambleText(el, originalText, chars);
                        }, elDelay);
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(el);
        });
    }

    function scrambleText(el, finalText, chars) {
        const duration = 900;
        const frameRate = 24;
        const totalFrames = Math.floor(duration / (1000 / frameRate));
        let frame = 0;

        const interval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;

            let display = '';
            for (let i = 0; i < finalText.length; i++) {
                if (finalText[i] === ' ' || finalText[i] === ',' || finalText[i] === '.') {
                    display += finalText[i];
                } else if (progress > (i + 1) / finalText.length) {
                    display += finalText[i];
                } else {
                    display += chars[Math.floor(Math.random() * chars.length)];
                }
            }

            el.textContent = display;

            if (frame >= totalFrames) {
                el.textContent = finalText;
                clearInterval(interval);
            }
        }, 1000 / frameRate);
    }

    // --- PARALLAX SUBTLE ON HERO (mouse-based) ---
    if (!isTouchDevice) {
        const heroImage = document.querySelector('.hero-bg-image img');
        if (heroImage) {
            let parallaxRAF;
            document.addEventListener('mousemove', (e) => {
                cancelAnimationFrame(parallaxRAF);
                parallaxRAF = requestAnimationFrame(() => {
                    const x = (e.clientX / window.innerWidth - 0.5) * 12;
                    const y = (e.clientY / window.innerHeight - 0.5) * 8;
                    heroImage.style.transform = `scale(1.06) translate(${x}px, ${y}px)`;
                });
            });
        }
    }

})();
