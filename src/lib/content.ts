/**
 * Content model for the explorer, finishes and gallery.
 * Swap `src` paths for Titan's own project photos — no component changes needed.
 */

export type ProjectType = "garage" | "pool-deck" | "patio" | "driveway" | "walkway" | "commercial";

export type Hotspot = {
  /** Position as % of the image (0–100). */
  x: number;
  y: number;
  title: string;
  body: string;
};

/**
 * A "view" is anything the explorer stage can render. Today we ship pannable
 * photography; `matterport` and `pano360` are reserved so real 3D / 360°
 * captures can drop straight into the same stage later.
 */
export type ExplorerView =
  | { kind: "photo"; src: string; alt: string; label: string; hotspots?: Hotspot[] }
  | { kind: "matterport"; modelId: string; label: string }
  | { kind: "pano360"; src: string; label: string };

export type ProjectCategory = {
  id: ProjectType;
  label: string;
  plural: string;
  headline: string;
  blurb: string;
  facts: string[];
  cover: string;
  views: ExplorerView[];
};

const warranty: Hotspot = {
  x: 0,
  y: 0,
  title: "Life of the Home Warranty",
  body: "Every epoxy and polyaspartic installation is backed for as long as you own the home.",
};
const at = (h: Hotspot, x: number, y: number): Hotspot => ({ ...h, x, y });

export const projectCategories: ProjectCategory[] = [
  {
    id: "garage",
    label: "Garage",
    plural: "Garages",
    headline: "A garage you’ll actually want to show off",
    blurb: "Full-broadcast flake with a high-gloss polyaspartic topcoat. Hot-tire, oil and chemical resistant.",
    facts: ["1-day install", "Showroom gloss", "Hot-tire resistant"],
    cover: "/images/projects/garage-showroom.jpg",
    views: [
      {
        kind: "photo",
        src: "/images/projects/garage-showroom.jpg",
        alt: "Finished flake-coated garage floor with high-gloss topcoat, sports car and black cabinetry",
        label: "Showroom garage",
        hotspots: [
          { x: 30, y: 78, title: "Full-broadcast flake", body: "Decorative flake hides imperfections and adds texture underfoot." },
          { x: 70, y: 70, title: "Polyaspartic topcoat", body: "UV-stable, high-gloss and built for hot tires, oil and road salt." },
          at(warranty, 58, 58),
        ],
      },
      {
        kind: "photo",
        src: "/images/projects/garage-sunlit.jpg",
        alt: "Sunlit garage with gray flake epoxy floor and dark cabinets",
        label: "Two-car garage",
        hotspots: [
          { x: 44, y: 66, title: "Wipes clean", body: "Sealed surface — spills and dirt stay on top, not in your concrete." },
          { x: 78, y: 82, title: "Moisture mitigation", body: "Primer system designed for Florida slabs to help prevent peeling." },
        ],
      },
      {
        kind: "photo",
        src: "/images/projects/after-garage.jpg",
        alt: "Garage after coating with glossy gray flake floor",
        label: "After transformation",
      },
    ],
  },
  {
    id: "pool-deck",
    label: "Pool Deck",
    plural: "Pool Decks",
    headline: "A pool deck that stays cool, clean and grippy",
    blurb: "Textured flake systems made for bare feet, Florida sun and chlorine.",
    facts: ["UV-stable", "Textured finish", "Chlorine resistant"],
    cover: "/images/projects/pool-deck-lanai.jpg",
    views: [
      {
        kind: "photo",
        src: "/images/projects/pool-deck-lanai.jpg",
        alt: "Screened lanai pool with light gray flake-coated pool deck",
        label: "Lanai pool deck",
        hotspots: [
          { x: 55, y: 80, title: "Textured surface", body: "Topcoat texture helps with traction when the deck is wet." },
          { x: 80, y: 58, title: "Seamless to the lanai", body: "One continuous finish from pool edge to outdoor living area." },
        ],
      },
      {
        kind: "photo",
        src: "/images/projects/pool-deck-waterfall.jpg",
        alt: "Pool deck with waterfall feature and speckled coating",
        label: "Waterfall pool",
        hotspots: [{ x: 30, y: 72, title: "Won’t yellow", body: "UV-stable polyaspartic keeps its color in full Florida sun." }],
      },
    ],
  },
  {
    id: "patio",
    label: "Patio",
    plural: "Patios",
    headline: "Outdoor living, finished properly",
    blurb: "Lanais and patios that match the quality of your furniture and outdoor kitchen.",
    facts: ["Indoor or outdoor", "Low maintenance", "UV-stable"],
    cover: "/images/projects/patio-outdoor-kitchen.jpg",
    views: [
      {
        kind: "photo",
        src: "/images/projects/patio-outdoor-kitchen.jpg",
        alt: "Covered patio with outdoor kitchen and glossy flake floor",
        label: "Outdoor kitchen lanai",
        hotspots: [
          { x: 30, y: 82, title: "Hose-off clean", body: "Grease and spills from the grill wipe right up." },
          { x: 75, y: 72, title: "Covers old concrete", body: "Cracks and stains are repaired and hidden before coating." },
        ],
      },
    ],
  },
  {
    id: "driveway",
    label: "Driveway",
    plural: "Driveways",
    headline: "Curb appeal from the street to the garage door",
    blurb: "Durable coatings that stand up to vehicles, rain and sun — and look sharp doing it.",
    facts: ["Vehicle-rated", "Weather resistant", "Fresh curb appeal"],
    cover: "/images/projects/driveway.jpg",
    views: [
      {
        kind: "photo",
        src: "/images/projects/driveway.jpg",
        alt: "Flake-coated driveway leading to a modern Florida home",
        label: "Full driveway",
        hotspots: [
          { x: 45, y: 72, title: "Built for vehicles", body: "Industrial-grade coating rated for daily traffic." },
          { x: 72, y: 50, title: "Clean control joints", body: "Joints are kept crisp so the slab looks intentional." },
        ],
      },
    ],
  },
  {
    id: "walkway",
    label: "Walkway",
    plural: "Walkways",
    headline: "Make the first step a good impression",
    blurb: "Entry walks and steps coated to match — the path guests notice first.",
    facts: ["Slip-conscious texture", "Matches driveway", "Steps & entries"],
    cover: "/images/projects/walkway.jpg",
    views: [
      {
        kind: "photo",
        src: "/images/projects/walkway.jpg",
        alt: "Curved front walkway with speckled coating and landscape lighting",
        label: "Front entry walk",
        hotspots: [
          { x: 52, y: 72, title: "Curves & steps", body: "Hand-detailed edges follow every curve and step." },
          { x: 52, y: 32, title: "Coated steps", body: "Entry steps finished to match the walk." },
        ],
      },
    ],
  },
  {
    id: "commercial",
    label: "Commercial",
    plural: "Commercial",
    headline: "Floors that work as hard as your team",
    blurb: "Shops, warehouses and showrooms — durable, bright and easy to keep clean.",
    facts: ["Industrial grade", "Abrasion resistant", "Brighter space"],
    cover: "/images/projects/commercial-shop.jpg",
    views: [
      {
        kind: "photo",
        src: "/images/projects/commercial-shop.jpg",
        alt: "Large commercial shop with high-gloss gray flake floor",
        label: "Shop floor",
        hotspots: [
          { x: 40, y: 70, title: "High abrasion", body: "Industrial-grade coating for carts, forklifts and foot traffic." },
          { x: 75, y: 48, title: "Reflects light", body: "Gloss finish brightens the whole workspace." },
        ],
      },
    ],
  },
];

export type Finish = {
  id: string;
  name: string;
  tone: string;
  description: string;
  floor: string;
  swatch: string;
};

/** Representative looks. Titan offers 25+ flake blends — see `flakeBlends`. */
export const finishes: Finish[] = [
  {
    id: "granite",
    name: "Granite",
    tone: "Black · White · Gray",
    description: "High-contrast salt-and-pepper. Our most popular garage look.",
    floor: "/images/finishes/granite-floor.jpg",
    swatch: "/images/finishes/granite-swatch.jpg",
  },
  {
    id: "domino",
    name: "Domino",
    tone: "White · Black accent",
    description: "Bright and clean — makes any garage feel bigger.",
    floor: "/images/finishes/domino-floor.jpg",
    swatch: "/images/finishes/domino-swatch.jpg",
  },
  {
    id: "stone",
    name: "Stone",
    tone: "Tan · Cream · Brown",
    description: "Warm, natural tones that pair with pavers and Florida stucco.",
    floor: "/images/finishes/stone-floor.jpg",
    swatch: "/images/finishes/stone-swatch.jpg",
  },
  {
    id: "graphite",
    name: "Graphite",
    tone: "Charcoal · Gray",
    description: "Low-key and modern. Hides dirt between cleanings.",
    floor: "/images/finishes/graphite-floor.jpg",
    swatch: "/images/finishes/graphite-swatch.jpg",
  },
  {
    id: "custom",
    name: "Custom",
    tone: "Your colors",
    description: "Team colors, brand colors, or something no one else has.",
    floor: "/images/finishes/custom-floor.jpg",
    swatch: "/images/finishes/custom-swatch.jpg",
  },
];

/** Actual blend names from Titan's flake color gallery. */
export const flakeBlends = [
  "Gravel", "Outback", "Orbit", "Moon-Stone", "Pepper", "Pumice", "Rainwashed", "Sandalwood",
  "Silver-Night", "Shoreline", "Shadow", "Vanilla Bean", "ButterCream", "Chinchilla", "Glacier",
  "Raven", "Blue Steel", "Stonehenge", "Smokey-Blue", "Creekbed", "Wombat", "Tidal Wave",
  "Stargazer", "French-Toast",
];

export type GalleryItem = {
  src: string;
  alt: string;
  type: ProjectType;
  caption: string;
  width: number;
  height: number;
};

export const gallery: GalleryItem[] = [
  { src: "/images/projects/garage-showroom.jpg", alt: "Showroom garage with glossy flake floor", type: "garage", caption: "Showroom garage", width: 1672, height: 941 },
  { src: "/images/projects/pool-deck-lanai.jpg", alt: "Screened pool deck with gray flake coating", type: "pool-deck", caption: "Lanai pool deck", width: 1536, height: 1024 },
  { src: "/images/projects/driveway.jpg", alt: "Coated driveway at a Florida home", type: "driveway", caption: "Full driveway", width: 1672, height: 941 },
  { src: "/images/projects/walkway.jpg", alt: "Coated front walkway with landscape lighting", type: "walkway", caption: "Front entry walkway", width: 1672, height: 941 },
  { src: "/images/projects/garage-sunlit.jpg", alt: "Two-car garage with gray flake floor", type: "garage", caption: "Two-car garage", width: 1672, height: 941 },
  { src: "/images/projects/patio-outdoor-kitchen.jpg", alt: "Covered patio with outdoor kitchen", type: "patio", caption: "Outdoor kitchen lanai", width: 1672, height: 941 },
  { src: "/images/projects/commercial-shop.jpg", alt: "Commercial shop floor coating", type: "commercial", caption: "Commercial shop", width: 1672, height: 941 },
  { src: "/images/projects/pool-deck-waterfall.jpg", alt: "Pool deck with waterfall", type: "pool-deck", caption: "Waterfall pool deck", width: 1672, height: 941 },
  { src: "/images/projects/after-garage.jpg", alt: "Garage floor after coating", type: "garage", caption: "Garage makeover", width: 764, height: 1024 },
];

export const estimateSizes: Record<"garage" | "default", { id: string; label: string; hint: string }[]> = {
  garage: [
    { id: "1-car", label: "1-Car", hint: "≈ 250 sq ft" },
    { id: "2-car", label: "2-Car", hint: "≈ 450 sq ft" },
    { id: "3-car", label: "3-Car", hint: "≈ 650 sq ft" },
    { id: "unsure", label: "Not sure", hint: "We’ll measure" },
  ],
  default: [
    { id: "small", label: "Small", hint: "Under 300 sq ft" },
    { id: "medium", label: "Medium", hint: "300–600 sq ft" },
    { id: "large", label: "Large", hint: "600+ sq ft" },
    { id: "unsure", label: "Not sure", hint: "We’ll measure" },
  ],
};

export const estimateTimelines = [
  { id: "asap", label: "ASAP" },
  { id: "30-days", label: "Within 30 Days" },
  { id: "1-3-months", label: "1–3 Months" },
  { id: "researching", label: "Just Researching" },
];
