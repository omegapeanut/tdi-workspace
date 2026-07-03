// Static placeholder content matching designs/TDI Home.dc.html.
// TODO: replace with Firestore reads (settings/site, projects, articles) per README.md.

export const hero = {
  C: {
    kicker: "COMMERCIAL DESIGN & BUILD — SINGAPORE · 匠心营造",
    headline: "Where work finds its form.",
    body: "Offices, restaurants and flagship retail — designed, built and handed over by one accountable team.",
    image: "/images/hero-commercial.jpg",
    imageAlt: "Commercial interior — boardroom with timber slats",
  },
  R: {
    kicker: "RESIDENTIAL INTERIORS — HDB · CONDO · LANDED · 家的质感",
    headline: "Quiet luxury, made livable.",
    body: "Homes composed with restraint — planned around how you actually live, priced before you commit.",
    image: "/images/hero-residential.jpg",
    imageAlt: "Residential interior — living room with warm lamps",
  },
};

export const services = {
  C: [
    { n: "01", title: "Office fit-out", body: "CAT B fit-outs and reinstatements — space planning, M&E coordination, landlord approvals." },
    { n: "02", title: "F&B & hospitality", body: "Restaurants, cafés and bars built for service flow, licensing and opening day." },
    { n: "03", title: "Retail flagship", body: "Brand-first stores and showrooms — millwork, lighting and visual merchandising built in." },
    { n: "04", title: "Clinics & wellness", body: "Compliant, calming healthcare spaces — from GP suites to aesthetic studios." },
  ],
  R: [
    { n: "01", title: "Whole-home renovation", body: "HDB, condo and landed — full design, permits and build under one contract." },
    { n: "02", title: "Kitchens & wet works", body: "Hacking, tiling, plumbing and waterproofing done right the first time." },
    { n: "03", title: "Custom carpentry", body: "Built-in wardrobes, feature walls and storage measured to the millimetre." },
    { n: "04", title: "Styling & lighting", body: "The last 10% that makes it feel finished — lighting plans, furniture and soft styling." },
  ],
};

export const servicesHeadline = {
  C: "Design & build, end to end.",
  R: "One team, whole home.",
};

export const featuredProjects = {
  C: [
    { image: "/images/project-fintech.jpg", alt: "Fintech HQ reception with timber slats", title: "Fintech HQ, Raffles Place", meta: "OFFICE · 12,400 SQFT · 14 WKS" },
    { image: "/images/project-izakaya.jpg", alt: "Izakaya bar counter in low light", title: "Izakaya, Duxton Hill", meta: "F&B · 2,100 SQFT · 9 WKS" },
    { image: "/images/project-boutique.jpg", alt: "Flagship boutique facade at night", title: "Flagship boutique, Orchard", meta: "RETAIL · 3,800 SQFT · 11 WKS" },
  ],
  R: [
    { image: "/images/project-maisonette.jpg", alt: "Maisonette stairwell in warm light", title: "Maisonette, Bukit Timah", meta: "LANDED FEEL · 1,650 SQFT · 10 WKS" },
    { image: "/images/project-bto.jpg", alt: "BTO living room with built-in bench", title: "4-room BTO, Tengah", meta: "HDB · 990 SQFT · 8 WKS" },
    { image: "/images/project-penthouse.jpg", alt: "Penthouse dining area with pendant lights", title: "Penthouse, Newton", meta: "CONDO · 2,300 SQFT · 12 WKS" },
  ],
};

export const proofStats = {
  C: [
    { value: "140+", label: "COMMERCIAL PROJECTS DELIVERED" },
    { value: "15", label: "YEARS OF DESIGN & BUILD" },
    { value: "92%", label: "HANDED OVER ON OR AHEAD OF TIME" },
    { value: "1", label: "CONTRACT, ONE ACCOUNTABLE TEAM" },
  ],
  R: [
    { value: "60+", label: "HOMES COMPLETED" },
    { value: "4.9★", label: "AVERAGE CLIENT RATING" },
    { value: "0", label: "HIDDEN COSTS — ITEMISED QUOTES" },
    { value: "12mo", label: "DEFECTS CARE AFTER HANDOVER" },
  ],
};

export const testimonial = {
  C: {
    quote: "They treated our downtime like it cost money — because it does. We moved back in a week early, and the space still stops visitors at the door.",
    avatar: "/images/avatar-commercial.jpg",
    name: "Operations Director",
    role: "Fintech HQ, Raffles Place",
  },
  R: {
    quote: "The quote we signed was the amount we paid. Ten weeks, one WhatsApp group, zero drama — and a home that finally feels like ours.",
    avatar: "/images/avatar-residential.jpg",
    name: "Homeowners, Tengah",
    role: "4-room BTO, full renovation",
  },
};

export const trustedBy = {
  C: { label: "TRUSTED BY TEAMS AT", items: ["NOVA BANK", "Herring & Co.", "KOPI CULTURE", "Atlas Retail", "MEDFIRST"] },
  R: { label: "AS FEATURED ON", items: ["Qanvast", "RENONATION", "Home & Decor", "STACKED"] },
};

export const processSteps = [
  { n: "01", title: "Consultation", body: "30 minutes, free. Bring a floor plan; leave with a realistic budget band." },
  { n: "02", title: "Concept & space plan", body: "Layouts, moodboards and a 3D view of the moments that matter." },
  { n: "03", title: "Budget & materials", body: "Itemised quote, line by line. Materials shortlisted from our library." },
  { n: "04", title: "Permits & approvals", body: "HDB permits or landlord and authority submissions — handled for you." },
  { n: "05", title: "Build, with updates", body: "A weekly photo report and one WhatsApp group. You always know where things stand." },
  { n: "06", title: "Handover & care", body: "Joint inspection, then 12 months of defects care after you move in." },
];

export const journalPreview = {
  C: [
    { image: "/images/journal-office-costs.jpg", alt: "Office fit-out cost guide cover", kicker: "FIT-OUT GUIDES · 8 MIN", title: "Office fit-out costs in Singapore: the 2026 guide" },
    { image: "/images/journal-cat-ab.jpg", alt: "CAT A vs CAT B article cover", kicker: "TENANT ADVICE · 6 MIN", title: "CAT A vs CAT B: what office tenants actually need to know" },
    { image: "/images/journal-downtime.jpg", alt: "Office renovation downtime article cover", kicker: "PLANNING · 5 MIN", title: "How much downtime does an office renovation really take?" },
  ],
  R: [
    { image: "/images/journal-hdb-permits.jpg", alt: "HDB renovation permits article cover", kicker: "HDB GUIDES · 7 MIN", title: "HDB renovation permits, explained in plain English" },
    { image: "/images/journal-bto-budget.jpg", alt: "BTO renovation budget article cover", kicker: "BUDGETING · 9 MIN", title: "4-room BTO renovation: where the money actually goes" },
    { image: "/images/journal-flooring.jpg", alt: "Vinyl vs engineered wood article cover", kicker: "MATERIALS · 5 MIN", title: "Vinyl vs engineered wood: the honest comparison" },
  ],
};

export const finalCta = {
  C: {
    kicker: "START A PROJECT",
    headline: "Let's scope your space — proposal in 5 working days.",
    body: "Send us your floor plan and headcount. We'll return a space plan, timeline and budget band — before you commit to anything.",
    primary: { label: "REQUEST A PROPOSAL", href: "/contact" },
    secondary: { label: "DOWNLOAD COMPANY PROFILE", href: "/contact" },
  },
  R: {
    kicker: "START YOUR RENOVATION",
    headline: "Know your number before you commit.",
    body: "Two minutes, five questions — an honest cost range for your HDB, condo or landed renovation. Estimates only; your consultation makes it exact.",
    primary: { label: "ESTIMATE MY RENOVATION", href: "/calculator" },
    secondary: { label: "BOOK A CONSULTATION", href: "/contact" },
  },
};
