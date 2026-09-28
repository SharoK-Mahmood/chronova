"use client";

import { useEffect } from "react";

function debugLog(
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
      "X-Debug-Session-Id": "fc00a4",
    },
    body: JSON.stringify({
      sessionId: "fc00a4",
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

/** Temporary debug probe — remove after session. */
export function DevConnectionProbe() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    debugLog("D", "DevConnectionProbe.tsx:mount", "Client probe mounted", {
      href: window.location.href,
      online: navigator.onLine,
      readyState: document.readyState,
    });

    const onError = (event: ErrorEvent) => {
      const msg = String(event.message ?? "");
      const isChunk =
        msg.includes("ChunkLoadError") ||
        msg.includes("Failed to load chunk") ||
        msg.includes("Loading chunk");
      debugLog(
        isChunk ? "B" : "D",
        "DevConnectionProbe.tsx:window.error",
        "window error",
        {
          message: msg.slice(0, 300),
          filename: event.filename,
          isChunk,
        },
      );
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = String(event.reason ?? "");
      const isChunk =
        reason.includes("ChunkLoadError") ||
        reason.includes("Failed to load chunk");
      const isRouter =
        reason.includes("Router action dispatched before initialization");
      debugLog(
        isRouter ? "D" : isChunk ? "B" : "A",
        "DevConnectionProbe.tsx:unhandledrejection",
        "unhandled rejection",
        {
          reason: reason.slice(0, 300),
          isChunk,
          isRouter,
        },
      );
    };

    const onOffline = () => {
      debugLog("A", "DevConnectionProbe.tsx:offline", "browser offline", {});
    };

    const probe = async () => {
      const started = Date.now();
      try {
        const res = await fetch(`/favicon.png?dbg=${started}`, {
          cache: "no-store",
        });
        debugLog("A", "DevConnectionProbe.tsx:probe", "favicon probe ok", {
          status: res.status,
          ms: Date.now() - started,
        });
      } catch (err) {
        debugLog("A", "DevConnectionProbe.tsx:probe", "favicon probe FAIL", {
          error: String(err).slice(0, 200),
          ms: Date.now() - started,
        });
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("offline", onOffline);

    void probe();
    const interval = window.setInterval(() => {
      void probe();
    }, 8000);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("offline", onOffline);
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
