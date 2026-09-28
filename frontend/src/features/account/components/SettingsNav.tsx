"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { SETTINGS_NAV_ITEMS } from "@/features/account/constants/settings-nav";
import type { SettingsSectionId } from "@/features/account/types/account-settings.types";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils/cn";

type SettingsNavProps = {
  activeSection: SettingsSectionId;
  onSectionChange: (section: SettingsSectionId) => void;
};

export function SettingsNav({
  activeSection,
  onSectionChange,
}: SettingsNavProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="hidden min-w-0 w-full lg:sticky lg:top-28 lg:block lg:self-start">
        <nav aria-label="Settings sections">
          <ul className="space-y-1">
            {SETTINGS_NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    activeSection === item.id
                      ? "bg-accent/10 font-medium text-accent"
                      : "text-secondary hover:bg-background hover:text-foreground",
                  )}
                >
                  {t(item.labelKey)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className={cn(
          "sticky z-30 mb-2 border-b border-border bg-background/95 py-2 backdrop-blur-md",
          "supports-[backdrop-filter]:bg-background/90",
          /* Full-bleed within Container padding. */
          "-mx-4 px-4 md:-mx-6 md:px-6",
          /* Sit below sticky storefront header (mobile: logo row + search; tablet: h-16). */
          "top-[7.5rem] md:top-16",
          "lg:hidden",
        )}
      >
        <nav
          aria-label="Settings sections"
          className="max-w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max gap-2">
            {SETTINGS_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
                  activeSection === item.id
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-secondary hover:border-accent/30 hover:text-foreground",
                )}
              >
                {t(item.labelKey)}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}

export function useScrollToSettingsSection(options?: { ready?: boolean }) {
  const ready = options?.ready ?? true;
  const pathname = usePathname();
  const [activeSection, setActiveSection] =
    useState<SettingsSectionId>("account");

  function scrollToSection(
    section: SettingsSectionId,
    behavior: ScrollBehavior = "smooth",
  ) {
    setActiveSection(section);

    const tryScroll = (attempts = 0) => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior, block: "start" });
        return;
      }

      if (attempts < 30) {
        window.setTimeout(() => tryScroll(attempts + 1), 50);
      }
    };

    tryScroll();
    window.history.replaceState(null, "", `#${section}`);
  }

  useEffect(() => {
    if (!ready || pathname !== "/account/settings") {
      return;
    }

    const storedSection = sessionStorage.getItem("chronova.settings-section");
    if (storedSection) {
      sessionStorage.removeItem("chronova.settings-section");
    }

    const hash = (window.location.hash.slice(1) ||
      storedSection ||
      "") as SettingsSectionId;
    const isValidSection = SETTINGS_NAV_ITEMS.some((item) => item.id === hash);

    if (!isValidSection) {
      return;
    }

    setActiveSection(hash);
    if (window.location.hash.slice(1) !== hash) {
      window.history.replaceState(null, "", `#${hash}`);
    }

    const tryScroll = (attempts = 0) => {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (attempts < 40) {
        window.setTimeout(() => tryScroll(attempts + 1), 50);
      }
    };

    // Wait a tick so settings sections are painted after the loading state.
    window.setTimeout(() => tryScroll(), 0);
  }, [ready, pathname]);

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.slice(1) as SettingsSectionId;
      const isValidSection = SETTINGS_NAV_ITEMS.some(
        (item) => item.id === hash,
      );
      if (!isValidSection) {
        return;
      }

      setActiveSection(hash);
      document
        .getElementById(hash)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const sections = SETTINGS_NAV_ITEMS.map((item) =>
      document.getElementById(item.id),
    ).filter(Boolean) as HTMLElement[];

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id as SettingsSectionId);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [ready]);

  return { activeSection, scrollToSection };
}

export function SettingsBackLink() {
  const { t } = useTranslation();

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-sm text-secondary transition-colors hover:text-accent"
    >
      <span aria-hidden>←</span>
      {t("common.back")}
    </Link>
  );
}
