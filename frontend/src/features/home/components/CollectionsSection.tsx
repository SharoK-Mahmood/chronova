import Link from "next/link";

import { Container } from "@/shared/components/ui/Container";
import { cn } from "@/shared/lib/utils/cn";

const COLLECTIONS = [
  {
    href: "/men",
    eyebrow: "For him",
    title: "Men's watches",
    description: "Bold complications and enduring classics.",
    accent: "from-primary/90 to-primary",
  },
  {
    href: "/women",
    eyebrow: "For her",
    title: "Women's watches",
    description: "Refined elegance in every detail.",
    accent: "from-[#2a2520] to-primary",
  },
  {
    href: "/brands",
    eyebrow: "Explore",
    title: "Shop by brand",
    description: "Rolex, Omega, Cartier, and more.",
    accent: "from-[#1a1814] to-[#111111]",
  },
  {
    href: "/new-arrivals",
    eyebrow: "Just in",
    title: "New arrivals",
    description: "The latest from the world's finest maisons.",
    accent: "from-primary via-[#1c1912] to-primary",
  },
] as const;

export function CollectionsSection() {
  return (
    <section className="border-b border-border bg-primary py-20 text-background sm:py-24">
      <Container>
        <div className="mb-12 max-w-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-accent">
            Collections
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Find your perfect timepiece
          </h2>
          <p className="mt-4 text-background/65">
            Browse by style, brand, or the latest arrivals — each piece chosen
            for its story and significance.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {COLLECTIONS.map((collection) => (
            <Link
              key={collection.href}
              href={collection.href}
              className="group relative overflow-hidden rounded-2xl border border-background/10 p-8 transition-all duration-500 hover:border-accent/40 hover:shadow-[0_20px_60px_-20px_rgba(201,162,39,0.25)] sm:p-10"
            >
              <div
                aria-hidden
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-80 transition-opacity duration-500 group-hover:opacity-100",
                  collection.accent,
                )}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.12),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.35em] text-accent">
                  {collection.eyebrow}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-3xl">
                  {collection.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-background/60">
                  {collection.description}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent">
                  Explore
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
