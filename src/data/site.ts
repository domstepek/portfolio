const DEFAULT_SITE_URL = "https://jean-dominique-stepek.is-a.dev";

const resolveSiteUrl = (value: string | undefined) => new URL(value ?? DEFAULT_SITE_URL).origin;

export const siteConfig = {
  name: "Dom",
  defaultTitle: "Dom | Software engineer",
  defaultDescription:
    "Dom builds interfaces for data-heavy financial software: real-time UIs, shared component systems, and the product work around them.",
  siteUrl: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  // basePath is always "/" on Vercel, so no dynamic configuration is needed
  basePath: "/",
  defaultSocialImage: "og-default.png",
  defaultFavicon: "favicon.svg",
} as const;
