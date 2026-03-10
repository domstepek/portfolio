const DEFAULT_SITE_URL = "https://jean-dominique-stepek.is-a.dev";
const DEFAULT_BASE_PATH = "/";

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
    "dom builds analytics platforms, infrastructure, ai/ml tooling, product systems, and developer experience tooling.",
  siteUrl: resolveSiteUrl(import.meta.env.PUBLIC_SITE_URL),
  basePath: normalizeBasePath(import.meta.env.PUBLIC_BASE_PATH ?? DEFAULT_BASE_PATH),
  defaultSocialImage: "og-default.png",
  defaultFavicon: "favicon.svg",
} as const;
