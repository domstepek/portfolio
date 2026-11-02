import { siteConfig } from "../data/site";

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");
const absoluteUrlPattern = /^https?:\/\//;

// basePath is always "/" on Vercel — basePrefix is always empty string
const basePrefix = "";

export const routePath = (...segments: string[]) => {
  const path = segments.map(trimSlashes).filter(Boolean).join("/");

  if (!path) {
    return "/";
  }

  return `/${path}/`;
};

export const homePath = routePath();

export const aboutPath = routePath("about");

export const domainPath = (slug: string) => routePath("domains", slug);

export const notesPath = routePath("notes");

export const notePath = (slug: string) => routePath("notes", slug);

export const resumePath = routePath("resume");

export const assetPath = (asset: string) => {
  const normalizedAsset = trimSlashes(asset);

  if (!normalizedAsset) {
    return homePath;
  }

  return `/${normalizedAsset}`;
};

const normalizeCanonicalPath = (path: string) => {
  if (!path || path === "/") {
    return homePath;
  }

  return routePath(path);
};

export const canonicalUrl = (path = "/") => {
  if (absoluteUrlPattern.test(path)) {
    return path;
  }

  return new URL(normalizeCanonicalPath(path), siteConfig.siteUrl).toString();
};

// Keep basePrefix export for any consumer that references it
export { basePrefix };
