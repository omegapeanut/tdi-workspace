// Static placeholder content matching designs/TDI Materials.dc.html.
// TODO: replace with Firestore reads (materials collection) per README.md.

export const materialsData = [
  { id: "oak", name: "Smoked oak veneer", tag: "WOOD", cat: "wood", desc: "Warm mid-tone oak with visible grain. Feature walls, joinery fronts, ceilings.", finish: "Matt lacquer", care: "Low maintenance", img: "/images/material-wood.jpg" },
  { id: "marble", name: "Calacatta marble", tag: "MARBLE", cat: "stone", desc: "Bold-veined statement stone. Reception counters, feature cladding, vanities.", finish: "Honed / polished", care: "Seal yearly", img: "/images/material-marble.jpg" },
  { id: "stone", name: "Sandblasted granite", tag: "STONE", cat: "stone", desc: "Muted, durable natural stone. Flooring, external thresholds, wet areas.", finish: "Sandblasted", care: "Very durable", img: "/images/material-stone.jpg" },
  { id: "tiles", name: "Zellige-look tiles", tag: "TILES", cat: "tiles", desc: "Handmade texture in glazed ceramic. Kitchen backsplashes, bathroom walls, F&B counters.", finish: "Gloss glaze", care: "Wipe clean", img: "/images/material-tiles.jpg" },
  { id: "fabric", name: "Bouclé upholstery", tag: "FABRIC", cat: "fabric", desc: "Soft loop-pile textile. Banquettes, headboards, acoustic panels.", finish: "Stain-guarded", care: "Vacuum weekly", img: "/images/material-fabric.jpg" },
  { id: "metal", name: "Brushed brass", tag: "METAL", cat: "metal", desc: "The house accent. Handles, trims, lighting, signage.", finish: "Brushed, lacquered", care: "Ages gracefully", img: "/images/material-metal.jpg" },
  { id: "terrazzo", name: "Porcelain terrazzo", tag: "TILES", cat: "tiles", desc: "Terrazzo look with porcelain toughness. High-traffic floors, F&B and retail.", finish: "Matt R10", care: "Very durable", img: "/images/material-terrazzo.jpg" },
  { id: "glass", name: "Fluted glass", tag: "GLASS", cat: "glass", desc: "Privacy with light. Partitions, shower screens, cabinet fronts.", finish: "Clear / low-iron", care: "Wipe clean", img: "/images/material-glass.jpg" },
];

export const materialCategories = [
  ["all", "ALL"],
  ["wood", "WOOD"],
  ["stone", "STONE & MARBLE"],
  ["tiles", "TILES"],
  ["fabric", "FABRIC"],
  ["metal", "METAL"],
  ["glass", "GLASS"],
];
