import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { DevConnectionProbe } from "@/shared/components/debug/DevConnectionProbe";
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
  const themeBootstrap = `(function(){try{var k="chronova.account-settings";var raw=localStorage.getItem(k);if(!raw){var keys=Object.keys(localStorage);for(var i=0;i<keys.length;i++){if(keys[i].indexOf(k+".")===0){raw=localStorage.getItem(keys[i]);if(raw)break;}}}if(!raw)return;var t=JSON.parse(raw).theme;if(t==="dark"){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}}catch(e){}})();`;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground type-body">
        <DevConnectionProbe />
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
