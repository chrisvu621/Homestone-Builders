import { site } from "@/lib/site";

/** Showroom notice. Always states that the showroom is a separate business. */
export function ShowroomCard({ compact = false }: { compact?: boolean }) {
  const { showroom } = site;
  return (
    <div className="border-t border-ink pt-6">
      <p className="eyebrow">Materials showroom · Walk-ins welcome</p>
      <h3 className="type-h3 mt-3 font-normal">{showroom.operator}</h3>
      <p className="mt-1 text-ink-soft">
        {showroom.street}, {showroom.city}, {showroom.state}
      </p>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
        Owned and operated by {showroom.operator}, a separate materials business. {site.name} is the licensed
        contractor that performs construction and installation.
        {!compact && " See materials in person, then talk with us about building your project."}
      </p>
      <a
        href={showroom.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="link-quiet mt-4 inline-block text-sm text-ink"
      >
        Get directions<span className="sr-only"> to the showroom (opens Google Maps in a new tab)</span>
      </a>
    </div>
  );
}
