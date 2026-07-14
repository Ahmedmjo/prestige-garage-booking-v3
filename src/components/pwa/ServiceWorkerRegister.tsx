"use client";

import { useEffect } from "react";

/**
 * Registers /sw.js on the client.
 *
 * Without a service worker, Chrome/Android NEVER fires `beforeinstallprompt`,
 * which means our InstallPrompt component never shows. The SW also enables
 * offline app-shell caching for repeat visits.
 *
 * Registered only in production (NODE_ENV === 'production') to avoid stale
 * cache issues during local dev.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => {
          // Silent fail — install prompt just won't show. Don't spam console.
          console.warn("SW registration failed", err);
        });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}

export default ServiceWorkerRegister;
