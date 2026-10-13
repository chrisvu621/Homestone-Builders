import { EstimateForm } from "@/components/EstimateForm";
import { PhoneIcon } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { ShowroomCard } from "@/components/ShowroomCard";
import { getEmailConfig } from "@/lib/estimate/email";
import { pageMetadata } from "@/lib/seo";
import { primaryCitiesText, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Request an Estimate",
  description: `Request an estimate from ${site.name} for kitchen or bathroom remodeling, ADUs, new homes, windows, doors or shower doors in Orange County. Call ${site.phone.display}.`,
  path: "/contact",
});

function SetupInstructions({ missing, problems }: { missing: string[]; problems: string[] }) {
  return (
    <div className="mb-8 rounded-xl border-2 border-amber-600/50 bg-amber-50 p-6 text-amber-950">
      <p className="font-semibold">Developer notice: estimate emails are not configured</p>
      <p className="mt-2 text-sm">
        Submissions will be rejected (not silently dropped) until email delivery is set up. This notice only appears in
        development; in production, visitors see a message asking them to call.
      </p>
      {missing.length > 0 && (
        <p className="mt-3 text-sm">
          Missing environment variables: <code className="font-mono font-semibold">{missing.join(", ")}</code>
        </p>
      )}
      {problems.map((p) => (
        <p key={p} className="mt-2 text-sm">{p}</p>
      ))}
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
        <li>Copy <code className="font-mono">.env.example</code> to <code className="font-mono">.env.local</code>.</li>
        <li>
          Set <code className="font-mono">EMAIL_PROVIDER</code> (resend, postmark or sendgrid),{" "}
          <code className="font-mono">EMAIL_API_KEY</code>, <code className="font-mono">EMAIL_FROM</code> (a sender
          verified with that provider) and <code className="font-mono">EMAIL_TO</code>.
        </li>
        <li>Restart <code className="font-mono">npm run dev</code>. On Vercel, add the same variables under Project → Settings → Environment Variables and redeploy.</li>
      </ol>
      <p className="mt-3 text-sm">See README.md → &ldquo;Estimate form email setup&rdquo; for details.</p>
    </div>
  );
}

export default function ContactPage() {
  const email = getEmailConfig();
  const showSetup = !email.configured && process.env.NODE_ENV !== "production";
  const productionUnconfigured = !email.configured && process.env.NODE_ENV === "production";

  return (
    <>
      <PageHeader crumbs={[{ name: "Request an Estimate", href: "/contact" }]} eyebrow="Contact" title="Request an estimate">
        <p>
          Tell us about your project and we&apos;ll follow up to talk through scope and next steps. Prefer the phone? Call{" "}
          <a href={site.phone.href} className="font-semibold text-clay">{site.phone.display}</a>.
        </p>
      </PageHeader>

      <section className="container-page grid gap-12 py-12 md:py-16 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <div>
          {!email.configured && showSetup && <SetupInstructions missing={email.missing} problems={email.problems} />}
          {productionUnconfigured ? (
            <div className="rounded-xl border border-stone-line bg-white p-8">
              <h2 className="text-2xl font-semibold">Our online form is temporarily unavailable</h2>
              <p className="mt-3 text-ink-soft">Please call us to request an estimate.</p>
              <a href={site.phone.href} className="btn btn-primary mt-6">
                <PhoneIcon /> Call {site.phone.display}
              </a>
            </div>
          ) : (
            <div className="rounded-xl border border-stone-line bg-white p-6 md:p-8">
              <EstimateForm
                cities={site.primaryCities}
                turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined}
              />
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl bg-charcoal p-6 text-ivory md:p-8">
            <p className="eyebrow !text-clay-light">Call us</p>
            <a href={site.phone.href} className="mt-2 flex items-center gap-3 font-display text-3xl font-semibold">
              <PhoneIcon className="h-7 w-7" /> {site.phone.display}
            </a>
            <p className="mt-4 text-sm text-sand/80">
              {site.name} · CSLB License #{site.licenseNumber}
            </p>
          </div>
          <div className="rounded-xl border border-stone-line bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold">Service area</h2>
            <p className="mt-3 text-ink-soft leading-relaxed">
              Primary service cities: {primaryCitiesText}. Other Orange County cities are considered on a
              project-by-project basis.
            </p>
          </div>
          <ShowroomCard compact />
        </aside>
      </section>
    </>
  );
}
