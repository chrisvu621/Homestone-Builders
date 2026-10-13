import { site } from "@/lib/site";
import { MapPin, Store } from "./Icons";

export function ShowroomCard({ compact = false }: { compact?: boolean }) {
  const { showroom } = site;
  return (
    <div className="rounded-xl border border-stone-line bg-white p-6 md:p-8">
      <div className="flex items-start gap-4">
        <span className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-clay-light text-clay-dark">
          <Store />
        </span>
        <div className="space-y-3">
          <p className="eyebrow">Materials showroom · Walk-ins welcome</p>
          <h3 className="text-2xl font-semibold">{showroom.operator}</h3>
          <p className="flex items-start gap-2 text-ink-soft">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
            <span>
              {showroom.street}, {showroom.city}, {showroom.state}
            </span>
          </p>
          <p className="text-ink-soft leading-relaxed">
            The showroom is owned and operated by <strong className="text-ink">{showroom.operator}</strong>, a separate
            materials business. <strong className="text-ink">{site.name}</strong> is the licensed contractor that performs
            construction and installation.
            {!compact && " Visit the showroom to see materials in person, then talk with us about building your project."}
          </p>
          <a
            href={showroom.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-clay underline underline-offset-4"
          >
            Get directions<span className="sr-only"> to the showroom (opens Google Maps in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
