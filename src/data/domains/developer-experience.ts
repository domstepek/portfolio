import type { DomainEntry } from "./types";

const developerExperience: DomainEntry = {
  slug: "developer-experience",
  order: 5,
  title: "developer experience",
  summary:
    "tooling, automation, and shared systems that make engineers faster, safer, and less likely to reinvent the same thing.",
  seoDescription:
    "developer experience domain page for team tooling, design systems, and qa automation Dom builds.",
  thesis:
    "i invest in developer experience when the team keeps burning time on the same setup, regression, or ui tax.",
  scope:
    "if the primary user win is for engineers shipping or maintaining software, it belongs here; if the main outcome is customer or operator workflow value, that belongs in product.",
  belongsHere: [
    "shared tooling that replaces repeated setup, config edits, and release chores",
    "quality systems that catch regressions before they become somebody else's fire drill",
    "reusable ui or workflow primitives that keep teams from rebuilding the same patterns",
  ],
  supportingWork: [
    {
      title: "global design system",
      context:
        "the shared component library and Storybook setup that gave multiple product surfaces one reusable ui baseline.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/global-design-system",
        },
      ],
      overlapNote: "the components show up across",
      relatedDomains: ["product"],
    },
    {
      title: "web portal qa bdd",
      context:
        "a WebdriverIO and Cucumber suite for high-risk portal flows and api checks that were too expensive to regression test by hand.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/web-portal-qa-bdd",
        },
      ],
      overlapNote: "the tested user journeys live mainly in",
      relatedDomains: ["analytics", "product"],
    },
    {
      title: "product team cli",
      context:
        "an internal cli for environment setup, config edits, and feature toggles so recurring team tasks became scripted instead of tribal knowledge.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/product-team-cli",
        },
      ],
      overlapNote: "the environment and release work connects to",
      relatedDomains: ["infrastructure"],
    },
    {
      title: "product migration scripts",
      context:
        "migration tooling for moving analytics product data and config without turning rollouts into manual cleanup days.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/product-migration-scripts",
        },
      ],
      overlapNote: "the destination data lives in",
      relatedDomains: ["analytics"],
    },
  ],
  relatedDomains: ["infrastructure", "product"],
};

export default developerExperience;
