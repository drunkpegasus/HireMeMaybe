import { NextSeo } from "next-seo";
import LandingHero from "@/components/landing-hero";
import { siteMetadata } from "@/data/siteMetaData.mjs";
export default function Home() {
  return (
    <>
      <NextSeo
        title="Kaus"
        description="Explore the professional portfolio of Kaustubh, a skilled Software Developer with 2 years of hands-on experience. Discover innovative projects, expertise in modern web technologies, and a passion for creating seamless user experiences."
        canonical={siteMetadata.siteUrl}
        openGraph={{
          url: siteMetadata.siteUrl,
          title: "Kaustubh - Software Developer",
          description:
            "Dive into the world of web development with Kaustubh. Discover a Software Developer with 2 years of expertise, showcasing cutting-edge projects and a commitment to crafting exceptional user interfaces.",
          images: [
            {
              url: `${siteMetadata.siteUrl}${siteMetadata.twitterImage}`,
              alt: "Kaustubh - Portfolio Image",
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
            property: "keywords",
            content:
              "React Developer, Software Developer, Frontend Developer, Web Developer, JavaScript, HTML, CSS, Portfolio, UI/UX, React.js, Frontend Development, Web Development, JavaScript Developer, Responsive Design",
          },
        ]}
      />
      {/* <Head>
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
