import { Container } from "@/shared/components/ui/Container";

const PILLARS = [
  {
    title: "Master craftsmanship",
    description:
      "Every timepiece is selected for exceptional finishing, provenance, and horological merit.",
  },
  {
    title: "Curated collection",
    description:
      "From iconic maisons to Chronova originals — a portfolio assembled for the connoisseur.",
  },
  {
    title: "White glove service",
    description:
      "Insured delivery, personal consultation, and aftercare worthy of your investment.",
  },
] as const;

export function HeritageSection() {
  return (
    <section className="border-b border-border bg-card">
      <Container className="max-w-5xl py-12 sm:py-14">
        <div className="grid gap-8 md:grid-cols-3 md:gap-6 md:divide-x md:divide-border">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="px-0 md:px-6 md:first:pl-0 md:last:pr-0">
              <p className="text-xs uppercase tracking-[0.35em] text-accent">
                {pillar.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-secondary">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
