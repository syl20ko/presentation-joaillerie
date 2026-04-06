/* ══════════════════════════════════════════════════════════════
   STOCKHOLM — V3 "LA MAISON"
   Vanilla JS — scroll reveals, header, preloader, mobile nav
   Architectural gallery interaction layer
   ══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── PRELOADER ── */
    var preloader = document.getElementById('preloader');
    var preloaderFill = document.getElementById('preloaderFill');
    var preloaderProgress = 0;

    function advancePreloader() {
        preloaderProgress += Math.random() * 20 + 8;
        if (preloaderProgress > 95) preloaderProgress = 95;
        preloaderFill.style.width = preloaderProgress + '%';
    }

    var preloaderInterval = setInterval(advancePreloader, 180);

    window.addEventListener('load', function () {
        clearInterval(preloaderInterval);
        preloaderFill.style.width = '100%';

        setTimeout(function () {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            // Slight delay before starting reveals for dramatic effect
            setTimeout(initAll, 200);
        }, 700);
    });

    document.body.style.overflow = 'hidden';

    /* ── INIT ALL ── */
    function initAll() {
        initReveal();
        initManifeste();
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

    /* ── SCROLL REVEAL (IntersectionObserver) ── */
    function initReveal() {
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

    /* ── SMOOTH SCROLL CTA ── */
    var heroCtaLink = document.querySelector('.hero-cta');
    if (heroCtaLink) {
        heroCtaLink.addEventListener('click', function (e) {
            e.preventDefault();
            var href = heroCtaLink.getAttribute('href');
            var target = document.querySelector(href);
            if (target) {
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

    /* ── SUBTLE PARALLAX (desktop only) ── */
    if (window.innerWidth > 768) {
        var galerieImages = document.querySelectorAll('.galerie-item');
        var rafId = null;

        function updateParallax() {
            for (var i = 0; i < galerieImages.length; i++) {
                var item = galerieImages[i];
                var img = item.querySelector('img');
                var speed = parseFloat(item.getAttribute('data-speed') || '0.03');
                var rect = item.getBoundingClientRect();
                var wh = window.innerHeight;

                if (rect.top < wh && rect.bottom > 0) {
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
