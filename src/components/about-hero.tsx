import { AnimatePresence, motion } from "framer-motion";
import FadeUp from "@/animation/fade-up";
import { ChevronDown } from "lucide-react";

export default function AboutHero() {
  // 1. This function handles the scroll
  const handleScrollDown = () => {
    const nextSection = document.getElementById("experience-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative mx-auto mt-0 flex max-w-7xl flex-col items-center gap-6 px-6 pt-20 text-center sm:px-14 md:mt-20 md:px-20 lg:mt-0 lg:flex-row lg:text-left">
      {/* <div className="w-full sm:w-1/2 md:w-2/3 lg:inline-block lg:h-full lg:w-1/2">
        <AnimatePresence>
          <FadeUp key="hero-image" duration={0.6}>
            <DuotoneImage
              src={heroProfileImg}
              width={100}
              height={100}
              className="h-auto w-full px-0 xl:px-16"
              alt="hero image"
              lightColor="#E0FFFF"
              darkColor="#004D4D"
              unoptimized
            />
          </FadeUp>
        </AnimatePresence>
      </div> */}
      <div className="sm:1/2 mt-10 w-full lg:w-1/2">
        <AnimatePresence>
          <FadeUp key="title-greeting" duration={0.6}>
            <h1 className="text-6xl font-bold text-accent sm:text-7xl md:text-6xl lg:text-5xl xl:text-7xl">
              Hi, I&apos;m Kaustubh
            </h1>
          </FadeUp>
          <FadeUp key="description-1" duration={0.6} delay={0.2}>
            <p className="mt-8 text-base font-medium text-zinc-900 dark:text-zinc-300 sm:text-lg md:text-lg">
              I build for the web with a preference for order over noise. My
              work leans toward simplicity that feels earned through intention
              and craft.
            </p>
          </FadeUp>
          <FadeUp key="description-2" duration={0.6} delay={0.4}>
            <p className="mt-8 text-base font-medium text-zinc-900 dark:text-zinc-300 sm:text-lg md:text-lg">
              React, Next.js and TypeScript are my tools of choice, though I
              care more for what they allow than what they are. What you see
              here is a modest record of projects that reflect a certain
              patience, and the occasional lapse of it.
            </p>
          </FadeUp>
        </AnimatePresence>
      </div>

      {/* 2. This is the new clickable button */}
      <button
        onClick={handleScrollDown}
        aria-label="Scroll down to experience section"
        className="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 cursor-pointer lg:block"
      >
        <motion.div
          className="text-accent opacity-50"
          animate={{
            y: [0, 10, 0], // Bounces down and back up
            opacity: [0.6, 0.1, 0.6], // Pulses opacity
          }}
          transition={{
            duration: 2.0,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </button>
    </div>
  );
}
