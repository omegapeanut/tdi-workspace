// Material data now lives in Firestore (see lib/cms.js) — seeded by scripts/seed.mjs.
// Category taxonomy stays static; it's fixed page structure, not editable content.

export const materialCategories = [
  ["all", "ALL"],
  ["wood", "WOOD"],
  ["stone", "STONE & MARBLE"],
  ["tiles", "TILES"],
  ["fabric", "FABRIC"],
  ["metal", "METAL"],
  ["glass", "GLASS"],
];
