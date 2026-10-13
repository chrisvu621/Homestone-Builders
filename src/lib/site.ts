/**
 * Single source of truth for business facts.
 *
 * Everything here was supplied by the business owner. Do not add claims
 * (years in business, ratings, insurance, bonding, guarantees, project counts,
 * certifications) unless they have been verified and supplied by the owner.
 */

export const site = {
  name: "Homestone Builders Inc.",
  shortName: "Homestone Builders",
  licenseNumber: "1142545",
  licenseAuthority: "California Contractors State License Board (CSLB)",
  /** Public CSLB lookup tool. We link to it so visitors can check the license themselves. */
  licenseLookupUrl:
    "https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx",
  phone: {
    display: "714-475-2377",
    href: "tel:7144752377",
    e164: "+17144752377",
  },
  region: "Orange County, California",
  primaryCities: [
    "Garden Grove",
    "Westminster",
    "Fountain Valley",
    "Huntington Beach",
    "Santa Ana",
    "Stanton",
    "Midway City",
  ],
  showroom: {
    operator: "Hometrade Stone & Marble",
    street: "13962 Seaboard",
    city: "Garden Grove",
    state: "CA",
    walkIns: true,
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Hometrade Stone & Marble, 13962 Seaboard, Garden Grove, CA"),
  },
} as const;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const primaryCitiesText = (() => {
  const c = [...site.primaryCities];
  const last = c.pop();
  return `${c.join(", ")} and ${last}`;
})();
