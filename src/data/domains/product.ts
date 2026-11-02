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
    "I like product work where the software has to hold a messy real-world process together: approvals, exceptions, and handoffs between teams.",
  scope:
    "Apps that operators use every day, where the states and handoffs matter as much as the screens.",
  belongsHere: [
    "Building operator-facing apps that carry real daily process, approvals, and exception handling",
    "Turning messy business workflows into software where the design matters as much as the data model",
    "Shipping systems where speed, clarity, and edge cases need product judgment on top of API coverage",
  ],
  flagships: [
    {
      slug: "sample-tracking",
      title: "Sample Tracking",
      summary:
        "The operational app for tracking sample shipments, statuses, exports, and recurring reporting, with automated regression testing. It moved the workflow out of scattered status updates and into one tool.",
      problem:
        "Teams needed one place to see where samples were, what had changed, and what still needed follow-up without piecing it together from status pings and spreadsheet cleanup.",
      role:
        "I shaped the product workflow around shipment state, reporting, and exception handling so the app followed how the process actually ran day to day. I also set up automated BDD regression testing around the high-risk portal flows.",
      constraints: [
        "The workflow had to cover shipments, status changes, exports, and recurring reporting in one product surface.",
        "A raw tracker wasn't enough for operators, because most of the value was in handoffs and follow-up.",
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
        "Sample movement and status tracking moved out of update threads and into one place.",
        "Reconciling exports, shipment context, and recurring updates across separate tools stopped being a daily chore.",
        "Portal regressions showed up before release day, and the team stopped paying for repetitive manual checks.",
        "This is the kind of workflow-heavy product work I like most.",
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
        alt: "A state diagram showing the shipment lifecycle from created through shipped, received, processed, reported, and archived, with exception handling branching off the shipped state.",
        caption:
          "The shipment lifecycle the app was built around. Exceptions and follow-ups took far more work than the happy path.",
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
          caption: "Reports library: published and draft reports with status tracking",
        },
        {
          src: "/highlights/product/sample-tracking/report-detail.png",
          alt: "A report detail view with KPI cards for total samples, received, on-time, and delayed counts, plus a filterable sample table.",
          caption: "Report detail: KPI summary cards with filterable sample table below",
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
        "I led full-stack development of the forecasting interface and backend, designing the experience around fiscal season targets and receipt predictions so planners could work directly in the tool.",
      constraints: [
        "The interface had to make forecast adjustments feel natural alongside fiscal targets and receipt data.",
        "The backend needed to coordinate across `Snowflake`, `GraphQL`, and real-time state without becoming a black box.",
        "The tool had to replace the spreadsheet workflows entirely, since partial adoption would have left the coordination problem in place.",
      ],
      decisions: [
        "Designed the forecasting interface around fiscal season structure so planners saw targets and predictions together.",
        "Used `GraphQL` and `Snowflake` to keep forecast data queryable and auditable across the planning cycle.",
        "Built the full stack as one product surface so forecast inputs, model outputs, and team decisions stayed connected.",
      ],
      outcomes: [
        "Reduced inventory waste by **$30M/year** because planners could act on forecast data directly instead of going through spreadsheets.",
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
          caption: "Forecast table: fiscal season targets with department-level drill-down across seasons",
        },
      ],
    },
    {
      slug: "charla",
      title: "Charla.cc",
      summary:
        "A social analytics platform I co-founded for tracking community engagement patterns across social media APIs, with unified customer profiles and proprietary metrics.",
      problem:
        "Brands had no unified view of community engagement across social platforms. The data was siloed, metrics were inconsistent, and the feedback loop between content and audience behavior was slow.",
      role:
        "I co-founded the company and built the platform end-to-end: frontend, API layer, social media integrations, and infrastructure.",
      constraints: [
        "The platform had to unify data from multiple social media APIs with different rate limits, schemas, and auth models.",
        "Infrastructure had to stay lean: two co-founders and no dedicated ops team.",
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
        "Built the full stack from zero with a small team. It's the closest I've come to greenfield product ownership.",
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
          caption: "Charla dashboard: cross-platform social engagement analytics",
        },
        {
          src: "/highlights/product/charla/community-health.png",
          alt: "The community health page showing audience engagement patterns and growth trends across connected social platforms.",
          caption: "Community health: audience engagement patterns across platforms",
        },
      ],
    },
  ],
  supportingWork: [
    {
      title: "Pricing App",
      context:
        "Helped set up the infrastructure and deployment for a dedicated pricing workflow app. Other engineers led the product and backend logic; I did the initial project scaffolding and deploy path.",
    },
    {
      title: "CMS",
      context:
        "A multi-tenant `Payload CMS` for shared content and admin workflows.",
    },
  ],
  relatedDomains: ["analytics-ai", "developer-experience"],
};

export default product;
