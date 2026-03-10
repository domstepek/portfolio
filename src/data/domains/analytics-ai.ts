import type { DomainEntry } from "./types";

const analyticsAi: DomainEntry = {
  slug: "analytics-ai",
  order: 2,
  title: "analytics & ai",
  summary:
    "reporting surfaces, measurement workflows, and ai-assisted tooling that help teams trust and act on the data in front of them.",
  seoDescription:
    "analytics & ai domain page for reporting surfaces, ai-assisted curation, and data tooling Dom builds.",
  thesis:
    "i build analytics and ai systems when the real bottleneck is understanding the business or making model-backed workflows actually useful — not collecting one more table or adding a chatbot veneer.",
  scope:
    "this covers the reporting, measurement, ai-assisted curation, and data-trust side of products — the work where the main challenge is making the numbers useful and the model behavior practical.",
  belongsHere: [
    "building dashboards, reports, and operator-facing analytics surfaces teams actually use every morning",
    "wiring retrieval, generation, and agent-style flows into concrete operator or analyst tasks",
    "data-heavy interfaces where query depth, filters, real-time collaboration, and clarity matter as much as frontend polish",
  ],
  flagships: [
    {
      slug: "collection-curator",
      title: "collection curator",
      summary:
        "a full-stack analytics platform combining an operator-facing portal with real-time collaboration, a configurable curation table, a PowerPoint-style presentation builder, an ai chatbot, and a production api backend with ai layer — replacing scattered tools and ad hoc data pulls.",
      problem:
        "teams needed one place to inspect product data, curate seasonal collections, build presentations, and get ai-assisted answers without bouncing between separate tools, spreadsheets, and ad hoc queries.",
      role:
        "i shaped the reporting workflow and built key frontend features — the configurable curation table, real-time collaboration via Legend State sync engine, and the PowerPoint-style presentation builder — while also architecting the api backend that brought conventional api work and ai-assisted behavior into one service boundary.",
      constraints: [
        "the portal had to support quick checks, deeper investigation, real-time multi-user collaboration, and presentation building without collapsing into a generic dashboard shell.",
        "the api needed to handle both conventional graphql queries and ai-specific behavior (retrieval, generation, agent tools) in the same service boundary.",
        "node and python concerns needed to cooperate without exposing the python surface directly — FastAPI sat behind a reverse-proxied secondary service.",
        "the system needed real auth, validation, and data plumbing because the goal was production use, not a prototype.",
      ],
      decisions: [
        "centered the portal on operator workflows instead of a chart-first dashboard layout, with filter and drill-down paths tied to follow-up actions.",
        "built the curation table with configurable column types (multiselects, dates, tags) so analysts could filter and organize product data without falling back to spreadsheets.",
        "used Legend State for real-time sync and collaboration instead of Redux, enabling multiple users to work on the same view simultaneously.",
        "paired Express and Apollo for the main api surface while keeping FastAPI behind a reverse proxy for python-heavy ai work.",
        "used Prisma, Redis pub/sub, and Cognito-backed middleware so the ai exploration lived inside normal backend discipline.",
      ],
      outcomes: [
        "one reporting and curation surface for product data, filters, real-time collaboration, presentations, and ai-assisted answers — instead of stitching context together across tools.",
        "the PowerPoint-style builder let teams create and export presentations directly from the platform with drag-and-drop, keyboard navigation, and pdf export.",
        "the ai chatbot using AWS Bedrock and RAG retrieval cut support tickets by 50% by answering platform-related user queries directly.",
        "the api architecture proved more capable for ai-assisted curation than the existing AppSync path alone.",
      ],
      stack: [
        "React",
        "Legend State",
        "Styled Components",
        "Apollo GraphQL",
        "Express",
        "FastAPI",
        "Prisma",
        "PostgreSQL",
        "Snowflake",
        "Redis pub/sub",
        "AWS Cognito",
        "AWS Bedrock",
        "AWS Amplify",
        "Vite",
        "Sentry",
        "Umami",
      ],
      visual: {
        alt: "a service diagram showing a client calling an Express and Apollo API that coordinates auth, data stores, and a protected FastAPI service for python endpoints.",
        caption:
          "the api side mattered because the ai layer lived inside a real service shape with auth, data, and mixed-language boundaries.",
        mermaid: `graph LR
  Client["client<br/><small>rest + graphql calls</small>"] --> API

  subgraph API["express + apollo"]
    direction TB
    A1[rest endpoints]
    A2[graphql api + subscriptions]
    A3[zod validation + auth middleware]
    A4[reverse proxy to python endpoints]
  end

  API --> Postgres["postgres<br/><small>prisma models</small>"]
  API --> Snowflake["snowflake<br/><small>product data</small>"]
  API --> Redis["redis<br/><small>pub-sub for subscriptions</small>"]
  API --> FastAPI["fastapi<br/><small>python endpoints</small>"]

  Cognito["cognito auth + secrets-managed service boundary"] -.-> API`,
      },
      screenshots: [
        {
          src: "/highlights/analytics-ai/collection-curator/curation-table.png",
          alt: "the configurable curation table with sortable columns, filters, and product thumbnails — the core operator-facing data surface.",
          caption: "curation table — configurable columns, inline filters, real-time collaboration",
        },
        {
          src: "/highlights/analytics-ai/collection-curator/visualizer.png",
          alt: "the visual assortment grid in edit mode with drag-and-drop product cards, category tree sidebar, and selection toolbar.",
          caption: "visualizer — drag-and-drop assortment grid with edit mode and category filtering",
        },
        {
          src: "/highlights/analytics-ai/collection-curator/export-modal.png",
          alt: "the export modal with PowerPoint selected, showing type, folder, product, image size, and card info options before download.",
          caption: "export modal — PowerPoint, Excel, or image export with configurable options",
        },
        {
          src: "/highlights/analytics-ai/collection-curator/pptx-output.png",
          alt: "the generated PowerPoint opened in Microsoft PowerPoint, showing a cover slide with collection metadata and a 43-slide deck in the thumbnail panel.",
          caption: "generated PowerPoint — 43-slide deck created directly from the platform",
        },
        {
          src: "/highlights/analytics-ai/collection-curator/ai-chatbot.png",
          alt: "the Mira AI chatbot responding to a natural language query by retrieving SKU data, generating insights, and sending an email summary.",
          caption: "mira ai chatbot — natural language queries with tool use and email delivery",
        },
        {
          src: "/highlights/analytics-ai/collection-curator/360-insights.png",
          alt: "the collaboration report showing KPI summary metrics and regional product grids for cross-market assortment analysis.",
          caption: "360 insights — collaboration report with regional product breakdowns",
        },
      ],
    },
  ],
  supportingWork: [
    {
      title: "mcp tools & agent demo",
      context:
        "wrote MCP tool definitions for the analytics platform and built a demo surface showing user-driven vs agent-driven actions — giving stakeholders a concrete example of model-driven tool use.",
    },
    {
      title: "bedrock utilities in datalabs api",
      context:
        "Bedrock-backed retrieve, converse, and knowledge-base helpers wired into a larger production API surface.",
    },
    {
      title: "superset on stargazer",
      context:
        "mapped the existing EKS cluster and release rails into a repeatable deployment path for Apache Superset so teams could publish dashboards without a separate platform project.",
    },
    {
      title: "umami",
      context:
        "a self-hosted analytics deployment in AWS so baseline measurement stayed inside our own stack and easy to inspect.",
    },
  ],
  relatedDomains: ["product", "developer-experience"],
};

export default analyticsAi;
