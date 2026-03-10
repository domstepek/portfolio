import { defineConfig } from "astro/config";

const DEFAULT_SITE_URL = "https://jean-dominique-stepek.is-a.dev";
const DEFAULT_BASE_PATH = "/";

const normalizeBasePath = (value) => {
  if (!value || value === "/") {
    return "/";
  }

  return `/${value.replace(/^\/+|\/+$/g, "")}`;
};

const site = new URL(process.env.PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).toString();
const base = normalizeBasePath(process.env.PUBLIC_BASE_PATH ?? DEFAULT_BASE_PATH);

export default defineConfig({
  output: "static",
  site,
  base,
  trailingSlash: "always",
  build: {
    format: "directory",
  },
});
