import type { DomainEntry } from "./types";

const aiMl: DomainEntry = {
  slug: "ai-ml",
  order: 3,
  title: "ai / ml",
  summary:
    "retrieval, model, and agent workflows where ai changes what the product can actually do.",
  seoDescription:
    "ai / ml domain page for retrieval flows, model-assisted tooling, and agent systems Dom builds.",
  thesis:
    "i use ai / ml when model behavior meaningfully changes the workflow, not when a chatbot veneer is the whole pitch.",
  scope:
    "this covers prompt orchestration, retrieval pipelines, and model-driven product features — the work where the ai layer is doing something real, not decorative.",
  belongsHere: [
    "wiring retrieval and generation flows into concrete operator or analyst tasks",
    "building agent-style systems where tool use, context passing, and guardrails matter more than demo flash",
    "adding ml-assisted features that need review loops, fallbacks, and practical debugging paths",
  ],
  flagships: [
    {
      slug: "collection-curator-api",
      title: "collection curator api",
      summary:
        "an apollo and fastapi system for exploring ai-assisted analytics curation with graph queries, python endpoints, and guarded service-to-service calls inside one real api surface.",
      problem:
        "the team needed to test whether an ai-assisted curation workflow could live inside a product-grade api stack instead of as a disconnected prototype.",
      role:
        "i helped shape the service boundaries and workflow so model-backed experimentation could sit next to auth, validation, database, and data-source concerns without becoming a toy app.",
      constraints: [
        "the system had to support both conventional api work and ai-specific behavior in the same service boundary.",
        "node and python concerns needed to cooperate without exposing the python surface directly.",
        "the experiment still needed real auth, validation, and data plumbing because the goal was learning what would hold up in a product setting.",
      ],
      decisions: [
        "paired Express and Apollo for the main api surface while keeping FastAPI behind a reverse-proxied secondary service for python-heavy work.",
        "used Prisma, Redis pub/sub, and Cognito-backed middleware so the ai exploration lived inside normal backend discipline.",
        "treated the project as an investigation of the next product analytics api iteration rather than a throwaway chat demo.",
      ],
      outcomes: [
        "the architecture proved more capable for ai-assisted curation than the existing app sync path alone.",
        "retrieval, subscriptions, and mixed-language service behavior could be tested in one place instead of across disconnected prototypes.",
        "the team got a concrete sandbox for seeing where model-backed workflows were promising and where they just added complexity.",
      ],
      stack: [
        "Express",
        "Apollo GraphQL",
        "Prisma",
        "PostgreSQL",
        "Snowflake",
        "Redis pub/sub",
        "FastAPI",
        "AWS Cognito",
      ],
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/collection-curator-api",
        },
      ],
      visual: {
        src: "highlights/ai-ml/collection-curator-api/architecture.svg",
        alt: "a service diagram showing a client calling an Express and Apollo API that coordinates auth, data stores, and a protected FastAPI service for python endpoints.",
        caption:
          "this project mattered because the ai layer lived inside a real service shape with auth, data, and mixed-language boundaries.",
      },
    },
    {
      slug: "mcp-demo",
      title: "mcp demo",
      summary:
        "a small demo that made MCP-style user actions and agent actions tangible by showing both modes in a working interface instead of in abstract slides.",
      problem:
        "people could talk about tool-using agents all day, but it was hard to judge the value until there was a concrete example of how user-driven and agent-driven actions actually felt.",
      role:
        "i turned the concept into a demo surface that made the interaction model easy to inspect, explain, and share outside a meeting.",
      constraints: [
        "the demo needed to stay simple enough to understand quickly while still proving something real about MCP-style actions.",
        "it had to show both user-driven and agent-driven behavior instead of collapsing them into the same vague flow.",
        "because it was a demo, the explanation layer mattered almost as much as the underlying mechanics.",
      ],
      decisions: [
        "kept the scope tight around one concrete demo instead of padding it with unrelated agent features.",
        "made the two interaction modes visible so people could compare direct user action with delegated agent action.",
        "used a live demo link and repo as proof so the idea stayed inspectable outside a slide deck.",
      ],
      outcomes: [
        "stakeholders could point at a working example of MCP-style interaction instead of debating a conceptual pitch.",
        "tradeoffs between user-driven and agent-driven actions became much easier to discuss with something tangible in front of people.",
        "served as a small but credible proof point that agent tooling could be grounded in product behavior.",
      ],
      stack: [
        "React",
        "Mantine",
        "Express",
        "LangChain",
        "LangGraph",
        "MCP SDK",
        "Socket.io",
        "AWS Bedrock",
        "Sentry",
      ],
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
  ],
  supportingWork: [
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
