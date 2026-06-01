'use strict';
/* TDI Workspace — public site renderer.
 * Reads the shared content store (Firestore-backed) and updates the public
 * pages so everything stays in sync with what the admin publishes.
 *
 * Load order on every public page:
 *   firebase-app-compat.js → firebase-firestore-compat.js → firebase-config.js
 *   → journal-data.js (journal pages only) → tdi-store.js → tdi-site.js → app.js
 */
(function () {

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function digits(s) { return String(s || '').replace(/[^\d]/g, ''); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }

  // ----------------------------------------------------------------
  //   CONTACT — works on every page by rewriting tel:/mailto:/wa.me
  //   links, plus the floating WhatsApp button. No per-page markup.
  // ----------------------------------------------------------------
  function hydrateContact(c, settings) {
    if (!c) return;
    const phoneText = c.phone || '';
    const emailText = c.email || '';
    const waDigits = digits(c.whatsapp) || digits(c.phone);
    const waMsg = encodeURIComponent(c.waMessage || '');

    // Phone links
    $all('a[href^="tel:"]').forEach(function (a) {
      if (phoneText) {
        a.href = 'tel:+' + digits(phoneText);
        // Only replace text if the current label looks like a phone number.
        if (/[\d][\d\s+()-]{5,}/.test(a.textContent) && !a.querySelector('*')) {
          a.textContent = phoneText;
        }
      }
    });

    // Email links
    $all('a[href^="mailto:"]').forEach(function (a) {
      if (emailText) {
        a.href = 'mailto:' + emailText;
        if (/@/.test(a.textContent) && !a.querySelector('*')) a.textContent = emailText;
      }
    });

    // WhatsApp links (footer / inline) — keep their visible label.
    $all('a[href*="wa.me"]').forEach(function (a) {
      if (a.classList.contains('wa')) return; // floating button handled below
      if (waDigits) a.href = 'https://wa.me/' + waDigits + (waMsg ? '?text=' + waMsg : '');
    });

    // Floating WhatsApp button — href + show/hide via settings.
    const float = $('.wa');
    if (float) {
      if (waDigits) float.href = 'https://wa.me/' + waDigits + (waMsg ? '?text=' + waMsg : '');
      const on = !settings || settings.whatsappFloat !== false;
      float.style.display = on ? '' : 'none';
    }

    // Optional per-page hooks (data-tdi="...") for richer contact blocks.
    const map = {
      phone: phoneText, email: emailText, whatsapp: c.whatsapp || '',
      address: c.address || '', hours: c.hours || '', entity: c.entity || '',
      uen: c.uen || '', license: c.license || ''
    };
    Object.keys(map).forEach(function (key) {
      $all('[data-tdi="' + key + '"]').forEach(function (el) { el.textContent = map[key]; });
    });
  }

  // ----------------------------------------------------------------
  //   TEAM — render the leadership + studio grids from the store.
  //   Only members with visible !== false are shown.
  // ----------------------------------------------------------------
  function memberCard(m) {
    return '' +
      '<article class="member">' +
        '<div class="member__media">' +
          '<img src="' + esc(m.photo) + '" alt="' + esc(m.name) + '">' +
          (m.exp ? '<span class="yrs">' + esc(m.exp) + '</span>' : '') +
        '</div>' +
        '<h3 class="member__name">' + esc(m.name) + '</h3>' +
        '<div class="member__role">' + esc(m.role) + '</div>' +
        (m.bio ? '<p class="member__bio">' + esc(m.bio) + '</p>' : '') +
      '</article>';
  }

  function renderTeam(team) {
    const leadWrap = $('[data-tdi-team="leadership"]');
    const studioWrap = $('[data-tdi-team="studio"]');
    if (!leadWrap && !studioWrap) return;
    const members = (team && team.members) || [];
    const visible = members.filter(function (m) { return m.visible !== false; });

    if (leadWrap) {
      const lead = visible.filter(function (m) { return m.dept === 'Leadership'; });
      leadWrap.innerHTML = lead.map(memberCard).join('');
    }
    if (studioWrap) {
      const studio = visible.filter(function (m) { return m.dept !== 'Leadership'; });
      studioWrap.innerHTML = studio.map(memberCard).join('');
      const section = studioWrap.closest('section');
      if (section) section.style.display = studio.length ? '' : 'none';
    }
  }

  // ----------------------------------------------------------------
  //   HOMEPAGE — hydrate hero, about snapshot and stats in place.
  //   Rich-markup fields (hero title, about headline) only change when
  //   the admin has edited them away from the default, so the designed
  //   layout is preserved out of the box.
  // ----------------------------------------------------------------
  function setText(el, value) { if (el && value != null) el.textContent = value; }

  function hydrateHome(h) {
    const hero = $('.hero__title');
    if (!hero) return; // not the homepage
    const D = (window.TDIStore && window.TDIStore.DEFAULTS.homepage) || {};

    setText($('.hero__eyebrow'), null); // keep dot; update via childNodes below
    const eyebrow = $('.hero__eyebrow');
    if (eyebrow && h.eyebrow) {
      // Preserve the leading <span class="dot">; replace trailing text node.
      const dot = eyebrow.querySelector('.dot');
      eyebrow.textContent = '';
      if (dot) eyebrow.appendChild(dot);
      eyebrow.appendChild(document.createTextNode(h.eyebrow));
    }

    // Hero title — only override the designed markup if the admin changed it.
    if (h.headline && h.headline !== D.headline) hero.textContent = h.headline;

    setText($('.hero__sub'), h.subheadline);

    const heroImg = $('.hero__media img');
    if (heroImg && h.heroImage) heroImg.src = h.heroImage;

    // Hero CTAs
    function safeLink(v) {
      // Only accept relative .html, anchors, or full URLs — never root-absolute
      // paths like "/projects" which 404 on a GitHub Pages subfolder.
      return /\.html(\?|#|$)|^https?:|^#|^mailto:|^tel:/.test(v || '') ? v : null;
    }
    const actions = $all('.hero__actions a');
    if (actions[0] && h.ctaPrimaryLabel) {
      actions[0].childNodes[0].nodeValue = h.ctaPrimaryLabel + ' ';
      const lk = safeLink(h.ctaPrimaryLink);
      if (lk) actions[0].href = lk;
    }
    if (actions[1] && h.ctaSecondaryLabel) {
      actions[1].childNodes[0].nodeValue = h.ctaSecondaryLabel + ' ';
      const lk = safeLink(h.ctaSecondaryLink);
      if (lk) actions[1].href = lk;
    }

    // About snapshot paragraphs (the two-col on the homepage).
    const aboutHead = $('.section .two-col h2.display');
    if (aboutHead && h.aboutHeadline && h.aboutHeadline !== D.aboutHeadline) {
      aboutHead.textContent = h.aboutHeadline;
    }
    const aboutCol = aboutHead ? aboutHead.closest('.two-col') : null;
    if (aboutCol) {
      const ps = $all('p', aboutCol);
      if (ps[0] && h.aboutP1) ps[0].textContent = h.aboutP1;
      if (ps[1] && h.aboutP2) ps[1].textContent = h.aboutP2;
    }

    // Stats — update value + label of existing items in place.
    const items = $all('.stats .stats__item');
    (h.stats || []).slice(0, items.length).forEach(function (st, i) {
      setText($('.stats__n', items[i]), st.value);
      setText($('.stats__l', items[i]), st.label);
    });
  }

  // ----------------------------------------------------------------
  //   BOOT
  // ----------------------------------------------------------------
  function render() {
    const S = window.TDIStore;
    if (!S) return;
    try { hydrateContact(S.get('contact'), S.get('settings')); } catch (e) { console.warn(e); }
    try { renderTeam(S.get('team')); } catch (e) { console.warn(e); }
    try { hydrateHome(S.get('homepage')); } catch (e) { console.warn(e); }
    document.dispatchEvent(new CustomEvent('tdi:content-ready'));
  }

  if (window.TDIStore) {
    window.TDIStore.fetchAll().then(render).catch(render);
  } else {
    console.warn('[TDI] tdi-store.js not loaded before tdi-site.js');
  }
})();
