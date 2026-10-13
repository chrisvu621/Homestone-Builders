import Link from "next/link";
import { site } from "@/lib/site";
import { PhoneIcon } from "./Icons";

/** Sticky call bar shown on small screens only. */
export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-ivory/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgb(0_0_0/0.08)] backdrop-blur md:hidden">
      <div className="flex gap-2">
        <a href={site.phone.href} className="btn btn-dark flex-[1.4] gap-2 px-3 whitespace-nowrap" aria-label={`Call Homestone Builders at ${site.phone.display}`}>
          <PhoneIcon className="h-5 w-5" />
          Call {site.phone.display}
        </a>
        <Link href="/contact" className="btn btn-primary flex-1 px-3 whitespace-nowrap">
          Estimate
        </Link>
      </div>
    </div>
  );
}
