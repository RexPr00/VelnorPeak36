const body = document.body;

const trapFocus = (container) => {
  const items = container.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
  if (!items.length) return () => {};
  const first = items[0];
  const last = items[items.length - 1];
  const handler = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  container.addEventListener('keydown', handler);
  return () => container.removeEventListener('keydown', handler);
};

const setupLang = () => {
  document.querySelectorAll('.lang').forEach((wrap) => {
    const btn = wrap.querySelector('.lang-btn');
    btn?.addEventListener('click', () => wrap.classList.toggle('open'));
  });
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.lang').forEach((wrap) => {
      if (!wrap.contains(e.target)) wrap.classList.remove('open');
    });
  });
};

const setupDrawer = () => {
  const drawer = document.getElementById('drawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const openBtn = document.getElementById('openDrawer');
  const closeBtn = document.getElementById('closeDrawer');
  if (!drawer || !openBtn || !closeBtn || !backdrop) return;

  let releaseTrap = () => {};

  const close = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    body.style.overflow = '';
    releaseTrap();
  };
  const open = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    body.style.overflow = 'hidden';
    releaseTrap = trapFocus(drawer);
    closeBtn.focus();
  };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
      document.getElementById('privacyModal')?.classList.remove('open');
      body.style.overflow = '';
    }
  });
};

const setupFaq = () => {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      items.forEach((x) => x.classList.remove('open'));
      item.classList.add('open');
    });
  });
};

const setupModal = () => {
  const modal = document.getElementById('privacyModal');
  const opens = document.querySelectorAll('[data-open-privacy]');
  const closes = document.querySelectorAll('[data-close-privacy]');
  if (!modal) return;

  let releaseTrap = () => {};
  const open = () => {
    modal.classList.add('open');
    body.style.overflow = 'hidden';
    releaseTrap = trapFocus(modal.querySelector('.modal-card'));
  };
  const close = () => {
    modal.classList.remove('open');
    body.style.overflow = '';
    releaseTrap();
  };

  opens.forEach((btn) => btn.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  closes.forEach((btn) => btn.addEventListener('click', close));
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
};

const setupObserver = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.card, .section h2, .form-card').forEach((el) => {
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'transform .35s ease';
    observer.observe(el);
  });
};

setupLang();
setupDrawer();
setupFaq();
setupModal();
setupObserver();
