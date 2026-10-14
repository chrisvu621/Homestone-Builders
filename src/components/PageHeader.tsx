import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export function PageHeader({
  crumbs,
  eyebrow,
  title,
  children,
  aside,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="container-page pt-8 pb-10 md:pt-12 md:pb-16">
      <Breadcrumbs items={crumbs} />
      <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-[1fr_auto] md:items-end md:gap-16">
        <div className="max-w-3xl space-y-4">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="text-[2.5rem] leading-[1.04] md:text-[4.25rem]">{title}</h1>
          {children && <div className="max-w-2xl text-ink-soft md:text-lg">{children}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}
