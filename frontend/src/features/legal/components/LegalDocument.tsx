import type { ReactNode } from "react";

import { Container } from "@/shared/components/ui/Container";
import { SITE } from "@/shared/constants/site";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
};

type LegalDocumentProps = {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
  footerNote?: ReactNode;
};

export function LegalDocument({
  title,
  description,
  lastUpdated,
  sections,
  footerNote,
}: LegalDocumentProps) {
  return (
    <Container className="py-12 sm:py-16">
      <header className="max-w-3xl border-b border-border pb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">
          {SITE.name}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-secondary">{description}</p>
        <p className="mt-3 text-sm text-secondary">
          Last updated: {lastUpdated}
        </p>
      </header>

      <div className="mt-10 max-w-3xl space-y-10">
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-xl font-semibold tracking-tight">
              {section.title}
            </h2>
            <div className="mt-4 space-y-4 text-secondary leading-relaxed">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
              {section.list ? (
                <ul className="list-disc space-y-2 pl-5">
                  {section.list.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      {footerNote ? (
        <p className="mt-12 max-w-3xl border-t border-border pt-8 text-sm text-secondary">
          {footerNote}
        </p>
      ) : null}
    </Container>
  );
}
