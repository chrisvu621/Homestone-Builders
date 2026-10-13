import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export function PageHeader({
  crumbs,
  eyebrow,
  title,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-stone-line bg-sand/50">
      <div className="container-page space-y-5 py-10 md:py-16">
        <Breadcrumbs items={crumbs} />
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="max-w-3xl text-4xl leading-tight font-semibold md:text-5xl">{title}</h1>
        {children && <div className="max-w-2xl text-lg text-ink-soft leading-relaxed">{children}</div>}
      </div>
    </section>
  );
}
