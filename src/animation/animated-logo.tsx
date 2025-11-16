import { AnimatePresence, Variants, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedLogo() {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimationKey((prevKey) => prevKey + 1);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const pathVariants: Variants = {
    hidden: {
      pathLength: 0,
      fill: "rgba(0, 0, 0, 0)",
    },
    visible: {
      pathLength: 1,

      // fill: "#1f8d93",
      fill: "#E57E8A",
    },
  };

  const svgVariants: Variants = {
    // This variant controls the SVG container's transition (fade/scale in/out)
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.svg
        key={animationKey}
        viewBox="0 0 450 450"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full fill-accent stroke-accent"
        variants={svgVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.path
          d="M100 60 
     L160 60 
     L160 200 
     L300 60 
     L380 60 
     L230 230 
     L380 390 
     L300 390 
     L160 250 
     L160 390 
     L100 390 
     Z"
          strokeWidth="15"
          strokeLinejoin="round"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          transition={{
            default: { duration: 3, ease: "easeInOut", delay: 0.3 },
            fill: { duration: 3, ease: [1, 0, 0.8, 1], delay: 0.3 },
          }}
        />
      </motion.svg>
    </AnimatePresence>
  );
}
