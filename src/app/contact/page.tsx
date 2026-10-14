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
    <div className="mb-8 border-l-2 border-amber-600 bg-amber-50 p-6 text-amber-950">
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
        <p>Tell us about your project and we&apos;ll follow up to talk through scope and next steps.</p>
      </PageHeader>

      <section className="container-page grid gap-14 pb-16 md:pb-24 lg:grid-cols-[1.7fr_1fr] lg:gap-24">
        <div>
          {!email.configured && showSetup && <SetupInstructions missing={email.missing} problems={email.problems} />}
          {productionUnconfigured ? (
            <div className="border-t border-ink pt-8">
              <h2 className="text-3xl">Our online form is temporarily unavailable</h2>
              <p className="mt-3 text-ink-soft">Please call us to request an estimate.</p>
              <a href={site.phone.href} className="btn btn-primary mt-6">
                <PhoneIcon className="h-4 w-4" /> Call {site.phone.display}
              </a>
            </div>
          ) : (
            <div className="border-t border-ink pt-8">
              <EstimateForm
                cities={site.primaryCities}
                turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined}
              />
            </div>
          )}
        </div>

        <aside className="space-y-12">
          <div className="border-t border-ink pt-6">
            <p className="eyebrow">Prefer the phone?</p>
            <a href={site.phone.href} className="mt-3 block font-serif text-[2.4rem] leading-none tabular-nums">
              {site.phone.display}
            </a>
            <p className="mt-3 text-sm text-ink-soft">
              {site.name} · CSLB #{site.licenseNumber}
            </p>
          </div>
          <div className="border-t border-ink pt-6">
            <p className="eyebrow">Service area</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Primary service cities: {primaryCitiesText}. Other Orange County cities on a project-by-project basis.
            </p>
          </div>
          <ShowroomCard compact />
        </aside>
      </section>
    </>
  );
}
