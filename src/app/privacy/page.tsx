import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} collects and uses the information you submit through this website.`,
  path: "/privacy",
});

/** Update this date whenever the policy text changes. */
const LAST_UPDATED = "October 13, 2026";

export default function PrivacyPage() {
  const turnstile = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  return (
    <>
      <PageHeader crumbs={[{ name: "Privacy Policy", href: "/privacy" }]} title="Privacy Policy">
        <p>Last updated: {LAST_UPDATED}</p>
      </PageHeader>
      <article className="container-page max-w-3xl py-12 md:py-16 prose-page">
        <p>
          This policy explains what information {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects through this
          website and how we use it. It covers this website only.
        </p>

        <h2>Information you give us</h2>
        <p>When you submit the <Link href="/contact">Request an Estimate</Link> form, we collect:</p>
        <ul>
          <li>Your name</li>
          <li>Your phone number</li>
          <li>Your email address (optional)</li>
          <li>The city where your project is located</li>
          <li>The service you&apos;re interested in and your timeline (timeline is optional)</li>
          <li>Your project description, plus anything else you choose to include in it</li>
        </ul>
        <p>Please don&apos;t include sensitive information such as financial account numbers in the description.</p>

        <h2>Information collected automatically</h2>
        <ul>
          <li>
            <strong>Spam prevention.</strong> When you submit the form, our server uses your IP address briefly to limit
            repeated submissions. The form also records when it was opened to filter out automated bots. We don&apos;t
            store this data with your request.
          </li>
          {turnstile && (
            <li>
              <strong>Cloudflare Turnstile.</strong> The form uses Cloudflare Turnstile to check that submissions come
              from a person. Cloudflare processes information about your browser and device for this purpose under its
              own{" "}
              <a href="https://www.cloudflare.com/turnstile-privacy-policy/" target="_blank" rel="noopener noreferrer">
                privacy policy
              </a>
              .
            </li>
          )}
          <li>
            <strong>Hosting logs.</strong> Like most websites, our hosting provider may automatically record technical
            information such as IP address, browser type and pages requested, for security and operations.
          </li>
        </ul>
        <p>
          This website does not use advertising or analytics cookies, and we do not use your information for
          cross-site tracking.
        </p>

        <h2>How we use your information</h2>
        <ul>
          <li>To respond to your estimate request and contact you about your project</li>
          <li>To keep records of the requests and communications we receive</li>
          <li>To protect the website from spam and abuse</li>
        </ul>
        <p>
          When you submit the form, your request is sent to our business inbox through an email delivery service. That
          service handles the message on our behalf in order to deliver it.
        </p>

        <h2>Sharing</h2>
        <p>
          We do not sell your personal information or share it for advertising. We share it only with service providers
          that help us run this website and deliver your request (for example, our hosting and email delivery
          providers), or when required by law.
        </p>
        <p>
          The materials showroom at {site.showroom.street}, {site.showroom.city} is operated by{" "}
          {site.showroom.operator}, a separate business. Requests submitted on this website go to {site.name}.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep estimate requests for as long as needed to respond to you, carry out any project you hire us for, and
          meet our business and legal record-keeping obligations.
        </p>

        <h2>Your choices and California privacy rights</h2>
        <p>
          You can ask us to tell you what information we have about you from this website, correct it, or delete it.
          California residents may have additional rights under California law. To make a request, call us at{" "}
          <a href={site.phone.href}>{site.phone.display}</a>. We may need to confirm your identity before acting on a
          request, and we won&apos;t treat you differently for making one.
        </p>

        <h2>Children</h2>
        <p>This website is intended for adults planning home projects. We don&apos;t knowingly collect information from children under 16.</p>

        <h2>Changes</h2>
        <p>If we change this policy, we&apos;ll update it on this page and change the &ldquo;Last updated&rdquo; date above.</p>

        <h2>Contact</h2>
        <p>
          {site.name}
          <br />
          Phone: <a href={site.phone.href}>{site.phone.display}</a>
        </p>
      </article>
    </>
  );
}
