// Static placeholder content matching designs/TDI Projects.dc.html.
// TODO: replace with Firestore reads (projects collection) per README.md.

export const projectsData = {
  C: [
    { name: "Fintech HQ, Raffles Place", tag: "OFFICE", cat: "office", meta: "12,400 SQFT · DESIGN & BUILD · 14 WEEKS", img: "/images/project-fintech.jpg" },
    { name: "Izakaya, Duxton Hill", tag: "F&B", cat: "fnb", meta: "2,100 SQFT · DESIGN & BUILD · 9 WEEKS", img: "/images/project-izakaya.jpg" },
    { name: "Flagship boutique, Orchard", tag: "RETAIL", cat: "retail", meta: "3,800 SQFT · FIT-OUT · 11 WEEKS", img: "/images/project-boutique.jpg" },
    { name: "Dental studio, Novena", tag: "CLINIC", cat: "clinic", meta: "1,600 SQFT · DESIGN & BUILD · 10 WEEKS", img: "/images/project-clinic.jpg" },
    { name: "Coworking loft, CBD", tag: "OFFICE", cat: "office", meta: "8,900 SQFT · FIT-OUT · 12 WEEKS", img: "/images/project-coworking.jpg" },
    { name: "Heritage restaurant, Amoy St", tag: "F&B", cat: "fnb", meta: "2,700 SQFT · RESTORATION + BUILD · 13 WEEKS", img: "/images/project-restaurant.jpg" },
  ],
  R: [
    { name: "Maisonette, Bukit Timah", tag: "LANDED", cat: "landed", meta: "1,650 SQFT · FULL RENOVATION · 10 WEEKS", img: "/images/project-maisonette.jpg" },
    { name: "4-room BTO, Tengah", tag: "HDB", cat: "hdb", meta: "990 SQFT · FULL RENOVATION · 8 WEEKS", img: "/images/project-bto.jpg" },
    { name: "Penthouse, Newton", tag: "CONDO", cat: "condo", meta: "2,300 SQFT · FULL RENOVATION · 12 WEEKS", img: "/images/project-penthouse.jpg" },
    { name: "Master suite, Holland Village", tag: "CONDO", cat: "condo", meta: "1,450 SQFT · PARTIAL RENOVATION · 6 WEEKS", img: "/images/project-condo-bedroom.jpg" },
    { name: "Semi-detached, Serangoon", tag: "LANDED", cat: "landed", meta: "3,600 SQFT · REBUILD INTERIORS · 18 WEEKS", img: "/images/project-landed.jpg" },
    { name: "Resale kitchen, Bishan", tag: "HDB", cat: "hdb", meta: "1,180 SQFT · KITCHEN & WET WORKS · 5 WEEKS", img: "/images/project-hdb-kitchen.jpg" },
  ],
};

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
