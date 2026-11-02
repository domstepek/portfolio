import type { DomainEntry } from "./types";

const analyticsAi: DomainEntry = {
  slug: "analytics-ai",
  order: 2,
  title: "Analytics & data",
  summary:
    "Reporting tools and data-heavy interfaces built for planners and analysts at Tapestry.",
  seoDescription:
    "Analytics & AI domain page for reporting surfaces, AI-assisted curation, and data tooling Dom builds.",
  thesis:
    "I build analytics tools when the real bottleneck is understanding the business. Model-backed features earn their place when they make a specific task faster.",
  scope:
    "Reporting, measurement, and AI-assisted curation, where the hard part is making the numbers trustworthy enough to act on.",
  belongsHere: [
    "Building dashboards, reports, and operator-facing analytics surfaces teams actually use every morning",
    "Wiring retrieval, generation, and agent-style flows into concrete operator or analyst tasks",
    "Data-heavy interfaces where query depth, filters, real-time collaboration, and clarity matter as much as frontend polish",
  ],
  flagships: [
    {
      slug: "collection-curator",
      title: "Collection Curator",
      summary:
        "A full-stack analytics platform: an operator-facing portal with real-time collaboration, a configurable curation table, a PowerPoint-style presentation builder, an AI chatbot, and a production API backend with an AI layer. It replaced scattered tools and ad hoc data pulls.",
      problem:
        "Teams needed one place to inspect product data, curate seasonal collections, build presentations, and get AI-assisted answers without bouncing between separate tools, spreadsheets, and ad hoc queries.",
      role:
        "I shaped the reporting workflow and built the main frontend features: the configurable curation table, real-time collaboration on the Legend State sync engine, and the PowerPoint-style presentation builder. I also designed the API backend, which put conventional API work and AI-assisted behavior behind one service boundary.",
      constraints: [
        "The portal had to support quick checks, deeper investigation, real-time multi-user collaboration, and presentation building without collapsing into a generic dashboard shell.",
        "The API needed to handle both conventional `GraphQL` queries and AI-specific behavior (retrieval, generation, agent tools) in the same service boundary.",
        "Node and Python had to work together without exposing the Python surface directly, so `FastAPI` sat behind a reverse-proxied secondary service.",
        "The system needed real auth, validation, and data plumbing because it was headed for production use.",
      ],
      decisions: [
        "Centered the portal on operator workflows instead of a chart-first dashboard layout, with filter and drill-down paths tied to follow-up actions.",
        "Built the curation table with configurable column types (multiselects, dates, tags) so analysts could filter and organize product data without falling back to spreadsheets.",
        "Used `Legend State` instead of Redux for real-time sync and collaboration, so several users could work in the same view at once.",
        "Paired `Express` and `Apollo` for the main API surface while keeping `FastAPI` behind a reverse proxy for Python-heavy AI work.",
        "Used `Prisma`, `Redis` pub/sub, and `Cognito`-backed middleware so the AI exploration lived inside normal backend discipline.",
      ],
      outcomes: [
        "Product data, filters, real-time collaboration, presentations, and AI-assisted answers lived in one reporting and curation surface, so people stopped stitching context together across tools.",
        "The PowerPoint-style builder let teams create and export presentations directly from the platform with drag-and-drop, keyboard navigation, and PDF export.",
        "The AI chatbot using `AWS Bedrock` and `RAG` retrieval cut support tickets by **50%** by answering platform-related user queries directly.",
        "The API architecture proved more capable for AI-assisted curation than the existing `AppSync` path alone.",
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
        alt: "A service diagram showing a client calling an Express and Apollo API that coordinates auth, data stores, and a protected FastAPI service for Python endpoints.",
        caption:
          "The AI layer lived inside a real service, with auth, data, and mixed-language boundaries.",
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
          alt: "The configurable curation table with sortable columns, filters, and product thumbnails. This is the core operator-facing data surface.",
          caption: "Curation table: configurable columns, inline filters, real-time collaboration",
        },
        {
          src: "/highlights/analytics-ai/collection-curator/visualizer.png",
          alt: "The visual assortment grid in edit mode with drag-and-drop product cards, category tree sidebar, and selection toolbar.",
          caption: "Visualizer: drag-and-drop assortment grid with edit mode and category filtering",
        },
        {
          src: "/highlights/analytics-ai/collection-curator/export-modal.png",
          alt: "The export modal with PowerPoint selected, showing type, folder, product, image size, and card info options before download.",
          caption: "Export modal: PowerPoint, Excel, or image export with configurable options",
        },
        {
          src: "/highlights/analytics-ai/collection-curator/pptx-output.png",
          alt: "The generated PowerPoint opened in Microsoft PowerPoint, showing a cover slide with collection metadata and a 43-slide deck in the thumbnail panel.",
          caption: "Generated PowerPoint: 43-slide deck created directly from the platform",
        },
        {
          src: "/highlights/analytics-ai/collection-curator/ai-chatbot.png",
          alt: "The Mira AI chatbot responding to a natural language query by retrieving SKU data, generating insights, and sending an email summary.",
          caption: "Mira AI chatbot: natural language queries with tool use and email delivery",
        },
        {
          src: "/highlights/analytics-ai/collection-curator/360-insights.png",
          alt: "The collaboration report showing KPI summary metrics and regional product grids for cross-market assortment analysis.",
          caption: "360 insights: collaboration report with regional product breakdowns",
        },
      ],
    },
  ],
  supportingWork: [
    {
      title: "MCP Tools & Agent Demo",
      context:
        "Wrote `MCP` tool definitions for the analytics platform and built a demo surface showing user-driven vs agent-driven actions, which gave stakeholders a concrete example of model-driven tool use.",
    },
    {
      title: "Bedrock Utilities in Datalabs API",
      context:
        "`Bedrock`-backed retrieve, converse, and knowledge-base helpers wired into a larger production API surface.",
    },
    {
      title: "Superset on Stargazer",
      context:
        "Mapped the existing `EKS` cluster and release rails into a repeatable deployment path for `Apache Superset` so teams could publish dashboards without a separate platform project.",
    },
    {
      title: "Umami",
      context:
        "A self-hosted analytics deployment in AWS so baseline measurement stayed inside our own stack and easy to inspect.",
    },
  ],
  relatedDomains: ["product", "developer-experience"],
};

export default analyticsAi;
