import type { DomainEntry } from "./types";

const product: DomainEntry = {
  slug: "product",
  order: 1,
  title: "Product",
  summary:
    "Workflow-heavy software that turns messy operational processes into usable tools.",
  seoDescription:
    "Product domain page for workflow-heavy internal software and operational systems Dom builds.",
  thesis:
    "I like product work when the software has to hold together a messy real-world process, not just present a clean screen.",
  scope:
    "This is the workflow-heavy application side — shaping states, decisions, and handoffs into tools operators actually use day to day.",
  belongsHere: [
    "Building operator-facing apps that carry real daily process, approvals, and exception handling",
    "Turning messy business workflows into software where the design matters as much as the data model",
    "Shipping systems that need product judgment around speed, clarity, and edge cases — not just API coverage",
  ],
  flagships: [
    {
      slug: "sample-tracking",
      title: "Sample Tracking",
      summary:
        "The operational app for tracking sample shipments, statuses, exports, and recurring reporting — with automated regression testing so the workflow lived in software instead of scattered updates.",
      problem:
        "Teams needed one place to see where samples were, what had changed, and what still needed follow-up without piecing it together from status pings and spreadsheet cleanup.",
      role:
        "I shaped the product workflow around shipment state, reporting, and exception handling so the app supported the real operational process instead of only recording rows. Also set up automated BDD regression testing around high-risk portal flows.",
      constraints: [
        "The workflow had to cover shipments, status changes, exports, and recurring reporting in one product surface.",
        "Operators needed something clearer than a raw tracker because the value came from handoffs and follow-up, not just storage.",
        "The app had to stay useful as a daily tool, which meant the reporting and operational views had to support each other.",
        "High-risk flows needed automated regression coverage so releases stopped depending on expensive manual re-testing.",
      ],
      decisions: [
        "Treated tracking, exports, and subscription-style reporting as one connected workflow instead of separate utilities.",
        "Designed around day-to-day operator questions and exceptions rather than a schema-first admin panel.",
        "Kept the product shaped like an operational tool, with reporting nearby but not taking over the primary workflow.",
        "Paired `WebdriverIO` and `Cucumber` `BDD` tests with targeted API checks around the flows worth protecting most.",
      ],
      outcomes: [
        "Sample movement and status tracking lived in one operational home instead of scattered across update threads.",
        "Reconciling exports, shipment context, and recurring updates across separate tools stopped being a daily chore.",
        "Portal regressions surfaced before release day instead of after, removing the repetitive manual checking tax.",
        "Showed the kind of workflow-heavy product work I like most: software that holds a messy real process together.",
      ],
      stack: [
        "React",
        "Mantine",
        "Express",
        "Apollo GraphQL",
        "Prisma",
        "PostgreSQL",
        "Snowflake",
        "Redis",
        "BullMQ",
        "Sentry",
        "WebdriverIO",
        "Cucumber",
      ],
      visual: {
        alt: "A state diagram showing the shipment lifecycle from created through shipped, received, processed, reported, and archived — with exception handling branching off the shipped state.",
        caption:
          "The shipment lifecycle the app was built around — exceptions and follow-ups were the hard part, not the happy path.",
        mermaid: `graph TD
  Created --> Shipped
  Shipped --> Received
  Received --> Processed
  Processed --> Reported
  Reported --> Archived
  Shipped --> Exception
  Exception --> Shipped`,
      },
      screenshots: [
        {
          src: "/highlights/product/sample-tracking/reports-library.png",
          alt: "The reports library showing published and draft reports with department, channel, owner, and status columns.",
          caption: "Reports library — published and draft reports with status tracking",
        },
        {
          src: "/highlights/product/sample-tracking/report-detail.png",
          alt: "A report detail view with KPI cards for total samples, received, on-time, and delayed counts, plus a filterable sample table.",
          caption: "Report detail — KPI summary cards with filterable sample table below",
        },
      ],
    },
    {
      slug: "supply-chain",
      title: "Supply Chain Forecasting",
      summary:
        "A predictive analytics platform for inventory planning where the hard part was coordinating forecasting decisions across teams and fiscal seasons.",
      problem:
        "Inventory planners needed a way to adjust forecasts against fiscal season targets and receipt predictions without falling back to spreadsheet workflows that couldn't keep up with the pace of decisions.",
      role:
        "I spearheaded full-stack development of the forecasting interface and backend, designing the experience around fiscal season targets and receipt predictions so planners could work directly in the tool.",
      constraints: [
        "The interface had to make forecast adjustments feel natural alongside fiscal targets and receipt data.",
        "The backend needed to coordinate across `Snowflake`, `GraphQL`, and real-time state without becoming a black box.",
        "The tool had to replace spreadsheet workflows entirely — partial adoption would not have solved the coordination problem.",
      ],
      decisions: [
        "Designed the forecasting interface around fiscal season structure so planners saw targets and predictions together.",
        "Used `GraphQL` and `Snowflake` to keep forecast data queryable and auditable across the planning cycle.",
        "Built the full stack as one product surface so forecast inputs, model outputs, and team decisions stayed connected.",
      ],
      outcomes: [
        "Reduced inventory waste by **$30M/year** by enabling planners to act on forecast data directly instead of through spreadsheet intermediaries.",
        "Inventory planners could adjust forecasts without falling back to spreadsheet workflows.",
        "Showed how product work and data work overlap when the interface has to carry real operational decisions.",
      ],
      stack: [
        "React",
        "TypeScript",
        "Apollo GraphQL",
        "Snowflake",
        "Vite",
        "Sentry",
      ],
      screenshots: [
        {
          src: "/highlights/product/supply-chain/forecast-table.png",
          alt: "The forecasting interface showing fiscal season targets across multiple seasons with department breakdowns and receipt unit data.",
          caption: "Forecast table — fiscal season targets with department-level drill-down across seasons",
        },
      ],
    },
    {
      slug: "charla",
      title: "Charla.cc",
      summary:
        "A social analytics platform I co-founded for tracking community engagement patterns across social media APIs, with unified customer profiles and proprietary metrics.",
      problem:
        "Brands had no unified way to understand community engagement across social platforms — data was siloed, metrics were inconsistent, and the feedback loop between content and audience behavior was slow.",
      role:
        "Co-founded the company and built the platform end-to-end: frontend, API layer, social media integrations, and infrastructure.",
      constraints: [
        "The platform had to unify data from multiple social media APIs with different rate limits, schemas, and auth models.",
        "Infrastructure had to stay lean — two co-founders, no dedicated ops team.",
        "The product needed proprietary engagement metrics that went beyond what any single platform's analytics offered.",
      ],
      decisions: [
        "Built unified customer profiles across platforms so engagement patterns could be compared and tracked over time.",
        "Used `Go` and `AWS Lambda` for data ingestion from social APIs to `DGraph`, keeping the pipeline lightweight and scalable.",
        "Owned the full infrastructure: Dockerized services, CI/CD with `AWS CodePipeline`, EC2 and Lambda compute.",
      ],
      outcomes: [
        "Shipped a working social analytics product with unified cross-platform engagement tracking.",
        "The co-founder experience shaped how I think about product scope, infrastructure tradeoffs, and shipping under real constraints.",
        "Built the full stack from zero with a small team — the closest thing to greenfield product ownership in my experience.",
      ],
      stack: [
        "React",
        "Go",
        "DGraph",
        "AWS Lambda",
        "AWS CodePipeline",
        "EC2",
        "Docker",
      ],
      screenshots: [
        {
          src: "/highlights/product/charla/dashboard.png",
          alt: "The Charla analytics dashboard showing cross-platform engagement metrics and community health indicators.",
          caption: "Charla dashboard — cross-platform social engagement analytics",
        },
        {
          src: "/highlights/product/charla/community-health.png",
          alt: "The community health page showing audience engagement patterns and growth trends across connected social platforms.",
          caption: "Community health — audience engagement patterns across platforms",
        },
      ],
    },
  ],
  supportingWork: [
    {
      title: "Pricing App",
      context:
        "Helped set up the infrastructure and deployment for a dedicated pricing workflow app — the product and backend logic were led by other engineers, but I contributed the initial project scaffolding and deploy path.",
    },
    {
      title: "CMS",
      context:
        "A multi-tenant `Payload CMS` for shared content and admin workflows rather than a one-off marketing site.",
    },
  ],
  relatedDomains: ["analytics-ai", "developer-experience"],
};

export default product;
