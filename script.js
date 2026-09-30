(() => {
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  const header = document.querySelector('.header');
  const overlay = document.querySelector('.header__nav-overlay');
  const navToggle = document.querySelector('.header__nav-toggle');
  const megaItem = document.querySelector('.header__nav-item--has-mega');
  const DESKTOP_BP = 1024;

  const isDesktop = () => window.innerWidth >= DESKTOP_BP;

  function setHeaderOffset() {
    if (!header) return;
    const h = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-offset', `${h}px`);
  }

  setHeaderOffset();
  window.addEventListener('load', setHeaderOffset);
  window.addEventListener('resize', setHeaderOffset);

  function closeMobileMenu() {
    burger?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('header__nav--open');
    overlay?.classList.remove('header__nav-overlay--open');
    document.body.classList.remove('no-scroll');
  }

  function closeMega() {
    megaItem?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }

  closeMobileMenu();
  closeMega();

  burger?.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    nav?.classList.toggle('header__nav--open', !expanded);
    overlay?.classList.toggle('header__nav-overlay--open', !expanded);
    document.body.classList.toggle('no-scroll', !expanded);
    if (expanded) closeMega();
    setHeaderOffset();
  });

  overlay?.addEventListener('click', closeMobileMenu);

  navToggle?.addEventListener('click', (e) => {
    if (isDesktop()) return;
    e.preventDefault();
    e.stopPropagation();
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    megaItem?.classList.toggle('is-open', !expanded);
  });

  nav?.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && !isDesktop()) closeMobileMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (nav?.classList.contains('header__nav--open')) closeMobileMenu();
      closeMega();
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (isDesktop()) {
        closeMobileMenu();
        closeMega();
      }
      setHeaderOffset();
    }, 150);
  });

  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const currentScrollY = window.scrollY;
    header?.classList.toggle('header--scrolled', currentScrollY > 10);

    const menuOpen = nav?.classList.contains('header__nav--open');

    if (!menuOpen) {
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        header?.classList.add('header--hidden');
      } else {
        header?.classList.remove('header--hidden');
      }
    } else {
      header?.classList.remove('header--hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  function updateCartBadge(count) {
    const badge = document.querySelector('.header__badge');
    if (!badge) return;
    const safe = Math.max(0, parseInt(count, 10) || 0);
    badge.dataset.count = String(safe);
    badge.textContent = String(safe);
  }

  window.updateCartBadge = updateCartBadge;
})();