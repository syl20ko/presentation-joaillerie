/* ═══════════════════════════════════════════════════
   LA JOAILLERIE — Stockholm Product Page
   Interactive behaviors: gallery, selectors, accordions, etc.
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ─── SCROLL PROGRESS BAR ───
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  // ─── HEADER SCROLL ───
  const header = document.getElementById('siteHeader');
  let lastScroll = 0;
  let ticking = false;

  function onScroll() {
    const scrollY = window.scrollY;

    // Header glassmorphism
    if (scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';

    lastScroll = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // Trigger once on load
  onScroll();

  // ─── MOBILE BURGER MENU ───
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (burgerBtn && mobileNav) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  }

  // ─── IMAGE GALLERY ───
  const mainImage = document.getElementById('mainImage');
  const thumbs = document.querySelectorAll('.thumb');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');

  const images = [
    {
      src: 'https://images.prismic.io/ljn-vitrine-next/aPtxaLpReVYa3pW__Moscow1.png?auto=format,compress',
      alt: 'Bague Stockholm — vue de face'
    },
    {
      src: 'https://images.prismic.io/ljn-vitrine-next/aPtxwbpReVYa3pXe_Moscow2.png?auto=format,compress',
      alt: 'Bague Stockholm — vue angle'
    },
    {
      src: '../../photos/Stockholm/Generated%20Image%20April%2003%2C%202026%20-%2011_43PM.jpg',
      alt: 'Bague Stockholm — portée bibliothèque'
    },
    {
      src: '../../photos/Stockholm/Generated%20Image%20April%2003%2C%202026%20-%2011_56PM.jpg',
      alt: 'Bague Stockholm — portée calligraphie'
    },
    {
      src: '../../photos/Stockholm/Generated%20Image%20April%2004%2C%202026%20-%2012_01AM.jpg',
      alt: 'Bague Stockholm — écrin'
    }
  ];

  let currentImageIndex = 0;

  function setImage(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    currentImageIndex = index;

    // Fade transition
    mainImage.classList.add('fade-out');

    setTimeout(() => {
      mainImage.src = images[index].src;
      mainImage.alt = images[index].alt;
      mainImage.classList.remove('fade-out');
    }, 200);

    // Update thumbs
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
  }

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const index = parseInt(thumb.dataset.index, 10);
      setImage(index);
    });
  });

  if (galleryPrev) {
    galleryPrev.addEventListener('click', () => setImage(currentImageIndex - 1));
  }
  if (galleryNext) {
    galleryNext.addEventListener('click', () => setImage(currentImageIndex + 1));
  }

  // Keyboard navigation for gallery
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') setImage(currentImageIndex - 1);
    if (e.key === 'ArrowRight') setImage(currentImageIndex + 1);
  });

  // ─── SELECTORS (ACCORDIONS IN PRODUCT DETAILS) ───
  const selectors = document.querySelectorAll('.selector');

  selectors.forEach((selector) => {
    const headerBtn = selector.querySelector('.selector-header');
    const body = selector.querySelector('.selector-body');

    headerBtn.addEventListener('click', () => {
      const isOpen = body.classList.contains('open');

      if (isOpen) {
        body.classList.remove('open');
        headerBtn.setAttribute('aria-expanded', 'false');
      } else {
        body.classList.add('open');
        headerBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ─── METAL SELECTOR ───
  const metalOptions = document.querySelectorAll('.metal-option');
  const metalValue = document.getElementById('metalValue');

  metalOptions.forEach((option) => {
    option.addEventListener('click', () => {
      metalOptions.forEach((o) => o.classList.remove('selected'));
      option.classList.add('selected');
      option.querySelector('input').checked = true;
      const name = option.querySelector('strong').textContent;
      if (metalValue) metalValue.textContent = name;
    });
  });

  // ─── SIZE SELECTOR ───
  const sizeButtons = document.querySelectorAll('.size-btn');
  const sizeValue = document.getElementById('sizeValue');

  sizeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (sizeValue) sizeValue.textContent = 'Taille ' + btn.dataset.size;
    });
  });

  // ─── GRAVURE TOGGLE ───
  const gravureToggle = document.getElementById('gravureToggle');
  const gravureInputWrap = document.getElementById('gravureInputWrap');
  const gravureInput = document.getElementById('gravureInput');
  const gravureCount = document.getElementById('gravureCount');
  const gravureValue = document.getElementById('gravureValue');

  if (gravureToggle && gravureInputWrap) {
    gravureToggle.addEventListener('change', () => {
      if (gravureToggle.checked) {
        gravureInputWrap.style.display = 'block';
        gravureValue.textContent = 'Activée · +30 €';
      } else {
        gravureInputWrap.style.display = 'none';
        gravureValue.textContent = 'Optionnelle · +30 €';
        if (gravureInput) gravureInput.value = '';
        if (gravureCount) gravureCount.textContent = '0';
      }
    });
  }

  if (gravureInput && gravureCount) {
    gravureInput.addEventListener('input', () => {
      gravureCount.textContent = gravureInput.value.length;
    });
  }

  // ─── PRODUCT ACCORDIONS ───
  const accordions = document.querySelectorAll('.accordion');

  accordions.forEach((accordion) => {
    const headerBtn = accordion.querySelector('.accordion-header');

    headerBtn.addEventListener('click', () => {
      const isOpen = accordion.classList.contains('open');

      if (isOpen) {
        accordion.classList.remove('open');
        headerBtn.setAttribute('aria-expanded', 'false');
      } else {
        accordion.classList.add('open');
        headerBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ─── SERVICE ACCORDIONS ───
  const serviceItems = document.querySelectorAll('.service-item');

  serviceItems.forEach((item) => {
    const headerBtn = item.querySelector('.service-header');

    headerBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      serviceItems.forEach((si) => si.classList.remove('open'));

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // ─── SIMILAR PRODUCTS CAROUSEL ───
  const carouselTrack = document.getElementById('similarTrack');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');

  if (carouselTrack && carouselPrev && carouselNext) {
    const scrollAmount = 280;

    carouselPrev.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    carouselNext.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // ─── ADD TO CART ANIMATION ───
  const addToCartBtn = document.getElementById('addToCart');

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const originalHTML = addToCartBtn.innerHTML;

      addToCartBtn.classList.add('added');
      addToCartBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Ajouté au panier
      `;

      // Update cart badge
      const badge = document.querySelector('.cart-badge');
      if (badge) {
        const count = parseInt(badge.textContent, 10) || 0;
        badge.textContent = count + 1;
        badge.style.transform = 'scale(1.3)';
        setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
      }

      setTimeout(() => {
        addToCartBtn.classList.remove('added');
        addToCartBtn.innerHTML = originalHTML;
      }, 2500);
    });
  }

  // ─── INTERSECTION OBSERVER — SCROLL REVEAL ───
  const revealElements = document.querySelectorAll(
    '.commitment-card, .similar-card, .accordion, .service-item'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.6s ease ${i % 4 * 0.1}s, transform 0.6s ease ${i % 4 * 0.1}s`;
      revealObserver.observe(el);
    });
  }

  // ─── TOUCH SWIPE FOR GALLERY ───
  const galleryMain = document.querySelector('.gallery-main');
  let touchStartX = 0;
  let touchEndX = 0;

  if (galleryMain) {
    galleryMain.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    galleryMain.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          setImage(currentImageIndex + 1);
        } else {
          setImage(currentImageIndex - 1);
        }
      }
    }, { passive: true });
  }

  // ─── SMOOTH ANCHOR SCROLLS ───
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = anchor.getAttribute('href');
      if (target && target !== '#') {
        e.preventDefault();
        const el = document.querySelector(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

});
