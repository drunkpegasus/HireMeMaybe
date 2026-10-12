import { GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { siteMetadata } from "@/data/siteMetaData.mjs";
import GalleryImage from "@/components/GalleryImage";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon, ExternalLinkIcon } from "lucide-react";

type CloudinaryImageData = {
  id: string;
  thumbnailSrc: string;
  lightboxSrc: string;
  originalSrc: string;
};

export const getStaticProps: GetStaticProps<{
  images: CloudinaryImageData[];
}> = async () => {
  try {
    const { v2: cloudinary } = await import("cloudinary");

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const { resources } = await cloudinary.api.resources_by_asset_folder(
      "gallery",
      {
        max_results: 500,
      },
    );

    resources.sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    const images: CloudinaryImageData[] = resources.map((file: any) => {
      // 400x400 square for the grid
      const thumbnailSrc = file.secure_url.replace(
        "/upload/",
        "/upload/c_fill,w_400,h_400,f_auto,q_auto/",
      );
      // 1920px max width for the fast-loading Lightbox
      const lightboxSrc = file.secure_url.replace(
        "/upload/",
        "/upload/c_limit,w_1920,f_auto,q_auto/",
      );
      // The massive, untouched original (with auto-format applied for modern browsers)
      const originalSrc = file.secure_url.replace(
        "/upload/",
        "/upload/f_auto,q_auto/",
      );

      return {
        id: file.public_id,
        thumbnailSrc,
        lightboxSrc,
        originalSrc,
      };
    });

    return {
      props: { images },
      revalidate: 5,
    };
  } catch (error) {
    console.error("Error fetching from Cloudinary:", error);
    return { props: { images: [] } };
  }
};

export default function PicturesPage({
  images,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [selectedImage, setSelectedImage] =
    useState<CloudinaryImageData | null>(null);

  return (
    <>
      <NextSeo
        title="Pictures"
        description="A gallery of my creative work and projects."
        canonical={`${siteMetadata.siteUrl}/pictures`}
        openGraph={{
          url: `${siteMetadata.siteUrl}/pictures`,
          title: "Pictures - My Work",
          description: "A gallery of my creative work and projects.",
        }}
      />
      <section className="mx-auto mb-40 mt-6 w-full max-w-7xl gap-20 px-6 sm:mt-12 sm:px-14 md:px-20">
        <h1 className="text-2xl font-semibold text-foreground md:text-4xl">
          Pictures
        </h1>
        <div className="my-2">
          <span className="text-sm text-muted-foreground">
            Right from my gallery. Click any image to see the full-size version.
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.length > 0 ? (
            images.map((image, index) => (
              <GalleryImage
                key={image.id}
                thumbnailSrc={image.thumbnailSrc}
                alt={image.id}
                onClick={() => setSelectedImage(image)}
                priority={index < 8}
              />
            ))
          ) : (
            <p className="text-muted-foreground">
              No images found in the gallery.
            </p>
          )}
        </div>
      </section>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[9999] flex cursor-zoom-out items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <div className="absolute right-6 top-6 flex gap-4">
              <a
                href={selectedImage.originalSrc}
                target="_blank"
                rel="noopener noreferrer"
                title="Open Original"
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              >
                <ExternalLinkIcon className="h-6 w-6 sm:h-8 sm:w-8" />
              </a>
              <button
                title="Close"
                className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                onClick={() => setSelectedImage(null)}
              >
                <XIcon className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>
            </div>

            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage.lightboxSrc}
              alt="Full size gallery view"
              className="max-h-[90vh] max-w-[90vw] rounded-md object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
