/* ============================================================
   La Joaillerie — Alliances Collection
   Vanilla JS — Filters, animations, scroll behaviors
   ============================================================ */

(function () {
  'use strict';

  /* -----------------------------------------------------------
     DATA
     ----------------------------------------------------------- */
  const products = [
    { id: 1,  name: 'Protéa',      price: 2360, metal: 'Or jaune',  material: 'Or jaune & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMwjVGGNHVfTPX1n_Protéa.png?auto=format,compress' },
    { id: 2,  name: 'Tulipe',      price: 3200, metal: 'Or jaune',  material: 'Or jaune & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMvSyWGNHVfTPWqn_tulipe.png?auto=format,compress' },
    { id: 3,  name: 'Iris',        price: 3465, metal: 'Or jaune',  material: 'Or jaune & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMwLs2GNHVfTPXc7_irisjaune.png?auto=format,compress' },
    { id: 4,  name: 'Rose',        price: 2125, metal: 'Or blanc',  material: 'Or blanc & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMwgKmGNHVfTPXzc_Roseblanche.png?auto=format,compress' },
    { id: 5,  name: 'Bouleau',     price: 3520, metal: 'Or jaune',  material: 'Or jaune & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMvdyGGNHVfTPW8o_Bouleau.png?auto=format,compress' },
    { id: 6,  name: 'Rose',        price: 1965, metal: 'Or jaune',  material: 'Or jaune & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMwgpGGNHVfTPXzu_Rosejaune.png?auto=format,compress' },
    { id: 7,  name: 'Pivoine',     price: 1955, metal: 'Or blanc',  material: 'Or blanc & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMwkw2GNHVfTPX3L_pivoineblanc.png?auto=format,compress' },
    { id: 8,  name: 'Iris',        price: 2350, metal: 'Or rouge',  material: 'Or rouge & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aQRy7bpReVYa33nS_Irisrouge1_2.png?auto=format,compress' },
    { id: 9,  name: 'Primevère',   price: 1125, metal: 'Or jaune',  material: 'Or jaune & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMwj5GGNHVfTPX2e_Primeverejaune.png?auto=format,compress' },
    { id: 10, name: 'Iris',        price: 2300, metal: 'Or blanc',  material: 'Or blanc & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMwK52GNHVfTPXcF_Irisblanc.png?auto=format,compress' },
    { id: 11, name: 'Lisianthus',  price: 3600, metal: 'Or jaune',  material: 'Or jaune & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMwmOWGNHVfTPX4G_Lisianthus.png?auto=format,compress' },
    { id: 12, name: 'Marguerite',  price: 1900, metal: 'Or jaune',  material: 'Or jaune & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aQR8FrpReVYa33q__Marguerite.png?auto=format,compress' },
    { id: 13, name: 'Muguet',      price: 2190, metal: 'Or jaune',  material: 'Or jaune & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMwU3mGNHVfTPXoO_Muguet.png?auto=format,compress' },
    { id: 14, name: 'Olivier',     price: 1145, metal: 'Or jaune',  material: 'Or jaune & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMwV7mGNHVfTPXpY_Olivier.png?auto=format,compress' },
    { id: 15, name: 'Violette',    price: 2770, metal: 'Or jaune',  material: 'Or jaune & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aQRyHLpReVYa33mx_Violette.png?auto=format,compress' },
    { id: 16, name: 'Hortensia',   price: 6920, metal: 'Or jaune',  material: 'Or jaune & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMwVbGGNHVfTPXox_hortensia.png?auto=format,compress' },
    { id: 17, name: 'Violette',    price: 2740, metal: 'Or blanc',  material: 'Or blanc & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMvGQWGNHVfTPWeY_violette.png?auto=format,compress' },
    { id: 18, name: 'Chêne',       price: 2630, metal: 'Or jaune',  material: 'Or jaune & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aQR1irpReVYa33oB_Chene.png?auto=format,compress' },
    { id: 19, name: 'Renoncule',   price: 3305, metal: 'Or rouge',  material: 'Or rouge & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMwiyGGNHVfTPX1W_Renonculerouge.png?auto=format,compress' },
    { id: 20, name: 'Jasmin',      price: 2700, metal: 'Or jaune',  material: 'Or jaune & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aQR-N7pReVYa33sN_jasmin.png?auto=format,compress' },
    { id: 21, name: 'Renoncule',   price: 3430, metal: 'Or blanc',  material: 'Or blanc & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMwiVmGNHVfTPX1C_Renonculeblanche.png?auto=format,compress' },
    { id: 22, name: 'Bruyère',     price: 2880, metal: 'Or jaune',  material: 'Or jaune & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMverWGNHVfTPW9O_Bruyere.png?auto=format,compress' },
    { id: 23, name: 'Primevère',   price: 1165, metal: 'Or blanc',  material: 'Or blanc & Diamants',  img: 'https://images.prismic.io/ljn-vitrine-next/aMwkQGGNHVfTPX2v_Primevereblanc.png?auto=format,compress' },
  ];

  /* -----------------------------------------------------------
     STATE
     ----------------------------------------------------------- */
  let currentMetal = 'all';
  let currentPrice = 'all';
  let currentSort  = 'default';

  /* -----------------------------------------------------------
     DOM REFS
     ----------------------------------------------------------- */
  const grid        = document.getElementById('products-grid');
  const countEl     = document.getElementById('results-count');
  const noResults   = document.getElementById('no-results');
  const header      = document.querySelector('.header');
  const scrollBtn   = document.getElementById('scroll-top');
  const burger      = document.getElementById('burger');
  const mobileNav   = document.getElementById('mobile-nav');

  /* -----------------------------------------------------------
     FORMAT HELPERS
     ----------------------------------------------------------- */
  function formatPrice(n) {
    return n.toLocaleString('fr-FR') + ' \u20AC';
  }

  /* -----------------------------------------------------------
     RENDER GRID
     ----------------------------------------------------------- */
  function renderGrid() {
    grid.innerHTML = '';
    const filtered = getFilteredProducts();

    // Update count
    const countLabel = filtered.length === 1 ? '1 r\u00E9sultat' : filtered.length + ' r\u00E9sultats';
    countEl.textContent = countLabel;

    // Show/hide no results
    if (filtered.length === 0) {
      noResults.classList.add('visible');
    } else {
      noResults.classList.remove('visible');
    }

    filtered.forEach(function (p, i) {
      var card = document.createElement('div');
      card.className = 'product-card entering';
      card.style.animationDelay = (i * 0.06) + 's';

      card.innerHTML =
        '<div class="product-card__image-wrap">' +
          '<img src="' + p.img + '" alt="Alliance ' + p.name + '" loading="lazy">' +
          '<div class="product-card__quickview">D\u00E9couvrir</div>' +
        '</div>' +
        '<div class="product-card__info">' +
          '<div class="product-card__name">' + p.name + '</div>' +
          '<div class="product-card__material">' + p.material + '</div>' +
          '<div class="product-card__price">' + formatPrice(p.price) + '</div>' +
        '</div>';

      grid.appendChild(card);
    });
  }

  /* -----------------------------------------------------------
     FILTER + SORT LOGIC
     ----------------------------------------------------------- */
  function getFilteredProducts() {
    var result = products.slice();

    // Metal filter
    if (currentMetal !== 'all') {
      result = result.filter(function (p) {
        return p.metal === currentMetal;
      });
    }

    // Price filter
    if (currentPrice === 'under2000') {
      result = result.filter(function (p) { return p.price < 2000; });
    } else if (currentPrice === '2000-3000') {
      result = result.filter(function (p) { return p.price >= 2000 && p.price <= 3000; });
    } else if (currentPrice === 'over3000') {
      result = result.filter(function (p) { return p.price > 3000; });
    }

    // Sort
    if (currentSort === 'price-asc') {
      result.sort(function (a, b) { return a.price - b.price; });
    } else if (currentSort === 'price-desc') {
      result.sort(function (a, b) { return b.price - a.price; });
    } else if (currentSort === 'name-az') {
      result.sort(function (a, b) { return a.name.localeCompare(b.name, 'fr'); });
    }

    return result;
  }

  /* -----------------------------------------------------------
     DROPDOWN BEHAVIOR
     ----------------------------------------------------------- */
  var dropdowns = document.querySelectorAll('.filter-dropdown');

  function closeAllDropdowns(except) {
    dropdowns.forEach(function (dd) {
      if (dd !== except) dd.classList.remove('open');
    });
  }

  dropdowns.forEach(function (dd) {
    var btn = dd.querySelector('.filter-dropdown__btn');
    var items = dd.querySelectorAll('.filter-dropdown__menu button');
    var filterType = dd.dataset.filter;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dd.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) dd.classList.add('open');
    });

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var value = item.dataset.value;

        // Update selected state in this dropdown
        items.forEach(function (it) { it.classList.remove('selected'); });
        item.classList.add('selected');

        // Update button text active state
        if (value === 'all' || value === 'default') {
          btn.classList.remove('active');
        } else {
          btn.classList.add('active');
        }

        // Update state
        if (filterType === 'metal') currentMetal = value;
        else if (filterType === 'price') currentPrice = value;
        else if (filterType === 'sort') currentSort = value;

        dd.classList.remove('open');
        renderGrid();
      });
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', function () {
    closeAllDropdowns();
  });

  /* -----------------------------------------------------------
     HEADER SCROLL STATE
     ----------------------------------------------------------- */
  var lastScroll = 0;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    // Header
    if (y > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll-to-top button
    if (y > 600) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }

    lastScroll = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -----------------------------------------------------------
     SCROLL TO TOP
     ----------------------------------------------------------- */
  scrollBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* -----------------------------------------------------------
     MOBILE NAV
     ----------------------------------------------------------- */
  burger.addEventListener('click', function () {
    var isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      mobileNav.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  });

  // Close mobile nav on link click
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* -----------------------------------------------------------
     INITIAL RENDER
     ----------------------------------------------------------- */
  renderGrid();

})();
