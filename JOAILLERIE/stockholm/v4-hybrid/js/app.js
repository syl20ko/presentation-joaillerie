/* ══════════════════════════════════════════════════════════════
   STOCKHOLM — V4 HYBRID
   V1 cinematic effects + V3 architectural interactions
   ══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── LOADING SCREEN ── */
    var loadingScreen = document.getElementById('loadingScreen');
    var loadingBar = document.getElementById('loadingBar');
    var loadProgress = 0;

    var loadInterval = setInterval(function () {
        loadProgress += Math.random() * 15 + 5;
        if (loadProgress > 90) loadProgress = 90;
        if (loadingBar) loadingBar.style.width = loadProgress + '%';
    }, 200);

    window.addEventListener('load', function () {
        clearInterval(loadInterval);
        if (loadingBar) loadingBar.style.width = '100%';

        setTimeout(function () {
            if (loadingScreen) loadingScreen.classList.add('hidden');
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
            setTimeout(initAll, 200);
        }, 600);
    });

    document.body.classList.add('loading');

    /* ── INIT ALL ── */
    function initAll() {
        initScrollReveal();
        initRevealItems();
        initManifeste();
        initCounters();
    }

    /* ── HEADER SCROLL STATE ── */
    var header = document.getElementById('header');
    var ticking = false;

    function updateHeader() {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    /* ── MOBILE NAV ── */
    var mobileMenuBtn = document.getElementById('mobileMenuBtn');
    var mobileNav = document.getElementById('mobileNav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function () {
            var isActive = mobileMenuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        var mobileLinks = mobileNav.querySelectorAll('a');
        for (var i = 0; i < mobileLinks.length; i++) {
            mobileLinks[i].addEventListener('click', function () {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }

    /* ── SCROLL REVEAL (V1 — .reveal elements) ── */
    function initScrollReveal() {
        var revealElements = document.querySelectorAll('.reveal');

        var observer = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    entries[i].target.classList.add('visible');
                    observer.unobserve(entries[i].target);
                }
            }
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        for (var j = 0; j < revealElements.length; j++) {
            observer.observe(revealElements[j]);
        }
    }

    /* ── REVEAL ITEMS (V3 — .reveal-item elements with stagger) ── */
    function initRevealItems() {
        var revealItems = document.querySelectorAll('.reveal-item');
        if (!revealItems.length) return;

        var revealQueue = [];
        var revealTimer = null;

        var observer = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    revealQueue.push(entries[i].target);
                    observer.unobserve(entries[i].target);

                    if (!revealTimer) {
                        revealTimer = setTimeout(flushRevealQueue, 60);
                    }
                }
            }
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        function flushRevealQueue() {
            for (var j = 0; j < revealQueue.length; j++) {
                (function (el, delay) {
                    setTimeout(function () {
                        el.classList.add('revealed');
                    }, delay);
                })(revealQueue[j], j * 140);
            }
            revealQueue = [];
            revealTimer = null;
        }

        for (var k = 0; k < revealItems.length; k++) {
            observer.observe(revealItems[k]);
        }
    }

    /* ── MANIFESTE REVEAL ── */
    function initManifeste() {
        var manifeste = document.getElementById('manifeste');
        if (!manifeste) return;

        var mark = manifeste.querySelector('.manifeste-mark');
        var quote = manifeste.querySelector('.manifeste-quote');
        var attrib = manifeste.querySelector('.manifeste-attribution');
        var elements = [mark, quote, attrib];

        for (var i = 0; i < elements.length; i++) {
            if (elements[i]) {
                elements[i].style.opacity = '0';
                elements[i].style.transform = 'translateY(30px)';
                elements[i].style.transition = 'opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)';
            }
        }

        var manifObserver = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                if (mark) {
                    setTimeout(function () {
                        mark.style.opacity = '0.4';
                        mark.style.transform = 'translateY(0)';
                    }, 100);
                }
                if (quote) {
                    setTimeout(function () {
                        quote.style.opacity = '1';
                        quote.style.transform = 'translateY(0)';
                    }, 350);
                }
                if (attrib) {
                    setTimeout(function () {
                        attrib.style.opacity = '1';
                        attrib.style.transform = 'translateY(0)';
                    }, 700);
                }
                manifObserver.unobserve(manifeste);
            }
        }, { threshold: 0.2 });

        manifObserver.observe(manifeste);
    }

    /* ── COUNTER ANIMATION (V1) ── */
    function initCounters() {
        var counters = document.querySelectorAll('[data-count]');

        var observer = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    animateCounter(entries[i].target);
                    observer.unobserve(entries[i].target);
                }
            }
        }, { threshold: 0.5 });

        for (var j = 0; j < counters.length; j++) {
            observer.observe(counters[j]);
        }
    }

    function animateCounter(el) {
        var target = parseInt(el.dataset.count, 10);
        var suffix = el.dataset.suffix || '';
        var duration = 2000;
        var start = performance.now();

        function update(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.round(eased * target);

            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    /* ── STATEMENT PARALLAX TEXT (V1) ── */
    var bgText = document.querySelector('.statement-bg-text');
    if (bgText) {
        window.addEventListener('scroll', function () {
            var rect = bgText.parentElement.getBoundingClientRect();
            var vh = window.innerHeight;
            if (rect.bottom > 0 && rect.top < vh) {
                var progress = (vh - rect.top) / (vh + rect.height);
                bgText.style.transform = 'translate(-50%, -50%) translateX(' + ((progress - 0.5) * 100) + 'px)';
            }
        }, { passive: true });
    }

    /* ── SMOOTH SCROLL CTA ── */
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var a = 0; a < anchors.length; a++) {
        anchors[a].addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var offset = target.getBoundingClientRect().top + window.scrollY - 40;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    }

    /* ── VIDEO AUTOPLAY + VIEWPORT PAUSE ── */
    var heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        heroVideo.play().catch(function () {});

        var videoObserver = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                heroVideo.play().catch(function () {});
            } else {
                heroVideo.pause();
            }
        }, { threshold: 0.05 });

        videoObserver.observe(heroVideo);
    }

    /* ── CURSOR GLOW (V1, desktop only) ── */
    var glow = document.querySelector('.cursor-glow');
    if (glow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        var mouseX = 0, mouseY = 0;
        var glowX = 0, glowY = 0;

        document.addEventListener('mousemove', function (e) {
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

    /* ── SUBTLE PARALLAX ON GALLERY (V3, desktop only) ── */
    if (window.innerWidth > 768) {
        var galerieImages = document.querySelectorAll('.galerie-item');
        var rafId = null;
        var speeds = [0.03, 0.05, 0.02, 0.04];

        function updateParallax() {
            for (var i = 0; i < galerieImages.length; i++) {
                var item = galerieImages[i];
                var img = item.querySelector('img');
                var speed = speeds[i] || 0.03;
                var rect = item.getBoundingClientRect();
                var wh = window.innerHeight;

                if (rect.top < wh && rect.bottom > 0 && img) {
                    var center = rect.top + rect.height / 2;
                    var offset = (center - wh / 2) * speed;
                    img.style.transform = 'translateY(' + offset + 'px)';
                }
            }
            rafId = null;
        }

        window.addEventListener('scroll', function () {
            if (!rafId) {
                rafId = requestAnimationFrame(updateParallax);
            }
        }, { passive: true });
    }

})();
