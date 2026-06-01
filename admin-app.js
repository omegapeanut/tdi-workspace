'use strict';
/* TDI Workspace — Admin Console App */
(function(){

// =============================================================
//   STORAGE KEYS
// =============================================================
const KEY = 'tdi_admin_v3';
const SESSION_KEY = 'tdi_admin_session';

// =============================================================
//   SEED DATA
// =============================================================
const SEED = {
  user: {
    name: 'Zhang Yaosheng',
    email: 'zhang@tdiworkspace.sg',
    mobile: '+65 8200 0000',
    title: 'Founder · Administrator',
    avatar: 'assets/zhang-yaosheng.jpg',
    mfa: true,
    sessionTimeout: '4h'
  },

  projects: [
    {id:'p1', name:'Asia‑Pacific Headquarters', slug:'/projects/asia-pacific-hq', category:'Office · Design & Build', year:2025, size:'22,000 sqft', industry:'Financial Services', featured:true, status:'published', completion:100, thumb:'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=320&q=70'},
    {id:'p2', name:'Modern Collaborative Workspace', slug:'/projects/collab-workspace', category:'Office', year:2024, size:'9,200 sqft', industry:'Professional Services', featured:true, status:'published', completion:100, thumb:'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=320&q=70'},
    {id:'p3', name:'Boutique Retail Experience', slug:'/projects/boutique-retail', category:'Retail · Design & Build', year:2024, size:'2,800 sqft', industry:'Luxury Retail', featured:false, status:'published', completion:100, thumb:'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=320&q=70'},
    {id:'p4', name:'Premium F&B Concept Interior', slug:'/projects/fnb-concept', category:'F&B · Design & Build', year:2025, size:'4,100 sqft', industry:'Hospitality', featured:true, status:'draft', completion:72, thumb:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=320&q=70'},
    {id:'p5', name:'Technology Office Upgrade', slug:'/projects/tech-office', category:'Office · Renovation', year:2024, size:'12,600 sqft', industry:'SaaS / Technology', featured:false, status:'published', completion:100, thumb:'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=320&q=70'},
    {id:'p6', name:'Flexible Hybrid Workspace', slug:'/projects/hybrid', category:'Office · Design & Build', year:2025, size:'7,300 sqft', industry:'Consulting', featured:false, status:'draft', completion:44, thumb:'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?auto=format&fit=crop&w=320&q=70'},
    {id:'p7', name:'Healthcare Specialist Clinic', slug:'/projects/clinic', category:'Commercial · Renovation', year:2024, size:'5,400 sqft', industry:'Healthcare', featured:false, status:'published', completion:100, thumb:'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=320&q=70'},
    {id:'p8', name:'Heritage Shophouse Studio', slug:'/projects/heritage-shophouse', category:'Office · Renovation', year:2023, size:'3,200 sqft', industry:'Creative Agency', featured:false, status:'published', completion:100, thumb:'https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3?auto=format&fit=crop&w=320&q=70'},
    {id:'p9', name:'All‑Day Café & Roastery', slug:'/projects/cafe-roastery', category:'F&B · Renovation', year:2025, size:'2,300 sqft', industry:'Hospitality', featured:false, status:'published', completion:100, thumb:'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=320&q=70'}
  ],

  team: [
    {id:'t1', name:'Zhang Yaosheng', email:'zhang@tdiworkspace.sg', role:'Founder · Managing Director', dept:'Leadership', exp:'22 yrs', photo:'assets/zhang-yaosheng.jpg', visible:true, isYou:true},
    {id:'t2', name:'Lin Jiahao', email:'lin@tdiworkspace.sg', role:'Design Director', dept:'Leadership', exp:'12 yrs', photo:'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&q=70', visible:true},
    {id:'t3', name:'James Koh', email:'james@tdiworkspace.sg', role:'Director of Delivery', dept:'Leadership', exp:'14 yrs', photo:'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=70', visible:true},
    {id:'t4', name:'Rachel Lim', email:'rachel@tdiworkspace.sg', role:'Senior Interior Designer', dept:'Studio', exp:'8 yrs', photo:'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=160&q=70', visible:true},
    {id:'t5', name:'Marcus Yeo', email:'marcus@tdiworkspace.sg', role:'Senior Project Manager', dept:'Delivery', exp:'7 yrs', photo:'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=70', visible:true},
    {id:'t6', name:'Aiko Tanaka', email:'aiko@tdiworkspace.sg', role:'Interior Designer', dept:'Studio', exp:'5 yrs', photo:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=70', visible:true},
    {id:'t7', name:'Daniel Ong', email:'daniel@tdiworkspace.sg', role:'Workshop Lead', dept:'Workshop', exp:'10 yrs', photo:'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?auto=format&fit=crop&w=160&q=70', visible:false},
    {id:'t8', name:'Sarah Chen', email:'sarah@tdiworkspace.sg', role:'Junior Designer', dept:'Studio', exp:'3 yrs', photo:'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=160&q=70', visible:true},
    {id:'t9', name:'Kenneth Tay', email:'kenneth@tdiworkspace.sg', role:'M&E Coordinator', dept:'Delivery', exp:'9 yrs', photo:'https://images.unsplash.com/photo-1542178243-bc20204b769f?auto=format&fit=crop&w=160&q=70', visible:true}
  ],

  inquiries: [
    {id:'i1', client:'Aurelia Mok', company:'Helios Capital', email:'aurelia.mok@helios.capital', phone:'+65 9123 4567', type:'Office · Design & Build', size:'6,400 sqft', address:'9 Battery Road, Singapore 049910', completion:'Nov 2026', budget:'$80 – 150k', styles:['Modern Minimalist','Corporate Luxury'], goals:"We're relocating our APAC investment team from a sub‑let space at OUE Bayfront into a Battery Road tenancy. The new floor needs to support 38 staff (growing to 52), include a four‑seater client suite, and signal a step‑change from our scrappy current setup. We have a layout from the landlord's tenant rep but we're open.", files:[{name:'Layout_v3.pdf', size:'1.4 MB'},{name:'Brand_guidelines.pdf', size:'2.1 MB'},{name:'Existing_office.jpg', size:'380 KB'}], status:'new', assignee:'Lin J.', date:'21 May', dateFull:'21 May 2026, 14:08 SGT', ref:'TDI-2026-0421', reply:''},
    {id:'i2', client:'Devraj Kumar', company:'Anchorpoint F&B', email:'devraj@anchorpoint.com', phone:'+65 9234 5678', type:'F&B · 3,200 sqft', size:'3,200 sqft', address:'Tanjong Pagar, Singapore', completion:'Q4 2026', budget:'$150k +', styles:['Warm Hospitality','Industrial Contemporary'], goals:'Two-concept dining destination — casual ground floor with a private upper dining room.', files:[{name:'Plan.dwg', size:'2.8 MB'}], status:'replied', assignee:'James K.', date:'20 May', dateFull:'20 May 2026, 11:32 SGT', ref:'TDI-2026-0418', reply:'Hi Devraj — thanks for the brief. Booking a site walk Wednesday.'},
    {id:'i3', client:'Megan Tan', company:'Loom Studio', email:'megan@loomstudio.sg', phone:'+65 9345 6789', type:'Office · 2,100 sqft', size:'2,100 sqft', address:'Tiong Bahru, Singapore', completion:'Aug 2026', budget:'$30 – 80k', styles:['Modern Minimalist','Open Collaborative'], goals:'Refresh existing studio for a hybrid team of 18.', files:[], status:'scheduled', assignee:'Rachel L.', date:'19 May', dateFull:'19 May 2026, 16:22 SGT', ref:'TDI-2026-0415', reply:''},
    {id:'i4', client:'Hafiz Ibrahim', company:'Kava Coffee', email:'hafiz@kavacoffee.sg', phone:'+65 9456 7890', type:'Retail · 1,400 sqft', size:'1,400 sqft', address:'Bras Basah, Singapore', completion:'Sep 2026', budget:'$30 – 80k', styles:['Warm Hospitality'], goals:'Fourth Kava outlet — same identity, tighter footprint, faster build.', files:[{name:'Site_photos.zip', size:'24 MB'}], status:'new', assignee:'—', date:'18 May', dateFull:'18 May 2026, 09:15 SGT', ref:'TDI-2026-0412', reply:''},
    {id:'i5', client:'Lucas Wright', company:'Stratus Logistics', email:'lucas@stratus.com', phone:'+65 9567 8901', type:'Commercial · 18,000 sqft', size:'18,000 sqft', address:'Changi Business Park', completion:'Mar 2027', budget:'$150k +', styles:['Industrial Contemporary'], goals:'Operations control centre + client-facing offices in one tenancy.', files:[{name:'Brief.pdf', size:'1.2 MB'}], status:'replied', assignee:'James K.', date:'17 May', dateFull:'17 May 2026, 13:48 SGT', ref:'TDI-2026-0409', reply:'Hi Lucas — initial questions sent. Looking forward to the walk-through.'},
    {id:'i6', client:'Sofia Reyes', company:'Atelier Northpoint', email:'sofia@atelier-np.com', phone:'+65 9678 9012', type:'Showroom · 4,800 sqft', size:'4,800 sqft', address:'Orchard Road, Singapore', completion:'Dec 2026', budget:'$80 – 150k', styles:['Corporate Luxury','Modern Minimalist'], goals:'New ground-floor showroom for an architectural surfaces brand.', files:[], status:'scheduled', assignee:'Lin J.', date:'16 May', dateFull:'16 May 2026, 10:04 SGT', ref:'TDI-2026-0406', reply:''},
    {id:'i7', client:'Jeremy Lau', company:'Northwind Asia', email:'jeremy@northwind.asia', phone:'+65 9789 0123', type:'Office · 5,500 sqft', size:'5,500 sqft', address:'Marina One, Singapore', completion:'Feb 2027', budget:'$80 – 150k', styles:['Open Collaborative'], goals:'Reconfigure existing floor to add 12 desks and three meeting rooms.', files:[], status:'new', assignee:'—', date:'15 May', dateFull:'15 May 2026, 17:22 SGT', ref:'TDI-2026-0403', reply:''},
    {id:'i8', client:'Naomi Chua', company:'Verdant Healthcare', email:'naomi@verdant.health', phone:'+65 9890 1234', type:'Clinic · 3,900 sqft', size:'3,900 sqft', address:'Novena Medical Centre', completion:'Oct 2026', budget:'$150k +', styles:['Warm Hospitality','Modern Minimalist'], goals:'Specialist clinic that feels like hospitality — see-and-treat workflow.', files:[], status:'replied', assignee:'Aiko T.', date:'14 May', dateFull:'14 May 2026, 12:11 SGT', ref:'TDI-2026-0400', reply:'Hi Naomi — sample HSA-compliant projects shared, scheduling discovery call.'},
    {id:'i9', client:'Aaron Sim', company:'Stratford & Co.', email:'aaron@stratford.co', phone:'+65 9901 2345', type:'Boutique retail · 1,100 sqft', size:'1,100 sqft', address:'Holland Village', completion:'Sep 2026', budget:'$30 – 80k', styles:['Corporate Luxury'], goals:'Heritage-tone boutique for a leather-goods label launching in Singapore.', files:[], status:'new', assignee:'—', date:'13 May', dateFull:'13 May 2026, 15:50 SGT', ref:'TDI-2026-0397', reply:''}
  ],

  homepage: {
    eyebrow: 'Commercial Interior Specialists · Est. 2003',
    headline: 'Designing workspaces that inspire performance.',
    subheadline: 'TDI Workspace transforms commercial spaces into functional, elegant environments that elevate productivity, brand identity, and human experience.',
    ctaPrimaryLabel: 'View Projects',
    ctaPrimaryLink: '/projects',
    ctaSecondaryLabel: 'Start Your Project',
    ctaSecondaryLink: '/inquiry',
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=70',
    aboutHeadline: 'Built on precision. Driven by experience.',
    aboutP1: 'For over two decades, TDI Workspace has delivered commercial interior environments across Singapore — combining strategic planning, practical execution, and design excellence.',
    aboutP2: 'From corporate offices and retail environments to F&B concepts and bespoke commercial spaces, we create interiors that work beautifully and perform flawlessly.',
    stats: [
      {value:'20+', label:'Years of practice'},
      {value:'300+', label:'Completed projects'},
      {value:'98%', label:'On‑time delivery'},
      {value:'A→Z', label:'End‑to‑end project management'}
    ],
    featuredIds: ['p1','p2','p3','p4','p5','p6']
  },

  pages: [
    {id:'pg1', name:'Home', path:'/', lastEdited:'2d ago', editor:'Zhang Y.', status:'published', body:'Hero, About snapshot, Services, Featured projects, Why TDI, Testimonial, CTA.'},
    {id:'pg2', name:'About', path:'/about', lastEdited:'5d ago', editor:'Lin J.', status:'published', body:''},
    {id:'pg3', name:'Projects', path:'/projects', lastEdited:'Auto-generated', editor:'System', status:'published', body:'Renders from Projects collection.'},
    {id:'pg4', name:'Team', path:'/team', lastEdited:'Auto-generated', editor:'System', status:'published', body:'Renders from Team Members collection.'},
    {id:'pg5', name:'Start Your Project', path:'/inquiry', lastEdited:'9d ago', editor:'Zhang Y.', status:'published', body:''},
    {id:'pg6', name:'Contact', path:'/contact', lastEdited:'9d ago', editor:'Zhang Y.', status:'published', body:''},
    {id:'pg7', name:'Careers', path:'/careers', lastEdited:'14d ago', editor:'Aiko T.', status:'draft', body:''},
    {id:'pg8', name:'Privacy Policy', path:'/privacy', lastEdited:'2 mo ago', editor:'Zhang Y.', status:'published', body:''},
    {id:'pg9', name:'Terms of Service', path:'/terms', lastEdited:'2 mo ago', editor:'Zhang Y.', status:'published', body:''}
  ],

  aboutPage: {
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
    license: 'L4 General Builder',
    instagram: '@tdiworkspace',
    linkedin: 'linkedin.com/company/tdi-workspace',
    gbp: 'g.co/tdiworkspace',
    notifyEmails: 'inquiries@tdiworkspace.sg, zhang@tdiworkspace.sg'
  },

  media: [
    {id:'m1', name:'apac-hq-01.jpg', size:'2.4 MB', kind:'projects', url:'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=400&q=70'},
    {id:'m2', name:'collab-hero.jpg', size:'1.8 MB', kind:'projects', url:'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=70'},
    {id:'m3', name:'collab-02.jpg', size:'2.1 MB', kind:'projects', url:'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=400&q=70'},
    {id:'m4', name:'retail-flagship.jpg', size:'1.9 MB', kind:'projects', url:'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=400&q=70'},
    {id:'m5', name:'fnb-dining.jpg', size:'2.3 MB', kind:'projects', url:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=70'},
    {id:'m6', name:'tech-office.jpg', size:'2.0 MB', kind:'projects', url:'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=70'},
    {id:'m7', name:'cafe-roastery.jpg', size:'1.6 MB', kind:'projects', url:'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=70'},
    {id:'m8', name:'reception.jpg', size:'1.7 MB', kind:'projects', url:'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=400&q=70'},
    {id:'m9', name:'boardroom.jpg', size:'2.2 MB', kind:'projects', url:'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=400&q=70'},
    {id:'m10', name:'materials.jpg', size:'1.5 MB', kind:'brand', url:'https://images.unsplash.com/photo-1583845112203-29329902332e?auto=format&fit=crop&w=400&q=70'},
    {id:'m11', name:'shophouse.jpg', size:'1.9 MB', kind:'projects', url:'https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3?auto=format&fit=crop&w=400&q=70'},
    {id:'m12', name:'hybrid-workspace.jpg', size:'2.1 MB', kind:'projects', url:'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?auto=format&fit=crop&w=400&q=70'},
    {id:'m13', name:'clinic-waiting.jpg', size:'1.8 MB', kind:'projects', url:'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=400&q=70'},
    {id:'m14', name:'fnb-bar.jpg', size:'2.0 MB', kind:'projects', url:'https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=400&q=70'},
    {id:'m15', name:'fnb-counter.jpg', size:'1.6 MB', kind:'projects', url:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=70'},
    {id:'m16', name:'portrait-zhang.jpg', size:'820 KB', kind:'team', url:'assets/zhang-yaosheng.jpg'}
  ],

  seo: {
    metaTitle: 'TDI Workspace — Commercial Interior Design Singapore',
    metaDesc: 'TDI Workspace transforms commercial interiors across Singapore — offices, retail, F&B and bespoke spaces — with strategic design and precision delivery.',
    ogTitle: 'Designing Workspaces That Inspire Performance',
    canonical: 'https://tdiworkspace.sg/',
    ogImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=70'
  },

  admins: [
    {id:'a1', name:'Zhang Yaosheng', email:'zhang@tdiworkspace.sg', role:'Founder · Administrator · Owner', lastActive:'Now', photo:'assets/zhang-yaosheng.jpg'},
    {id:'a2', name:'Lin Jiahao', email:'lin@tdiworkspace.sg', role:'Editor', lastActive:'5h ago', photo:'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&q=70'},
    {id:'a3', name:'Marcus Yeo', email:'marcus@tdiworkspace.sg', role:'Editor · Projects only', lastActive:'Yesterday', photo:'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=70'}
  ],

  settings: {
    maintenance: false,
    cookieBanner: true,
    whatsappFloat: true,
    timezone: 'Asia/Singapore (UTC+8)',
    ga4: true,
    imageLazyLoad: true,
    notifyWA: true,
    autoReply: true,
    weeklyDigest: false
  },

  activity: [
    {who:'Lin J.', action:'published', what:'Boutique Retail Experience', when:'2h'},
    {who:'James K.', action:'updated programme on', what:'APAC HQ Transformation', when:'5h'},
    {who:'Marcus Y.', action:'uploaded 12 photos to', what:'Hybrid Workspace', when:'Yest.'},
    {who:'Zhang Y.', action:'edited the homepage hero copy', what:'', when:'2d'},
    {who:'Aiko T.', action:'added new team member', what:'Kenneth Tay', when:'3d'},
    {who:'Rachel L.', action:'archived 4 expired homepage features', what:'', when:'4d'}
  ],

  // Pulled from journal-data.js seed at runtime so a single edit-point keeps
  // the journal pages and the admin in lockstep.
  articles: (window.TDIJournal && window.TDIJournal.SEED_ARTICLES) ? JSON.parse(JSON.stringify(window.TDIJournal.SEED_ARTICLES)) : []
};

// =============================================================
//   STORE
// =============================================================
function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

function loadData() {
  try {
    const s = localStorage.getItem(KEY);
    if (s) {
      const parsed = JSON.parse(s);
      const base = deepClone(SEED);
      Object.keys(parsed).forEach(k => { base[k] = parsed[k]; });
      return base;
    }
  } catch (e) {}
  return deepClone(SEED);
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(DATA)); }
  catch (e) { toast('Could not save — storage full.', 'err'); }
  scheduleContentPush();
}

// =============================================================
//   FIRESTORE CONTENT SYNC  (admin writes → public site reads)
// =============================================================
// One source of truth lives in Firestore (collection `content`, via
// tdi-store.js). The admin pulls it on login and pushes it on every save,
// so changes here show up on the live public website.
let _contentPushTimer = null;
let _contentSyncReady = false; // gate: don't push during the initial load

function scheduleContentPush() {
  if (!_contentSyncReady) return;
  if (!(window.TDIStore && window.TDIFire && TDIFire.db)) return;
  clearTimeout(_contentPushTimer);
  _contentPushTimer = setTimeout(pushAllContent, 500);
}

function contentSnapshot() {
  return {
    team:     { members: DATA.team },
    projects: { items: DATA.projects },
    homepage: DATA.homepage,
    about:    DATA.aboutPage,
    contact:  DATA.contact,
    settings: DATA.settings,
    journal:  { items: DATA.articles }
  };
}

function pushAllContent() {
  if (!(window.TDIStore && window.TDIFire && TDIFire.db)) return;
  const snap = contentSnapshot();
  Object.keys(snap).forEach(function (k) { TDIStore.save(k, snap[k]); });
}

function applyStoreToData() {
  const c = window.TDIStore && TDIStore.cache;
  if (!c) return;
  if (c.team && Array.isArray(c.team.members)) DATA.team = c.team.members;
  if (c.projects && Array.isArray(c.projects.items)) DATA.projects = c.projects.items;
  if (c.homepage) DATA.homepage = Object.assign({}, DATA.homepage, c.homepage);
  if (c.about) DATA.aboutPage = Object.assign({}, DATA.aboutPage, c.about);
  if (c.contact) DATA.contact = Object.assign({}, DATA.contact, c.contact);
  if (c.settings) DATA.settings = Object.assign({}, DATA.settings, c.settings);
  if (c.journal && Array.isArray(c.journal.items) && c.journal.items.length) DATA.articles = c.journal.items;
}

function seedMissingContent() {
  if (!(window.TDIStore && window.TDIFire && TDIFire.db)) return;
  const snap = contentSnapshot();
  TDIStore.KEYS.forEach(function (k) {
    if (!TDIStore.existed[k]) TDIStore.save(k, snap[k]);
  });
}

let DATA = loadData();
let currentInquiryId = DATA.inquiries[0]?.id;
let currentPageId = 'pg2';
let projectFilter = 'all';
let inquiryFilter = 'all';
let teamFilter = 'all';
let mediaFilter = 'all';
let journalFilter = 'all';
let searchQuery = '';

// =============================================================
//   HELPERS
// =============================================================
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const uid = (prefix='x') => prefix + Math.random().toString(36).slice(2, 9);
function escape(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
function statusTag(status) {
  if (status === 'new') return '<span class="tag tag--new">New</span>';
  if (status === 'replied') return '<span class="tag tag--warn">Replied</span>';
  if (status === 'scheduled') return '<span class="tag tag--ok">Scheduled</span>';
  if (status === 'published') return '<span class="tag tag--ok">Published</span>';
  if (status === 'draft') return '<span class="tag tag--warn">Draft</span>';
  return `<span class="tag">${escape(cap(status))}</span>`;
}

// =============================================================
//   TOAST
// =============================================================
function toast(msg, kind='ok') {
  const el = document.createElement('div');
  el.className = 'toast' + (kind === 'err' ? ' toast--err' : '');
  el.innerHTML = `<span class="tk">${kind === 'err' ? '!' : '✓'}</span><span>${escape(msg)}</span>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('in'));
  setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 300); }, 2600);
}

// =============================================================
//   ACTIVITY LOG
// =============================================================
function logActivity(action, what='') {
  const parts = DATA.user.name.split(' ');
  const who = parts[0] + ' ' + (parts[1] ? parts[1][0] + '.' : '');
  DATA.activity.unshift({ who, action, what, when: 'just now' });
  if (DATA.activity.length > 12) DATA.activity.length = 12;
  persist();
  if ($('#dash-activity')) renderDashboard();
}

// =============================================================
//   MODAL
// =============================================================
function modal(opts) {
  const back = document.createElement('div');
  back.className = 'modal2-back';
  back.innerHTML = `
    <div class="modal2 ${opts.wide ? 'modal2--wide' : ''}">
      <div class="modal2__head">
        <h3>${escape(opts.title)}</h3>
        <button class="modal2__close" aria-label="Close" type="button">×</button>
      </div>
      <form class="modal2__body" id="m2-form" autocomplete="off"></form>
      <div class="modal2__foot">
        ${opts.onDelete ? `<button type="button" class="btn btn--ghost btn--danger" data-act="delete">${escape(opts.deleteLabel || 'Delete')}</button>` : ''}
        <div style="flex:1;"></div>
        <button type="button" class="btn btn--ghost" data-act="cancel">Cancel</button>
        ${opts.onSubmit ? `<button type="button" class="btn btn--dark" data-act="submit">${escape(opts.submitLabel || 'Save')}</button>` : ''}
      </div>
    </div>`;
  const form = back.querySelector('#m2-form');
  if (opts.html) form.innerHTML = opts.html;
  if (opts.fields) form.innerHTML = renderFields(opts.fields);

  const close = () => { back.classList.remove('in'); setTimeout(() => back.remove(), 200); };

  back.addEventListener('click', (e) => {
    if (e.target === back || e.target.closest('.modal2__close')) return close();
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'cancel') return close();
    if (act === 'submit') {
      const values = readForm(form, opts.fields || []);
      const res = opts.onSubmit ? opts.onSubmit(values, { close }) : true;
      if (res !== false) close();
    }
    if (act === 'delete') {
      if (confirm('Delete this item? This cannot be undone.')) { opts.onDelete(); close(); }
    }
  });

  document.body.appendChild(back);
  requestAnimationFrame(() => back.classList.add('in'));
  setTimeout(() => form.querySelector('input,textarea,select')?.focus(), 80);
  return { close, root: back };
}

function renderFields(fields) {
  let out = '';
  let i = 0;
  while (i < fields.length) {
    const f = fields[i];
    if (f.section) {
      out += `<h5 class="m2-section">${escape(f.section)}</h5>`;
      i++; continue;
    }
    if (f.half) {
      // collect run of halves
      let row = '<div class="m2-grid">';
      while (i < fields.length && fields[i].half) {
        row += renderOneField(fields[i]);
        i++;
      }
      row += '</div>';
      out += row;
    } else {
      out += renderOneField(f);
      i++;
    }
  }
  return out;
}

function renderOneField(f) {
  if (f.type === 'textarea') {
    return `<label class="m2-field"><span>${escape(f.label)}</span><textarea name="${f.name}" ${f.placeholder ? `placeholder="${escape(f.placeholder)}"` : ''}>${escape(f.value ?? '')}</textarea></label>`;
  }
  if (f.type === 'select') {
    return `<label class="m2-field"><span>${escape(f.label)}</span><select name="${f.name}">${(f.options||[]).map(o => `<option value="${escape(o.value)}" ${o.value == f.value ? 'selected' : ''}>${escape(o.label)}</option>`).join('')}</select></label>`;
  }
  if (f.type === 'checkbox') {
    return `<label class="m2-field m2-field--row"><input type="checkbox" name="${f.name}" ${f.value ? 'checked' : ''}><span>${escape(f.label)}</span></label>`;
  }
  if (f.type === 'multicheck') {
    return `<div class="m2-field"><span>${escape(f.label)}</span><div class="m2-chips">${(f.options||[]).map(o => {
      const checked = (f.value || []).includes(o.value);
      return `<label class="m2-chip ${checked?'is-on':''}"><input type="checkbox" name="${f.name}" value="${escape(o.value)}" ${checked?'checked':''}><span>${escape(o.label)}</span></label>`;
    }).join('')}</div></div>`;
  }
  if (f.type === 'image') {
    return `<div class="m2-field"><span>${escape(f.label)}</span>
      <div class="m2-image">
        <img src="${escape(f.value || '')}" alt="" onerror="this.style.display='none'">
        <div><input type="text" name="${f.name}" value="${escape(f.value ?? '')}" placeholder="https://… or assets/file.jpg"><div style="display:flex; gap:8px; margin-top:8px;"><button type="button" class="btn btn--ghost" style="padding:6px 12px; font-size:12px;" data-pick-media="${f.name}">Pick from library</button></div></div>
      </div></div>`;
  }
  const t = f.type || 'text';
  return `<label class="m2-field"><span>${escape(f.label)}</span><input type="${t}" name="${f.name}" value="${escape(f.value ?? '')}" ${f.placeholder ? `placeholder="${escape(f.placeholder)}"` : ''}></label>`;
}

function readForm(form, fields) {
  const v = {};
  for (const f of fields) {
    if (f.section) continue;
    if (f.type === 'checkbox') {
      v[f.name] = !!form.querySelector(`[name="${f.name}"]`)?.checked;
    } else if (f.type === 'multicheck') {
      v[f.name] = $$(`[name="${f.name}"]:checked`, form).map(i => i.value);
    } else {
      const el = form.querySelector(`[name="${f.name}"]`);
      v[f.name] = el ? el.value : '';
    }
  }
  return v;
}

// Bind chip toggle visual + image-picker pickers
document.addEventListener('change', (e) => {
  const chip = e.target.closest('.m2-chip');
  if (chip) chip.classList.toggle('is-on', e.target.checked);
});
document.addEventListener('click', (e) => {
  const pick = e.target.closest('[data-pick-media]');
  if (!pick) return;
  e.preventDefault();
  const fieldName = pick.dataset.pickMedia;
  pickFromLibrary((url) => {
    const root = pick.closest('.m2-field');
    root.querySelector(`input[name="${fieldName}"]`).value = url;
    const img = root.querySelector('img');
    img.src = url; img.style.display = '';
  });
});

function pickFromLibrary(onPick) {
  const html = `<div class="m2-lib">${DATA.media.map(m => `
    <button type="button" class="m2-lib-tile" data-url="${escape(m.url)}">
      <img src="${escape(m.url)}" alt=""><span>${escape(m.name)}</span>
    </button>`).join('')}</div>`;
  const m = modal({ title: 'Pick from media library', html, wide: true });
  m.root.querySelector('.m2-lib').addEventListener('click', (e) => {
    const t = e.target.closest('.m2-lib-tile');
    if (t) { onPick(t.dataset.url); m.close(); }
  });
}

// =============================================================
//   LOGIN  (Firebase Authentication)
// =============================================================
function isSignedIn() {
  return !!(window.TDIFire && TDIFire.auth && TDIFire.auth.currentUser);
}

function failLogin(overlay, msg) {
  const inputs = overlay.querySelectorAll('input');
  if (inputs[1]) { inputs[1].value = ''; inputs[1].focus(); }
  const card = overlay.querySelector('.login__card');
  if (card) { card.classList.add('shake'); setTimeout(() => card.classList.remove('shake'), 500); }
  toast(msg, 'err');
}

function signIn() {
  const overlay = $('#loginOverlay');
  const inputs = overlay.querySelectorAll('input');
  const email = (inputs[0].value || '').trim();
  const pwd = inputs[1].value;
  const auth = window.TDIFire && TDIFire.auth;

  if (!auth) { toast('Auth not ready — see FIREBASE_SETUP.md / firebase-config.js.', 'err'); return; }
  if (!email || !pwd) { failLogin(overlay, 'Enter your email and password.'); return; }

  const btn = overlay.querySelector('[data-act="signin"]');
  if (btn) { btn.disabled = true; btn.style.opacity = '0.6'; }

  auth.signInWithEmailAndPassword(email, pwd)
    .then(() => { /* onAuthStateChanged reveals the dashboard */ })
    .catch((err) => {
      const code = err.code || '';
      const msg = /user-not-found|wrong-password|invalid-credential|invalid-email/.test(code)
        ? 'Email or password is incorrect.'
        : /api-key|configuration/.test(code)
          ? 'Firebase not configured yet — fill in firebase-config.js.'
          : (err.message || 'Sign-in failed.');
      failLogin(overlay, msg);
    })
    .finally(() => { if (btn) { btn.disabled = false; btn.style.opacity = ''; } });
}

function signOut() {
  if (!confirm('Sign out of TDI admin?')) return;
  const auth = window.TDIFire && TDIFire.auth;
  if (auth) auth.signOut();
}

function setupLogin() {
  const overlay = $('#loginOverlay');
  overlay.querySelector('[data-act="signin"]')?.addEventListener('click', signIn);
  overlay.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); signIn(); } });

  const auth = window.TDIFire && TDIFire.auth;
  if (!auth) {
    overlay.classList.remove('is-hidden');
    toast('Firebase not loaded — see FIREBASE_SETUP.md.', 'err');
    return;
  }

  auth.onAuthStateChanged((user) => {
    if (user) {
      overlay.classList.add('is-hidden');
      DATA.user.email = user.email || DATA.user.email;
      if (user.displayName) DATA.user.name = user.displayName;
      toast('Welcome back, ' + DATA.user.name.split(' ')[0] + '.');
      startInquirySync();
      // Pull shared content from Firestore, seed anything missing, then render.
      const afterLoad = function () {
        applyStoreToData();
        seedMissingContent();
        _contentSyncReady = true;
        renderAll();
        logActivity('signed in');
      };
      if (window.TDIStore && TDIStore.fetchAll) {
        TDIStore.fetchAll().then(afterLoad).catch(afterLoad);
      } else {
        _contentSyncReady = true;
        renderAll();
        logActivity('signed in');
      }
    } else {
      overlay.classList.remove('is-hidden');
      stopInquirySync();
    }
  });
}

// =============================================================
//   INQUIRIES — live sync with Firestore
// =============================================================
let _inqUnsub = null;

function startInquirySync() {
  const db = window.TDIFire && TDIFire.db;
  if (!db || _inqUnsub) return;
  _inqUnsub = db.collection('inquiries').orderBy('createdAt', 'desc').onSnapshot(
    (snap) => {
      DATA.inquiries = snap.docs.map((doc) => {
        const x = doc.data() || {};
        const ts = x.createdAt && x.createdAt.toDate ? x.createdAt.toDate() : null;
        return Object.assign(
          { client: '', company: '', email: '', phone: '', type: '', size: '',
            address: '', completion: '', budget: '', styles: [], goals: '',
            files: [], status: 'new', assignee: '\u2014', reply: '', ref: '' },
          x,
          { id: doc.id,
            date: ts ? ts.toLocaleDateString('en-SG', { day: '2-digit', month: 'short' }) : (x.date || ''),
            dateFull: ts ? ts.toLocaleString('en-SG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' SGT' : (x.dateFull || '') }
        );
      });
      if (!DATA.inquiries.find((i) => i.id === currentInquiryId)) {
        currentInquiryId = DATA.inquiries[0] ? DATA.inquiries[0].id : null;
      }
      if ($('#inq-list')) renderInquiries();
      if ($('#dash-inquiries')) renderDashboard();
    },
    (err) => {
      console.error('[TDI] Inquiry sync error:', err);
      toast('Could not load inquiries from the database.', 'err');
    }
  );
}

function stopInquirySync() {
  if (_inqUnsub) { _inqUnsub(); _inqUnsub = null; }
}

// Write-backs: update Firestore when connected, else fall back to localStorage.
function inquiryDocRef(id) {
  const db = window.TDIFire && TDIFire.db;
  return (db && id) ? db.collection('inquiries').doc(id) : null;
}

function saveInquiry(i, patch) {
  Object.assign(i, patch);
  const ref = inquiryDocRef(i.id);
  if (ref) ref.update(patch).catch((e) => { console.error(e); toast('Save failed — check connection.', 'err'); });
  else persist();
}

function removeInquiry(id) {
  const ref = inquiryDocRef(id);
  if (ref) ref.delete().catch((e) => { console.error(e); toast('Delete failed — check connection.', 'err'); });
  else { DATA.inquiries = DATA.inquiries.filter((x) => x.id !== id); persist(); }
}

// =============================================================
//   TABS
// =============================================================
function showTab(id) {
  $$('.tabview').forEach(t => t.classList.toggle('is-active', t.id === 'tab-' + id));
  $$('#adminNav a').forEach(a => a.classList.toggle('is-active', a.dataset.tab === id));
  $('.admin__main')?.scrollTo({top: 0});
  window.scrollTo({top: 0});
}

function setupTabs() {
  $('#adminNav').addEventListener('click', (e) => {
    const a = e.target.closest('a[data-tab]'); if (!a) return;
    e.preventDefault();
    history.replaceState(null, '', '#' + a.dataset.tab);
    showTab(a.dataset.tab);
  });
  document.addEventListener('click', (e) => {
    const j = e.target.closest('[data-tab-jump]'); if (!j) return;
    e.preventDefault();
    history.replaceState(null, '', '#' + j.dataset.tabJump);
    showTab(j.dataset.tabJump);
  });
  const initial = (location.hash || '#dashboard').slice(1);
  if (document.getElementById('tab-' + initial)) showTab(initial);
}

// =============================================================
//   RENDER — USER HEADER
// =============================================================
function renderUserHeader() {
  const av = $('#user-avatar');
  if (av) av.style.backgroundImage = `url("${DATA.user.avatar}")`;
  if ($('#user-name')) $('#user-name').textContent = DATA.user.name;
  if ($('#user-title')) $('#user-title').textContent = DATA.user.title;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  if ($('#dash-greeting')) $('#dash-greeting').textContent = `${greet}, ${DATA.user.name.split(' ')[0]}.`;
  // Nav counters
  if ($('#nav-cnt-projects')) $('#nav-cnt-projects').textContent = DATA.projects.length;
  if ($('#nav-cnt-team')) $('#nav-cnt-team').textContent = DATA.team.length;
  const newInq = DATA.inquiries.filter(i => i.status === 'new').length;
  if ($('#nav-cnt-inq')) $('#nav-cnt-inq').textContent = newInq + ' new';
  if ($('#nav-cnt-media')) $('#nav-cnt-media').textContent = DATA.media.length;
  if ($('#nav-cnt-journal')) $('#nav-cnt-journal').textContent = (DATA.articles || []).length;
}

// =============================================================
//   RENDER — DASHBOARD
// =============================================================
function renderDashboard() {
  $('#kpi-inquiries').textContent = DATA.inquiries.filter(i => i.status === 'new').length;
  $('#kpi-projects').textContent = DATA.projects.length;
  $('#kpi-team').textContent = DATA.team.length;
  $('#kpi-open').textContent = DATA.projects.filter(p => p.status === 'draft' || p.completion < 100).length;

  $('#dash-inquiries').innerHTML = DATA.inquiries.slice(0, 5).map(i => `
    <tr data-iid="${i.id}" data-action="jump-inquiry" style="cursor:pointer;">
      <td><div style="font-weight:500;">${escape(i.client)}</div><div style="color:var(--muted); font-size:12px;">${escape(i.company)} · ${escape(i.date)}</div></td>
      <td>${escape(i.type)}</td>
      <td>${escape(i.budget)}</td>
      <td>${statusTag(i.status)}</td>
      <td>${i.files[0] ? escape(i.files[0].name) : '—'}</td>
      <td><button class="icon-btn" title="View">↗</button></td>
    </tr>`).join('');

  $('#dash-activity').innerHTML = DATA.activity.slice(0, 6).map(a => `
    <li><span class="dot"></span><span><strong>${escape(a.who)}</strong> ${escape(a.action)}${a.what ? ' <em>' + escape(a.what) + '</em>' : ''}.</span><time>${escape(a.when)}</time></li>`).join('');
}

// =============================================================
//   RENDER — PROJECTS
// =============================================================
function renderProjects() {
  $('#kpi-proj-total').textContent = DATA.projects.length;
  $('#kpi-proj-pub').textContent = DATA.projects.filter(p => p.status === 'published').length;
  $('#kpi-proj-draft').textContent = DATA.projects.filter(p => p.status === 'draft').length;
  $('#kpi-proj-feat').textContent = DATA.projects.filter(p => p.featured).length;

  const filtered = DATA.projects.filter(p => {
    if (projectFilter === 'featured') return p.featured;
    if (projectFilter === 'draft') return p.status === 'draft';
    if (projectFilter === 'office') return /Office/i.test(p.category);
    if (projectFilter === 'retail') return /Retail/i.test(p.category);
    if (projectFilter === 'fnb') return /F&B/i.test(p.category);
    return true;
  }).filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery));

  $('#projects-tbody').innerHTML = filtered.map(p => `
    <tr data-pid="${p.id}">
      <td><img class="thumb" src="${escape(p.thumb)}" alt=""></td>
      <td><strong>${escape(p.name)}</strong><br><small style="color:var(--muted);">${escape(p.slug)}</small></td>
      <td>${escape(p.category)}</td>
      <td>${p.year} · ${escape(p.size)}</td>
      <td>${p.featured ? '★ Featured' : '—'}</td>
      <td>${statusTag(p.status)}</td>
      <td><div class="progress-cell"><div class="bar"><span style="width:${p.completion}%;"></span></div><span class="pct">${p.completion}%</span></div></td>
      <td>
        <button class="icon-btn" data-action="edit-project" title="Edit">✎</button>
        <button class="icon-btn" data-action="duplicate-project" title="Duplicate">⤓</button>
        <button class="icon-btn" data-action="delete-project" title="Delete">⌫</button>
      </td>
    </tr>`).join('') || `<tr><td colspan="8" class="empty-row">No projects match this filter.</td></tr>`;
}

function openProjectModal(p) {
  const isNew = !p;
  const project = p || { id: uid('p'), name:'', slug:'/projects/', category:'Office · Design & Build', year: new Date().getFullYear(), size:'', industry:'', featured:false, status:'draft', completion:0, thumb:'' };
  modal({
    title: isNew ? 'New Project' : `Edit · ${project.name}`,
    wide: true,
    fields: [
      { type:'image', name:'thumb', label:'Cover Image', value: project.thumb },
      { type:'text', name:'name', label:'Project Name', value: project.name, half: true },
      { type:'text', name:'slug', label:'URL Slug', value: project.slug, half: true },
      { type:'select', name:'category', label:'Category', value: project.category, half: true, options: [
        {value:'Office · Design & Build', label:'Office · Design & Build'},
        {value:'Office', label:'Office'},
        {value:'Office · Renovation', label:'Office · Renovation'},
        {value:'Retail · Design & Build', label:'Retail · Design & Build'},
        {value:'Retail', label:'Retail'},
        {value:'F&B · Design & Build', label:'F&B · Design & Build'},
        {value:'F&B · Renovation', label:'F&B · Renovation'},
        {value:'Commercial · Renovation', label:'Commercial · Renovation'},
        {value:'Commercial', label:'Commercial'}
      ]},
      { type:'text', name:'industry', label:'Client Industry', value: project.industry, half: true },
      { type:'number', name:'year', label:'Year', value: project.year, half: true },
      { type:'text', name:'size', label:'Floor Size', value: project.size, half: true },
      { type:'select', name:'status', label:'Status', value: project.status, half: true, options: [
        {value:'published', label:'Published'}, {value:'draft', label:'Draft'}
      ]},
      { type:'number', name:'completion', label:'Completion %', value: project.completion, half: true },
      { type:'checkbox', name:'featured', label:'Featured on homepage', value: project.featured }
    ],
    submitLabel: isNew ? 'Create Project' : 'Save Changes',
    onDelete: isNew ? null : () => {
      DATA.projects = DATA.projects.filter(x => x.id !== project.id);
      DATA.homepage.featuredIds = DATA.homepage.featuredIds.filter(id => id !== project.id);
      persist(); renderProjects(); renderHomepage(); renderDashboard();
      logActivity('deleted project', project.name);
      toast(`"${project.name}" deleted.`);
    },
    onSubmit: (v) => {
      project.name = v.name || 'Untitled';
      project.slug = v.slug || '/projects/' + project.id;
      project.category = v.category;
      project.industry = v.industry;
      project.year = parseInt(v.year) || project.year;
      project.size = v.size;
      project.status = v.status;
      project.completion = Math.max(0, Math.min(100, parseInt(v.completion) || 0));
      project.featured = v.featured;
      project.thumb = v.thumb || project.thumb;
      if (isNew) DATA.projects.unshift(project);
      persist(); renderProjects(); renderHomepage(); renderDashboard();
      logActivity(isNew ? 'created project' : 'edited project', project.name);
      toast(isNew ? 'Project created.' : 'Project saved.');
    }
  });
}

// =============================================================
//   RENDER — TEAM
// =============================================================
function renderTeam() {
  $('#kpi-team-total').textContent = DATA.team.length;
  $('#kpi-team-design').textContent = DATA.team.filter(t => /Design/i.test(t.role)).length;
  $('#kpi-team-delivery').textContent = DATA.team.filter(t => t.dept === 'Delivery' || /Director/.test(t.role)).length;
  $('#kpi-team-workshop').textContent = DATA.team.filter(t => t.dept === 'Workshop').length;

  const filtered = DATA.team.filter(t => {
    if (teamFilter === 'leadership') return t.dept === 'Leadership';
    if (teamFilter === 'studio') return t.dept === 'Studio';
    if (teamFilter === 'hidden') return !t.visible;
    return true;
  }).filter(t => !searchQuery || t.name.toLowerCase().includes(searchQuery));

  $('#team-tbody').innerHTML = filtered.map(t => `
    <tr data-tid="${t.id}">
      <td><img class="thumb avatar" src="${escape(t.photo)}" alt=""></td>
      <td><strong>${escape(t.name)}</strong><br><small style="color:var(--muted);">${escape(t.email)}</small></td>
      <td>${escape(t.role)}</td>
      <td>${escape(t.exp || '—')}</td>
      <td>${t.isYou ? '<span class="tag tag--ok">You · Visible</span>' : (t.visible ? '<span class="tag tag--ok">Visible</span>' : '<span class="tag tag--warn">Hidden</span>')}</td>
      <td>
        <button class="icon-btn" data-action="edit-team" title="Edit">✎</button>
        ${t.isYou ? '' : '<button class="icon-btn" data-action="delete-team" title="Delete">⌫</button>'}
      </td>
    </tr>`).join('');
}

function openTeamModal(t) {
  const isNew = !t;
  const m = t || { id: uid('t'), name:'', email:'', role:'Interior Designer', dept:'Studio', exp:'', photo:'', visible:true };
  modal({
    title: isNew ? 'Add Team Member' : `Edit · ${m.name}`,
    fields: [
      { type:'image', name:'photo', label:'Profile Photo', value: m.photo },
      { type:'text', name:'name', label:'Full Name', value: m.name, half: true },
      { type:'email', name:'email', label:'Email', value: m.email, half: true },
      { type:'text', name:'role', label:'Role / Title', value: m.role, half: true },
      { type:'select', name:'dept', label:'Department', value: m.dept, half: true, options: [
        {value:'Leadership', label:'Leadership'},
        {value:'Studio', label:'Studio'},
        {value:'Delivery', label:'Delivery'},
        {value:'Workshop', label:'Workshop'}
      ]},
      { type:'text', name:'exp', label:'Experience (e.g. 10 yrs)', value: m.exp, half: true },
      { type:'checkbox', name:'visible', label:'Visible on public team page', value: m.visible, half: true }
    ],
    submitLabel: isNew ? 'Add Member' : 'Save Changes',
    onDelete: isNew || m.isYou ? null : () => {
      DATA.team = DATA.team.filter(x => x.id !== m.id);
      persist(); renderTeam(); renderDashboard();
      logActivity('removed team member', m.name);
      toast(`${m.name} removed.`);
    },
    onSubmit: (v) => {
      m.name = v.name || 'Unnamed';
      m.email = v.email;
      m.role = v.role;
      m.dept = v.dept;
      m.exp = v.exp;
      m.visible = v.visible;
      m.photo = v.photo || m.photo;
      if (isNew) DATA.team.push(m);
      persist(); renderTeam(); renderDashboard();
      logActivity(isNew ? 'added team member' : 'edited team member', m.name);
      toast(isNew ? 'Member added.' : 'Member updated.');
    }
  });
}

// =============================================================
//   RENDER — INQUIRIES
// =============================================================
function renderInquiries() {
  $('#kpi-inq-unread').textContent = DATA.inquiries.filter(i => i.status === 'new').length;
  $('#kpi-inq-prog').textContent = DATA.inquiries.filter(i => i.status === 'replied' || i.status === 'scheduled').length;
  $('#kpi-inq-won').textContent = 3;
  $('#kpi-inq-resp').textContent = '6h';

  const filtered = DATA.inquiries.filter(i => {
    if (inquiryFilter === 'new') return i.status === 'new';
    if (inquiryFilter === 'replied') return i.status === 'replied';
    if (inquiryFilter === 'scheduled') return i.status === 'scheduled';
    return true;
  }).filter(i => !searchQuery || (i.client + ' ' + i.company).toLowerCase().includes(searchQuery));

  $('#inq-list').innerHTML = filtered.map(i => `
    <div class="inq-row ${i.id === currentInquiryId ? 'is-active' : ''}" data-iid="${i.id}" data-action="open-inquiry">
      <div class="head"><strong>${escape(i.client)} · ${escape(i.company)}</strong><time>${escape(i.date)}</time></div>
      <div class="sub">${escape(i.type)}</div>
      <div class="meta">${statusTag(i.status)}<span>${escape(i.budget)}</span>${i.files[0] ? `<span>${escape(i.files[0].name)}</span>` : ''}</div>
    </div>`).join('') || `<div style="padding:32px; text-align:center; color:var(--muted);">No inquiries match this filter.</div>`;

  renderInquiryDetail();
}

function renderInquiryDetail() {
  const i = DATA.inquiries.find(x => x.id === currentInquiryId);
  const detail = $('#inq-detail');
  if (!i) {
    detail.innerHTML = `<div style="padding: 60px 0; text-align:center; color:var(--muted);">Select an inquiry from the list.</div>`;
    return;
  }
  detail.innerHTML = `
    <div class="crumbs">Inquiry · ${escape(i.ref)} · ${escape(i.dateFull)}</div>
    <h3>${escape(i.client)} <span style="color:var(--muted);">— ${escape(i.company)}</span></h3>
    <div style="margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
      ${statusTag(i.status)}
      <span style="color:var(--muted); font-size: 13px;">Assigned to <strong style="color:var(--ink);" data-action="assign-inquiry">${escape(i.assignee)}</strong></span>
      <span style="color:var(--muted); font-size: 13px;">·</span>
      <span style="color:var(--muted); font-size: 13px;">Source: tdiworkspace.sg /inquiry</span>
    </div>
    <div class="grid">
      <div class="field-out"><div class="l">Email</div><div class="v">${escape(i.email)}</div></div>
      <div class="field-out"><div class="l">Phone</div><div class="v">${escape(i.phone)}</div></div>
      <div class="field-out"><div class="l">Project Type</div><div class="v">${escape(i.type)}</div></div>
      <div class="field-out"><div class="l">Size</div><div class="v">${escape(i.size)}</div></div>
      <div class="field-out"><div class="l">Address</div><div class="v">${escape(i.address)}</div></div>
      <div class="field-out"><div class="l">Target Completion</div><div class="v">${escape(i.completion)}</div></div>
      <div class="field-out"><div class="l">Budget Range</div><div class="v">${escape(i.budget)}</div></div>
      <div class="field-out"><div class="l">Style Preference</div><div class="v">${i.styles.map(escape).join(', ')}</div></div>
    </div>
    <div>
      <div class="l" style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted);">Project Goals</div>
      <p style="margin-top: 10px; color: var(--ink-2); font-size: 14.5px; line-height: 1.6;">${escape(i.goals)}</p>
    </div>
    <div style="margin-top: 22px;">
      <div class="l" style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px;">Attachments</div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        ${i.files.length ? i.files.map(f => `<span class="file-pill"><span aria-hidden="true">▤</span><a href="#" data-action="download-file">${escape(f.name)} · ${escape(f.size)}</a></span>`).join('') : '<span style="color:var(--muted); font-size: 13px;">No files attached.</span>'}
      </div>
    </div>
    <div class="reply">
      <div class="l" style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted);">Internal Reply</div>
      <textarea id="inq-reply" placeholder="Type your reply…">${escape(i.reply)}</textarea>
      <div style="display:flex; justify-content: space-between; align-items: center;">
        <div style="display:flex; gap: 8px;">
          <button class="btn btn--ghost" style="padding: 8px 14px; font-size: 12px;" data-action="mark-replied">${i.status === 'new' ? 'Mark as Replied' : 'Mark as New'}</button>
          <button class="btn btn--ghost" style="padding: 8px 14px; font-size: 12px;" data-action="assign-inquiry">Assign…</button>
          <button class="btn btn--ghost btn--danger" style="padding: 8px 14px; font-size: 12px;" data-action="delete-inquiry">Delete</button>
        </div>
        <button class="btn btn--dark" style="padding: 10px 18px; font-size: 13px;" data-action="send-reply">Send Reply <span class="arrow">→</span></button>
      </div>
    </div>`;
}

// =============================================================
//   RENDER — HOMEPAGE
// =============================================================
function renderHomepage() {
  if (!$('#home-form')) return;
  const h = DATA.homepage;
  const setVal = (id, v) => { const el = $(id); if (el) el.value = v ?? ''; };
  setVal('#home-eyebrow', h.eyebrow);
  setVal('#home-headline', h.headline);
  setVal('#home-sub', h.subheadline);
  setVal('#home-ctaA', h.ctaPrimaryLabel);
  setVal('#home-ctaA-link', h.ctaPrimaryLink);
  setVal('#home-ctaB', h.ctaSecondaryLabel);
  setVal('#home-ctaB-link', h.ctaSecondaryLink);
  const heroImg = $('#home-hero-img'); if (heroImg) heroImg.src = h.heroImage;
  setVal('#home-about-h', h.aboutHeadline);
  setVal('#home-about-p1', h.aboutP1);
  setVal('#home-about-p2', h.aboutP2);

  $('#home-stats').innerHTML = h.stats.map((s, idx) => `
    <div class="field--row" style="grid-template-columns: 1fr 2fr 40px; gap: 14px;" data-stat-idx="${idx}">
      <input value="${escape(s.value)}" data-stat-field="value" style="border:0; border-bottom:1px solid var(--line); font-family:'Instrument Serif', serif; font-size:24px;">
      <input value="${escape(s.label)}" data-stat-field="label">
      <button type="button" class="icon-btn" data-action="remove-stat" title="Remove">⌫</button>
    </div>`).join('');

  // Featured projects
  $('#home-featured').innerHTML = h.featuredIds.map((id, idx) => {
    const p = DATA.projects.find(x => x.id === id);
    if (!p) return '';
    return `<tr data-fid="${id}">
      <td><img class="thumb" src="${escape(p.thumb)}" alt=""></td>
      <td>${escape(p.name)}</td>
      <td>${idx + 1}</td>
      <td><div class="switch ${p.featured ? 'is-on' : ''}" data-action="toggle-featured" data-pid="${p.id}"></div></td>
      <td>
        <button class="icon-btn" data-action="featured-up" title="Move up">↑</button>
        <button class="icon-btn" data-action="featured-down" title="Move down">↓</button>
        <button class="icon-btn" data-action="featured-remove" title="Remove">⌫</button>
      </td>
    </tr>`;
  }).join('');
}

function saveHomepage() {
  const h = DATA.homepage;
  h.eyebrow = $('#home-eyebrow').value;
  h.headline = $('#home-headline').value;
  h.subheadline = $('#home-sub').value;
  h.ctaPrimaryLabel = $('#home-ctaA').value;
  h.ctaPrimaryLink = $('#home-ctaA-link').value;
  h.ctaSecondaryLabel = $('#home-ctaB').value;
  h.ctaSecondaryLink = $('#home-ctaB-link').value;
  h.aboutHeadline = $('#home-about-h').value;
  h.aboutP1 = $('#home-about-p1').value;
  h.aboutP2 = $('#home-about-p2').value;
  // Stats
  h.stats = $$('#home-stats > div').map(row => ({
    value: row.querySelector('[data-stat-field="value"]').value,
    label: row.querySelector('[data-stat-field="label"]').value
  }));
  persist();
  logActivity('saved homepage');
  toast('Homepage saved.');
}

// =============================================================
//   RENDER — PAGES
// =============================================================
function renderPages() {
  $('#pages-list').innerHTML = DATA.pages.map((p, idx) => `
    <div class="page-row" data-pgid="${p.id}">
      <div class="n">/ ${String(idx+1).padStart(2,'0')}</div>
      <div><strong>${escape(p.name)}</strong><br><small>${escape(p.path)}</small></div>
      <div><small>Last edited ${escape(p.lastEdited)} by ${escape(p.editor)}</small></div>
      <div>${statusTag(p.status)}</div>
      <div><button class="icon-btn" data-action="edit-page">✎ Edit</button></div>
    </div>`).join('');

  const cur = DATA.pages.find(p => p.id === currentPageId) || DATA.pages[1];
  if (cur && $('#pageeditor-title')) {
    $('#pageeditor-title').textContent = 'Editing: ' + cur.name + ' — ' + cur.path;
    const a = DATA.aboutPage;
    $('#pe-head').value = a.headline;
    $('#pe-intro').value = a.intro;
    $('#pe-mission').value = a.mission;
    $('#pe-vision').value = a.vision;
    $('#pe-closing').value = a.closing;
  }
}

function savePages() {
  const a = DATA.aboutPage;
  a.headline = $('#pe-head').value;
  a.intro = $('#pe-intro').value;
  a.mission = $('#pe-mission').value;
  a.vision = $('#pe-vision').value;
  a.closing = $('#pe-closing').value;
  const cur = DATA.pages.find(p => p.id === currentPageId);
  if (cur) { cur.lastEdited = 'just now'; cur.editor = DATA.user.name.split(' ').map((n,i) => i ? n[0]+'.' : n).join(' '); }
  persist();
  renderPages();
  logActivity('edited page', cur ? cur.name : '');
  toast('Page saved.');
}

function openPageModal(p) {
  modal({
    title: 'Page · ' + p.name,
    fields: [
      { type:'text', name:'name', label:'Page Name', value: p.name, half: true },
      { type:'text', name:'path', label:'URL Path', value: p.path, half: true },
      { type:'select', name:'status', label:'Status', value: p.status, options: [{value:'published',label:'Published'},{value:'draft',label:'Draft'}] },
      { type:'textarea', name:'body', label:'Body Notes', value: p.body }
    ],
    submitLabel: 'Save',
    onSubmit: (v) => {
      p.name = v.name; p.path = v.path; p.status = v.status; p.body = v.body;
      p.lastEdited = 'just now';
      p.editor = DATA.user.name.split(' ').map((n,i) => i ? n[0]+'.' : n).join(' ');
      persist(); renderPages();
      logActivity('edited page', p.name);
      toast('Page saved.');
    }
  });
}

// =============================================================
//   RENDER — CONTACT
// =============================================================
function renderContact() {
  if (!$('#c-phone')) return;
  const c = DATA.contact;
  const map = {
    '#c-phone':'phone', '#c-email':'email', '#c-wa':'whatsapp', '#c-wa-msg':'waMessage',
    '#c-address':'address', '#c-hours':'hours',
    '#c-entity':'entity', '#c-uen':'uen', '#c-license':'license',
    '#c-ig':'instagram', '#c-li':'linkedin', '#c-gbp':'gbp',
    '#c-notify':'notifyEmails'
  };
  Object.entries(map).forEach(([sel, key]) => { const el = $(sel); if (el) el.value = c[key] ?? ''; });

  // Toggles
  const t = DATA.settings;
  $('#sw-notify-wa')?.classList.toggle('is-on', !!t.notifyWA);
  $('#sw-auto-reply')?.classList.toggle('is-on', !!t.autoReply);
  $('#sw-weekly')?.classList.toggle('is-on', !!t.weeklyDigest);
}

function saveContact() {
  const c = DATA.contact;
  c.phone = $('#c-phone').value;
  c.email = $('#c-email').value;
  c.whatsapp = $('#c-wa').value;
  c.waMessage = $('#c-wa-msg').value;
  c.address = $('#c-address').value;
  c.hours = $('#c-hours').value;
  c.entity = $('#c-entity').value;
  c.uen = $('#c-uen').value;
  c.license = $('#c-license').value;
  c.instagram = $('#c-ig').value;
  c.linkedin = $('#c-li').value;
  c.gbp = $('#c-gbp').value;
  c.notifyEmails = $('#c-notify').value;
  DATA.settings.notifyWA = $('#sw-notify-wa').classList.contains('is-on');
  DATA.settings.autoReply = $('#sw-auto-reply').classList.contains('is-on');
  DATA.settings.weeklyDigest = $('#sw-weekly').classList.contains('is-on');
  persist();
  logActivity('updated contact details');
  toast('Contact details saved.');
}

// =============================================================
//   RENDER — MEDIA
// =============================================================
function renderMedia() {
  if (!$('#media-grid')) return;
  $('#kpi-media-total').textContent = DATA.media.length.toLocaleString();
  $('#kpi-media-photos').textContent = DATA.media.filter(m => /jpg|png|webp/i.test(m.name)).length;
  $('#kpi-media-draw').textContent = DATA.media.filter(m => /pdf|dwg/i.test(m.name)).length;
  $('#kpi-media-other').textContent = DATA.media.filter(m => /mp4|zip/i.test(m.name)).length;

  const filtered = DATA.media.filter(m => mediaFilter === 'all' || m.kind === mediaFilter)
    .filter(m => !searchQuery || m.name.toLowerCase().includes(searchQuery));
  $('#media-grid').innerHTML = filtered.map(m => `
    <div class="media-tile" data-mid="${m.id}" data-action="open-media">
      <img src="${escape(m.url)}" alt="">
      <div class="label"><span>${escape(m.name)}</span><span>${escape(m.size)}</span></div>
    </div>`).join('') || `<div style="padding:32px; color:var(--muted);">No media match this filter.</div>`;
}

function openMediaModal(m) {
  modal({
    title: 'Media · ' + m.name,
    fields: [
      { type:'image', name:'url', label:'File', value: m.url },
      { type:'text', name:'name', label:'Filename', value: m.name, half: true },
      { type:'text', name:'size', label:'File Size', value: m.size, half: true },
      { type:'select', name:'kind', label:'Folder', value: m.kind, options: [
        {value:'projects', label:'Projects'},
        {value:'team', label:'Team'},
        {value:'brand', label:'Brand'},
        {value:'misc', label:'Misc'}
      ]}
    ],
    submitLabel: 'Save',
    onDelete: () => {
      DATA.media = DATA.media.filter(x => x.id !== m.id);
      persist(); renderMedia();
      logActivity('deleted media file', m.name);
      toast('File deleted.');
    },
    onSubmit: (v) => {
      Object.assign(m, v);
      persist(); renderMedia();
      logActivity('edited media file', m.name);
      toast('File updated.');
    }
  });
}

function handleMediaUpload(files) {
  if (!files || !files.length) return;
  const limit = 5;
  let added = 0;
  [...files].slice(0, limit).forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      const m = { id: uid('m'), name: file.name, size: humanSize(file.size), kind: 'projects', url: reader.result };
      DATA.media.unshift(m);
      added++;
      if (added === Math.min(files.length, limit)) {
        try { persist(); renderMedia(); }
        catch(e) {
          DATA.media = DATA.media.slice(0, DATA.media.length - added);
          toast('Files too large for browser storage.', 'err');
          return;
        }
        logActivity('uploaded files');
        toast(`${added} file${added===1?'':'s'} uploaded.`);
      }
    };
    reader.readAsDataURL(file);
  });
}

function humanSize(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024*1024) return (n/1024).toFixed(0) + ' KB';
  return (n/(1024*1024)).toFixed(1) + ' MB';
}

// =============================================================
//   RENDER — SEO
// =============================================================
function renderSEO() {
  if (!$('#seo-title')) return;
  const s = DATA.seo;
  $('#seo-title').value = s.metaTitle;
  $('#seo-desc').value = s.metaDesc;
  $('#seo-og').value = s.ogTitle;
  $('#seo-canon').value = s.canonical;
  $('#seo-og-img').src = s.ogImage;
  updateSeoPreview();
  $('#sw-ga4')?.classList.toggle('is-on', !!DATA.settings.ga4);
  $('#sw-lazy')?.classList.toggle('is-on', !!DATA.settings.imageLazyLoad);
}

function updateSeoPreview() {
  const t = $('#seo-title').value || DATA.seo.metaTitle;
  const d = $('#seo-desc').value || DATA.seo.metaDesc;
  $('#seo-preview-title').textContent = t;
  $('#seo-preview-desc').textContent = d;
}

function saveSEO() {
  const s = DATA.seo;
  s.metaTitle = $('#seo-title').value;
  s.metaDesc = $('#seo-desc').value;
  s.ogTitle = $('#seo-og').value;
  s.canonical = $('#seo-canon').value;
  DATA.settings.ga4 = $('#sw-ga4').classList.contains('is-on');
  DATA.settings.imageLazyLoad = $('#sw-lazy').classList.contains('is-on');
  persist();
  logActivity('updated SEO');
  toast('SEO saved.');
}

// =============================================================
//   RENDER — SETTINGS
// =============================================================
function renderSettings() {
  if (!$('#st-name')) return;
  const u = DATA.user;
  $('#st-avatar').src = u.avatar;
  $('#st-name').value = u.name;
  $('#st-email').value = u.email;
  $('#st-mobile').value = u.mobile;
  $('#st-title').value = u.title;
  $('#st-display-name').textContent = u.name;

  // Toggles
  $('#sw-mfa')?.classList.toggle('is-on', !!u.mfa);
  $('#sw-maintenance')?.classList.toggle('is-on', !!DATA.settings.maintenance);
  $('#sw-cookie')?.classList.toggle('is-on', !!DATA.settings.cookieBanner);
  $('#sw-wa-float')?.classList.toggle('is-on', !!DATA.settings.whatsappFloat);

  // Admin users
  $('#st-admins').innerHTML = DATA.admins.map(a => `
    <tr data-aid="${a.id}">
      <td><img class="thumb avatar" src="${escape(a.photo)}" alt=""></td>
      <td><strong>${escape(a.name)}</strong><br><small style="color:var(--muted);">${escape(a.email)}</small></td>
      <td>${escape(a.role)}</td>
      <td>${escape(a.lastActive)}</td>
      <td>
        <button class="icon-btn" data-action="edit-admin">✎</button>
        ${a.id === 'a1' ? '' : '<button class="icon-btn" data-action="delete-admin">⌫</button>'}
      </td>
    </tr>`).join('');
}

function saveSettings() {
  const u = DATA.user;
  u.name = $('#st-name').value || u.name;
  u.email = $('#st-email').value || u.email;
  u.mobile = $('#st-mobile').value;
  u.title = $('#st-title').value;
  u.mfa = $('#sw-mfa').classList.contains('is-on');
  DATA.settings.maintenance = $('#sw-maintenance').classList.contains('is-on');
  DATA.settings.cookieBanner = $('#sw-cookie').classList.contains('is-on');
  DATA.settings.whatsappFloat = $('#sw-wa-float').classList.contains('is-on');
  // Sync owner in admins
  const owner = DATA.admins.find(a => a.id === 'a1');
  if (owner) { owner.name = u.name; owner.email = u.email; owner.photo = u.avatar; }
  // Sync owner in team
  const teamSelf = DATA.team.find(t => t.isYou);
  if (teamSelf) { teamSelf.name = u.name; teamSelf.email = u.email; teamSelf.photo = u.avatar; }
  persist();
  renderAll();
  logActivity('updated account settings');
  toast('Settings saved.');
}

function openAdminModal(a) {
  const isNew = !a;
  const admin = a || { id: uid('a'), name:'', email:'', role:'Editor', lastActive:'Just added', photo:'' };
  modal({
    title: isNew ? 'Invite Admin' : 'Edit · ' + admin.name,
    fields: [
      { type:'image', name:'photo', label:'Photo', value: admin.photo },
      { type:'text', name:'name', label:'Name', value: admin.name, half: true },
      { type:'email', name:'email', label:'Email', value: admin.email, half: true },
      { type:'select', name:'role', label:'Role', value: admin.role, options: [
        {value:'Administrator · Owner', label:'Administrator · Owner'},
        {value:'Administrator', label:'Administrator'},
        {value:'Editor', label:'Editor'},
        {value:'Editor · Projects only', label:'Editor · Projects only'},
        {value:'Editor · Team only', label:'Editor · Team only'},
        {value:'Viewer', label:'Viewer'}
      ]}
    ],
    submitLabel: isNew ? 'Send Invite' : 'Save',
    onDelete: isNew || admin.id === 'a1' ? null : () => {
      DATA.admins = DATA.admins.filter(x => x.id !== admin.id);
      persist(); renderSettings();
      logActivity('removed admin', admin.name);
      toast('Admin removed.');
    },
    onSubmit: (v) => {
      Object.assign(admin, v);
      if (isNew) DATA.admins.push(admin);
      persist(); renderSettings();
      logActivity(isNew ? 'invited admin' : 'updated admin', admin.name);
      toast(isNew ? 'Invitation sent.' : 'Admin updated.');
    }
  });
}

// =============================================================
//   RENDER — JOURNAL
// =============================================================
function renderJournal() {
  if (!$('#journal-tbody')) return;
  const arts = DATA.articles || [];
  $('#kpi-art-total').textContent = arts.length;
  $('#kpi-art-pub').textContent = arts.filter(a => a.status !== 'draft').length;
  $('#kpi-art-draft').textContent = arts.filter(a => a.status === 'draft').length;
  $('#kpi-art-feat').textContent = arts.filter(a => a.featured).length;

  const filtered = arts.filter(a => {
    if (journalFilter === 'workplace') return /Workplace/i.test(a.category);
    if (journalFilter === 'materials') return /Materials/i.test(a.category);
    if (journalFilter === 'postocc') return /Post/i.test(a.category);
    if (journalFilter === 'practice') return /Practice/i.test(a.category);
    if (journalFilter === 'draft') return a.status === 'draft';
    return true;
  }).filter(a => !searchQuery
    || (a.plainTitle || '').toLowerCase().includes(searchQuery)
    || (a.author || '').toLowerCase().includes(searchQuery)
    || (a.category || '').toLowerCase().includes(searchQuery)
  );

  // Sort by date descending
  filtered.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  $('#journal-tbody').innerHTML = filtered.map(a => `
    <tr data-jid="${escape(a.id)}">
      <td><img class="thumb article-thumb" src="${escape(a.coverThumb || a.cover)}" alt=""></td>
      <td><strong>${escape(a.plainTitle || a.slug)}</strong><br><small style="color:var(--muted);">/journal/${escape(a.slug)}</small></td>
      <td>${escape(a.category)}</td>
      <td>${escape(a.author || '—')}</td>
      <td>${escape(a.dateLabel || a.date || '—')}</td>
      <td>${a.featured ? '★ Featured' : '—'}</td>
      <td>${statusTag(a.status || 'published')}</td>
      <td>
        <button class="icon-btn" data-action="edit-article" title="Edit">✎</button>
        <button class="icon-btn" data-action="view-article" title="View on site">↗</button>
        <button class="icon-btn" data-action="duplicate-article" title="Duplicate">⤓</button>
        <button class="icon-btn" data-action="delete-article" title="Delete">⌫</button>
      </td>
    </tr>`).join('') || `<tr><td colspan="8" class="empty-row">No journal entries match this filter.</td></tr>`;
}

function openArticleModal(a) {
  const isNew = !a;
  const today = new Date();
  const isoToday = today.toISOString().slice(0, 10);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dateLabelToday = today.getDate() + ' ' + months[today.getMonth()] + ' ' + today.getFullYear();
  const art = a || {
    id: uid('a'),
    slug: '',
    title: '',
    plainTitle: '',
    category: 'Workplace Strategy',
    date: isoToday,
    dateLabel: dateLabelToday,
    readTime: '8 min read',
    author: DATA.user.name,
    authorRole: DATA.user.title || '',
    coAuthor: '',
    coAuthorRole: '',
    cover: '',
    coverThumb: '',
    excerpt: '',
    lede: '',
    featured: false,
    status: 'draft',
    customUrl: '',
    body: '<p>Write your piece here. Body text is HTML — use &lt;p&gt;, &lt;h3&gt;, and the helpers below.</p>'
  };

  const bodyHelp = `<div class="help">
    Body is HTML. Common blocks:
    <code style="color:var(--ink);">&lt;p&gt;…&lt;/p&gt;</code>,
    <code style="color:var(--ink);">&lt;h3&gt;…&lt;/h3&gt;</code>,
    <code style="color:var(--ink);">&lt;div class="pullquote"&gt;…&lt;/div&gt;</code>,
    <code style="color:var(--ink);">&lt;div class="article-figure"&gt;…&lt;/div&gt;</code>. Use <code style="color:var(--ink);">&lt;em class="italic"&gt;</code> for emphasis.
  </div>`;

  modal({
    title: isNew ? 'New Journal Entry' : `Edit · ${art.plainTitle || art.slug}`,
    wide: true,
    fields: [
      { section: 'Headline & meta' },
      { type:'text', name:'plainTitle', label:'Plain Title (used in cards, browser tab)', value: art.plainTitle, placeholder:'The neighborhood model' },
      { type:'text', name:'title', label:'Display Title (HTML allowed, e.g. <em class="italic">why…</em>)', value: art.title, placeholder:'The neighborhood model: <em class="italic">why…</em>' },
      { type:'text', name:'slug', label:'URL Slug', value: art.slug, placeholder:'the-neighborhood-model', half:true },
      { type:'select', name:'category', label:'Category', value: art.category, half:true, options:[
        {value:'Workplace Strategy', label:'Workplace Strategy'},
        {value:'Materials', label:'Materials'},
        {value:'Post-Occupancy', label:'Post-Occupancy'},
        {value:'Practice', label:'Practice'}
      ]},
      { type:'text', name:'date', label:'Date (YYYY-MM-DD)', value: art.date, half:true },
      { type:'text', name:'dateLabel', label:'Display Date Label', value: art.dateLabel, placeholder:'9 May 2026', half:true },
      { type:'text', name:'readTime', label:'Read Time', value: art.readTime, placeholder:'8 min read', half:true },
      { type:'select', name:'status', label:'Status', value: art.status, half:true, options:[
        {value:'published', label:'Published'},
        {value:'draft', label:'Draft'}
      ]},
      { type:'checkbox', name:'featured', label:'Featured (top of the journal index)', value: !!art.featured },

      { section: 'Author' },
      { type:'text', name:'author', label:'Author Name', value: art.author, half:true },
      { type:'text', name:'authorRole', label:'Author Role', value: art.authorRole, half:true },
      { type:'text', name:'coAuthor', label:'Co-author (optional)', value: art.coAuthor, half:true },
      { type:'text', name:'coAuthorRole', label:'Co-author Role', value: art.coAuthorRole, half:true },

      { section: 'Cover image' },
      { type:'image', name:'cover', label:'Cover Image (full bleed)', value: art.cover },
      { type:'text', name:'coverThumb', label:'Thumbnail URL (optional — falls back to cover)', value: art.coverThumb, placeholder:'https://… or assets/file.jpg' },

      { section: 'Lede & excerpt' },
      { type:'textarea', name:'excerpt', label:'Excerpt (shown on cards — ~30 words)', value: art.excerpt },
      { type:'textarea', name:'lede', label:'Lede (longer lead-in shown on the article page)', value: art.lede },

      { section: 'Body' },
      { type:'textarea', name:'body', label:'Body HTML', value: art.body },

      { section: 'Advanced' },
      { type:'text', name:'customUrl', label:'Custom URL (optional — routes to a hand-built page instead of the template)', value: art.customUrl, placeholder:'journal-hybrid-fails.html' }
    ],
    html: undefined,
    submitLabel: isNew ? 'Create Entry' : 'Save Changes',
    onDelete: isNew ? null : () => {
      DATA.articles = DATA.articles.filter(x => x.id !== art.id);
      persist(); renderJournal(); renderUserHeader();
      logActivity('deleted journal entry', art.plainTitle);
      toast(`"${art.plainTitle}" deleted.`);
    },
    onSubmit: (v) => {
      // Auto-derive slug if blank
      if (!v.slug && v.plainTitle) {
        v.slug = v.plainTitle.toLowerCase()
          .replace(/<[^>]+>/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }
      Object.assign(art, v);
      art.coverThumb = v.coverThumb || v.cover;
      // Title falls back to plainTitle if blank
      if (!art.title) art.title = art.plainTitle;
      if (isNew) DATA.articles.unshift(art);
      persist(); renderJournal(); renderUserHeader();
      logActivity(isNew ? 'created journal entry' : 'edited journal entry', art.plainTitle);
      toast(isNew ? 'Entry created.' : 'Entry saved.');
    }
  });

  // After the modal opens, find the body textarea and add the .body-editor class
  // (the renderer doesn't support per-field classes, so do it post-hoc).
  requestAnimationFrame(() => {
    const ta = document.querySelector('.modal2-back textarea[name="body"]');
    if (ta) {
      ta.classList.add('body-editor');
      ta.rows = 18;
      const help = document.createElement('div');
      help.className = 'help';
      help.style.cssText = 'font-size:12px; color: var(--muted); margin-top: 6px;';
      help.innerHTML = bodyHelp.replace(/^<div class="help">|<\/div>$/g, '');
      ta.parentElement.appendChild(help);
    }
  });
}

// =============================================================
//   RENDER — ALL
// =============================================================
function renderAll() {
  renderUserHeader();
  renderDashboard();
  renderProjects();
  renderTeam();
  renderInquiries();
  renderHomepage();
  renderPages();
  renderContact();
  renderMedia();
  renderJournal();
  renderSEO();
  renderSettings();
}

// =============================================================
//   EVENTS — global delegated
// =============================================================
function setupEvents() {

  // Logout
  $('#logout-btn')?.addEventListener('click', signOut);

  // Tab toggle visual buttons (filters)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.toggle button');
    if (!btn) return;
    const tg = btn.closest('.toggle');
    tg.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const key = btn.dataset.filter;
    if (!key) return;
    const scope = tg.dataset.scope;
    if (scope === 'projects') { projectFilter = key; renderProjects(); }
    else if (scope === 'team') { teamFilter = key; renderTeam(); }
    else if (scope === 'inquiries') { inquiryFilter = key; renderInquiries(); }
    else if (scope === 'media') { mediaFilter = key; renderMedia(); }
    else if (scope === 'journal') { journalFilter = key; renderJournal(); }
  });

  // Switches
  document.addEventListener('click', (e) => {
    const sw = e.target.closest('.switch');
    if (!sw) return;
    // Inquiry list rows use data-action, not switch
    if (sw.dataset.action === 'toggle-featured') {
      const pid = sw.dataset.pid;
      const p = DATA.projects.find(x => x.id === pid);
      if (p) { p.featured = !p.featured; sw.classList.toggle('is-on', p.featured); persist(); renderHomepage(); renderProjects(); }
      return;
    }
    sw.classList.toggle('is-on');
  });

  // Search inputs
  document.addEventListener('input', (e) => {
    const inp = e.target.closest('[data-search]');
    if (!inp) return;
    searchQuery = inp.value.trim().toLowerCase();
    const scope = inp.dataset.search;
    if (scope === 'projects') renderProjects();
    else if (scope === 'team') renderTeam();
    else if (scope === 'inquiries') renderInquiries();
    else if (scope === 'media') renderMedia();
    else if (scope === 'journal') renderJournal();
  });

  // SEO live preview
  ['#seo-title', '#seo-desc'].forEach(sel => {
    document.addEventListener('input', (e) => {
      if (e.target.matches(sel)) updateSeoPreview();
    });
  });

  // Data-action dispatcher
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const a = t.dataset.action;
    const row = t.closest('[data-pid],[data-tid],[data-iid],[data-pgid],[data-mid],[data-aid],[data-fid],[data-jid]');

    switch (a) {
      // Projects
      case 'new-project': openProjectModal(); break;
      case 'edit-project': openProjectModal(DATA.projects.find(p => p.id === row.dataset.pid)); break;
      case 'duplicate-project': {
        const src = DATA.projects.find(p => p.id === row.dataset.pid);
        if (src) {
          const copy = { ...src, id: uid('p'), name: src.name + ' (Copy)', slug: src.slug + '-copy', status: 'draft', completion: 0, featured: false };
          DATA.projects.unshift(copy); persist(); renderProjects();
          logActivity('duplicated project', src.name);
          toast('Project duplicated.');
        }
        break;
      }
      case 'delete-project': {
        const p = DATA.projects.find(x => x.id === row.dataset.pid);
        if (p && confirm(`Delete "${p.name}"?`)) {
          DATA.projects = DATA.projects.filter(x => x.id !== p.id);
          DATA.homepage.featuredIds = DATA.homepage.featuredIds.filter(id => id !== p.id);
          persist(); renderProjects(); renderHomepage(); renderDashboard();
          logActivity('deleted project', p.name);
          toast('Project deleted.');
        }
        break;
      }
      // Team
      case 'new-team': openTeamModal(); break;
      case 'edit-team': openTeamModal(DATA.team.find(m => m.id === row.dataset.tid)); break;
      case 'delete-team': {
        const m = DATA.team.find(x => x.id === row.dataset.tid);
        if (m && !m.isYou && confirm(`Remove ${m.name}?`)) {
          DATA.team = DATA.team.filter(x => x.id !== m.id);
          persist(); renderTeam(); renderDashboard();
          logActivity('removed team member', m.name);
          toast(`${m.name} removed.`);
        }
        break;
      }
      // Inquiries
      case 'open-inquiry':
      case 'jump-inquiry':
        currentInquiryId = row.dataset.iid;
        renderInquiries();
        if (a === 'jump-inquiry') { history.replaceState(null, '', '#inquiries'); showTab('inquiries'); }
        break;
      case 'mark-replied': {
        const i = DATA.inquiries.find(x => x.id === currentInquiryId);
        if (i) {
          const ns = i.status === 'new' ? 'replied' : 'new';
          saveInquiry(i, { status: ns });
          renderInquiries(); renderDashboard();
          logActivity(i.status === 'replied' ? 'marked inquiry replied' : 'reopened inquiry', i.client);
          toast('Status updated.');
        }
        break;
      }
      case 'send-reply': {
        const i = DATA.inquiries.find(x => x.id === currentInquiryId);
        const txt = $('#inq-reply').value.trim();
        if (i && txt) {
          saveInquiry(i, { reply: txt, status: 'replied' });
          renderInquiries(); renderDashboard();
          logActivity('replied to inquiry', i.client);
          toast('Reply sent.');
        } else { toast('Type a reply first.', 'err'); }
        break;
      }
      case 'assign-inquiry': {
        const i = DATA.inquiries.find(x => x.id === currentInquiryId);
        if (!i) break;
        modal({
          title: 'Assign Inquiry',
          fields: [{ type:'select', name:'assignee', label:'Assign To', value: i.assignee, options: [
            {value:'—', label:'Unassigned'},
            ...DATA.team.map(t => ({ value: t.name.split(' ').map((n,idx)=>idx?n[0]+'.':n).join(' '), label: t.name + ' — ' + t.role }))
          ]}],
          submitLabel: 'Assign',
          onSubmit: (v) => {
            saveInquiry(i, { assignee: v.assignee }); renderInquiries();
            logActivity('assigned inquiry to ' + i.assignee, i.client);
            toast('Inquiry assigned.');
          }
        });
        break;
      }
      case 'delete-inquiry': {
        const i = DATA.inquiries.find(x => x.id === currentInquiryId);
        if (i && confirm(`Delete inquiry from ${i.client}?`)) {
          removeInquiry(i.id);
          DATA.inquiries = DATA.inquiries.filter(x => x.id !== i.id);
          currentInquiryId = DATA.inquiries[0]?.id;
          renderInquiries(); renderDashboard();
          logActivity('deleted inquiry', i.client);
          toast('Inquiry deleted.');
        }
        break;
      }
      case 'export-inquiries': {
        const rows = [['Ref','Client','Company','Email','Phone','Type','Size','Budget','Status','Date']];
        DATA.inquiries.forEach(i => rows.push([i.ref, i.client, i.company, i.email, i.phone, i.type, i.size, i.budget, i.status, i.dateFull]));
        const csv = rows.map(r => r.map(c => `"${(c||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n');
        downloadFile(csv, 'inquiries.csv', 'text/csv');
        toast('CSV exported.');
        break;
      }
      case 'download-file': e.preventDefault(); toast('File downloaded.'); break;

      // Homepage
      case 'save-home': saveHomepage(); break;
      case 'home-replace-img': pickFromLibrary((url) => {
        DATA.homepage.heroImage = url; $('#home-hero-img').src = url; persist();
      }); break;
      case 'home-upload-img': $('#home-img-input').click(); break;
      case 'add-stat':
        DATA.homepage.stats.push({value: '00', label: 'New stat'});
        renderHomepage();
        break;
      case 'remove-stat': {
        const idx = parseInt(t.closest('[data-stat-idx]').dataset.statIdx);
        DATA.homepage.stats.splice(idx, 1); renderHomepage();
        break;
      }
      case 'featured-up': {
        const i = DATA.homepage.featuredIds.indexOf(row.dataset.fid);
        if (i > 0) { [DATA.homepage.featuredIds[i-1], DATA.homepage.featuredIds[i]] = [DATA.homepage.featuredIds[i], DATA.homepage.featuredIds[i-1]]; persist(); renderHomepage(); }
        break;
      }
      case 'featured-down': {
        const i = DATA.homepage.featuredIds.indexOf(row.dataset.fid);
        if (i < DATA.homepage.featuredIds.length - 1) { [DATA.homepage.featuredIds[i+1], DATA.homepage.featuredIds[i]] = [DATA.homepage.featuredIds[i], DATA.homepage.featuredIds[i+1]]; persist(); renderHomepage(); }
        break;
      }
      case 'featured-remove': {
        DATA.homepage.featuredIds = DATA.homepage.featuredIds.filter(id => id !== row.dataset.fid);
        persist(); renderHomepage();
        break;
      }
      case 'featured-add': {
        const candidates = DATA.projects.filter(p => !DATA.homepage.featuredIds.includes(p.id));
        if (!candidates.length) { toast('All projects already featured.', 'err'); break; }
        modal({
          title: 'Add Featured Project',
          fields: [{ type:'select', name:'pid', label:'Project', value: candidates[0].id, options: candidates.map(p => ({value: p.id, label: p.name + ' · ' + p.year})) }],
          submitLabel: 'Add',
          onSubmit: (v) => {
            DATA.homepage.featuredIds.push(v.pid); persist(); renderHomepage();
            toast('Added to featured.');
          }
        });
        break;
      }

      // Pages
      case 'select-page': currentPageId = row.dataset.pgid; renderPages(); break;
      case 'edit-page': openPageModal(DATA.pages.find(p => p.id === row.dataset.pgid)); break;
      case 'save-pages': savePages(); break;
      case 'new-page':
        modal({
          title: 'New Page',
          fields: [
            { type:'text', name:'name', label:'Page Name', value:'', half:true },
            { type:'text', name:'path', label:'URL Path', value:'/', half:true },
            { type:'select', name:'status', label:'Status', value:'draft', options:[{value:'published',label:'Published'},{value:'draft',label:'Draft'}] }
          ],
          submitLabel: 'Create',
          onSubmit: (v) => {
            DATA.pages.push({ id: uid('pg'), name: v.name || 'Untitled', path: v.path || '/', lastEdited: 'just now', editor: DATA.user.name.split(' ')[0] + ' ' + DATA.user.name.split(' ')[1][0] + '.', status: v.status, body: '' });
            persist(); renderPages();
            logActivity('created page', v.name);
            toast('Page created.');
          }
        });
        break;

      // Contact
      case 'save-contact': saveContact(); break;
      case 'edit-notify-list':
        modal({
          title: 'Inquiry Notification Recipients',
          fields: [{ type:'textarea', name:'list', label:'Comma-separated email list', value: DATA.contact.notifyEmails }],
          submitLabel: 'Save',
          onSubmit: (v) => { DATA.contact.notifyEmails = v.list; $('#c-notify').value = v.list; persist(); toast('Recipients updated.'); }
        });
        break;

      // Media
      case 'open-media': openMediaModal(DATA.media.find(m => m.id === row.dataset.mid)); break;
      case 'upload-media': $('#media-input').click(); break;

      // Journal
      case 'new-article': openArticleModal(); break;
      case 'edit-article': openArticleModal(DATA.articles.find(x => x.id === row.dataset.jid)); break;
      case 'view-article': {
        const art = DATA.articles.find(x => x.id === row.dataset.jid);
        if (!art) break;
        // Prefer custom URL if set, otherwise route via template.
        const href = art.customUrl ? art.customUrl : 'journal-article.html?slug=' + encodeURIComponent(art.slug);
        window.open(href, '_blank');
        break;
      }
      case 'duplicate-article': {
        const src = DATA.articles.find(x => x.id === row.dataset.jid);
        if (src) {
          const copy = JSON.parse(JSON.stringify(src));
          copy.id = uid('a');
          copy.slug = src.slug + '-copy';
          copy.plainTitle = src.plainTitle + ' (Copy)';
          copy.title = src.title.replace(/(<\/?em[^>]*>)/g, '') + ' (Copy)';
          copy.status = 'draft';
          copy.featured = false;
          copy.customUrl = '';
          DATA.articles.unshift(copy);
          persist(); renderJournal();
          logActivity('duplicated journal entry', src.plainTitle);
          toast('Entry duplicated.');
        }
        break;
      }
      case 'delete-article': {
        const art = DATA.articles.find(x => x.id === row.dataset.jid);
        if (art && confirm(`Delete "${art.plainTitle}"?`)) {
          DATA.articles = DATA.articles.filter(x => x.id !== art.id);
          persist(); renderJournal(); renderUserHeader();
          logActivity('deleted journal entry', art.plainTitle);
          toast('Entry deleted.');
        }
        break;
      }

      // SEO
      case 'save-seo': saveSEO(); break;
      case 'regen-sitemap':
        logActivity('regenerated sitemap');
        toast('Sitemap regenerated · 38 URLs.');
        break;
      case 'edit-robots':
        modal({
          title: 'robots.txt',
          fields: [{ type:'textarea', name:'content', label:'File contents', value: 'User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://tdiworkspace.sg/sitemap.xml' }],
          submitLabel: 'Save',
          onSubmit: () => { logActivity('edited robots.txt'); toast('robots.txt saved.'); }
        });
        break;
      case 'seo-replace-img': pickFromLibrary((url) => { DATA.seo.ogImage = url; $('#seo-og-img').src = url; persist(); }); break;

      // Settings
      case 'save-settings': saveSettings(); break;
      case 'change-photo': pickFromLibrary((url) => { DATA.user.avatar = url; renderUserHeader(); renderSettings(); persist(); toast('Avatar updated.'); }); break;
      case 'new-admin': openAdminModal(); break;
      case 'edit-admin': openAdminModal(DATA.admins.find(a => a.id === row.dataset.aid)); break;
      case 'delete-admin': {
        const adm = DATA.admins.find(x => x.id === row.dataset.aid);
        if (adm && adm.id !== 'a1' && confirm(`Remove ${adm.name}?`)) {
          DATA.admins = DATA.admins.filter(x => x.id !== adm.id);
          persist(); renderSettings();
          logActivity('removed admin', adm.name);
          toast('Admin removed.');
        }
        break;
      }
      case 'change-pwd':
        modal({
          title: 'Change Password',
          fields: [
            { type:'password', name:'old', label:'Current Password' },
            { type:'password', name:'pwd', label:'New Password' },
            { type:'password', name:'confirm', label:'Confirm New Password' }
          ],
          submitLabel: 'Update Password',
          onSubmit: (v) => {
            if (!v.pwd || v.pwd.length < 6) { toast('Password too short (6+ chars).', 'err'); return false; }
            if (v.pwd !== v.confirm) { toast('Passwords do not match.', 'err'); return false; }
            const auth = window.TDIFire && TDIFire.auth;
            const user = auth && auth.currentUser;
            if (!user) { toast('Not signed in.', 'err'); return false; }
            const cred = firebase.auth.EmailAuthProvider.credential(user.email, v.old);
            user.reauthenticateWithCredential(cred)
              .then(() => user.updatePassword(v.pwd))
              .then(() => { logActivity('changed password'); toast('Password updated.'); })
              .catch((err) => {
                const code = err.code || '';
                toast(/wrong-password|invalid-credential/.test(code) ? 'Current password is incorrect.' : (err.message || 'Could not update password.'), 'err');
              });
          }
        });
        break;
      case 'signout-others': toast('Other sessions signed out.'); break;
      case 'change-timeout':
        modal({
          title: 'Session Timeout',
          fields: [{ type:'select', name:'t', label:'Auto sign-out after', value: DATA.user.sessionTimeout, options: ['30m','1h','2h','4h','8h','24h'].map(v => ({value:v, label:v + ' of inactivity'})) }],
          submitLabel: 'Save',
          onSubmit: (v) => { DATA.user.sessionTimeout = v.t; persist(); renderSettings(); toast('Timeout updated.'); }
        });
        break;
      case 'view-invoices': toast('Opening billing history…'); break;
      case 'update-payment': toast('Opening payment update flow…'); break;
      case 'upgrade-plan': toast('Plan upgrade — contact sales.'); break;
      case 'export-data': {
        const blob = JSON.stringify(DATA, null, 2);
        downloadFile(blob, 'tdi-workspace-export.json', 'application/json');
        logActivity('exported workspace data');
        toast('Data exported.');
        break;
      }
      case 'transfer': toast('Transfer workspace flow — requires email verification.'); break;
      case 'delete-workspace':
        if (prompt('Type "DELETE" to confirm permanent deletion:') === 'DELETE') {
          localStorage.removeItem(KEY); sessionStorage.removeItem(SESSION_KEY);
          toast('Workspace deleted.', 'err');
          setTimeout(() => location.reload(), 1200);
        }
        break;
      case 'reset-data':
        if (confirm('Reset all admin data to factory defaults? You will lose all changes.')) {
          localStorage.removeItem(KEY); DATA = loadData();
          renderAll(); toast('Data reset.');
        }
        break;
    }
  });

  // Media upload
  $('#media-input')?.addEventListener('change', (e) => handleMediaUpload(e.target.files));
  $('#home-img-input')?.addEventListener('change', (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { DATA.homepage.heroImage = r.result; $('#home-hero-img').src = r.result; try{ persist(); toast('Hero image updated.'); }catch{ toast('Image too large.', 'err'); } };
    r.readAsDataURL(f);
  });

  // Drag-drop on media tab
  const mediaDrop = $('#media-drop');
  if (mediaDrop) {
    ['dragover','dragenter'].forEach(ev => mediaDrop.addEventListener(ev, (e) => { e.preventDefault(); mediaDrop.classList.add('is-drag'); }));
    ['dragleave','drop'].forEach(ev => mediaDrop.addEventListener(ev, (e) => { e.preventDefault(); mediaDrop.classList.remove('is-drag'); }));
    mediaDrop.addEventListener('drop', (e) => handleMediaUpload(e.dataTransfer.files));
  }

  // Click on media tile in grid
  // Inquiry list rows are handled via data-action="open-inquiry"
}

function downloadFile(content, filename, mime='text/plain') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// =============================================================
//   INIT
// =============================================================
function init() {
  setupLogin();
  setupTabs();
  setupEvents();
  renderAll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else { init(); }

// expose for debugging
window.__tdi = { DATA, persist, resetData: () => { localStorage.removeItem(KEY); location.reload(); } };

})();
