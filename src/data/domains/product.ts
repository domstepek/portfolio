import type { DomainEntry } from "./types";

const product: DomainEntry = {
  slug: "product",
  order: 4,
  title: "product",
  summary:
    "workflow-heavy software that turns messy operational processes into usable tools.",
  seoDescription:
    "product domain page for workflow-heavy internal software and operational systems Dom builds.",
  thesis:
    "i like product work when the software has to hold together a messy real-world process, not just present a clean screen.",
  scope:
    "this is the workflow-heavy application side — shaping states, decisions, and handoffs into tools operators actually use day to day.",
  belongsHere: [
    "building operator-facing apps that carry real daily process, approvals, and exception handling",
    "turning messy business workflows into software where the design matters as much as the data model",
    "shipping systems that need product judgment around speed, clarity, and edge cases — not just api coverage",
  ],
  flagships: [
    {
      slug: "sample-tracking",
      title: "sample tracking",
      summary:
        "the operational app for tracking sample shipments, statuses, exports, and recurring reporting so the workflow lived in software instead of scattered updates.",
      problem:
        "teams needed one place to see where samples were, what had changed, and what still needed follow-up without piecing it together from status pings and spreadsheet cleanup.",
      role:
        "i shaped the product workflow around shipment state, reporting, and exception handling so the app supported the real operational process instead of only recording rows.",
      constraints: [
        "the workflow had to cover shipments, status changes, exports, and recurring reporting in one product surface.",
        "operators needed something clearer than a raw tracker because the value came from handoffs and follow-up, not just storage.",
        "the app had to stay useful as a daily tool, which meant the reporting and operational views had to support each other.",
      ],
      decisions: [
        "treated tracking, exports, and subscription-style reporting as one connected workflow instead of separate utilities.",
        "designed around day-to-day operator questions and exceptions rather than a schema-first admin panel.",
        "kept the product shaped like an operational tool, with reporting nearby but not taking over the primary workflow.",
      ],
      outcomes: [
        "sample movement and status tracking lived in one operational home instead of scattered across update threads.",
        "reconciling exports, shipment context, and recurring updates across separate tools stopped being a daily chore.",
        "showed the kind of workflow-heavy product work i like most: software that holds a messy real process together.",
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
      ],
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/sample_tracking",
        },
      ],
    },
    {
      slug: "pricing-app",
      title: "pricing app",
      summary:
        "a dedicated pricing workflow with its own frontend and backend so quote logic stopped living in ad hoc spreadsheets and one-off calculations.",
      problem:
        "pricing logic was too important to keep spread across sheets and manual judgment, but the workflow still needed to stay understandable to the people using it.",
      role:
        "i helped turn the pricing process into software with clearer states, inputs, and outputs so quoting became something the product could carry instead of a fragile side process.",
      constraints: [
        "the workflow had to encode pricing logic without turning the product into a black box no one trusted.",
        "frontend and backend pieces needed to move together because the core value lived in the full quote flow, not only in formulas.",
        "the team needed a dedicated tool, but it still had to fit the broader product and deployment conventions.",
      ],
      decisions: [
        "gave pricing its own application boundary instead of tucking the workflow into a generic admin screen.",
        "kept the experience centered on quote inputs, logic, and outputs rather than forcing people back into spreadsheets for edge cases.",
        "treated backend rules and frontend workflow as one product surface so the business logic stayed inspectable.",
      ],
      outcomes: [
        "pricing moved out of ad hoc spreadsheets and into a dedicated product workflow.",
        "quote logic became easier to repeat and reason about across the team.",
        "created a clearer handoff between pricing decisions and the rest of the operational process.",
      ],
      stack: [
        "React",
        "Vite",
        "Express",
        "Apollo GraphQL",
        "Prisma",
        "PostgreSQL",
        "Snowflake",
        "Redis",
        "BullMQ",
        "Sentry",
        "Umami",
      ],
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/pricing-app",
        },
      ],
    },
  ],
  supportingWork: [
    {
      title: "supply forecast",
      context:
        "forecasting and planning tooling where the hard part was coordinating operational decisions across teams.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/supply-chain",
        },
      ],
      overlapNote: "the model and reporting side of that work sits close to",
      relatedDomains: ["analytics"],
    },
    {
      title: "cms",
      context:
        "a multi-tenant Payload CMS for shared content and admin workflows rather than a one-off marketing site.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/cms",
        },
      ],
    },
  ],
  relatedDomains: ["analytics", "ai-ml"],
};

export default product;
