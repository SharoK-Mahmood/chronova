import type { Metadata } from "next";

import { Container } from "@/shared/components/ui/Container";

type SectionPageProps = {
  title: string;
  description: string;
};

export function SectionPage({ title, description }: SectionPageProps) {
  return (
    <Container className="py-12 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-2xl text-secondary">{description}</p>
    </Container>
  );
}

export function createSectionMetadata(
  title: string,
  description: string,
): Metadata {
  return { title, description };
}
