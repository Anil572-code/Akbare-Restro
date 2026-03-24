/* ============================================================
   AKBARE SEKUWA & RESTRO — Premium Enhanced script.js
   ============================================================ */
'use strict';

/* ============================================================
   LOADER
   ============================================================ */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  document.body.classList.add('loader-active');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loader-active');
      // Fire event so hero animations start EXACTLY when loader begins fading
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('loaderDone'));
      }, 900); // wait for loader fade (1.1s) to mostly complete
    }, 3000);
  });
})();

/* Custom cursor removed */

/* ============================================================
   SCROLL PROGRESS
   ============================================================ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  let ticking = false;
  function update() {
    const scrollTop = window.pageYOffset;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (docH > 0 ? (scrollTop / docH) * 100 : 0) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

/* ============================================================
   NAVBAR — scroll + mobile toggle
   ============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  function toggleMenu(open) {
    hamburger?.classList.toggle('open', open);
    navMenu?.classList.toggle('open', open);
    hamburger?.setAttribute('aria-expanded', String(open));
  }

  hamburger?.addEventListener('click', () => toggleMenu(!navMenu.classList.contains('open')));
  document.querySelectorAll('.navbar__link').forEach(l => {
    if (l.tagName === 'A') l.addEventListener('click', () => toggleMenu(false));
  });
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) toggleMenu(false);
  });
})();

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = document.getElementById('navbar')?.offsetHeight || 70;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
      }
    });
  });
})();

/* ============================================================
   ACTIVE NAV
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.navbar__link');
  let ticking = false;
  function update() {
    const navH = document.getElementById('navbar')?.offsetHeight || 70;
    let current = '';
    sections.forEach(s => { if (window.pageYOffset >= s.offsetTop - navH - 80) current = s.id; });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

/* ============================================================
   HERO — line reveal animation (reliable, preserves shimmer)
   ============================================================ */
(function initHeroLines() {
  const lines = document.querySelectorAll('.hero__headline-clip');
  const navbar = document.getElementById('navbar');
  const eyebrow = document.querySelector('.hero__eyebrow');
  const actions = document.querySelector('.hero__actions');
  const rating = document.querySelector('.hero__rating');
  const scroll = document.querySelector('.hero__scroll');

  // Keep everything invisible initially
  lines.forEach(line => { line.style.opacity = '0'; line.style.transform = 'translateY(40px)'; });
  if (navbar) { navbar.style.opacity = '0'; navbar.style.transform = 'translateY(-20px)'; }
  if (eyebrow) { eyebrow.style.opacity = '0'; eyebrow.style.transform = 'translateY(20px)'; }
  if (actions) { actions.style.opacity = '0'; actions.style.transform = 'translateY(20px)'; }
  if (rating)  { rating.style.opacity  = '0'; rating.style.transform  = 'translateY(20px)'; }
  if (scroll)  { scroll.style.opacity  = '0'; }

  document.addEventListener('loaderDone', () => {
    const ease = 'cubic-bezier(0.16,1,0.3,1)';
    const dur = '0.9s';

    // Navbar slides in
    if (navbar) {
      navbar.style.transition = `opacity 0.7s ease, transform 0.7s ${ease}`;
      requestAnimationFrame(() => { navbar.style.opacity = '1'; navbar.style.transform = 'translateY(0)'; });
    }

    // Eyebrow
    if (eyebrow) {
      eyebrow.style.transition = `opacity ${dur} ease 0.1s, transform ${dur} ${ease} 0.1s`;
      requestAnimationFrame(() => { eyebrow.style.opacity = '1'; eyebrow.style.transform = 'translateY(0)'; });
    }

    // Headline lines staggered
    lines.forEach((line, i) => {
      line.style.transition = `opacity ${dur} ${ease} ${0.2 + i * 0.18}s, transform ${dur} ${ease} ${0.2 + i * 0.18}s`;
      requestAnimationFrame(() => { line.style.opacity = '1'; line.style.transform = 'translateY(0)'; });
    });

    // Typed subtitle — start after headline
    if (window._startTyped) setTimeout(window._startTyped, 800);

    // Actions + rating + scroll
    if (actions) {
      actions.style.transition = `opacity ${dur} ease 0.7s, transform ${dur} ${ease} 0.7s`;
      setTimeout(() => { actions.style.opacity = '1'; actions.style.transform = 'translateY(0)'; }, 10);
    }
    if (rating) {
      rating.style.transition = `opacity ${dur} ease 0.9s, transform ${dur} ${ease} 0.9s`;
      setTimeout(() => { rating.style.opacity = '1'; rating.style.transform = 'translateY(0)'; }, 10);
    }
    if (scroll) {
      scroll.style.transition = 'opacity 1s ease 1.2s';
      setTimeout(() => { scroll.style.opacity = '1'; }, 10);
    }
  });
})();

/* ============================================================
   HERO — typed subtitle effect
   ============================================================ */
(function initTypedSub() {
  const sub = document.querySelector('.hero__sub');
  if (!sub) return;

  const phrases = [
    'Premium Sekuwa Experience in Chitwan',
    'Charcoal-Grilled. Soul-Fired.',
    "Nepal's Hottest Chilli. Your Table.",
    'Where Every Flame Tells a Story.',
  ];

  const cursor = document.createElement('span');
  cursor.className = 'hero__cursor';
  cursor.setAttribute('aria-hidden', 'true');

  sub.textContent = '';
  sub.appendChild(cursor);

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  function type() { window._typedStarted = true;
    if (sub) sub.classList.add('visible');
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      sub.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        sub.appendChild(cursor);
        setTimeout(type, 2400);
        return;
      }
    } else {
      sub.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        sub.appendChild(cursor);
        setTimeout(type, 500);
        return;
      }
    }
    sub.appendChild(cursor);
    setTimeout(type, isDeleting ? 32 : 58);
  }

  // Expose start hook for loader coordination
  window._startTyped = type;
  // Fallback if loaderDone never fires
  setTimeout(() => { if (!window._typedStarted) type(); }, 5000);
})();

/* ============================================================
   BUTTON RIPPLE
   ============================================================ */
(function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
})();

/* ============================================================
   FLAME DIVIDERS
   ============================================================ */
(function initFlameDividers() {
  const sections = ['features', 'dishes', 'gallery', 'about', 'testimonials', 'greviews', 'reservation', 'find-us'];
  sections.forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const div = document.createElement('div');
    div.className = 'flame-divider';
    div.setAttribute('aria-hidden', 'true');
    div.innerHTML = `
      <div class="flame-divider__line"></div>
      <div class="flame-divider__icon" aria-hidden="true">
        <svg viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="36">
          <defs>
            <linearGradient id="flameGrad" x1="14" y1="36" x2="14" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#8B0000"/>
              <stop offset="55%" stop-color="#D4AF37"/>
              <stop offset="100%" stop-color="#f5e6a0"/>
            </linearGradient>
          </defs>
          <path d="M14 2C14 2 5 12 5 20C5 24.97 9.03 29 14 29C18.97 29 23 24.97 23 20C23 12 14 2 14 2Z" fill="url(#flameGrad)" opacity="0.9"/>
          <path d="M14 12C14 12 10 17 10 21C10 23.21 11.79 25 14 25C16.21 25 18 23.21 18 21C18 17 14 12 14 12Z" fill="#fff" opacity="0.15"/>
        </svg>
      </div>
      <div class="flame-divider__line"></div>`;
    sec.parentNode.insertBefore(div, sec);
  });
})();

/* ============================================================
   DISH CARD — heat effect on hover (mouse position)
   ============================================================ */
(function initDishCardGlow() {
  document.querySelectorAll('.dish-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--gx', x + '%');
      card.style.setProperty('--gy', y + '%');
    });
  });
})();

/* ============================================================
   INTERSECTION OBSERVER — reveals with stagger
   ============================================================ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .section-label');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
})();

/* ============================================================
   PARALLAX — hero particles + subtle section parallax
   ============================================================ */
(function initParallax() {
  const particles = document.querySelector('.hero__particles');
  if (!particles) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.pageYOffset;
        particles.style.transform = `translateY(${y * 0.2}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ============================================================
   ANIMATED STAT COUNTERS
   ============================================================ */
(function initCounters() {
  const nums    = document.querySelectorAll('.about__stat-num');
  const statsEl = document.querySelector('.about__stats');
  if (!nums.length || !statsEl) return;

  function animateCounter(el) {
    const raw    = el.textContent.trim();
    const suffix = raw.replace(/[\d.]/g, '');
    const target = parseFloat(raw);
    if (isNaN(target)) return;
    const duration = 2200;
    const start = performance.now();
    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else { el.textContent = raw; el.closest('.about__stat')?.classList.add('counted'); }
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => nums.forEach(el => animateCounter(el)), 200);
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });
  observer.observe(statsEl);
})();

/* ============================================================
   RESERVATION FORM
   ============================================================ */
(function initReservationForm() {
  const form    = document.getElementById('reservationForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  function getError(id, value) {
    switch (id) {
      case 'res-name':
        if (!value.trim()) return 'Please enter your full name.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        return '';
      case 'res-email':
        if (!value.trim()) return 'Please enter your email address.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      case 'res-date': {
        if (!value) return 'Please select a date.';
        const sel = new Date(value);
        const today = new Date(); today.setHours(0,0,0,0);
        if (sel < today) return 'Please select a future date.';
        return '';
      }
      case 'res-time':    return value ? '' : 'Please select a preferred time.';
      case 'res-guests':  return value ? '' : 'Please select the number of guests.';
      default: return '';
    }
  }

  function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errEl = document.getElementById('err-' + inputId.replace('res-', ''));
    if (!input || !errEl) return;
    input.classList.toggle('error', !!message);
    errEl.textContent = message;
  }

  function validateAll() {
    const fields = ['res-name', 'res-email', 'res-date', 'res-time', 'res-guests'];
    let valid = true;
    fields.forEach(id => {
      const input = document.getElementById(id);
      if (!input) return;
      const err = getError(id, input.value);
      showError(id, err);
      if (err) valid = false;
    });
    return valid;
  }

  ['res-name', 'res-email', 'res-date', 'res-time', 'res-guests'].forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('blur',  () => showError(id, getError(id, input.value)));
    input.addEventListener('input', () => { if (input.classList.contains('error') && !getError(id, input.value)) showError(id, ''); });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    const btn     = form.querySelector('.res-form__submit');
    const btnText = btn.querySelector('span');
    const name    = document.getElementById('res-name').value.trim();
    const email   = document.getElementById('res-email').value.trim();
    const date    = document.getElementById('res-date').value;
    const time    = document.getElementById('res-time').value;
    const guests  = document.getElementById('res-guests').value;

    const dateFormatted = new Date(date + 'T00:00:00').toLocaleDateString('en-NP', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    btn.disabled        = true;
    btnText.textContent = 'Preparing…';

    // Short delay for UX, then open WhatsApp directly - no broken third-party dependency
    await new Promise(r => setTimeout(r, 700));

    const waMsg = encodeURIComponent(
      `🔥 *New Table Reservation — Akbare Sekuwa & Restro*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `📅 *Date:* ${dateFormatted}\n` +
      `🕐 *Time:* ${time}\n` +
      `👥 *Guests:* ${guests}\n\n` +
      `_Sent via akbaresekuwa.com_`
    );

    btn.disabled        = false;
    btnText.textContent = 'Confirm Reservation';
    if (success) success.classList.add('show');
    form.reset();
    success?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => success?.classList.remove('show'), 12000);
    // Open WhatsApp with pre-filled message - instant confirmation
    setTimeout(() => window.open(`https://wa.me/9779855015317?text=${waMsg}`, '_blank'), 800);
  });
})();

/* ============================================================
   TESTIMONIALS CAROUSEL — with momentum feel
   ============================================================ */
(function initTestimonials() {
  const track   = document.getElementById('testimonialsTrack');
  const dotsEl  = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testi-card'));
  const total = cards.length;
  let current = 0;
  let autoTimer;

  function getPerView() { return window.innerWidth > 960 ? 3 : window.innerWidth > 640 ? 2 : 1; }
  function maxIndex()   { return Math.max(0, total - getPerView()); }
  function getCardW()   { return (cards[0]?.offsetWidth || 0) + parseInt(getComputedStyle(track).gap || '24'); }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIndex()));
    track.style.transform = `translateX(-${current * getCardW()}px)`;
    updateDots();
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= maxIndex();
  }

  function updateDots() {
    dotsEl?.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    for (let i = 0; i <= maxIndex(); i++) {
      const btn = document.createElement('button');
      btn.className = 'testi-dot' + (i === current ? ' active' : '');
      btn.setAttribute('aria-label', `Review ${i + 1}`);
      btn.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsEl.appendChild(btn);
    }
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current >= maxIndex() ? 0 : current + 1), 5500);
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  });

  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', resetAuto);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildDots(); goTo(Math.min(current, maxIndex())); }, 200);
  });

  buildDots(); goTo(0); resetAuto();
})();

/* ============================================================
   MENU MODAL
   ============================================================ */
(function initMenuModal() {
  const modal      = document.getElementById('menuModal');
  const backdrop   = document.getElementById('menuBackdrop');
  const closeBtn   = document.getElementById('menuClose');
  const reserveBtn = document.getElementById('menuReserveBtn');
  const openBtns   = ['heroMenuBtn','viewFullMenuBtn','navMenuTrigger'].map(id => document.getElementById(id)).filter(Boolean);

  if (!modal) return;

  function openModal() {
    modal.removeAttribute('hidden');
    document.body.classList.add('modal-open');
    modal.classList.remove('closing');
    modal.classList.add('opening');
    document.getElementById('navMenu')?.classList.remove('open');
    document.getElementById('hamburger')?.classList.remove('open');
  }

  function closeModal() {
    modal.classList.remove('opening');
    modal.classList.add('closing');
    document.body.classList.remove('modal-open');
    setTimeout(() => { modal.setAttribute('hidden',''); modal.classList.remove('closing'); }, 450);
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal(); });

  document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.menu-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active'); tab.setAttribute('aria-selected','true');
      document.getElementById('tab-' + tab.dataset.tab)?.classList.add('active');
    });
  });

  reserveBtn?.addEventListener('click', (e) => {
    e.preventDefault(); closeModal();
    setTimeout(() => {
      const target = document.getElementById('reservation');
      if (target) window.scrollTo({ top: target.offsetTop - (document.getElementById('navbar')?.offsetHeight || 70), behavior: 'smooth' });
    }, 460);
  });
})();

/* ============================================================
   MAP PLACEHOLDER
   ============================================================ */
(function initMap() {
  const iframe      = document.getElementById('mapIframe');
  const placeholder = document.getElementById('mapPlaceholder');
  if (!iframe) return;
  iframe.addEventListener('load', () => {
    if (placeholder) placeholder.style.display = 'none';
  });
})();

/* ============================================================
   SECTION ENTRANCE — subtle background shift
   ============================================================ */
(function initSectionGlow() {
  const glowSections = [
    { id: 'hero',         color: 'rgba(139,0,0,0.04)' },
    { id: 'features',     color: 'rgba(212,175,55,0.02)' },
    { id: 'dishes',       color: 'rgba(139,0,0,0.03)' },
    { id: 'gallery',      color: 'rgba(212,175,55,0.02)' },
    { id: 'about',        color: 'rgba(212,175,55,0.02)' },
    { id: 'testimonials', color: 'rgba(139,0,0,0.03)' },
    { id: 'greviews',     color: 'rgba(66,133,244,0.02)' },
    { id: 'reservation',  color: 'rgba(212,175,55,0.01)' },
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const info = glowSections.find(s => s.id === entry.target.id);
        if (info) document.body.style.backgroundColor = '#0a0a0a';
      }
    });
  }, { threshold: 0.3 });

  glowSections.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });
})();
/* ============================================================
   HERO VIDEO / IMAGE UPLOAD
   ============================================================ */
(function initHeroVideo() {
  const input  = document.getElementById('heroVideoInput');
  const upload = document.getElementById('heroVideoUpload');
  const video  = document.getElementById('heroVideo');
  const wrap   = document.querySelector('.hero__video-wrap');
  if (!input || !video) return;

  upload?.addEventListener('click', () => input.click());

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);

    // If image, set as background on the wrap instead
    if (file.type.startsWith('image/')) {
      if (wrap) {
        wrap.style.backgroundImage = `url('${url}')`;
        wrap.style.backgroundSize = 'cover';
        wrap.style.backgroundPosition = 'center';
        wrap.classList.add('has-video');
        upload.style.display = 'none';
      }
      return;
    }

    video.src = url;
    video.load();
    video.addEventListener('loadeddata', () => {
      video.classList.add('loaded');
      wrap?.classList.add('has-video');
    }, { once: true });
  });

  // If a video src is already set (from a hardcoded source tag), show it
  if (video.readyState >= 2) {
    video.classList.add('loaded');
    wrap?.classList.add('has-video');
  }
})();

/* ============================================================
   DISH PHOTO UPLOAD
   ============================================================ */
(function initDishPhotoUpload() {
  document.querySelectorAll('.dish-photo-input').forEach((input, i) => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const url  = URL.createObjectURL(file);
      const card = input.closest('.dish-card');
      const img  = card?.querySelector('.dish-card__img');
      if (!img) return;
      img.style.backgroundImage = `url('${url}')`;
      img.style.backgroundSize  = 'cover';
      img.style.backgroundPosition = 'center';
      img.classList.add('has-photo');
      // Fade in
      img.style.opacity = '0';
      setTimeout(() => { img.style.transition = 'opacity 0.6s ease'; img.style.opacity = '1'; }, 10);
    });
  });

  // Gallery photo upload
  document.querySelectorAll('.gallery__img').forEach(imgEl => {
    const label = document.createElement('label');
    label.className = 'dish-photo-upload';
    label.title = 'Upload photo';
    label.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><span>Add Photo</span><input type="file" accept="image/*" style="display:none">`;
    imgEl.parentElement.style.position = 'relative';
    imgEl.parentElement.appendChild(label);
    label.querySelector('input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      imgEl.style.backgroundImage = `url('${url}')`;
      imgEl.style.backgroundSize  = 'cover';
      imgEl.style.backgroundPosition = 'center';
      imgEl.classList.add('has-photo');
    });
  });
})();

/* ============================================================
   WHATSAPP CHAT BUBBLE
   ============================================================ */
(function initWaBubble() {
  const bubble  = document.getElementById('waBubble');
  const toggle  = document.getElementById('waBubbleToggle');
  const panel   = document.getElementById('waBubblePanel');
  const badge   = document.getElementById('waBadge');
  if (!bubble || !toggle) return;

  let open = false;

  toggle.addEventListener('click', () => {
    open = !open;
    bubble.setAttribute('data-open', String(open));
    toggle.setAttribute('aria-expanded', String(open));
    if (open && badge) badge.style.display = 'none';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (open && !bubble.contains(e.target)) {
      open = false;
      bubble.setAttribute('data-open', 'false');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Quick reply buttons
  document.querySelectorAll('.wa-bubble__quick-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const msg = encodeURIComponent(btn.dataset.msg || btn.textContent.trim());
      window.open(`https://wa.me/9779855015317?text=${msg}`, '_blank');
    });
  });
})();