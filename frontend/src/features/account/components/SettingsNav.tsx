"use client";

import Link from "next/link";
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
      <nav
        aria-label="Settings sections"
        className="hidden lg:block lg:sticky lg:top-28 lg:self-start"
      >
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

      <div className="mb-6 lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SETTINGS_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                activeSection === item.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-secondary hover:border-accent/30 hover:text-foreground",
              )}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export function useScrollToSettingsSection() {
  const [activeSection, setActiveSection] =
    useState<SettingsSectionId>("account");

  function scrollToSection(section: SettingsSectionId) {
    setActiveSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${section}`);
  }

  useEffect(() => {
    const hash = window.location.hash.slice(1) as SettingsSectionId;
    const isValidSection = SETTINGS_NAV_ITEMS.some((item) => item.id === hash);

    if (isValidSection) {
      setActiveSection(hash);
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
      });
    }
  }, []);

  useEffect(() => {
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
  }, []);

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
