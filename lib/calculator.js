// Pricing model matching designs/TDI Calculator.dc.html. Estimates only.

export const PROPERTY_TYPES = [
  ["hdbNew", "HDB (new)", "BTO / new flat", 1.0],
  ["hdbResale", "HDB (resale)", "incl. hacking", 1.22],
  ["condo", "Condo", "new or resale", 1.15],
  ["landed", "Landed", "terrace to GCB", 1.45],
];

export const DESIGN_TIERS = [
  ["basic", "Essential", "practical finishes", 0.8],
  ["modern", "Modern", "popular choice", 1.0],
  ["luxury", "Luxury", "premium materials", 1.4],
  ["premium", "Bespoke", "fully custom", 1.85],
];

// [key, label, baseLo, baseHi, perSqftLo, perSqftHi, perRoom]
export const SCOPE_ITEMS = [
  ["kitchen", "Kitchen", 9000, 16000, 0, 0, 0],
  ["bathroom", "Bathrooms", 7000, 14000, 0, 0, 0],
  ["flooring", "Flooring", 0, 0, 5.5, 11, 0],
  ["painting", "Painting", 0, 0, 1.1, 1.9, 0],
  ["electrical", "Electrical & wiring", 2400, 4800, 0, 0, 260],
  ["carpentry", "Carpentry", 7500, 16000, 0, 0, 1300],
  ["ceiling", "False ceiling", 2200, 4800, 0, 0, 0],
  ["aircon", "Aircon", 1600, 2600, 0, 0, 950],
  ["lighting", "Lighting", 1500, 3800, 0, 0, 0],
  ["furniture", "Built-in furniture", 7000, 18000, 0, 0, 0],
];

export const DEFAULT_SCOPE = {
  kitchen: true,
  bathroom: true,
  flooring: true,
  painting: true,
  electrical: true,
  carpentry: true,
  ceiling: false,
  aircon: false,
  lighting: false,
  furniture: false,
};

export function formatSgd(n) {
  return "S$" + (Math.round(n / 500) * 500).toLocaleString("en-SG");
}

export function computeEstimate({ prop, tier, rooms, area, scope }) {
  const propMult = PROPERTY_TYPES.find((p) => p[0] === prop)[3];
  const tierMult = DESIGN_TIERS.find((t) => t[0] === tier)[3];
  const mult = propMult * tierMult;

  let lo = 0;
  let hi = 0;
  const breakdown = [];

  SCOPE_ITEMS.forEach(([key, label, bLo, bHi, psLo, psHi, perRoom]) => {
    if (!scope[key]) return;
    const rLo = (bLo + psLo * area + perRoom * rooms) * mult;
    const rHi = (bHi + psHi * area + perRoom * rooms) * mult;
    lo += rLo;
    hi += rHi;
    breakdown.push({ label, range: `${formatSgd(rLo)} – ${formatSgd(rHi)}` });
  });

  return { lo, hi, breakdown };
}
