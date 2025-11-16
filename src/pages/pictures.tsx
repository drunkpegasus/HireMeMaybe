import { GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { siteMetadata } from "@/data/siteMetaData.mjs";

// Node.js built-in modules to read files
import fs from "fs";
import path from "path";

// Using relative path for GalleryImage
import GalleryImage from "@/components/GalleryImage";

// This is the data structure we'll create on the server
type ImageData = {
  thumbnail: string;
  full: string;
  filename: string;
};

// This function runs at build time on the server
export const getStaticProps: GetStaticProps<{
  images: ImageData[];
}> = async () => {
  // 1. Define the paths to your image folders
  const thumbnailDir = path.join(
    process.cwd(),
    "public/images/gallery/thumbnails",
  );
  const fullDir = path.join(process.cwd(), "public/images/gallery/full");

  // 2. Read all filenames from the 'thumbnails' directory
  let thumbnailFiles;
  try {
    thumbnailFiles = fs.readdirSync(thumbnailDir);
  } catch (error) {
    console.error("Error reading thumbnails directory:", error);
    // If the directory doesn't exist, return an empty array
    return { props: { images: [] } };
  }

  // 3. Create the props array
  const images: ImageData[] = thumbnailFiles
    .filter((file) =>
      // Ensure we only process image files
      /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file),
    )
    .map((filename) => {
      const fullPath = path.join(fullDir, filename);

      // Check if a matching full-size image exists
      if (fs.existsSync(fullPath)) {
        return {
          thumbnail: `/images/gallery/thumbnails/${filename}`,
          full: `/images/gallery/full/${filename}`,
          filename: filename,
        };
      }
      return null; // Return null if no matching full image
    })
    .filter((image): image is ImageData => image !== null); // Filter out any null entries

  // 4. Pass the image data to the page
  return {
    props: {
      images,
    },
    // Optional: Re-validate every 1 hour (3600 seconds)
    // This lets new images show up without a full rebuild
    revalidate: 3600,
  };
};

// Your new page component
export default function ProjectsPage({
  images,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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

        {/* Responsive Grid Gallery */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.length > 0 ? (
            images.map((image) => (
              <GalleryImage
                key={image.filename}
                thumbnailSrc={image.thumbnail}
                fullSrc={image.full}
                alt={image.filename}
              />
            ))
          ) : (
            <p className="text-muted-foreground">
              No images found in the gallery.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
