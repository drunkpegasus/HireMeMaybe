import { type ProjectCardProps } from "@/components/projects/project-card";
import { type ProjectShowcaseListItem } from "@/components/projects/project-showcase-list";
import { siteMetadata } from "@/data/siteMetaData.mjs";

// Generic placeholder project showcase data. Replace with real projects as needed.
export const PROJECT_SHOWCASE: ProjectShowcaseListItem[] = [
  {
    index: 0,
    title: "Project Alpha",
    href: "/projects/project-alpha",
    tags: ["Web", "TypeScript", "Design"],
    image: {
      LIGHT: "/images/projects/generic-light.webp",
      DARK: "/images/projects/generic-dark.webp",
    },
  },
  {
    index: 1,
    title: "Project Beta",
    href: "/projects/project-beta",
    tags: ["API", "Node", "Tests"],
    image: {
      LIGHT: "/images/projects/generic-light-2.webp",
      DARK: "/images/projects/generic-dark-2.webp",
    },
  },
  {
    index: 2,
    title: "Project Gamma",
    href: "/projects/project-gamma",
    tags: ["Mobile", "React Native", "UI"],
    image: {
      LIGHT: "/images/projects/generic-light-3.webp",
      DARK: "/images/projects/generic-dark-3.webp",
    },
  },
];

// Generic placeholder project cards. Keep shape consistent with ProjectCardProps.
export const PROJECTS_CARD: ProjectCardProps[] = [
  {
    name: "Project Alpha",
    favicon: "/favicon.ico",
    imageUrl: [
      "/images/projects/generic-light.webp",
      "/images/projects/generic-dark.webp",
    ],
    description:
      "A generic placeholder project used for UI demonstrations. Replace with actual project details.",
    sourceCodeHref: "https://example.com/source/project-alpha",
    liveWebsiteHref: "https://example.com/demo/project-alpha",
  },
  {
    name: "Project Beta",
    favicon: "/favicon.ico",
    imageUrl: [
      "/images/projects/generic-light-2.webp",
      "/images/projects/generic-dark-2.webp",
    ],
    description:
      "Another placeholder entry. Use this slot for web services, APIs or backend projects.",
    sourceCodeHref: "https://example.com/source/project-beta",
    liveWebsiteHref: "https://example.com/demo/project-beta",
  },
  {
    name: "Project Gamma",
    favicon: "/favicon.ico",
    imageUrl: [
      "/images/projects/generic-light-3.webp",
      "/images/projects/generic-dark-3.webp",
    ],
    description:
      "Placeholder for a mobile or experimental project. Swap in real screenshots and links.",
    sourceCodeHref: "https://example.com/source/project-gamma",
    liveWebsiteHref: siteMetadata.siteUrl,
  },
  {
    name: "Sample Library",
    favicon: "/favicon.ico",
    imageUrl: [
      "/images/projects/generic-lib-1.webp",
      "/images/projects/generic-lib-2.webp",
    ],
    description:
      "A sample library/package placeholder used for demonstrations.",
    sourceCodeHref: "https://example.com/source/sample-library",
  },
];
