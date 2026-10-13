import type { Metadata } from "next";
import { services } from "./services";
import { getSiteUrl, site } from "./site";

export function pageMetadata(opts: { title: string; description: string; path: string }): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: { title: opts.title, description: opts.description, url: opts.path },
  };
}

/** Business structured data. Only facts supplied by the owner; no address, hours or ratings are claimed. */
export function businessJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${url}/#business`,
    name: site.name,
    url,
    telephone: site.phone.e164,
    logo: `${url}/icon.svg`,
    areaServed: [
      ...site.primaryCities.map((city) => ({
        "@type": "City",
        name: `${city}, CA`,
      })),
      { "@type": "AdministrativeArea", name: "Orange County, CA" },
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: `California contractor license #${site.licenseNumber}`,
      recognizedBy: {
        "@type": "GovernmentOrganization",
        name: "Contractors State License Board",
        url: "https://www.cslb.ca.gov/",
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Construction services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: `${url}/services/${s.slug}` },
      })),
    },
  };
}
