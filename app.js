/* TDI Workspace — shared script */

// Device / viewport detection — flips body classes so CSS can serve the
// right layout per device. Re-runs on resize + orientation change.
(function() {
  const root = document.documentElement;
  const body = document.body;
  const apply = () => {
    const w = window.innerWidth;
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    let device = 'desktop';
    if (w <= 640) device = 'mobile';
    else if (w <= 1024) device = 'tablet';
    body.classList.toggle('is-mobile', device === 'mobile');
    body.classList.toggle('is-tablet', device === 'tablet');
    body.classList.toggle('is-desktop', device === 'desktop');
    body.classList.toggle('is-touch', touch);
    body.classList.toggle('is-hover', !touch);
    root.dataset.device = device;
  };
  apply();
  let raf;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(apply);
  }, { passive: true });
  window.addEventListener('orientationchange', apply);
})();

// Nav scroll state
(function() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 12);
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const btn = nav.querySelector('.nav__menu-btn');
  if (btn) btn.addEventListener('click', () => nav.classList.toggle('is-open'));
})();

// Active link highlight
(function() {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__panel a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) a.classList.add('is-active');
  });
})();

// Reveal on scroll — rAF-wrapped to avoid ResizeObserver loop warnings during reflow
(function() {
  const io = new IntersectionObserver((entries) => {
    requestAnimationFrame(() => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));
})();

// Project filter
(function() {
  const filters = document.querySelector('.filters');
  if (!filters) return;
  const items = document.querySelectorAll('[data-cat]');
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    filters.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const cat = btn.dataset.filter;
    items.forEach(it => {
      const show = cat === 'all' || it.dataset.cat.split(',').includes(cat);
      it.style.display = show ? '' : 'none';
    });
  });
})();

// Project modal
(function() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  const close = () => modal.classList.remove('is-open');
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.closest('.modal__close')) close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  document.querySelectorAll('[data-project-trigger]').forEach(row => {
    row.addEventListener('click', () => {
      const data = JSON.parse(row.dataset.project);
      modal.querySelector('[data-f="name"]').textContent = data.name;
      modal.querySelector('[data-f="industry"]').textContent = data.industry;
      modal.querySelector('[data-f="size"]').textContent = data.size;
      modal.querySelector('[data-f="year"]').textContent = data.year;
      modal.querySelector('[data-f="scope"]').textContent = data.scope;
      modal.querySelector('[data-f="challenge"]').textContent = data.challenge;
      modal.querySelector('[data-f="solution"]').textContent = data.solution;
      modal.querySelector('[data-f="hero"]').src = data.hero;
      modal.querySelectorAll('[data-f="gal"]').forEach((img, i) => { img.src = data.gallery[i] || data.hero; });
      modal.classList.add('is-open');
    });
  });
})();

// Inquiry multi-step
(function() {
  const form = document.querySelector('.form');
  if (!form) return;
  const steps = [...form.querySelectorAll('.form__step')];
  const stepsNav = document.querySelectorAll('.steps li');
  const bar = document.querySelector('.progressbar > span');
  let idx = 0;

  const render = () => {
    steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    stepsNav.forEach((s, i) => {
      s.classList.toggle('is-active', i === idx);
      s.classList.toggle('is-done', i < idx);
    });
    if (bar) bar.style.width = (((idx + 1) / steps.length) * 100) + '%';
    window.scrollTo({ top: form.offsetTop - 90, behavior: 'smooth' });
  };

  form.addEventListener('click', (e) => {
    const next = e.target.closest('[data-next]');
    const prev = e.target.closest('[data-prev]');
    if (next) { e.preventDefault(); idx = Math.min(idx + 1, steps.length - 1); render(); }
    if (prev) { e.preventDefault(); idx = Math.max(idx - 1, 0); render(); }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    idx = steps.length - 1;
    render();
  });

  // Chip toggles
  form.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const input = chip.querySelector('input');
      if (!input) return;
      if (input.type === 'checkbox') {
        input.checked = !input.checked;
        chip.classList.toggle('is-selected', input.checked);
      } else {
        chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('is-selected'));
        chip.classList.add('is-selected');
        input.checked = true;
      }
    });
  });

  // Budget radio
  form.querySelectorAll('.budget label').forEach(lbl => {
    lbl.addEventListener('click', () => {
      form.querySelectorAll('.budget label').forEach(l => l.classList.remove('is-selected'));
      lbl.classList.add('is-selected');
    });
  });

  // Dropzone
  const dz = form.querySelector('.dropzone');
  if (dz) {
    const fileInput = dz.querySelector('input[type="file"]');
    const filesEl = dz.querySelector('.files');
    const update = (files) => {
      if (!files.length) { filesEl.textContent = ''; return; }
      filesEl.textContent = [...files].map(f => f.name).join(', ');
    };
    dz.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => update(fileInput.files));
    ['dragenter','dragover'].forEach(ev => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('is-drag'); }));
    ['dragleave','drop'].forEach(ev => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('is-drag'); }));
    dz.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      fileInput.files = files;
      update(files);
    });
  }

  render();
})();
