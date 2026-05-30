/* TDI Workspace — public inquiry form → Firestore.
 *
 * Captures a submitted inquiry and writes it to the `inquiries` collection so
 * it shows up in the admin Inquiries inbox (admin-app.js reads from there).
 * app.js handles the multi-step UI + advancing to the thank-you screen; this
 * file only persists the data.
 */
(function () {
  const form = document.querySelector('.form');
  if (!form) return;

  const val = (name) => (form.querySelector('[name="' + name + '"]') || {}).value || '';
  const trim = (s) => String(s || '').trim();

  function humanSize(b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return Math.round(b / 1024) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  }

  function genRef() {
    const y = new Date().getFullYear();
    const n = Math.floor(1000 + Math.random() * 9000);
    return 'TDI-' + y + '-' + n;
  }

  function collect() {
    const ptype  = form.querySelector('input[name="ptype"]:checked');
    const budget = form.querySelector('input[name="budget"]:checked');
    const styles = [...form.querySelectorAll('input[name="style"]:checked')].map((i) => i.value);
    const fileEl = form.querySelector('.dropzone input[type="file"]');
    const files  = fileEl && fileEl.files ? [...fileEl.files].map((f) => ({ name: f.name, size: humanSize(f.size) })) : [];
    const sizeRaw = trim(val('size'));
    return {
      client:     trim(val('client')),
      company:    trim(val('company')),
      email:      trim(val('email')),
      phone:      trim(val('phone')),
      type:       ptype ? ptype.value.replace('&amp;', '&') : '',
      size:       sizeRaw ? sizeRaw + ' sqft' : '',
      completion: trim(val('completion')),
      address:    trim(val('address')),
      budget:     budget ? budget.value.replace('&lt;', '<') : '',
      styles:     styles,
      goals:      trim(val('goals')),
      files:      files,
      status:     'new',
      assignee:   '\u2014',
      reply:      ''
    };
  }

  form.addEventListener('submit', async function () {
    // Runs alongside app.js's own submit handler (which advances the UI).
    const data = collect();
    if (!data.email || !data.client) return; // minimal guard against empty saves

    const ref = genRef();
    data.ref = ref;

    const refEl = document.getElementById('inq-ref');
    if (refEl) refEl.textContent = ref;

    const db = window.TDIFire && window.TDIFire.db;
    if (!db) {
      console.warn('[TDI] Firestore not ready — inquiry not saved. Did you fill in firebase-config.js?');
      return;
    }
    try {
      await db.collection('inquiries').add(
        Object.assign({}, data, {
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      );
      console.log('[TDI] Inquiry saved to Firestore:', ref);
    } catch (err) {
      console.error('[TDI] Failed to save inquiry:', err);
    }
  });
})();
