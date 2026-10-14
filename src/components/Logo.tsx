import Link from "next/link";

/** Text wordmark: serif name over a tracked sans line, sized so both lines are about the same width. */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const color = tone === "dark" ? "text-ink" : "text-canvas";
  return (
    <Link href="/" className={`inline-flex flex-col items-start leading-none ${color}`} aria-label="Homestone Builders Inc. home">
      <span className="font-serif text-[1.6rem] tracking-[-0.015em] md:text-[1.75rem]">Homestone</span>
      <span className="mt-[0.3rem] text-[0.6rem] font-semibold tracking-[0.33em] uppercase md:text-[0.64rem]">
        Builders Inc.
      </span>
    </Link>
  );
}
