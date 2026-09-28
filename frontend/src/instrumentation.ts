export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

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
      hypothesisId: "A",
      location: "instrumentation.ts:register",
      message: "Next.js server register()",
      data: {
        pid: process.pid,
        nodeEnv: process.env.NODE_ENV,
        cwd: process.cwd(),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}
