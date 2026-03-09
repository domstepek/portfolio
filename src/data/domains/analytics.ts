import type { DomainEntry } from "./types";

const analytics: DomainEntry = {
  slug: "analytics",
  order: 1,
  title: "analytics",
  summary:
    "reporting surfaces, measurement workflows, and data tools that help teams trust what they are looking at.",
  seoDescription:
    "analytics domain page for reporting surfaces, measurement workflows, and data tools Dom builds.",
  thesis:
    "i build analytics systems when the real bottleneck is understanding the business, not collecting one more table.",
  scope:
    "if the job is helping people inspect, compare, or trust the data itself, it belongs here; if the hard part is shipping the platform or model behavior, it belongs somewhere else.",
  belongsHere: [
    "reporting products that turn warehouse or event data into daily operator workflows",
    "measurement layers that make trends, exceptions, and drill-down paths obvious before a team is flying blind",
    "data-heavy interfaces where query depth, filters, and clarity matter as much as frontend polish",
  ],
  supportingWork: [
    {
      title: "web portal",
      context:
        "the main operator-facing reporting portal for drilling into product data, filters, and follow-up actions in one place.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/web-portal",
        },
      ],
      overlapNote: "the workflow design also touches",
      relatedDomains: ["product"],
    },
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
    {
      title: "superset on stargazer",
      context:
        "the path for running Apache Superset on the shared EKS platform so analysts could publish dashboards without bespoke platform work each time.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/stargazer-applications",
        },
      ],
      overlapNote: "the cluster and deploy rail belong more in",
      relatedDomains: ["infrastructure"],
    },
  ],
  relatedDomains: ["product", "ai-ml"],
};

export default analytics;
