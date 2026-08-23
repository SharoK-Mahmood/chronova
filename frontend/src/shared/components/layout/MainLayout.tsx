import type { ReactNode } from "react";

import { Footer } from "@/shared/components/layout/Footer";
import { Header } from "@/shared/components/layout/Header";
import { Providers } from "@/shared/components/layout/Providers";

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Providers>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </Providers>
  );
}
