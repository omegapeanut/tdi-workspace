// Project data now lives in Firestore (see lib/cms.js) — seeded by scripts/seed.mjs.
// Category taxonomy stays static; it's fixed page structure, not editable content.

export const projectCategories = {
  C: [
    ["all", "ALL"],
    ["office", "OFFICE"],
    ["fnb", "F&B"],
    ["retail", "RETAIL"],
    ["clinic", "CLINIC"],
  ],
  R: [
    ["all", "ALL"],
    ["hdb", "HDB"],
    ["condo", "CONDO"],
    ["landed", "LANDED"],
  ],
};
