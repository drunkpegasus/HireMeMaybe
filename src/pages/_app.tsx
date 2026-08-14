import { useEffect } from "react"; // <-- Added this line
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
    const logVisitor = async (url: string) => {
      try {
        // Make sure NEXT_PUBLIC_API_URL is set in your Vercel Environment Variables
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        if (!apiUrl) return;

        await fetch(`${apiUrl}/log-ip`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: url,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
          }),
        });
      } catch (error) {
        // Silently fail so it doesn't break the UI for the user
        console.error('Visitor logging failed:', error);
      }
    };

    // Log the initial page visit when the app first mounts
    logVisitor(router.asPath);

    // Listen for all subsequent Next.js client-side route changes
    const handleRouteChange = (url: string) => {
      logVisitor(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
  
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