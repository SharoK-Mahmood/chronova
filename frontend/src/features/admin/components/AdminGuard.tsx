"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/context/AuthProvider";
import { Container } from "@/shared/components/ui/Container";
import { useTranslation } from "@/shared/i18n";

type AdminGuardProps = {
  children: ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { isHydrated, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isHydrated, isAuthenticated, pathname, router]);

  if (!isHydrated) {
    return (
      <Container className="py-16">
        <p className="text-secondary">{t("common.loading")}</p>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container className="py-16">
        <p className="text-secondary">{t("auth.signInToContinue")}</p>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("admin.forbidden")}
        </h1>
      </Container>
    );
  }

  return children;
}
