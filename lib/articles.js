// Article data now lives in Firestore (see lib/cms.js) — seeded by scripts/seed.mjs.
// Category taxonomy stays static; it's fixed page structure, not editable content.

export const journalCategories = [
  ["all", "ALL"],
  ["commercial", "COMMERCIAL"],
  ["residential", "RESIDENTIAL"],
  ["materials", "MATERIALS"],
  ["trends", "TRENDS & IDEAS"],
];
