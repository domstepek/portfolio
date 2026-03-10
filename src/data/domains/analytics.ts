import type { DomainEntry } from "./types";

const analytics: DomainEntry = {
  slug: "analytics",
  order: 1,
  title: "analytics",
  summary:
    "reporting surfaces and measurement workflows that help teams trust the data in front of them.",
  seoDescription:
    "analytics domain page for reporting surfaces, measurement workflows, and data tools Dom builds.",
  thesis:
    "i build analytics systems when the real bottleneck is understanding the business, not collecting one more table.",
  scope:
    "this covers the reporting, measurement, and data-trust side of products — the work where the main challenge is making the numbers useful, not building the platform underneath.",
  belongsHere: [
    "building dashboards and reports that ops teams actually use every morning",
    "designing measurement layers so trends, exceptions, and drill-downs are obvious before anyone is flying blind",
    "data-heavy interfaces where query depth, filters, and clarity matter as much as frontend polish",
  ],
  flagships: [
    {
      slug: "web-portal",
      title: "web portal",
      summary:
        "the main operator-facing reporting surface for drilling into product data, narrowing with filters, and taking follow-up action without bouncing between separate tools.",
      problem:
        "teams needed one place to inspect product data and answer day-to-day questions without turning every investigation into an ad hoc query or spreadsheet detour.",
      role:
        "i shaped the reporting workflow and translated the core business questions into filters, views, and drill-down paths people could use in real work.",
      constraints: [
        "the interface had to support quick checks and deeper investigation without collapsing into a generic dashboard shell.",
        "data trust mattered because the page was meant to drive follow-up actions, not just passive reading.",
        "operators needed the reporting context and the next step close together instead of split across multiple tools.",
      ],
      decisions: [
        "centered the portal on operator workflows instead of a chart-first dashboard layout.",
        "paired summary views with filter and drill-down paths so people could move from signal to record-level context without losing their place.",
        "kept follow-up actions near the reporting surface so the portal could help resolve questions instead of only describe them.",
      ],
      outcomes: [
        "one reporting surface for product data, filters, and exceptions — instead of stitching context together across tools.",
        "cut down the back-and-forth between raw data pulls and separate operational tools during investigations.",
        "the reporting depth held up because it was tied to real daily use, not a dashboard someone opened once a quarter.",
      ],
      stack: [
        "React",
        "Redux",
        "Apollo GraphQL",
        "D3",
        "visx",
        "AWS Amplify",
        "Vite",
        "Sentry",
        "Umami",
      ],
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/web-portal",
        },
      ],
    },
    {
      slug: "superset-on-stargazer",
      title: "superset on stargazer",
      summary:
        "a repeatable path for running Apache Superset on the shared EKS platform so teams could publish dashboards without kicking off a separate platform project first.",
      problem:
        "teams needed dashboarding, but standing up a one-off analytics environment each time would have turned a normal reporting ask into avoidable platform work.",
      role:
        "i mapped the existing cluster and release rails into a usable analytics deployment path so dashboarding could fit the same platform standards carrying the rest of the stack.",
      constraints: [
        "it had to fit a shared EKS environment instead of assuming a single-purpose analytics cluster.",
        "analysts needed a publishable dashboard path without becoming kubernetes specialists.",
        "the setup had to be repeatable enough that each new dashboard request did not restart the same platform conversation from zero.",
      ],
      decisions: [
        "used the existing stargazer application rail instead of carving out a special-case hosting path.",
        "optimized for a documented repeatable deployment shape rather than a fragile manual install.",
        "kept dashboard authoring separate from lower-level cluster concerns so the analytics workflow stayed approachable.",
      ],
      outcomes: [
        "Apache Superset went from theoretical to deployable on the shared platform.",
        "shortened the path from 'we need a dashboard' to a working deployment shape.",
        "analytics tooling rode the same release and platform standards as everything else — no special-case hosting.",
      ],
      stack: [
        "Apache Superset",
        "AWS",
        "EKS",
      ],
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/stargazer-applications",
        },
      ],
    },
  ],
  supportingWork: [
    {
      title: "umami",
      context:
        "a self-hosted analytics deployment in aws so baseline measurement stayed inside our own stack and easy to inspect.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/umami",
        },
      ],
      overlapNote: "the hosting path leans on",
      relatedDomains: ["infrastructure"],
    },
  ],
  relatedDomains: ["product", "ai-ml"],
};

export default analytics;
