import type { DomainEntry } from "./types";

const developerExperience: DomainEntry = {
  slug: "developer-experience",
  order: 5,
  title: "developer experience",
  summary:
    "shared tooling and automation that help engineers ship faster and repeat less setup.",
  seoDescription:
    "developer experience domain page for team tooling, design systems, and qa automation Dom builds.",
  thesis:
    "i invest in developer experience when the team keeps burning time on the same setup, regression, or ui tax.",
  scope:
    "this is the internal tooling and automation layer — everything aimed at helping engineers ship faster, catch regressions sooner, and stop repeating the same setup work.",
  belongsHere: [
    "building shared tooling that replaces repeated setup, config edits, and release chores",
    "setting up quality systems that catch regressions before they become somebody else's fire drill",
    "creating reusable ui or workflow primitives so teams stop rebuilding the same patterns from scratch",
  ],
  flagships: [
    {
      slug: "global-design-system",
      title: "global design system",
      summary:
        "a shared react component library and storybook-backed baseline that gave multiple product surfaces one reusable ui system instead of repeated one-off components.",
      problem:
        "teams were paying the same ui tax across products, rebuilding patterns and styling decisions that should have been shared once and reused.",
      role:
        "i helped turn those repeated ui needs into a maintainable shared system so teams could ship product work without re-solving common components every time.",
      constraints: [
        "the library had to be reusable across multiple product surfaces, not secretly optimized for one app.",
        "shared components needed enough consistency to help without locking teams into brittle one-off abstractions.",
        "documentation and publishing discipline mattered because a design system only helps if teams can actually consume it.",
      ],
      decisions: [
        "kept the system as a dedicated library rather than copying component code between apps.",
        "focused on reusable exports and a documented publish path so the system could behave like a real product dependency.",
        "used a standard React and TypeScript library workflow so adoption did not require special tooling.",
      ],
      outcomes: [
        "product teams got a shared ui baseline instead of repeated component drift.",
        "consistent interface work across four separate apps stopped requiring each team to solve the same component problems.",
        "turned ui reuse into something maintainable rather than a folder of copied snippets.",
      ],
      stack: [
        "React",
        "TypeScript",
        "Vite",
        "Storybook",
      ],
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/global-design-system",
        },
      ],
    },
    {
      slug: "web-portal-qa-bdd",
      title: "web portal qa bdd",
      summary:
        "a webdriverio and cucumber suite for high-risk portal flows plus api checks, so regression coverage stopped depending on expensive manual re-testing.",
      problem:
        "the portal had important paths that were too risky and too repetitive to keep verifying by hand every time something changed.",
      role:
        "i helped define an automated regression layer around the flows worth protecting most, pairing browser behavior with targeted api checks.",
      constraints: [
        "the suite had to cover real user journeys without becoming impossible to run outside a single local machine.",
        "different environments and browsers mattered, so the test harness needed to stay configurable.",
        "reporting and ci usefulness were part of the value; test code alone would not solve the regression tax.",
      ],
      decisions: [
        "used WebdriverIO plus Cucumber so important flows could be expressed as behavior-focused tests instead of scattered scripts.",
        "kept smoke, tagged, api, and dockerized execution paths so the suite could serve local debugging and repeatable ci runs.",
        "focused first on high-risk flows where manual regression cost was already obvious.",
      ],
      outcomes: [
        "portal regressions surfaced before release day instead of after.",
        "the repetitive manual checking that ate time on high-risk workflows mostly went away.",
        "created reusable qa tooling that supported both browser and api confidence on the same project.",
      ],
      stack: [
        "WebdriverIO",
        "Cucumber",
        "Gherkin",
        "Jest",
        "Docker Compose",
      ],
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/web-portal-qa-bdd",
        },
      ],
      visual: {
        src: "highlights/developer-experience/web-portal-qa-bdd/regression-flow.svg",
        alt: "a regression flow showing tagged test runs feeding browser checks and api checks, then producing reports for release confidence.",
        caption:
          "the useful part was giving the team repeatable ways to run the same high-risk checks locally, in docker, or in ci.",
      },
    },
  ],
  supportingWork: [
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
