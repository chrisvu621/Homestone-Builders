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
  intro: string[];
  scopeHeading: string;
  scope: string[];
  planningHeading: string;
  planning: string[];
  /** Photo folder under public/projects used on this page, if any. */
  photoCategory?: ProjectCategory;
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
    heading: "Kitchen remodeling in Orange County",
    intro: [
      "A kitchen remodel touches almost every trade in the house: demolition, framing, plumbing, electrical, cabinetry, countertops, tile, flooring and finish work. Homestone Builders Inc. manages the construction and installation so you are working with one licensed general contractor instead of coordinating separate crews.",
      "Whether you are refreshing finishes or reworking the whole layout, we start by understanding how you use the space and what you want to change.",
    ],
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
      "Have you started choosing materials? You can see stone and other surfaces in person at the nearby showroom operated by Hometrade Stone & Marble.",
    ],
    photoCategory: "kitchens",
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
    heading: "Bathroom remodeling in Orange County",
    intro: [
      "Bathrooms pack plumbing, waterproofing, tile, electrical and ventilation into a small footprint, so careful sequencing matters. Homestone Builders Inc. handles the construction and installation from demolition through finish work.",
      "Projects range from replacing a dated vanity and tub to fully rebuilding a primary bathroom with a walk-in shower.",
    ],
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
    heading: "ADU construction in Orange County",
    intro: [
      "An accessory dwelling unit (ADU) adds a separate living space on your lot, whether that is a detached backyard unit, an addition attached to the main house, or a converted garage. Homestone Builders Inc. builds ADUs as a licensed California general contractor.",
      "ADUs require plans and a building permit from your city, and requirements differ from city to city. We will talk through your lot, goals and timeline so you understand the path before construction begins.",
    ],
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
    heading: "New home construction in Orange County",
    intro: [
      "Building a new home, or replacing an existing one, is the largest project most homeowners will take on. Homestone Builders Inc. performs ground-up residential construction as a licensed California general contractor.",
      "Every new-home project is different. Tell us about your lot, your plans and where you are in the design process, and we will discuss next steps.",
    ],
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
    heading: "Window and door installation",
    intro: [
      "New windows and doors change how a home looks, sounds and feels. Homestone Builders Inc. installs windows and doors as a standalone project or as part of a larger remodel.",
    ],
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
    heading: "Shower door installation",
    intro: [
      "A glass shower door or enclosure can be the finishing piece of a bathroom remodel, or a quick upgrade on its own. Homestone Builders Inc. installs shower doors in new and existing showers.",
    ],
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
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
