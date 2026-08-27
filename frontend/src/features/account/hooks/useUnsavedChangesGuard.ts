"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type UseUnsavedChangesGuardOptions = {
  enabled: boolean;
};

function isSamePageNavigation(url: string | URL | null | undefined): boolean {
  if (url == null || url === "") {
    return true;
  }

  try {
    const next = new URL(String(url), window.location.href);
    return (
      next.origin === window.location.origin &&
      next.pathname === window.location.pathname &&
      next.search === window.location.search
    );
  } catch {
    return true;
  }
}

function toAppPath(url: URL): string {
  return `${url.pathname}${url.search}${url.hash}`;
}

/**
 * Opens the leave dialog outside React's insertion/update phase.
 * Next.js Link navigation can call history APIs inside useInsertionEffect;
 * scheduling setState there throws.
 */
function defer(callback: () => void) {
  window.setTimeout(callback, 0);
}

export function useUnsavedChangesGuard({
  enabled,
}: UseUnsavedChangesGuardOptions) {
  const router = useRouter();
  const enabledRef = useRef(enabled);
  const bypassRef = useRef(false);
  const openRef = useRef(false);
  const pendingProceedRef = useRef<(() => void) | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  enabledRef.current = enabled;
  openRef.current = isOpen;

  const requestLeave = useCallback((proceed: () => void) => {
    if (!enabledRef.current || bypassRef.current) {
      proceed();
      return;
    }

    if (openRef.current) {
      return;
    }

    pendingProceedRef.current = proceed;
    defer(() => {
      if (!enabledRef.current) {
        const pending = pendingProceedRef.current;
        pendingProceedRef.current = null;
        pending?.();
        return;
      }
      setIsOpen(true);
    });
  }, []);

  const confirmLeave = useCallback(() => {
    const proceed = pendingProceedRef.current;
    pendingProceedRef.current = null;
    setIsOpen(false);
    bypassRef.current = true;
    defer(() => {
      proceed?.();
      bypassRef.current = false;
    });
  }, []);

  const cancelLeave = useCallback(() => {
    pendingProceedRef.current = null;
    setIsOpen(false);
  }, []);

  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (!enabledRef.current || bypassRef.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  // Prefer stopping <Link> / <a> clicks before Next.js starts navigation.
  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!enabledRef.current || bypassRef.current || openRef.current) {
        return;
      }

      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;

      if (!anchor) {
        return;
      }

      if (anchor.target && anchor.target !== "_self") {
        return;
      }

      if (anchor.hasAttribute("download")) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      let next: URL;
      try {
        next = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (next.origin !== window.location.origin) {
        return;
      }

      if (isSamePageNavigation(next)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const path = toAppPath(next);
      requestLeave(() => {
        bypassRef.current = true;
        router.push(path);
        defer(() => {
          bypassRef.current = false;
        });
      });
    }

    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [requestLeave, router]);

  // Safety net for programmatic soft navigations that skip the click path.
  useEffect(() => {
    const originalPushState = window.history.pushState.bind(window.history);
    const originalReplaceState =
      window.history.replaceState.bind(window.history);

    window.history.pushState = (data, unused, url) => {
      if (
        bypassRef.current ||
        !enabledRef.current ||
        isSamePageNavigation(url)
      ) {
        return originalPushState(data, unused, url);
      }

      requestLeave(() => originalPushState(data, unused, url));
    };

    window.history.replaceState = (data, unused, url) => {
      if (
        bypassRef.current ||
        !enabledRef.current ||
        isSamePageNavigation(url)
      ) {
        return originalReplaceState(data, unused, url);
      }

      requestLeave(() => originalReplaceState(data, unused, url));
    };

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [requestLeave]);

  useEffect(() => {
    function onPopState() {
      if (!enabledRef.current || bypassRef.current || openRef.current) {
        return;
      }

      bypassRef.current = true;
      window.history.go(1);
      defer(() => {
        bypassRef.current = false;
        requestLeave(() => {
          bypassRef.current = true;
          window.history.go(-1);
          defer(() => {
            bypassRef.current = false;
          });
        });
      });
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [requestLeave]);

  return {
    isOpen,
    requestLeave,
    confirmLeave,
    cancelLeave,
  };
}
