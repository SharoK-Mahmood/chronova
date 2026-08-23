import type { Metadata } from "next";

import { MainLayout } from "@/shared/components/layout/MainLayout";
import { SITE } from "@/shared/constants/site";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
