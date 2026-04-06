/* ═══════════════════════════════════════════════════════════
   LA JOAILLERIE — V2 Split Screen: Cinema + Commerce
   Canvas frame playback + GSAP + Lenis
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── CONFIG ── */
    const TOTAL_FRAMES   = 121;
    const IMAGE_SCALE    = 0.86;
    const FRAME_SPEED    = 2.0;
    const FRAME_DIR      = 'frames/';
    const BATCH_PHASE1   = 10;      // first fast-load batch
    const BATCH_SIZE     = 8;       // subsequent batches
    const BASE_PRICE     = 4690;
    const ENGRAVING_COST = 30;

    /* ── DOM REFS ── */
    const canvas          = document.getElementById('ringCanvas');
    const ctx             = canvas.getContext('2d');
    const panelLeft       = document.getElementById('panelLeft');
    const panelRight      = document.getElementById('panelRight');
    const panelRightInner = document.getElementById('panelRightInner');
    const loadingOverlay  = document.getElementById('loadingOverlay');
    const loadingBar      = document.getElementById('loadingBar');
    const loadingText     = document.getElementById('loadingText');
    const sizeSelector    = document.getElementById('sizeSelector');
    const stockNotice     = document.getElementById('stockNotice');
    const engravingToggle = document.getElementById('engravingToggle');
    const engravingWrap   = document.getElementById('engravingWrap');
    const addToCartBtn    = document.getElementById('addToCart');
    const cartPriceLabel  = document.getElementById('cartPriceLabel');
    const cartCount       = document.querySelector('.cart-count');
    const toast           = document.getElementById('toast');
    const header          = document.getElementById('header');

    /* ── STATE ── */
    const frames          = new Array(TOTAL_FRAMES).fill(null);
    let loadedCount       = 0;
    let allLoaded         = false;
    let currentFrame      = 0;
    let hasEngraving      = false;
    let selectedSize      = 57;
    let cartItems         = 0;
    let dpr               = Math.min(window.devicePixelRatio || 1, 2);
    let canvasW, canvasH;
    let isMobile          = window.innerWidth < 768;

    /* ═══════════════════════════════════════════
       CANVAS SETUP
       ═══════════════════════════════════════════ */

    function resizeCanvas() {
        isMobile = window.innerWidth < 768;
        const rect = panelLeft.getBoundingClientRect();
        canvasW = rect.width;
        canvasH = rect.height;
        canvas.width  = canvasW * dpr;
        canvas.height = canvasH * dpr;
        canvas.style.width  = canvasW + 'px';
        canvas.style.height = canvasH + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawFrame(currentFrame);
    }

    /* ── FRAME RENDERING ── */
    function drawFrame(idx) {
        const img = frames[idx];
        if (!img) return;

        // Clear
        ctx.clearRect(0, 0, canvasW, canvasH);

        // Sample background color from image corners
        sampleAndFillBackground(img);

        // Calculate scaled size (IMAGE_SCALE)
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = canvasW / canvasH;

        let drawW, drawH;
        if (canvasAspect > imgAspect) {
            // Canvas is wider — fit to height
            drawH = canvasH * IMAGE_SCALE;
            drawW = drawH * imgAspect;
        } else {
            // Canvas is taller — fit to width
            drawW = canvasW * IMAGE_SCALE;
            drawH = drawW / imgAspect;
        }

        const x = (canvasW - drawW) / 2;
        const y = (canvasH - drawH) / 2;

        ctx.drawImage(img, x, y, drawW, drawH);
    }

    /* ── BACKGROUND SAMPLING ── */
    // We use a tiny offscreen canvas to get corner pixels
    let sampleCanvas, sampleCtx;
    function sampleAndFillBackground(img) {
        if (!sampleCanvas) {
            sampleCanvas = document.createElement('canvas');
            sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
        }
        // Draw image small to sample corners
        const sw = 20, sh = 20;
        sampleCanvas.width = sw;
        sampleCanvas.height = sh;
        sampleCtx.drawImage(img, 0, 0, sw, sh);

        try {
            // Sample 4 corners
            const corners = [
                sampleCtx.getImageData(1, 1, 1, 1).data,
                sampleCtx.getImageData(sw - 2, 1, 1, 1).data,
                sampleCtx.getImageData(1, sh - 2, 1, 1).data,
                sampleCtx.getImageData(sw - 2, sh - 2, 1, 1).data
            ];

            // Average
            let r = 0, g = 0, b = 0;
            for (const c of corners) {
                r += c[0]; g += c[1]; b += c[2];
            }
            r = Math.round(r / 4);
            g = Math.round(g / 4);
            b = Math.round(b / 4);

            const bgColor = `rgb(${r},${g},${b})`;
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvasW, canvasH);

            // Also set panel bg for seamless transition
            panelLeft.style.backgroundColor = bgColor;
        } catch (e) {
            // CORS or other — use default
            ctx.fillStyle = '#E8E2DC';
            ctx.fillRect(0, 0, canvasW, canvasH);
        }
    }

    /* ═══════════════════════════════════════════
       FRAME LOADING — TWO PHASE
       ═══════════════════════════════════════════ */

    function framePath(i) {
        // i is 0-based → filename is 1-based
        const num = String(i + 1).padStart(4, '0');
        return `${FRAME_DIR}frame_${num}.webp`;
    }

    function loadImage(idx) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                frames[idx] = img;
                loadedCount++;
                resolve(img);
            };
            img.onerror = () => {
                loadedCount++;
                resolve(null);
            };
            img.src = framePath(idx);
        });
    }

    function updateLoadingUI() {
        const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        loadingBar.style.width = pct + '%';
        loadingText.textContent = `Chargement ${pct}%`;
    }

    async function loadFrames() {
        // Phase 1: Load first BATCH_PHASE1 frames fast
        const phase1 = [];
        for (let i = 0; i < BATCH_PHASE1 && i < TOTAL_FRAMES; i++) {
            phase1.push(loadImage(i));
        }
        await Promise.all(phase1);
        updateLoadingUI();

        // Show first frame immediately
        if (frames[0]) {
            resizeCanvas();
            drawFrame(0);
        }

        // Phase 2: Load remaining in batches
        for (let i = BATCH_PHASE1; i < TOTAL_FRAMES; i += BATCH_SIZE) {
            const batch = [];
            for (let j = i; j < i + BATCH_SIZE && j < TOTAL_FRAMES; j++) {
                batch.push(loadImage(j));
            }
            await Promise.all(batch);
            updateLoadingUI();
        }

        allLoaded = true;

        // Fade out loading overlay
        loadingOverlay.classList.add('hidden');

        // Draw current frame
        drawFrame(currentFrame);
    }

    /* ═══════════════════════════════════════════
       SCROLL-DRIVEN FRAME PLAYBACK
       ═══════════════════════════════════════════ */

    function setupScrollPlayback() {
        gsap.registerPlugin(ScrollTrigger);

        // The scroll trigger: as the right panel scrolls, scrub through frames
        ScrollTrigger.create({
            trigger: panelRightInner,
            scroller: isMobile ? window : undefined,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
            onUpdate: (self) => {
                // Apply FRAME_SPEED: multiply progress to loop through faster
                let rawProgress = self.progress * FRAME_SPEED;
                // Clamp or loop
                let frameProgress = rawProgress % 1; // loop if > 1
                if (rawProgress >= 1 && rawProgress < 2) {
                    // Reverse on second pass for boomerang effect
                    frameProgress = 1 - (rawProgress - 1);
                } else if (rawProgress >= 2) {
                    frameProgress = rawProgress % 1;
                }
                const targetFrame = Math.min(
                    Math.floor(frameProgress * (TOTAL_FRAMES - 1)),
                    TOTAL_FRAMES - 1
                );
                if (targetFrame !== currentFrame && frames[targetFrame]) {
                    currentFrame = targetFrame;
                    drawFrame(currentFrame);
                }
            }
        });
    }

    /* ═══════════════════════════════════════════
       GSAP ENTRANCE ANIMATIONS
       ═══════════════════════════════════════════ */

    function setupAnimations() {
        const sections = document.querySelectorAll('.anim-section');

        sections.forEach((section, i) => {
            gsap.to(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                delay: 0.05,
            });
        });
    }

    /* ═══════════════════════════════════════════
       LENIS SMOOTH SCROLL
       ═══════════════════════════════════════════ */

    let lenis;

    function setupLenis() {
        lenis = new Lenis({
            duration: 1.3,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.5,
        });

        // Connect Lenis to GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    }

    /* ═══════════════════════════════════════════
       HEADER BEHAVIOR
       ═══════════════════════════════════════════ */

    function setupHeader() {
        let lastScrollY = 0;
        let ticking = false;

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
                    if (currentScrollY > lastScrollY && currentScrollY > 120) {
                        header.classList.add('hidden');
                    } else {
                        header.classList.remove('hidden');
                    }
                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ═══════════════════════════════════════════
       MOBILE: STICKY CANVAS
       ═══════════════════════════════════════════ */

    function setupMobileSticky() {
        if (!isMobile) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    panelLeft.classList.add('mobile-sticky');
                } else {
                    panelLeft.classList.remove('mobile-sticky');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'))}px 0px 0px 0px`
        });

        // Create a sentinel element at the top of the right panel
        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        sentinel.style.position = 'absolute';
        sentinel.style.top = '0';
        panelRight.prepend(sentinel);
        observer.observe(sentinel);
    }

    /* ═══════════════════════════════════════════
       SIZE SELECTOR
       ═══════════════════════════════════════════ */

    function setupSizeSelector() {
        const pills = sizeSelector.querySelectorAll('.size-pill');
        const inStockSizes = [55, 56, 57, 58, 59];

        pills.forEach((pill) => {
            pill.addEventListener('click', () => {
                // Deselect all
                pills.forEach(p => p.classList.remove('selected'));
                // Select this one
                pill.classList.add('selected');
                selectedSize = parseInt(pill.dataset.size);

                // Update stock notice
                if (inStockSizes.includes(selectedSize)) {
                    stockNotice.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a9e6b" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <span>En stock — Expédition sous 48h</span>
                    `;
                    stockNotice.style.color = '#4a9e6b';
                    stockNotice.style.background = 'rgba(74, 158, 107, 0.06)';
                } else {
                    stockNotice.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8965A" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>Sur commande — Livraison sous 3 semaines</span>
                    `;
                    stockNotice.style.color = '#B8965A';
                    stockNotice.style.background = 'rgba(184, 150, 90, 0.06)';
                }
            });
        });
    }

    /* ═══════════════════════════════════════════
       ENGRAVING TOGGLE
       ═══════════════════════════════════════════ */

    function setupEngraving() {
        engravingToggle.addEventListener('change', () => {
            hasEngraving = engravingToggle.checked;
            engravingWrap.style.display = hasEngraving ? 'block' : 'none';
            updatePrice();
        });

        // Font selector
        const fontOpts = engravingWrap.querySelectorAll('.font-opt');
        fontOpts.forEach((opt) => {
            opt.addEventListener('click', () => {
                fontOpts.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
            });
        });
    }

    function updatePrice() {
        const total = BASE_PRICE + (hasEngraving ? ENGRAVING_COST : 0);
        const formatted = total.toLocaleString('fr-FR') + '\u00A0€';
        cartPriceLabel.innerHTML = formatted;
    }

    /* ═══════════════════════════════════════════
       ADD TO CART
       ═══════════════════════════════════════════ */

    function setupAddToCart() {
        addToCartBtn.addEventListener('click', () => {
            cartItems++;
            cartCount.textContent = cartItems;
            cartCount.classList.add('visible');

            // Button animation
            addToCartBtn.style.transform = 'scale(0.96)';
            setTimeout(() => {
                addToCartBtn.style.transform = 'scale(1)';
            }, 150);

            // Show toast
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2800);
        });
    }

    /* ═══════════════════════════════════════════
       ACCORDION
       ═══════════════════════════════════════════ */

    function setupAccordion() {
        const items = document.querySelectorAll('.accordion-item');
        items.forEach((item) => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                // Close all
                items.forEach(i => {
                    i.classList.remove('open');
                    i.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                });

                // Open this one (if it was closed)
                if (!isOpen) {
                    item.classList.add('open');
                    header.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    /* ═══════════════════════════════════════════
       WINDOW RESIZE HANDLER
       ═══════════════════════════════════════════ */

    let resizeTimer;
    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            isMobile = window.innerWidth < 768;
            resizeCanvas();
            ScrollTrigger.refresh();
        }, 200);
    }

    /* ═══════════════════════════════════════════
       INITIALIZE
       ═══════════════════════════════════════════ */

    function init() {
        // Size canvas initially
        resizeCanvas();

        // Start loading frames
        loadFrames().then(() => {
            // Frames loaded, ensure playback is ready
            ScrollTrigger.refresh();
        });

        // Setup Lenis smooth scroll
        setupLenis();

        // Setup GSAP scroll playback
        setupScrollPlayback();

        // Setup entrance animations
        setupAnimations();

        // Setup header hide/show
        setupHeader();

        // Setup mobile sticky
        setupMobileSticky();

        // Interactive elements
        setupSizeSelector();
        setupEngraving();
        setupAddToCart();
        setupAccordion();

        // Resize listener
        window.addEventListener('resize', onResize);
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
