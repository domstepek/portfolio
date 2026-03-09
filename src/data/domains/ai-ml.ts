import type { DomainEntry } from "./types";

const aiMl: DomainEntry = {
  slug: "ai-ml",
  order: 3,
  title: "ai / ml",
  summary:
    "applied ai / ml systems where retrieval, model behavior, or agent orchestration changes what the workflow can do.",
  seoDescription:
    "ai / ml domain page for retrieval flows, model-assisted tooling, and agent systems Dom builds.",
  thesis:
    "i use ai / ml when model behavior meaningfully changes the workflow, not when a chatbot veneer is the whole pitch.",
  scope:
    "if the hard part is prompt orchestration, retrieval quality, or model-driven actions, it belongs here; if it would still be the same product without the model, it probably belongs somewhere else.",
  belongsHere: [
    "retrieval and generation flows tied to concrete operator or analyst tasks",
    "agent-style systems where tool use, context passing, and guardrails matter more than demo flash",
    "ml-assisted features that need review loops, fallbacks, and practical debugging",
  ],
  supportingWork: [
    {
      title: "collection curator api",
      context:
        "an api platform for exploring analytics curation with Bedrock, LangChain, and MCP-backed assistant flows.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/collection-curator-api",
        },
      ],
      overlapNote: "the adjacent use cases land in",
      relatedDomains: ["analytics", "product"],
    },
    {
      title: "mcp demo",
      context:
        "a small demo that proved MCP-style user and agent actions with something concrete instead of a slide deck.",
      proofLinks: [
        {
          label: "demo",
          href: "https://cdn-dev.tapestrydev.com/mcp-demo",
        },
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/mcp-demo",
        },
      ],
    },
    {
      title: "bedrock utilities in datalabs api",
      context:
        "Bedrock-backed retrieve, converse, and knowledge-base helpers wired into a larger production API surface.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/datalabs-api",
        },
      ],
      overlapNote: "the consuming data workflows live in",
      relatedDomains: ["analytics"],
    },
  ],
  relatedDomains: ["analytics", "developer-experience"],
};

export default aiMl;
