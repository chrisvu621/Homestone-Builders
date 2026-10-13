import Link from "next/link";
import { Camera } from "./Icons";

export function PhotosComingSoon({ what }: { what: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-stone-line bg-white/50 px-6 py-12 text-center">
      <Camera className="h-8 w-8 text-clay" />
      <p className="font-display text-xl">{what} photos coming soon</p>
      <p className="max-w-md text-sm text-ink-soft">
        We only show photos of our own completed projects. Want to talk about yours in the meantime?
      </p>
      <Link href="/contact" className="text-sm font-semibold text-clay underline underline-offset-4">
        Request an estimate
      </Link>
    </div>
  );
}
