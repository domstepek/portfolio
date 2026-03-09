const DEFAULT_SITE_URL = "https://jstepek.github.io";
const DEFAULT_BASE_PATH = "/website";

const normalizeBasePath = (value: string | undefined) => {
  if (!value || value === "/") {
    return "/";
  }

  return `/${value.replace(/^\/+|\/+$/g, "")}`;
};

const resolveSiteUrl = (value: string | undefined) => new URL(value ?? DEFAULT_SITE_URL).origin;

export const siteConfig = {
  name: "dom",
  defaultTitle: "dom | systems, products, and tooling",
  defaultDescription:
    "a static astro foundation for a domain-first personal site about systems, products, and developer tooling.",
  siteUrl: resolveSiteUrl(import.meta.env.PUBLIC_SITE_URL),
  basePath: normalizeBasePath(import.meta.env.PUBLIC_BASE_PATH ?? DEFAULT_BASE_PATH),
  defaultSocialImage: "og-default.png",
  defaultFavicon: "favicon.svg",
} as const;
