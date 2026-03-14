const DEFAULT_SITE_URL = "https://jean-dominique-stepek.is-a.dev";

const resolveSiteUrl = (value: string | undefined) => new URL(value ?? DEFAULT_SITE_URL).origin;

export const siteConfig = {
  name: "Dom",
  defaultTitle: "Dom | Systems, Products, and Tooling",
  defaultDescription:
    "Dom builds product systems, analytics & AI tooling, and developer experience infrastructure.",
  siteUrl: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  // basePath is always "/" on Vercel — no dynamic configuration needed
  basePath: "/",
  defaultSocialImage: "og-default.png",
  defaultFavicon: "favicon.svg",
} as const;
