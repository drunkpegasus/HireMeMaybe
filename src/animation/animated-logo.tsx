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

  const iconVariant: Variants = {
    hidden: {
      pathLength: 0,
      fill: "rgba(0, 0, 0, 0)",
    },
    visible: {
      pathLength: 1,

      fill: "#1f8d93",
    },
  };

  return (
    <AnimatePresence>
      <motion.svg
        viewBox="0 0 450 450"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full fill-accent stroke-accent"
      >
        <motion.path
          key={animationKey}
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
          variants={iconVariant}
          initial="hidden"
          animate="visible"
          transition={{
            default: { duration: 3, ease: "easeInOut" },
            fill: { duration: 3, ease: [1, 0, 0.8, 1] },
          }}
        />
      </motion.svg>
    </AnimatePresence>
  );
}
