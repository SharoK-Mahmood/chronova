"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { getBrandSummaries } from "@/features/brands";
import { Container } from "@/shared/components/ui/Container";
import { cn } from "@/shared/lib/utils/cn";

type BrandsMenuContextValue = {
  isOpen: boolean;
  open: () => void;
  scheduleClose: () => void;
  cancelClose: () => void;
};

const BrandsMenuContext = createContext<BrandsMenuContextValue | null>(null);

const CLOSE_DELAY_MS = 120;

function useBrandsMenu() {
  const context = useContext(BrandsMenuContext);

  if (!context) {
    throw new Error("useBrandsMenu must be used within BrandsMenuProvider");
  }

  return context;
}

type BrandsMenuProviderProps = {
  children: ReactNode;
};

export function BrandsMenuProvider({ children }: BrandsMenuProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const open = useCallback(() => {
    cancelClose();
    setIsOpen(true);
  }, [cancelClose]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, CLOSE_DELAY_MS);
  }, [cancelClose]);

  useEffect(() => {
    return () => cancelClose();
  }, [cancelClose]);

  return (
    <BrandsMenuContext.Provider
      value={{ isOpen, open, scheduleClose, cancelClose }}
    >
      {children}
    </BrandsMenuContext.Provider>
  );
}

type BrandsNavLinkProps = {
  isActive: boolean;
  className?: string;
};

export function BrandsNavLink({ isActive, className }: BrandsNavLinkProps) {
  const { isOpen, open, scheduleClose, cancelClose } = useBrandsMenu();

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        open();
      }}
      onMouseLeave={scheduleClose}
    >
      <Link
        href="/brands"
        aria-current={isActive ? "page" : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={className}
      >
        Brands
      </Link>
    </div>
  );
}

export function BrandsMegaMenuPanel() {
  const { isOpen, open, scheduleClose, cancelClose } = useBrandsMenu();
  const brands = getBrandSummaries();

  return (
    <div
      className={cn(
        "absolute inset-x-0 top-full z-50 hidden pt-3 xl:block",
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
      onMouseEnter={() => {
        cancelClose();
        open();
      }}
      onMouseLeave={scheduleClose}
    >
      <div
        className={cn(
          "border-t border-border bg-card shadow-lg transition-transform duration-200",
          isOpen ? "translate-y-0" : "-translate-y-1",
        )}
      >
        <Container className="py-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-accent">
                Collections
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">
                Shop by brand
              </h2>
            </div>
            <Link
              href="/brands"
              className="text-sm font-medium text-secondary transition-colors hover:text-accent"
            >
              View all brands
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="group/brand rounded-xl p-3 transition-colors hover:bg-background"
              >
                <p className="font-medium transition-colors group-hover/brand:text-accent">
                  {brand.name}
                </p>
                <p className="mt-1 text-xs text-secondary">
                  {brand.productCount > 0
                    ? `${brand.productCount} ${brand.productCount === 1 ? "watch" : "watches"}`
                    : "Coming soon"}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}
