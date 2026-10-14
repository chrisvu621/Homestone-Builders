import Link from "next/link";
import { site } from "@/lib/site";
import { PhoneIcon } from "./Icons";

/** Sticky call bar shown on small screens only. */
export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-canvas/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <div className="flex gap-2">
        <a href={site.phone.href} className="btn btn-outline min-h-12 flex-1 gap-2 px-3 whitespace-nowrap text-ink" aria-label={`Call Homestone Builders at ${site.phone.display}`}>
          <PhoneIcon className="h-4 w-4" />
          {site.phone.display}
        </a>
        <Link href="/contact" className="btn btn-primary min-h-12 flex-1 px-3 whitespace-nowrap">
          Request Estimate
        </Link>
      </div>
    </div>
  );
}
