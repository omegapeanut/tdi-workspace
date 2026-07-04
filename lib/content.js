// Fixed page copy that isn't part of the Admin CMS scope (see designs/TDI Admin.dc.html
// nav — Process isn't a CMS section, and the services teaser headline is static UI copy).
// Everything else that used to live here (hero, services, projects, testimonials,
// journal preview, final CTA) now comes from Firestore — see lib/cms.js.

export const servicesHeadline = {
  C: "Design & build, end to end.",
  R: "One team, whole home.",
};

export const processSteps = [
  { n: "01", title: "Consultation", body: "30 minutes, free. Bring a floor plan; leave with a realistic budget band." },
  { n: "02", title: "Concept & space plan", body: "Layouts, moodboards and a 3D view of the moments that matter." },
  { n: "03", title: "Budget & materials", body: "Itemised quote, line by line. Materials shortlisted from our library." },
  { n: "04", title: "Permits & approvals", body: "HDB permits or landlord and authority submissions — handled for you." },
  { n: "05", title: "Build, with updates", body: "A weekly photo report and one WhatsApp group. You always know where things stand." },
  { n: "06", title: "Handover & care", body: "Joint inspection, then 12 months of defects care after you move in." },
];
