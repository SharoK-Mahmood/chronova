import type { ReactNode } from "react";

import { Footer } from "@/shared/components/layout/Footer";
import { Header } from "@/shared/components/layout/Header";

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
