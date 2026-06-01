'use strict';
/* TDI Workspace — shared content store.
 * ------------------------------------------------------------------
 * ONE source of truth for editable site content, backed by Firestore.
 * The admin console WRITES these docs; every public page READS them.
 *
 * Firestore layout — collection `content`, one doc per section:
 *   content/homepage   → { eyebrow, headline, …, stats[], featuredIds[] }
 *   content/team       → { members: [ … ] }
 *   content/projects   → { items: [ … ] }
 *   content/journal    → { items: [ … ] }       (articles)
 *   content/about      → { headline, intro, mission, vision, closing }
 *   content/contact    → { phone, email, whatsapp, address, … }
 *   content/settings   → { whatsappFloat, maintenance, cookieBanner, … }
 *
 * Security: firestore.rules allow PUBLIC read of content/* and admin-only
 * write. So a visitor can render the site; only a signed-in admin can edit.
 *
 * Each section ships with a baked-in DEFAULT so the site still renders if
 * Firestore is unreachable or a doc has not been seeded yet.
 * ------------------------------------------------------------------ */
window.TDIStore = (function () {

  const COLLECTION = 'content';
  const KEYS = ['homepage', 'team', 'projects', 'journal', 'about', 'contact', 'settings'];

  // ---- Baked-in defaults (mirror the admin seed) -------------------
  const DEFAULTS = {
    homepage: {
      eyebrow: 'Commercial Interior Specialists · Est. 2003',
      headline: 'Designing workspaces that inspire performance.',
      subheadline: 'TDI Workspace transforms commercial spaces into functional, elegant environments that elevate productivity, brand identity, and human experience.',
      ctaPrimaryLabel: 'View Projects',
      ctaPrimaryLink: 'projects.html',
      ctaSecondaryLabel: 'Start Your Project',
      ctaSecondaryLink: 'inquiry.html',
      heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2200&q=80',
      aboutHeadline: 'Built on precision. Driven by experience.',
      aboutP1: 'For over two decades, TDI Workspace has delivered commercial interior environments across Singapore — combining strategic planning, practical execution, and design excellence.',
      aboutP2: 'From corporate offices and retail environments to F&B concepts and bespoke commercial spaces, we create interiors that work beautifully and perform flawlessly.',
      stats: [
        { value: '20+', label: 'Years of practice' },
        { value: '300+', label: 'Completed projects' },
        { value: '98%', label: 'On‑time delivery' },
        { value: 'A→Z', label: 'End‑to‑end project management' }
      ],
      featuredIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6']
    },

    team: {
      members: [
        { id: 't1', name: 'Zhang Yaosheng', email: 'zhang@tdiworkspace.sg', role: 'Founder · Managing Director', dept: 'Leadership', exp: '22 yrs', photo: 'assets/zhang-yaosheng.jpg', bio: 'Trained as an architect, Yaosheng founded TDI in 2003 and still personally leads every design brief. Past life: project director at a regional Big‑Four corporate fit‑out practice.', visible: true, isYou: true },
        { id: 't2', name: 'Lin Jiahao', email: 'lin@tdiworkspace.sg', role: 'Design Director', dept: 'Leadership', exp: '12 yrs', photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80', bio: "Leads the interior design studio. RIBA Part 2 with a focus on workplace strategy. Authored TDI's space‑planning methodology used on every project since 2018.", visible: true },
        { id: 't3', name: 'James Koh', email: 'james@tdiworkspace.sg', role: 'Director of Delivery', dept: 'Leadership', exp: '14 yrs', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=900&q=80', bio: 'Heads project management and site delivery. PMP, BCA Workplace Safety qualified. Has personally signed off 240+ TDI handovers.', visible: true },
        { id: 't4', name: 'Rachel Lim', email: 'rachel@tdiworkspace.sg', role: 'Senior Interior Designer', dept: 'Studio', exp: '8 yrs', photo: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=900&q=80', bio: 'Specialises in workplace and F&B briefs. Material library curator for the studio.', visible: true },
        { id: 't5', name: 'Marcus Yeo', email: 'marcus@tdiworkspace.sg', role: 'Senior Project Manager', dept: 'Delivery', exp: '7 yrs', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=900&q=80', bio: 'Runs three live sites at any time. Known for the most disciplined snag walks in the office.', visible: true },
        { id: 't6', name: 'Aiko Tanaka', email: 'aiko@tdiworkspace.sg', role: 'Interior Designer', dept: 'Studio', exp: '5 yrs', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80', bio: 'Workplace strategy and post‑occupancy research. Leads our materials sustainability working group.', visible: true },
        { id: 't7', name: 'Daniel Ong', email: 'daniel@tdiworkspace.sg', role: 'Workshop Lead', dept: 'Workshop', exp: '10 yrs', photo: 'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?auto=format&fit=crop&w=900&q=80', bio: 'Runs the in‑house carpentry workshop. A decade of cabinetry from joinery up to feature stairs.', visible: true },
        { id: 't8', name: 'Sarah Chen', email: 'sarah@tdiworkspace.sg', role: 'Junior Designer', dept: 'Studio', exp: '3 yrs', photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=80', bio: 'Joined as an intern in 2023. Lights, joinery details and FF&E procurement.', visible: true },
        { id: 't9', name: 'Kenneth Tay', email: 'kenneth@tdiworkspace.sg', role: 'M&E Coordinator', dept: 'Delivery', exp: '9 yrs', photo: 'https://images.unsplash.com/photo-1542178243-bc20204b769f?auto=format&fit=crop&w=900&q=80', bio: 'Bridges design intent and the engineers. The reason TDI ceilings stay 50mm lower than the competition.', visible: true }
      ]
    },

    projects: {
      items: [
        { id: 'p1', name: 'Asia‑Pacific Headquarters', slug: '/projects/asia-pacific-hq', category: 'Office · Design & Build', year: 2025, size: '22,000 sqft', industry: 'Financial Services', featured: true, status: 'published', completion: 100, thumb: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=320&q=70' },
        { id: 'p2', name: 'Modern Collaborative Workspace', slug: '/projects/collab-workspace', category: 'Office', year: 2024, size: '9,200 sqft', industry: 'Professional Services', featured: true, status: 'published', completion: 100, thumb: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=320&q=70' },
        { id: 'p3', name: 'Boutique Retail Experience', slug: '/projects/boutique-retail', category: 'Retail · Design & Build', year: 2024, size: '2,800 sqft', industry: 'Luxury Retail', featured: false, status: 'published', completion: 100, thumb: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=320&q=70' },
        { id: 'p4', name: 'Premium F&B Concept Interior', slug: '/projects/fnb-concept', category: 'F&B · Design & Build', year: 2025, size: '4,100 sqft', industry: 'Hospitality', featured: true, status: 'draft', completion: 72, thumb: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=320&q=70' },
        { id: 'p5', name: 'Technology Office Upgrade', slug: '/projects/tech-office', category: 'Office · Renovation', year: 2024, size: '12,600 sqft', industry: 'SaaS / Technology', featured: false, status: 'published', completion: 100, thumb: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=320&q=70' },
        { id: 'p6', name: 'Flexible Hybrid Workspace', slug: '/projects/hybrid', category: 'Office · Design & Build', year: 2025, size: '7,300 sqft', industry: 'Consulting', featured: false, status: 'draft', completion: 44, thumb: 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?auto=format&fit=crop&w=320&q=70' },
        { id: 'p7', name: 'Healthcare Specialist Clinic', slug: '/projects/clinic', category: 'Commercial · Renovation', year: 2024, size: '5,400 sqft', industry: 'Healthcare', featured: false, status: 'published', completion: 100, thumb: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=320&q=70' },
        { id: 'p8', name: 'Heritage Shophouse Studio', slug: '/projects/heritage-shophouse', category: 'Office · Renovation', year: 2023, size: '3,200 sqft', industry: 'Creative Agency', featured: false, status: 'published', completion: 100, thumb: 'https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3?auto=format&fit=crop&w=320&q=70' },
        { id: 'p9', name: 'All‑Day Café & Roastery', slug: '/projects/cafe-roastery', category: 'F&B · Renovation', year: 2025, size: '2,300 sqft', industry: 'Hospitality', featured: false, status: 'published', completion: 100, thumb: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=320&q=70' }
      ]
    },

    about: {
      headline: 'Creating spaces that work better.',
      intro: 'TDI Workspace is a Singapore commercial interior specialist delivering high-performance environments for modern businesses. Our strength lies in combining practical construction knowledge with design intelligence to create workspaces that are elegant, efficient, and built for long-term performance.',
      mission: 'To deliver intelligent commercial spaces that empower businesses.',
      vision: "To be Singapore's most trusted commercial interior partner.",
      closing: 'We believe exceptional spaces are not just visually impressive — they solve operational challenges, strengthen company culture, and support business growth.'
    },

    contact: {
      phone: '+65 6200 0000',
      email: 'hello@tdiworkspace.sg',
      whatsapp: '+65 8000 0000',
      waMessage: "Hello TDI Workspace, I'm interested in discussing my project.",
      address: '71 Ubi Crescent, #06-02, Excalibur Centre, Singapore 408571',
      hours: 'Mon–Fri · 9am – 6pm SGT',
      entity: 'TDI Workspace Pte. Ltd.',
      uen: '200312345R',
      license: 'L4 General Builder'
    },

    settings: {
      maintenance: false,
      cookieBanner: true,
      whatsappFloat: true
    }
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function defaultFor(key) {
    if (key === 'journal') {
      const arts = (window.TDIJournal && window.TDIJournal.SEED_ARTICLES)
        ? window.TDIJournal.SEED_ARTICLES : [];
      return { items: clone(arts) };
    }
    return clone(DEFAULTS[key] || {});
  }

  const cache = {};
  const existed = {};
  let _loaded = false;
  let _resolveReady;
  const ready = new Promise(function (r) { _resolveReady = r; });

  // Pre-fill cache with defaults so synchronous get() always returns something.
  KEYS.forEach(function (k) { cache[k] = defaultFor(k); existed[k] = false; });

  function db() { return (window.TDIFire && window.TDIFire.db) || null; }

  async function fetchAll() {
    const database = db();
    if (database) {
      try {
        const snaps = await Promise.all(KEYS.map(function (k) {
          return database.collection(COLLECTION).doc(k).get();
        }));
        snaps.forEach(function (snap, i) {
          const k = KEYS[i];
          existed[k] = snap.exists;
          if (snap.exists) {
            const data = snap.data();
            if (data && Object.keys(data).length) cache[k] = data;
          }
        });
      } catch (e) {
        console.warn('[TDI] content load failed — using built-in defaults.', e);
      }
    }
    _loaded = true;
    _resolveReady(cache);
    return cache;
  }

  function get(key) { return cache[key] || defaultFor(key); }

  async function save(key, value) {
    cache[key] = value;
    const database = db();
    if (!database) return false;
    try {
      await database.collection(COLLECTION).doc(key).set(value);
      existed[key] = true;
      return true;
    } catch (e) {
      console.error('[TDI] content save failed for "' + key + '":', e);
      return false;
    }
  }

  return {
    COLLECTION: COLLECTION,
    KEYS: KEYS,
    DEFAULTS: DEFAULTS,
    defaultFor: defaultFor,
    cache: cache,
    existed: existed,
    ready: ready,
    fetchAll: fetchAll,
    get: get,
    save: save,
    isLoaded: function () { return _loaded; }
  };
})();
