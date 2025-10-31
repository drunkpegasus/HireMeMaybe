import { motion } from 'framer-motion';

type GalleryImageProps = {
  thumbnailSrc: string;
  fullSrc: string;
  alt: string;
};

// This is a new component that uses the new app's styling.
export default function GalleryImage({ thumbnailSrc, fullSrc, alt }: GalleryImageProps) {
  return (
    <motion.a
      href={fullSrc}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block h-64 w-full overflow-hidden rounded-xl shadow-md"
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.2 },
      }}
      layout
    >
      {/*
        Replaced next/image with a standard <img> tag to resolve a
        build-time error. This removes Next.js image optimization
        for this component, but will resolve the dependency issue.
      */}
      <img
        src={thumbnailSrc}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
      />
      {/* Adds a nice dark overlay on hover */}
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
    </motion.a>
  );
}


