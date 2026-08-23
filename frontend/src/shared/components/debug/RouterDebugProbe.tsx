"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function logDebug(
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown>,
) {
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/e48f63ee-04ff-42df-9270-03f44f8af41e", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "c7537f",
    },
    body: JSON.stringify({
      sessionId: "c7537f",
      runId: "pre-fix",
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}

export function RouterDebugProbe() {
  const pathname = usePathname();

  useEffect(() => {
    logDebug("B", "RouterDebugProbe.tsx:mount", "router probe mounted", {
      pathname,
      readyState: document.readyState,
      visibility: document.visibilityState,
    });

    function handleError(event: ErrorEvent) {
      if (
        !event.message.includes(
          "Router action dispatched before initialization",
        )
      ) {
        return;
      }

      logDebug("E", "RouterDebugProbe.tsx:error", "router init error caught", {
        pathname: window.location.pathname,
        message: event.message,
        stack: event.error instanceof Error ? event.error.stack : null,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    }

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, [pathname]);

  return null;
}
