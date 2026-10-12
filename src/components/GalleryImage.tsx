import Image from "next/image";
import { motion } from "framer-motion";

type GalleryImageProps = {
  thumbnailSrc: string;
  fullSrc: string;
  alt: string;
};

export default function GalleryImage({
  thumbnailSrc,
  fullSrc,
  alt,
}: GalleryImageProps) {
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
      <Image
        src={thumbnailSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
    </motion.a>
  );
}
