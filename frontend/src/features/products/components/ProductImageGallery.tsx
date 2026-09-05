"use client";

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

import { ProductImage } from "@/shared/components/ui/ProductImage";
import { cn } from "@/shared/lib/utils/cn";
import {
  getProductImageUrls,
  hasProductPhoto,
} from "@/shared/lib/utils/product-image";

const AUTOPLAY_MS = 4200;
const FADE_MS = 700;

type ProductImageGalleryProps = {
  imageUrl: string;
  imageUrls?: string[];
  alt: string;
};

export function ProductImageGallery({
  imageUrl,
  imageUrls,
  alt,
}: ProductImageGalleryProps) {
  const urls = getProductImageUrls({ imageUrl, imageUrls }).filter(
    hasProductPhoto,
  );
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = urls.length;
  const activeIndex = count === 0 ? 0 : index % count;
  const activeUrl = urls[activeIndex] ?? "";
  const hasPhoto = hasProductPhoto(activeUrl);

  const goTo = useCallback(
    (next: number) => {
      if (count < 2) {
        return;
      }
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const goNext = useEffectEvent(() => {
    goTo(activeIndex + 1);
  });

  useEffect(() => {
    if (paused || count < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      goNext();
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, count, activeIndex]);

  if (count === 0) {
    return (
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-border bg-background">
        <div className="h-40 w-40 rounded-full border border-border bg-card shadow-sm" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "group/gallery relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl",
          hasPhoto ? "bg-[#f7f6f4]" : "border border-border bg-background",
        )}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget as Node | null)
          ) {
            setPaused(false);
          }
        }}
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
          setPaused(true);
        }}
        onTouchEnd={(event) => {
          const start = touchStartX.current;
          const end = event.changedTouches[0]?.clientX;
          touchStartX.current = null;
          setPaused(false);

          if (start == null || end == null || count < 2) {
            return;
          }

          const delta = end - start;
          if (Math.abs(delta) < 40) {
            return;
          }

          goTo(activeIndex + (delta < 0 ? 1 : -1));
        }}
      >
        {urls.map((url, imageIndex) => {
          const isActive = imageIndex === activeIndex;

          return (
            <div
              key={`${url}-${imageIndex}`}
              className={cn(
                "absolute inset-0 transition-opacity ease-out",
                isActive ? "opacity-100" : "opacity-0",
              )}
              style={{ transitionDuration: `${FADE_MS}ms` }}
              aria-hidden={!isActive}
            >
              <ProductImage
                src={url}
                alt={isActive ? alt : ""}
                fill
                priority={imageIndex === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain p-8 transition-transform duration-700 ease-out group-hover/gallery:scale-[1.015]"
              />
            </div>
          );
        })}

        {count > 1 ? (
          <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-1.5">
            {urls.map((_, dotIndex) => {
              const selected = dotIndex === activeIndex;

              return (
                <button
                  key={`dot-${dotIndex}`}
                  type="button"
                  aria-label={`Show image ${dotIndex + 1}`}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    selected
                      ? "w-5 bg-foreground/70"
                      : "w-1.5 bg-foreground/25 hover:bg-foreground/45",
                  )}
                  onClick={() => goTo(dotIndex)}
                />
              );
            })}
          </div>
        ) : null}
      </div>

      {count > 1 ? (
        <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {urls.map((url, thumbIndex) => {
            const selected = thumbIndex === activeIndex;

            return (
              <li key={`${url}-thumb-${thumbIndex}`}>
                <button
                  type="button"
                  onClick={() => {
                    setPaused(true);
                    goTo(thumbIndex);
                  }}
                  aria-label={`${alt} ${thumbIndex + 1}`}
                  aria-pressed={selected}
                  className={cn(
                    "relative aspect-square w-full overflow-hidden rounded-xl border bg-white transition-colors",
                    selected
                      ? "border-accent ring-1 ring-accent/30"
                      : "border-border hover:border-accent/40",
                  )}
                >
                  <ProductImage
                    src={url}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
