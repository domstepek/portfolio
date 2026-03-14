import type { DomainEntry } from "./types";

const developerExperience: DomainEntry = {
  slug: "developer-experience",
  order: 3,
  title: "Developer Experience",
  summary:
    "Shared tooling and automation that help engineers ship faster and repeat less setup.",
  seoDescription:
    "Developer experience domain page for monorepo tooling, design systems, and team automation Dom builds.",
  thesis:
    "I invest in developer experience when the team keeps burning time on the same setup, regression, or UI tax.",
  scope:
    "This is the internal tooling and automation layer — everything aimed at helping engineers ship faster, catch regressions sooner, and stop repeating the same setup work.",
  belongsHere: [
    "Building shared tooling that replaces repeated setup, config edits, and release chores",
    "Creating reusable UI or workflow primitives so teams stop rebuilding the same patterns from scratch",
    "Setting up project foundations that make the next app easier to start and maintain",
  ],
  flagships: [
    {
      slug: "monorepo-template",
      title: "Monorepo Template",
      summary:
        "A pnpm-workspace monorepo foundation with shared configs, CI pipelines, and deployment conventions so new projects start from a proven baseline instead of from scratch.",
      problem:
        "Every new project started with the same setup chores — linting, `TypeScript` config, CI pipelines, deploy scripts — and each team solved them slightly differently, creating drift.",
      role:
        "I built the monorepo template as the shared starting point for new projects, encoding the conventions the team had already agreed on into a reusable foundation.",
      constraints: [
        "The template had to support multiple apps and packages without becoming tightly coupled to any single project's needs.",
        "CI and deploy conventions needed to work out of the box so new projects did not reinvent the release process.",
        "The foundation had to stay maintainable by the team, not just by the person who set it up.",
      ],
      decisions: [
        "Used `pnpm` workspaces for monorepo orchestration so builds, linting, and testing could run across packages with shared dependencies.",
        "Encoded shared configs (`tsconfig`, `eslint`, `prettier`) as workspace packages so conventions stayed consistent without copy-pasting.",
        "Included CI pipeline templates and deploy conventions so new projects inherited a working release path from day one.",
      ],
      outcomes: [
        "New projects started from a proven baseline instead of reinventing setup, cutting initial scaffolding time significantly.",
        "Team conventions for linting, builds, and deploys stayed consistent across projects because they came from the same source.",
        "Reduced the drift that happened when every project solved the same tooling problems independently.",
      ],
      stack: [
        "pnpm workspaces",
        "TypeScript",
        "ESLint",
        "Prettier",
        "GitHub Actions",
      ],
      visual: {
        alt: "A dependency graph showing two apps depending on shared packages for UI components, TypeScript config, and ESLint config.",
        caption:
          "pnpm workspace graph — shared configs as packages so conventions stay consistent without copy-pasting.",
        mermaid: `graph TD
  Root[pnpm workspace root] --> Frontend[frontend]
  Root --> Backend[backend]
  Root --> E2E[e2e]
  Root --> CICD[cicd]
  Root --> Docs[docs]
  E2E --> Frontend
  E2E --> Backend
  CICD --> Frontend
  CICD --> Backend`,
      },
    },
    {
      slug: "global-design-system",
      title: "Global Design System",
      summary:
        "A shared React component library and Storybook-backed baseline that gave two product surfaces one reusable UI system instead of repeated one-off components.",
      problem:
        "Teams were paying the same UI tax across products, rebuilding patterns and styling decisions that should have been shared once and reused.",
      role:
        "I helped turn those repeated UI needs into a maintainable shared system so teams could ship product work without re-solving common components every time.",
      constraints: [
        "The library had to be reusable across multiple product surfaces, not secretly optimized for one app.",
        "Shared components needed enough consistency to help without locking teams into brittle one-off abstractions.",
        "Documentation and publishing discipline mattered because a design system only helps if teams can actually consume it.",
      ],
      decisions: [
        "Kept the system as a dedicated library rather than copying component code between apps.",
        "Focused on reusable exports and a documented publish path so the system could behave like a real product dependency.",
        "Used a standard `React` and `TypeScript` library workflow so adoption did not require special tooling.",
      ],
      outcomes: [
        "Product teams got a shared UI baseline instead of repeated component drift.",
        "Consistent interface work across two apps stopped requiring each team to solve the same component problems.",
        "Turned UI reuse into something maintainable rather than a folder of copied snippets.",
      ],
      stack: [
        "React",
        "TypeScript",
        "Vite",
        "Storybook",
      ],
      screenshots: [
        {
          src: "/highlights/developer-experience/global-design-system/storybook.png",
          alt: "Storybook showing the design system color documentation with base, gray, primary, error, warning, and success color scales alongside the component tree.",
          caption: "Storybook — color system documentation with component tree navigation",
        },
      ],
    },
  ],
  supportingWork: [
    {
      title: "Product Team CLI",
      context:
        "An internal `CLI` for environment setup, config edits, and feature toggles so recurring team tasks became scripted instead of tribal knowledge.",
    },
    {
      title: "Product Migration Scripts",
      context:
        "Migration tooling for moving analytics product data and config without turning rollouts into manual cleanup days.",
    },
    {
      title: "CDK-EKS Contributions",
      context:
        "Contributed AWS permissions and access patterns to the shared `EKS` platform foundation — the core `CDK` stacks and cluster setup were led by another engineer.",
    },
    {
      title: "Stargazer Applications",
      context:
        "Tweaked `Helm` chart templates and environment values in the GitOps repo for service deployments on the shared `EKS` cluster — the `ArgoCD` and ApplicationSet setup was led by another engineer.",
    },
    {
      title: "Private CDN",
      context:
        "An internal `CDN` and proxy layer for caching assets and controlling delivery paths in one place.",
    },
    {
      title: "SSO Reverse Proxy",
      context:
        "A reusable auth sidecar that put `SSO` in front of `ECS` and `EKS` services without rebuilding the same edge logic per app.",
    },
  ],
  relatedDomains: ["product", "analytics-ai"],
};

export default developerExperience;
