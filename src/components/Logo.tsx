import Link from "next/link";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const color = tone === "dark" ? "text-ink" : "text-canvas";
  return (
    <Link href="/" className={`group flex flex-col leading-none ${color}`} aria-label="Homestone Builders Inc. home">
      <span className="font-serif text-[1.55rem] tracking-[-0.01em] md:text-[1.7rem]">Homestone</span>
      <span className="mt-0.5 text-[0.6rem] font-medium tracking-[0.32em] uppercase opacity-80">Builders Inc.</span>
    </Link>
  );
}
