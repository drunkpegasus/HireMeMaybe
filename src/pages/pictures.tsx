import { GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { siteMetadata } from "@/data/siteMetaData.mjs";
import GalleryImage from "@/components/GalleryImage";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const getStaticProps: GetStaticProps<{
  images: string[];
}> = async () => {
  try {
    const { resources } = await cloudinary.search
      .expression("folder:gallery")
      .sort_by("created_at", "desc")
      .max_results(500)
      .execute();

    const images = resources.map(
      (file: any) => `${file.public_id.split("/").pop()}.${file.format}`,
    );

    return {
      props: { images },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error fetching from Cloudinary:", error);
    return { props: { images: [] } };
  }
};

export default function PicturesPage({
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

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.length > 0 ? (
            images.map((fileName) => (
              <GalleryImage
                key={fileName}
                fileName={fileName}
                alt={`Gallery picture ${fileName}`}
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
