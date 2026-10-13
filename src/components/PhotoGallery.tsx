"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectPhoto } from "@/lib/projects";
import { ArrowRight, Close } from "./Icons";

type Props = { photos: ProjectPhoto[]; limit?: number; label: string };

export function PhotoGallery({ photos, limit, label }: Props) {
  const shown = limit ? photos.slice(0, limit) : photos;
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const open = (i: number, el: HTMLButtonElement) => {
    triggerRef.current = el;
    setIndex(i);
  };
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + shown.length) % shown.length)),
    [shown.length],
  );

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (index !== null && !dlg.open) dlg.showModal();
    if (index === null && dlg.open) {
      dlg.close();
      triggerRef.current?.focus();
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

  const current = index !== null ? shown[index] : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3" aria-label={label}>
        {shown.map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-sand"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="sr-only">Open larger view</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(e) => e.target === e.currentTarget && close()}
        aria-label={current ? current.alt : "Photo viewer"}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-black/95 p-0 text-white backdrop:bg-black/80"
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 text-sm">
              <span aria-live="polite">
                {index! + 1} / {shown.length}
              </span>
              <button type="button" onClick={close} className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10">
                <Close />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="relative flex-1" onClick={(e) => e.target === e.currentTarget && close()}>
              <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
            </div>
            <p className="px-4 pt-3 text-center text-sm text-white/80">{current.alt}</p>
            {shown.length > 1 && (
              <div className="flex justify-center gap-3 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button type="button" onClick={() => step(-1)} className="btn btn-outline min-h-11 border-white/40 text-white">
                  <ArrowRight className="h-4 w-4 rotate-180" /> Previous
                </button>
                <button type="button" onClick={() => step(1)} className="btn btn-outline min-h-11 border-white/40 text-white">
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
