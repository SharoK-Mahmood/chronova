import type { ReactNode } from "react";

import { Container } from "@/shared/components/ui/Container";
import { cn } from "@/shared/lib/utils/cn";
import { type as typography } from "@/shared/lib/typography";

type SectionPageProps = {
  title: string;
  children: ReactNode;
};

export function SectionPage({ title, children }: SectionPageProps) {
  return (
    <Container className="py-10 md:py-12 lg:py-16">
      <h1 className={typography.page}>{title}</h1>
      <div className={cn("mt-8", typography.body)}>{children}</div>
    </Container>
  );
}

export function createSectionMetadata(title: string, description: string) {
  return { title, description };
}
