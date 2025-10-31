import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";

import MainLayout from "@/layout/main-layout";
import CursorTrailCanvas from "@/components/cursor-trail-canvas";
import "@/styles/globals.css";
import { MittEmitter } from "next/dist/shared/lib/mitt";
import { useEffect as reactUseEffect, DependencyList } from "react";

function logPageView(url: string) {
  fetch(`/api/log-visit?page=${encodeURIComponent(url)}`, {
    method: "GET",
    keepalive: true,
  }).catch((err) => {
    console.error("Failed to log page view:", err);
  });
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // This logs the route change *after* it completes
    const handleRouteChange = (url: string) => {
      logPageView(url);
    };

    // Listen for the event
    router.events.on("routeChangeComplete", handleRouteChange);

    // Clean up the listener
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light">
        <MainLayout>
          <AnimatePresence mode="wait" initial={false}>
            <CursorTrailCanvas className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />
            <Component key={router.asPath} {...pageProps} />
          </AnimatePresence>
        </MainLayout>
      </ThemeProvider>
      <Analytics />
    </>
  );
}

// Lightweight wrapper that forwards to React's useEffect.
// The original call passes router.events (a MittEmitter) in the dependency array,
// so we accept a generic deps parameter and cast it to React's DependencyList.
function useEffect(
  effect: () => void | (() => void | undefined),
  deps?: DependencyList | unknown[]
) {
  return reactUseEffect(effect, deps as DependencyList | undefined);
}

