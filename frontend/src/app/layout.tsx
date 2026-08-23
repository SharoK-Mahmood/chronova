import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { MainLayout } from "@/shared/components/layout/MainLayout";
import { SITE } from "@/shared/constants/site";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-family-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-family-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/chronova-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground type-body">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
