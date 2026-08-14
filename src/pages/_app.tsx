import { useEffect } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";

import MainLayout from "@/layout/main-layout";
import CursorTrailCanvas from "@/components/cursor-trail-canvas";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const logVisitor = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_LOGGING_API_ENDPOINT;

        if (!apiUrl) return;

        await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: router.asPath,
            screenWidth: Math.round(window.screen.width * window.devicePixelRatio),
            screenHeight: Math.round(window.screen.height * window.devicePixelRatio),
          }),
        });
      } catch (error) {
        console.error("Visitor logging failed:", error);
      }
    };

    logVisitor();
  }, [router.asPath]);

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
