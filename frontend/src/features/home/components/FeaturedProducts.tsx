"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";

import { Price } from "@/features/currency";
import { useProductCatalog } from "@/features/products";
import type { Product, ProductSummary } from "@/features/products";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/ui/Container";
import { ProductImage } from "@/shared/components/ui/ProductImage";
import { useTranslation } from "@/shared/i18n";
import { hasProductPhoto } from "@/shared/lib/utils/product-image";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

const MAX_MARQUEE_ITEMS = 18;
/** Auto-drift speed on desktop (px / second). */
const AUTO_SCROLL_PX_PER_SEC = 36;
const DRAG_CLICK_THRESHOLD_PX = 6;
/** Pause auto-drift after trackpad/wheel input (ms). */
const WHEEL_PAUSE_MS = 1000;

function toSummary(product: Product): ProductSummary {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    currency: product.currency,
    imageUrl: product.imageUrl,
    imageUrls: product.imageUrls?.length
      ? product.imageUrls
      : product.imageUrl
        ? [product.imageUrl]
        : [],
    brand: product.brand,
    reference: product.reference,
    subtitle: product.subtitle,
  };
}

function shuffleProducts(products: Product[]): ProductSummary[] {
  const next = [...products];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = next[index];
    next[index] = next[swapIndex]!;
    next[swapIndex] = current!;
  }

  return next.slice(0, MAX_MARQUEE_ITEMS).map(toSummary);
}

function useIsDesktopRail(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine) and (hover: hover)",
    );
    const sync = () => setIsDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return isDesktop;
}

export function FeaturedProducts() {
  const { t } = useTranslation();
  const { products, isLoading } = useProductCatalog();
  const [items, setItems] = useState<ProductSummary[]>([]);
  const isDesktop = useIsDesktopRail();

  useEffect(() => {
    if (products.length === 0) {
      setItems([]);
      return;
    }
    setItems(shuffleProducts(products));
  }, [products]);

  return (
    <section className="relative overflow-hidden border-y border-primary/20 bg-primary text-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(90,120,160,0.2),transparent_60%)]"
      />
      <div
        aria-hidden
        className="home-grain pointer-events-none absolute inset-0 opacity-[0.28]"
      />

      <Container className="relative py-14 sm:py-16 lg:py-24">
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#9aafc5]">
              {t("home.featured.eyebrow")}
            </p>
            <h2 className={cn("mt-3 text-background", typography.section)}>
              {t("home.featured.title")}
            </h2>
            <p
              className={cn(
                "mt-3 max-w-md text-background/60",
                typography.body,
              )}
            >
              {t("home.featured.subtitle")}
            </p>
          </div>
          <Button
            href="/products"
            variant="secondary"
            effect="luxury"
            className="shrink-0 border-background/25 text-background hover:border-accent/50 hover:bg-background/10"
          >
            {t("common.viewAll")}
          </Button>
        </div>

        {!isLoading && items.length > 0 ? (
          <p className="text-[11px] uppercase tracking-[0.28em] text-background/40">
            {isDesktop
              ? t("home.featured.dragHint")
              : t("home.featured.swipeHint")}
          </p>
        ) : null}
      </Container>

      {isLoading ? (
        <Container className="pb-16">
          <p className="text-background/55">{t("common.loading")}</p>
        </Container>
      ) : items.length === 0 ? (
        <Container className="pb-16">
          <p className="text-background/55">{t("home.featured.empty")}</p>
        </Container>
      ) : isDesktop ? (
        <DesktopFeaturedRail items={items} />
      ) : (
        <TouchFeaturedRail items={items} />
      )}
    </section>
  );
}

type RailProps = {
  items: ProductSummary[];
};

function DesktopFeaturedRail({ items }: RailProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const dragOriginXRef = useRef(0);
  const dragOriginOffsetRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const wheelPauseUntilRef = useRef(0);
  const reduceMotionRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const wrapOffset = useCallback((value: number) => {
    const loopWidth = loopWidthRef.current;
    if (loopWidth <= 0) {
      return value;
    }

    let next = value;
    while (next <= -loopWidth) {
      next += loopWidth;
    }
    while (next > 0) {
      next -= loopWidth;
    }
    return next;
  }, []);

  const applyTransform = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  }, []);

  const measureLoop = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    loopWidthRef.current = track.scrollWidth / 2;
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reduceMotionRef.current = media.matches;
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    measureLoop();
    applyTransform();

    const track = trackRef.current;
    if (!track) {
      return;
    }

    const observer = new ResizeObserver(() => {
      measureLoop();
      offsetRef.current = wrapOffset(offsetRef.current);
      applyTransform();
    });
    observer.observe(track);

    return () => observer.disconnect();
  }, [items, applyTransform, measureLoop, wrapOffset]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      if (absX < 0.5 && absY < 0.5) {
        return;
      }

      // Trackpads send horizontal deltaX; vertical two-finger scroll also moves the rail.
      const delta = absX >= absY ? event.deltaX : event.deltaY;
      event.preventDefault();

      offsetRef.current = wrapOffset(offsetRef.current - delta);
      velocityRef.current = 0;
      wheelPauseUntilRef.current = performance.now() + WHEEL_PAUSE_MS;
      applyTransform();
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [applyTransform, wrapOffset]);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!draggingRef.current) {
        if (Math.abs(velocityRef.current) > 2) {
          offsetRef.current = wrapOffset(
            offsetRef.current + velocityRef.current * delta,
          );
          velocityRef.current *= 0.95;
          if (Math.abs(velocityRef.current) < 2) {
            velocityRef.current = 0;
          }
          applyTransform();
        } else if (
          !reduceMotionRef.current &&
          now >= wheelPauseUntilRef.current
        ) {
          offsetRef.current = wrapOffset(
            offsetRef.current - AUTO_SCROLL_PX_PER_SEC * delta,
          );
          applyTransform();
        }
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [applyTransform, wrapOffset]);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    draggingRef.current = true;
    suppressClickRef.current = false;
    pointerIdRef.current = event.pointerId;
    dragOriginXRef.current = event.clientX;
    dragOriginOffsetRef.current = offsetRef.current;
    lastPointerXRef.current = event.clientX;
    lastPointerTimeRef.current = performance.now();
    velocityRef.current = 0;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || pointerIdRef.current !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragOriginXRef.current;
    if (Math.abs(deltaX) > DRAG_CLICK_THRESHOLD_PX) {
      suppressClickRef.current = true;
    }

    const now = performance.now();
    const dt = Math.max((now - lastPointerTimeRef.current) / 1000, 0.001);
    const frameDelta = event.clientX - lastPointerXRef.current;
    velocityRef.current = frameDelta / dt;
    lastPointerXRef.current = event.clientX;
    lastPointerTimeRef.current = now;

    offsetRef.current = wrapOffset(dragOriginOffsetRef.current + deltaX);
    applyTransform();
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    draggingRef.current = false;
    pointerIdRef.current = null;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div className="relative pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-primary to-transparent lg:w-28"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-primary to-transparent lg:w-28"
      />

      <div
        ref={viewportRef}
        className={cn(
          "overflow-hidden select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        dir="ltr"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          ref={trackRef}
          className="flex w-max gap-5 pe-5 will-change-transform"
          style={{ touchAction: "none" }}
        >
          {[...items, ...items].map((product, index) => (
            <WatchCard
              key={`${product.id}-${index}`}
              product={product}
              size="desktop"
              decorative={index >= items.length}
              suppressClickRef={suppressClickRef}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TouchFeaturedRail({ items }: RailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const onScroll = () => {
      const cards = scroller.querySelectorAll<HTMLElement>("[data-watch-card]");
      if (cards.length === 0) {
        return;
      }

      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let closest = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = index;
        }
      });

      setActiveIndex(closest);
    };

    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [items]);

  return (
    <div className="pb-14">
      <div
        ref={scrollerRef}
        className={cn(
          "flex gap-4 overflow-x-auto px-4 pb-3 sm:gap-5 sm:px-8",
          "snap-x snap-mandatory scroll-smooth",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        dir="ltr"
      >
        {items.map((product) => (
          <WatchCard
            key={product.id}
            product={product}
            size="touch"
            dataWatchCard
          />
        ))}
        <div className="w-2 shrink-0 sm:w-4" aria-hidden />
      </div>

      <div
        className="mt-5 flex items-center justify-center gap-2"
        aria-hidden={items.length < 2}
      >
        {items.map((product, index) => (
          <span
            key={product.id}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              index === activeIndex
                ? "w-6 bg-accent"
                : "w-1.5 bg-background/25",
            )}
          />
        ))}
      </div>
    </div>
  );
}

type WatchCardProps = {
  product: ProductSummary;
  size: "desktop" | "touch";
  decorative?: boolean;
  dataWatchCard?: boolean;
  suppressClickRef?: RefObject<boolean>;
};

function WatchCard({
  product,
  size,
  decorative = false,
  dataWatchCard = false,
  suppressClickRef,
}: WatchCardProps) {
  const imageAlt = product.subtitle
    ? `${product.brand} ${product.name}, ${product.subtitle}`
    : `${product.brand} ${product.name}`;

  return (
    <Link
      href={`/products/${product.slug}`}
      tabIndex={decorative ? -1 : 0}
      aria-hidden={decorative || undefined}
      data-watch-card={dataWatchCard ? "" : undefined}
      draggable={false}
      onClick={(event) => {
        if (suppressClickRef?.current) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
      className={cn(
        "group relative flex shrink-0 flex-col",
        size === "desktop" && "w-[260px] lg:w-[300px]",
        size === "touch" &&
          "w-[78vw] max-w-[320px] snap-center sm:w-[58vw] sm:max-w-[360px]",
        size === "desktop" &&
          "transition-transform duration-500 ease-out hover:-translate-y-1",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-gradient-to-b from-white/10 to-white/[0.03]",
          size === "desktop" ? "aspect-[4/5]" : "aspect-[3/4]",
        )}
      >
        {hasProductPhoto(product.imageUrl) ? (
          <ProductImage
            src={product.imageUrl}
            alt={decorative ? "" : imageAlt}
            fill
            sizes={size === "desktop" ? "300px" : "80vw"}
            draggable={false}
            className={cn(
              "object-contain",
              size === "desktop"
                ? "p-6 transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:p-8"
                : "p-5 sm:p-7",
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-24 w-24 rounded-full border border-background/15 bg-background/5" />
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/40 to-transparent"
        />
      </div>

      <div className="mt-4 flex flex-col gap-1 px-1">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#9aafc5]">
          {product.brand}
        </p>
        <h3
          className={cn(
            "truncate font-medium tracking-tight text-background",
            size === "touch" ? "text-lg" : "text-base sm:text-lg",
          )}
        >
          {product.name}
        </h3>
        {product.subtitle && size === "touch" ? (
          <p className="line-clamp-1 text-sm text-background/50">
            {product.subtitle}
          </p>
        ) : null}
        <p className="text-sm text-accent sm:text-base">
          <Price amountUsd={product.price} />
        </p>
      </div>
    </Link>
  );
}
