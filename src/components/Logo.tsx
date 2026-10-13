import Link from "next/link";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const text = tone === "dark" ? "text-ink" : "text-ivory";
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${text}`} aria-label="Homestone Builders Inc. home">
      <svg viewBox="0 0 64 64" className="h-9 w-9 shrink-0" aria-hidden="true">
        <rect width="64" height="64" rx="12" fill="#2a2825" />
        <path d="M14 30 32 15l18 15v19H14z" fill="none" stroke="#e9d5c4" strokeWidth="4" strokeLinejoin="round" />
        <path d="M26 49V36h12v13" fill="none" stroke="#c98a5f" strokeWidth="4" strokeLinejoin="round" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-lg font-semibold tracking-tight">Homestone Builders</span>
        <span className={`block text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${tone === "dark" ? "text-ink-soft" : "text-sand"}`}>
          General Contractor
        </span>
      </span>
    </Link>
  );
}
