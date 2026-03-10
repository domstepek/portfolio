export interface ResumeSkillCategory {
  label: string;
  items: string;
}

export interface ResumeBullet {
  text: string;
}

export interface ResumeProject {
  title: string;
  bullets: ResumeBullet[];
}

export interface ResumeRole {
  company: string;
  title: string;
  dates: string;
  projects: ResumeProject[];
}

export interface ResumeEducationEntry {
  school: string;
  degree: string;
  year: string;
}

export interface ResumePageData {
  name: string;
  headline: string;
  contact: {
    phone: string;
    email: string;
    portfolio: string;
    github: string;
    linkedin: string;
  };
  skills: ResumeSkillCategory[];
  experience: ResumeRole[];
  education: ResumeEducationEntry[];
  seo: {
    title: string;
    description: string;
  };
}

export const resumePage: ResumePageData = {
  name: "Jean-Dominique Stepek",
  headline:
    "Full-Stack & Platform Engineer | Analytics, Infrastructure, Product, Internal Tooling",
  contact: {
    phone: "(916) 342-9303",
    email: "domstepek@gmail.com",
    portfolio: "jean-dominique-stepek.is-a.dev",
    github: "github.com/domstepek",
    linkedin: "linkedin.com/in/jean-dominique-stepek",
  },
  skills: [
    { label: "Languages", items: "TypeScript, Python, SQL, GraphQL" },
    {
      label: "Frontend",
      items: "React, Next.js, Vite, Redux, Mantine, Tailwind CSS",
    },
    { label: "Backend", items: "Node.js, Express, Apollo GraphQL, Prisma" },
    {
      label: "Data",
      items: "PostgreSQL, Snowflake, Redis, BullMQ, DynamoDB",
    },
    {
      label: "Infrastructure",
      items:
        "AWS (CDK, EKS, Bedrock, Cognito), Kubernetes, Helm, ArgoCD, Jenkins, Docker",
    },
    {
      label: "AI / ML",
      items: "AWS Bedrock, Agent Harnesses (e.g. Claude Code), GSD",
    },
  ],
  experience: [
    {
      company: "Tapestry",
      title: "Software Development Engineer (Full Stack)",
      dates: "Jun 2022 – Present",
      projects: [
        {
          title: "Collection Curator",
          bullets: [
            {
              text: "Shaped the reporting workflow for an operator-facing analytics portal — filters, drill-downs, and follow-up actions in one surface — replacing scattered tools and ad hoc data pulls.",
            },
            {
              text: "Built a configurable table interface for seasonal collection curation with custom column types (multiselects, dates, tags), enabling analysts to filter and organize product data without ad hoc spreadsheet work.",
            },
            {
              text: "Led frontend development of a PowerPoint-style presentation tool with React and Styled Components, including drag-and-drop, keyboard navigation, and export-to-PDF features.",
            },
            {
              text: "Created an internal GenAI chatbot using AWS Bedrock and RAG retrieval for answering platform-related user queries — cutting support tickets by 50%.",
            },
            {
              text: "Built an MCP server and agent layer for the analytics platform, giving stakeholders a working example of model-driven tool use that made the tradeoffs between user-driven and agent-driven actions concrete.",
            },
            {
              text: "Stood up the shared EKS platform foundation with AWS CDK — networking, cluster primitives, ArgoCD, and environment-specific config — so service deployments became repeatable GitOps operations instead of manual buildouts.",
            },
          ],
        },
        {
          title: "Supply Chain Forecasting App",
          bullets: [
            {
              text: "Spearheaded full-stack development of a predictive analytics platform with React, TypeScript, GraphQL, and Snowflake, reducing inventory waste by $30M/year.",
            },
            {
              text: "Designed the forecasting interface around fiscal season targets and receipt predictions, enabling inventory planners to adjust forecasts without falling back to spreadsheet workflows.",
            },
          ],
        },
        {
          title: "Sample Tracking",
          bullets: [
            {
              text: "Built the operational app for sample shipment tracking, status management, exports, and recurring reporting — consolidating scattered update threads into one surface for 16 stakeholders.",
            },
            {
              text: "Saved ~800 hours/year by replacing manual reconciliation of exports, shipment context, and recurring updates across separate tools.",
            },
          ],
        },
      ],
    },
    {
      company: "Charla.cc",
      title: "Co-Founder & Software Engineer",
      dates: "Jul 2021 – May 2022",
      projects: [
        {
          title: "",
          bullets: [
            {
              text: "Co-founded and built a social analytics platform tracking community engagement patterns across social media APIs, with unified customer profiles and proprietary metrics.",
            },
            {
              text: "Built data ingestion pipelines from social media APIs to DGraph using Go and AWS Lambda, and owned infrastructure: Dockerized services, CI/CD with AWS CodePipeline, EC2 and Lambda compute.",
            },
          ],
        },
      ],
    },
  ],
  education: [
    {
      school: "Hack Reactor",
      degree: "Advanced Software Engineering Immersive",
      year: "2021",
    },
    {
      school: "American River College",
      degree: "A.S. Computer Science",
      year: "2020",
    },
  ],
  seo: {
    title: "resume",
    description:
      "resume for Jean-Dominique Stepek — full-stack and platform engineer across analytics, infrastructure, product, and internal tooling.",
  },
};
