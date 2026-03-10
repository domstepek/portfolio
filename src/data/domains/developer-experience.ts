import type { DomainEntry } from "./types";

const developerExperience: DomainEntry = {
  slug: "developer-experience",
  order: 3,
  title: "developer experience",
  summary:
    "shared tooling and automation that help engineers ship faster and repeat less setup.",
  seoDescription:
    "developer experience domain page for monorepo tooling, design systems, and team automation Dom builds.",
  thesis:
    "i invest in developer experience when the team keeps burning time on the same setup, regression, or ui tax.",
  scope:
    "this is the internal tooling and automation layer — everything aimed at helping engineers ship faster, catch regressions sooner, and stop repeating the same setup work.",
  belongsHere: [
    "building shared tooling that replaces repeated setup, config edits, and release chores",
    "creating reusable ui or workflow primitives so teams stop rebuilding the same patterns from scratch",
    "setting up project foundations that make the next app easier to start and maintain",
  ],
  flagships: [
    {
      slug: "monorepo-template",
      title: "monorepo template",
      summary:
        "a pnpm-workspace monorepo foundation with shared configs, ci pipelines, and deployment conventions so new projects start from a proven baseline instead of from scratch.",
      problem:
        "every new project started with the same setup chores — linting, typescript config, ci pipelines, deploy scripts — and each team solved them slightly differently, creating drift.",
      role:
        "i built the monorepo template as the shared starting point for new projects, encoding the conventions the team had already agreed on into a reusable foundation.",
      constraints: [
        "the template had to support multiple apps and packages without becoming tightly coupled to any single project's needs.",
        "ci and deploy conventions needed to work out of the box so new projects did not reinvent the release process.",
        "the foundation had to stay maintainable by the team, not just by the person who set it up.",
      ],
      decisions: [
        "used pnpm workspaces for monorepo orchestration so builds, linting, and testing could run across packages with shared dependencies.",
        "encoded shared configs (tsconfig, eslint, prettier) as workspace packages so conventions stayed consistent without copy-pasting.",
        "included ci pipeline templates and deploy conventions so new projects inherited a working release path from day one.",
      ],
      outcomes: [
        "new projects started from a proven baseline instead of reinventing setup, cutting initial scaffolding time significantly.",
        "team conventions for linting, builds, and deploys stayed consistent across projects because they came from the same source.",
        "reduced the drift that happened when every project solved the same tooling problems independently.",
      ],
      stack: [
        "pnpm workspaces",
        "TypeScript",
        "ESLint",
        "Prettier",
        "GitHub Actions",
      ],
      visual: {
        alt: "a dependency graph showing two apps depending on shared packages for ui components, typescript config, and eslint config.",
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
      title: "global design system",
      summary:
        "a shared react component library and storybook-backed baseline that gave two product surfaces one reusable ui system instead of repeated one-off components.",
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
        "consistent interface work across two apps stopped requiring each team to solve the same component problems.",
        "turned ui reuse into something maintainable rather than a folder of copied snippets.",
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
          alt: "storybook showing the design system color documentation with base, gray, primary, error, warning, and success color scales alongside the component tree.",
          caption: "storybook — color system documentation with component tree navigation",
        },
      ],
    },
  ],
  supportingWork: [
    {
      title: "product team cli",
      context:
        "an internal cli for environment setup, config edits, and feature toggles so recurring team tasks became scripted instead of tribal knowledge.",
    },
    {
      title: "product migration scripts",
      context:
        "migration tooling for moving analytics product data and config without turning rollouts into manual cleanup days.",
    },
    {
      title: "cdk-eks contributions",
      context:
        "contributed AWS permissions and access patterns to the shared EKS platform foundation — the core CDK stacks and cluster setup were led by another engineer.",
    },
    {
      title: "stargazer applications",
      context:
        "tweaked Helm chart templates and environment values in the GitOps repo for service deployments on the shared EKS cluster — the ArgoCD and ApplicationSet setup was led by another engineer.",
    },
    {
      title: "private cdn",
      context:
        "an internal CDN and proxy layer for caching assets and controlling delivery paths in one place.",
    },
    {
      title: "sso reverse proxy",
      context:
        "a reusable auth sidecar that put SSO in front of ECS and EKS services without rebuilding the same edge logic per app.",
    },
  ],
  relatedDomains: ["product", "analytics-ai"],
};

export default developerExperience;
