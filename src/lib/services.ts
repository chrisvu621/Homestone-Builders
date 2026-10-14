import type { ProjectCategory } from "./projects";

export type Service = {
  slug: string;
  name: string;
  /** Short label used in navigation, cards and the estimate form. */
  label: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  heading: string;
  intro: string;
  scopeHeading: string;
  scope: string[];
  planningHeading: string;
  planning: string[];
  /** Photo folder under public/projects used on this page, if any. */
  photoCategory?: ProjectCategory;
  /** Large photo near the top of the page, as "<folder>/<file>". Defaults to the first project photo. */
  heroPhoto?: string;
};

export const services: Service[] = [
  {
    slug: "kitchen-remodeling",
    name: "Kitchen Remodeling",
    label: "Kitchen remodeling",
    summary:
      "Layout changes, cabinetry, countertops, flooring, lighting and finish work, built and installed by one licensed contractor.",
    seoTitle: "Kitchen Remodeling in Garden Grove & Orange County",
    seoDescription:
      "Kitchen remodeling by Homestone Builders Inc., a licensed California general contractor (CSLB #1142545) serving Garden Grove, Westminster, Huntington Beach and nearby Orange County cities. Call 714-475-2377.",
    heading: "Kitchen remodeling",
    intro:
      "From new finishes to a reworked layout, we handle the construction and installation, so you work with one licensed general contractor instead of separate crews.",
    scopeHeading: "What a kitchen project can include",
    scope: [
      "Layout changes and opening up walls (subject to structural review and permits)",
      "Cabinet installation",
      "Countertop and backsplash installation",
      "Flooring",
      "Lighting and electrical updates",
      "Plumbing fixture relocation and replacement",
      "Paint, trim and finish carpentry",
    ],
    planningHeading: "Helpful to think about before we talk",
    planning: [
      "Which parts of the current kitchen work well, and which frustrate you every day?",
      "Are you keeping the current layout, or moving sinks, appliances or walls?",
      "Do you have a budget range and a target timeline in mind?",
      "Have you started choosing materials?",
    ],
    photoCategory: "kitchens",
    heroPhoto: "kitchens/kitchen-02.jpg",
  },
  {
    slug: "bathroom-remodeling",
    name: "Bathroom Remodeling",
    label: "Bathroom remodeling",
    summary:
      "Showers, tubs, vanities, tile and fixtures, from a single-bath refresh to a full primary-suite remodel.",
    seoTitle: "Bathroom Remodeling in Garden Grove & Orange County",
    seoDescription:
      "Bathroom remodeling by Homestone Builders Inc., licensed California general contractor CSLB #1142545. Showers, tubs, vanities and tile for homes in Garden Grove, Westminster, Fountain Valley and nearby cities.",
    heading: "Bathroom remodeling",
    intro:
      "Showers, tubs, vanities and tile, from a single-bath refresh to a full rebuild. We handle demolition through finish work.",
    scopeHeading: "What a bathroom project can include",
    scope: [
      "Shower and tub replacement, including tub-to-shower conversions",
      "Tile for floors, walls and shower surrounds",
      "Vanity and countertop installation",
      "Plumbing fixture replacement",
      "Lighting, electrical and ventilation updates",
      "Glass shower door installation",
    ],
    planningHeading: "Helpful to think about before we talk",
    planning: [
      "Is this a hall bath, guest bath or primary bathroom, and who uses it most?",
      "Are you keeping the tub, converting to a shower, or both?",
      "Any accessibility needs, such as a lower shower threshold or grab-bar blocking?",
      "Do you have tile, stone or fixtures picked out already?",
    ],
    photoCategory: "bathrooms",
  },
  {
    slug: "adu-construction",
    name: "ADU Construction",
    label: "ADUs (accessory dwelling units)",
    summary:
      "Detached, attached and garage-conversion accessory dwelling units for Orange County properties.",
    seoTitle: "ADU Builder in Garden Grove & Orange County",
    seoDescription:
      "Accessory dwelling unit (ADU) construction by Homestone Builders Inc., licensed California general contractor CSLB #1142545, serving Garden Grove, Santa Ana, Westminster and nearby Orange County cities.",
    heading: "ADU construction",
    intro:
      "Detached units, attached additions and garage conversions. ADUs need plans and a city building permit, and requirements vary by city, so we start with your lot, goals and timeline.",
    scopeHeading: "Common types of ADU projects",
    scope: [
      "Detached ADUs in the backyard",
      "Attached ADUs that extend the main house",
      "Garage conversions",
      "Junior ADUs (JADUs) created within the existing home",
    ],
    planningHeading: "Helpful to think about before we talk",
    planning: [
      "How will the ADU be used: family, guests, a home office or a rental?",
      "Do you know your lot size and where utilities enter the property?",
      "Do you already have plans drawn, or are you starting from an idea?",
      "What is your target timeline? Plan review and permitting are part of every ADU schedule.",
    ],
  },
  {
    slug: "new-home-construction",
    name: "New Home Construction",
    label: "New home construction",
    summary:
      "Ground-up residential construction on your lot, managed by a licensed general contractor.",
    seoTitle: "New Home Construction in Orange County",
    seoDescription:
      "New home construction by Homestone Builders Inc., licensed California general contractor CSLB #1142545, serving Garden Grove, Huntington Beach, Fountain Valley and nearby Orange County cities.",
    heading: "New home construction",
    intro:
      "Ground-up residential construction on your lot, including demolish-and-rebuild projects. Tell us where you are in the design process and we'll discuss next steps.",
    scopeHeading: "Where you might be in the process",
    scope: [
      "You own a lot and are starting from scratch",
      "You plan to demolish and rebuild an existing home",
      "You have architectural plans and are looking for a builder",
      "You have plans in city review or already approved",
    ],
    planningHeading: "Helpful to have ready when you call",
    planning: [
      "The property address or city",
      "Any plans, surveys or city correspondence you already have",
      "Your target budget range and move-in timeline",
    ],
  },
  {
    slug: "windows-and-doors",
    name: "Windows & Doors",
    label: "Windows and doors",
    summary:
      "Replacement windows, entry doors, patio and sliding doors, installed as a standalone job or part of a larger remodel.",
    seoTitle: "Window & Door Installation in Orange County",
    seoDescription:
      "Window and door installation by Homestone Builders Inc., licensed California general contractor CSLB #1142545, serving Garden Grove, Westminster, Stanton, Midway City and nearby Orange County cities.",
    heading: "Windows & doors",
    intro:
      "Replacement windows, entry doors and sliding patio doors, installed on their own or as part of a larger remodel.",
    scopeHeading: "What we install",
    scope: [
      "Replacement windows",
      "Entry doors",
      "Sliding and patio doors",
      "Interior doors as part of remodel projects",
    ],
    planningHeading: "Helpful to have ready when you call",
    planning: [
      "How many windows or doors you want to replace, and which rooms they are in",
      "Whether you are changing any opening sizes",
      "Photos of the existing windows or doors, if you have them",
    ],
  },
  {
    slug: "shower-doors",
    name: "Shower Doors",
    label: "Shower doors",
    summary:
      "Glass shower door and enclosure installation for new and existing bathrooms.",
    seoTitle: "Shower Door Installation in Orange County",
    seoDescription:
      "Glass shower door installation by Homestone Builders Inc., licensed California general contractor CSLB #1142545, serving Garden Grove, Fountain Valley, Huntington Beach and nearby Orange County cities.",
    heading: "Shower doors",
    intro:
      "Glass shower doors and enclosures for new and existing showers, as a finishing piece of a remodel or a quick upgrade on its own.",
    scopeHeading: "Common shower door projects",
    scope: [
      "Replacing an existing shower door",
      "Replacing a shower curtain with a glass door or panel",
      "New enclosures as part of a bathroom remodel",
    ],
    planningHeading: "Helpful to have ready when you call",
    planning: [
      "Rough measurements of the shower opening",
      "Photos of the current shower",
      "Whether the shower is being rebuilt or staying as-is",
    ],
    photoCategory: "shower-doors",
    heroPhoto: "bathrooms/bathroom-02.jpg",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
