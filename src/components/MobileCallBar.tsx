"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { PhoneIcon } from "./Icons";

const isField = (el: EventTarget | null) =>
  el instanceof HTMLElement && el.matches("input:not([type=hidden]), select, textarea");

/**
 * Sticky call bar shown on small screens only. It steps aside while a form field
 * has focus, so it never covers the field being typed in or its error message.
 */
export function MobileCallBar() {
  const pathname = usePathname();
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const onIn = (e: FocusEvent) => isField(e.target) && setTyping(true);
    const onOut = (e: FocusEvent) => isField(e.target) && !isField(e.relatedTarget) && setTyping(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  const onContact = pathname === "/contact";

  return (
    <div
      hidden={typing}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-canvas px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="flex gap-2">
        <a
          href={site.phone.href}
          className="btn btn-outline min-h-12 flex-1 gap-2 px-3 whitespace-nowrap text-ink"
          aria-label={`Call Homestone Builders at ${site.phone.display}`}
        >
          <PhoneIcon className="h-4 w-4" />
          {site.phone.display}
        </a>
        {/* On the estimate page itself, the second button would only link to the page you're on. */}
        {!onContact && (
          <Link href="/contact" className="btn btn-primary min-h-12 flex-1 px-3 whitespace-nowrap">
            Request Estimate
          </Link>
        )}
      </div>
    </div>
  );
}
