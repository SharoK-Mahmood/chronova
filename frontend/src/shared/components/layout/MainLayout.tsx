"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Footer } from "@/shared/components/layout/Footer";
import { Header } from "@/shared/components/layout/Header";
import { MobileBottomNav } from "@/shared/components/layout/MobileBottomNav";
import { Providers } from "@/shared/components/layout/Providers";

type MainLayoutProps = {
  children: ReactNode;
};

function StorefrontChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <div className="pb-20 md:pb-0">
        <Footer />
      </div>
      <MobileBottomNav />
    </>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Providers>
      <StorefrontChrome>{children}</StorefrontChrome>
    </Providers>
  );
}
