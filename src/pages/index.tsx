import Head from "next/head";
import { NextSeo } from "next-seo";
import LandingHero from "@/components/landing-hero";
import { siteMetadata } from "@/data/siteMetaData.mjs";

export default function Home() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteMetadata.siteName, // "Kaus" (change to "Kaustubh" in siteMetaData.mjs if preferred)
    alternateName: ["Kaustubh", "Kaustubh Shastrakar", "kaustubhsh.com"],
    url: `${siteMetadata.siteUrl}/`,
  };

  return (
    <>
      <NextSeo
        title="Kaustubh Shastrakar"
        description="Explore the professional portfolio of Kaustubh Shastrakar, a skilled Software Developer with 2 years of hands-on experience. Discover innovative projects, expertise in modern web technologies, and a passion for creating seamless user experiences."
        canonical={siteMetadata.siteUrl}
        openGraph={{
          url: siteMetadata.siteUrl,
          title: "Kaustubh Shastrakar - Software Developer",
          description:
            "Dive into the world of web development with Kaustubh Shastrakar. Discover a Software Developer with 2 years of expertise, showcasing cutting-edge projects and a commitment to crafting exceptional user interfaces.",
          images: [
            {
              url: `${siteMetadata.siteUrl}${siteMetadata.twitterImage}`,
              alt: "Kaustubh Shastrakar - Portfolio Image",
            },
          ],
          siteName: siteMetadata.siteName,
          type: "website",
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[
          {
            name: "application-name",
            content: siteMetadata.siteName,
          },
          {
            name: "apple-mobile-web-app-title",
            content: siteMetadata.siteName,
          },
          {
            property: "keywords",
            content:
              "React Developer, Software Developer, Frontend Developer, Web Developer, JavaScript, HTML, CSS, Portfolio, UI/UX, React.js, Frontend Development, Web Development, JavaScript Developer, Responsive Design",
          },
        ]}
      />
      {/* <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {siteMetadata.googleSiteVerification && (
          <meta
            name="google-site-verification"
            content={siteMetadata.googleSiteVerification}
          />
        )}
      </Head> */}
      <div className="flex flex-grow flex-col">
        <LandingHero />
      </div>
      {/* <SkillsShowcase skills={SKILLS_DATA} />
      <ProjectShowcase projects={PROJECT_SHOWCASE} /> */}
    </>
  );
}