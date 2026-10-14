"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Project, ProjectPhoto } from "@/lib/projects";
import { ArrowRight, Close } from "./Icons";

type Slide = { photo: ProjectPhoto; project: Project };

const ratio = (p: ProjectPhoto) => (p.width && p.height ? p.width / p.height : 4 / 3);

/**
 * Masonry of projects (two columns on desktop, one on mobile) with a
 * full-screen viewer. Photos keep their natural proportions.
 */
export function ProjectGallery({ projects, label }: { projects: Project[]; label: string }) {
  const slides = useMemo<Slide[]>(
    () => projects.flatMap((project) => project.photos.map((photo) => ({ photo, project }))),
    [projects],
  );
  const [index, setIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openAt = (photo: ProjectPhoto, el: HTMLElement) => {
    triggerRef.current = el;
    setIndex(slides.findIndex((s) => s.photo.src === photo.src));
  };

  return (
    <>
      <ul className="columns-1 gap-x-8 md:columns-2 lg:gap-x-12" aria-label={label}>
        {projects.map((project) => {
          const [main, ...rest] = project.photos;
          return (
            <li key={project.id} id={project.id} className="mb-12 break-inside-avoid md:mb-16">
              <figure>
                <button
                  type="button"
                  onClick={(e) => openAt(main, e.currentTarget)}
                  className="group relative block w-full overflow-hidden bg-sand"
                  style={{ aspectRatio: String(ratio(main)) }}
                >
                  <Image
                    src={main.src}
                    alt={main.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                  <span className="sr-only">View larger: {project.title}</span>
                </button>
                {rest.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {rest.map((photo) => (
                      <button
                        key={photo.src}
                        type="button"
                        onClick={(e) => openAt(photo, e.currentTarget)}
                        className="relative aspect-square overflow-hidden bg-sand"
                      >
                        <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 16vw, 33vw" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="font-serif text-[1.45rem] leading-tight">{project.title}</span>
                  <span className="shrink-0 text-xs tracking-[0.14em] text-ink-soft uppercase">{project.kind}</span>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
      <Lightbox slides={slides} index={index} onIndex={setIndex} returnFocus={triggerRef} />
    </>
  );
}

function Lightbox({
  slides,
  index,
  onIndex,
  returnFocus,
}: {
  slides: Slide[];
  index: number | null;
  onIndex: (i: number | null) => void;
  returnFocus: React.RefObject<HTMLElement | null>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  const close = useCallback(() => onIndex(null), [onIndex]);
  const step = useCallback(
    (d: number) => {
      if (index === null) return;
      onIndex((index + d + count) % count);
    },
    [index, count, onIndex],
  );

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (index !== null && !dlg.open) {
      dlg.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (index === null && dlg.open) {
      dlg.close();
    }
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step]);

  const onClose = () => {
    document.documentElement.style.overflow = "";
    close();
    returnFocus.current?.focus();
  };

  const current = index !== null ? slides[index] : null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label={current ? current.project.title : "Photo viewer"}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink p-0 text-canvas backdrop:bg-ink"
    >
      {current && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 md:px-8 md:pt-6">
            <span className="text-xs tracking-[0.16em] text-canvas/70 uppercase tabular-nums" aria-live="polite">
              {index! + 1} / {count}
            </span>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="-mr-2 inline-flex h-12 w-12 items-center justify-center text-canvas hover:text-sand"
            >
              <Close className="h-7 w-7" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div
            className="relative min-h-0 flex-1 md:mx-20"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            }}
          >
            <Image
              key={current.photo.src}
              src={current.photo.src}
              alt={current.photo.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="absolute top-1/2 -left-16 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-canvas/80 hover:text-canvas md:inline-flex"
                >
                  <ArrowRight className="h-7 w-7 rotate-180" />
                  <span className="sr-only">Previous photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="absolute top-1/2 -right-16 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-canvas/80 hover:text-canvas md:inline-flex"
                >
                  <ArrowRight className="h-7 w-7" />
                  <span className="sr-only">Next photo</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-end justify-between gap-4 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-8 md:pb-8">
            <div className="min-w-0">
              <p className="font-serif text-xl leading-tight md:text-2xl">{current.project.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-canvas/65 md:text-sm">{current.photo.alt}</p>
            </div>
            {count > 1 && (
              <div className="flex shrink-0 gap-1 md:hidden">
                <button type="button" onClick={() => step(-1)} className="inline-flex h-12 w-12 items-center justify-center border border-canvas/30">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                  <span className="sr-only">Previous photo</span>
                </button>
                <button type="button" onClick={() => step(1)} className="inline-flex h-12 w-12 items-center justify-center border border-canvas/30">
                  <ArrowRight className="h-5 w-5" />
                  <span className="sr-only">Next photo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
