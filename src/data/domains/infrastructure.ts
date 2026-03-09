import type { DomainEntry } from "./types";

const infrastructure: DomainEntry = {
  slug: "infrastructure",
  order: 2,
  title: "infrastructure",
  summary:
    "platform foundations, deploy rails, and edge systems that make services easier to ship and safer to run.",
  seoDescription:
    "infrastructure domain page for deploy rails, kubernetes foundations, and edge systems Dom builds.",
  thesis:
    "i do infrastructure work when the product problem is really a reliability, delivery, or platform problem in disguise.",
  scope:
    "if the hard part is provisioning, deploying, routing, or securing the system, it belongs here; if the main user win is inside the workflow itself, that is product.",
  belongsHere: [
    "cluster, network, and GitOps foundations that keep teams from hand-building every environment",
    "shared edge services for auth, caching, routing, and delivery policies",
    "operational systems that remove release anxiety and reduce platform drift",
  ],
  supportingWork: [
    {
      title: "cdk-eks",
      context:
        "the aws cdk foundation repo for standing up EKS, core addons, autoscaling, ingress, and secret plumbing.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/cdk-eks",
        },
      ],
      overlapNote: "making environments repeatable also helps",
      relatedDomains: ["developer-experience"],
    },
    {
      title: "stargazer applications",
      context:
        "the GitOps repo that pushed services through ArgoCD and Helm values instead of one-off deploy steps.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/stargazer-applications",
        },
      ],
      overlapNote: "some of the shipped apps live in",
      relatedDomains: ["analytics"],
    },
    {
      title: "private cdn",
      context:
        "an internal CDN and proxy layer for caching assets and controlling delivery paths in one place.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/private_cdn",
        },
      ],
    },
    {
      title: "sso reverse proxy",
      context:
        "a reusable auth sidecar that put SSO in front of ECS and EKS services without rebuilding the same edge logic per app.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/sso-reverse-proxy",
        },
      ],
      overlapNote: "the protected apps themselves live in",
      relatedDomains: ["product"],
    },
  ],
  relatedDomains: ["developer-experience", "analytics"],
};

export default infrastructure;
