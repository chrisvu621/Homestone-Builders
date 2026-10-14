"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { Close, Menu } from "./Icons";
import { Logo } from "./Logo";

const nav = [
  { href: "/gallery", label: "Our Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas">
      <div className="container-page flex h-16 items-center justify-between gap-6 md:h-[4.75rem]">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="text-[0.92rem] text-ink-soft transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-accent aria-[current=page]:underline-offset-8"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-7 lg:flex">
          <a href={site.phone.href} className="text-[0.92rem] text-ink tabular-nums hover:text-ink-soft">
            {site.phone.display}
          </a>
          <Link href="/contact" className="btn btn-primary min-h-11 px-5 text-[0.9rem]">
            Request an Estimate
          </Link>
        </div>
        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <Close className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      <div id="mobile-menu" hidden={!open} className="border-t border-line bg-canvas lg:hidden">
        <nav aria-label="Mobile" className="container-page flex flex-col py-2">
          {[{ href: "/", label: "Home" }, ...nav].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="type-h3 border-b border-line/70 py-3.5 last:border-0 aria-[current=page]:text-ink-soft"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
