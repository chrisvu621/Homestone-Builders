"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { Close, Menu, PhoneIcon } from "./Icons";
import { Logo } from "./Logo";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
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
    <header className="sticky top-0 z-40 border-b border-stone-line/80 bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/85">
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="rounded-md px-3 py-2 text-[0.95rem] font-medium text-ink-soft hover:text-ink aria-[current=page]:text-clay"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a href={site.phone.href} className="flex items-center gap-2 font-semibold text-ink hover:text-clay">
            <PhoneIcon className="h-4 w-4" />
            {site.phone.display}
          </a>
          <Link href="/contact" className="btn btn-primary min-h-11 px-4 text-[0.95rem]">
            Request an Estimate
          </Link>
        </div>
        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <Close /> : <Menu />}
        </button>
      </div>
      <div id="mobile-menu" hidden={!open} className="border-t border-stone-line bg-ivory md:hidden">
        <nav aria-label="Mobile" className="container-page flex flex-col py-3">
          {[{ href: "/", label: "Home" }, ...nav, { href: "/privacy", label: "Privacy" }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="border-b border-stone-line/60 py-3.5 text-lg font-medium last:border-0 aria-[current=page]:text-clay"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-primary mt-3 w-full">
            Request an Estimate
          </Link>
        </nav>
      </div>
    </header>
  );
}
