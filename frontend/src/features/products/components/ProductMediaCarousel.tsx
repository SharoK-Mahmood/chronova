"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

import {
  getProductImageUrls,
  hasProductPhoto,
} from "@/shared/lib/utils/product-image";
import { cn } from "@/shared/lib/utils/cn";

const AUTOPLAY_MS = 4200;
const FADE_MS = 700;

type ProductMediaCarouselProps = {
  imageUrl: string;
  imageUrls?: string[] | null;
  alt: string;
  sizes: string;
  /** When set, clicking the image opens the product (controls stay separate). */
  href?: string;
  className?: string;
  imageClassName?: string;
  autoplay?: boolean;
};

function Chevron({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden
    >
      {direction === "prev" ? (
        <path d="M12.5 4.5 7.5 10l5 5.5" />
      ) : (
        <path d="M7.5 4.5 12.5 10l-5 5.5" />
      )}
    </svg>
  );
}

export function ProductMediaCarousel({
  imageUrl,
  imageUrls,
  alt,
  sizes,
  href,
  className,
  imageClassName,
  autoplay = true,
}: ProductMediaCarouselProps) {
  const urls = getProductImageUrls({ imageUrl, imageUrls }).filter(
    hasProductPhoto,
  );
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = urls.length;
  const activeIndex = count === 0 ? 0 : index % count;

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
    if (!autoplay || paused || count < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      goNext();
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [autoplay, paused, count, activeIndex]);

  const media = (
    <>
      {count === 0 ? (
        <div className="flex h-full w-full items-center justify-center bg-background">
          <div className="h-16 w-16 rounded-full border border-border bg-card shadow-sm md:h-20 md:w-20 lg:h-24 lg:w-24" />
        </div>
      ) : (
        urls.map((url, imageIndex) => {
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
              <Image
                src={url}
                alt={isActive ? alt : ""}
                fill
                sizes={sizes}
                priority={imageIndex === 0}
                className={cn(
                  "object-contain p-3 transition-transform duration-700 ease-out md:p-5 lg:p-6",
                  "group-hover/media:scale-[1.02]",
                  imageClassName,
                )}
              />
            </div>
          );
        })
      )}
    </>
  );

  return (
    <div
      className={cn(
        "group/media relative h-full w-full overflow-hidden bg-[#f7f6f4]",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
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
        if (Math.abs(delta) < 36) {
          return;
        }

        goTo(activeIndex + (delta < 0 ? 1 : -1));
      }}
    >
      {href ? (
        <Link href={href} className="absolute inset-0 z-0 block" aria-label={alt}>
          {media}
        </Link>
      ) : (
        <div className="absolute inset-0 z-0">{media}</div>
      )}

      {count > 1 ? (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-16 bg-gradient-to-t from-black/[0.06] to-transparent"
            aria-hidden
          />

          <button
            type="button"
            aria-label="Previous image"
            className={cn(
              "absolute start-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center",
              "rounded-full border border-black/8 bg-white/85 text-foreground/80 shadow-sm backdrop-blur-sm",
              "opacity-0 transition-all duration-300 hover:bg-white hover:text-foreground",
              "group-hover/media:opacity-100 focus-visible:opacity-100",
              "max-md:opacity-100",
            )}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              goTo(activeIndex - 1);
            }}
          >
            <Chevron direction="prev" />
          </button>

          <button
            type="button"
            aria-label="Next image"
            className={cn(
              "absolute end-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center",
              "rounded-full border border-black/8 bg-white/85 text-foreground/80 shadow-sm backdrop-blur-sm",
              "opacity-0 transition-all duration-300 hover:bg-white hover:text-foreground",
              "group-hover/media:opacity-100 focus-visible:opacity-100",
              "max-md:opacity-100",
            )}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              goTo(activeIndex + 1);
            }}
          >
            <Chevron direction="next" />
          </button>

          <div className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-1.5">
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
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    goTo(dotIndex);
                  }}
                />
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
