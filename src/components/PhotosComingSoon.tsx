import Link from "next/link";

export function PhotosComingSoon({ what }: { what: string }) {
  return (
    <div className="border-t border-line py-10">
      <p className="font-serif text-2xl">{what} photos coming soon.</p>
      <p className="mt-2 max-w-md text-sm text-ink-soft">
        We only show photos of our own completed projects.{" "}
        <Link href="/contact" className="link-quiet text-ink">
          Request an estimate
        </Link>
      </p>
    </div>
  );
}
