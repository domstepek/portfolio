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
  headline: "Software Engineer | React, TypeScript & Financial Applications",
  contact: {
    phone: "(916) 342-9303",
    email: "domstepek@gmail.com",
    portfolio: "jean-dominique-stepek.is-a.dev",
    github: "github.com/domstepek",
    linkedin: "linkedin.com/in/jean-dominique-stepek",
  },
  skills: [
    { label: "Frontend", items: "TypeScript, React, React Native, Next.js, Legend State, Three.js, Vite, Tailwind CSS" },
    { label: "Testing & delivery", items: "Playwright, React Doctor, GitHub Actions, Jenkins, Docker" },
    { label: "APIs & data", items: "Node.js, Express, GraphQL, WebSockets, SQL, PostgreSQL, Snowflake, Redis, AWS" },
  ],
  experience: [
    {
      company: "Gödel Terminal",
      title: "Software Engineer",
      dates: "May 2026 – Present",
      projects: [
        {
          title: "",
          bullets: [
            { text: "Built configurable financial data grids with sorting, filtering, row virtualization, and cell-level store subscriptions to live prices delivered through Kafka-backed WebSocket feeds." },
            { text: "Introduced the terminal’s first shared UI component library, standardizing nearly all terminal table and shared-chart rendering." },
            { text: "Owned React Native mobile development across two two-week iterations, from chat to financial research and brokerage-integrated order entry; adapted desktop commands into guided mobile workflows. Released on Android, with iOS in private beta." },
            { text: "Built Gödel Atlas and all terminal supply-chain visualization views, including Three.js 3D views, for exploring a dataset of 15,184 companies and 56,340 relationships." },
            { text: "Established linting, formatting, type checking, and React Doctor CI checks; validated workflows with automated tests, coverage reporting, Playwright E2E testing, and internal beta testing." },
            { text: "Worked with engineering leadership and the CEO on trading-product requirements, using direct customer feedback to prioritize features and usability improvements." },
          ],
        },
      ],
    },
    {
      company: "Tapestry",
      title: "Software Development Engineer (Full Stack)",
      dates: "Jun 2022 – May 2026",
      projects: [
        {
          title: "",
          bullets: [
            { text: "Built React and TypeScript analytics interfaces for Collection Curator, combining configurable data tables, custom column types, filtering, and real-time collaboration through Legend State." },
            { text: "Led frontend development of a presentation editor with React and Styled Components, including drag-and-drop interactions, keyboard navigation, and PDF export." },
            { text: "Led full-stack development of an inventory-forecasting platform using React, TypeScript, GraphQL, and Snowflake; the platform reduced inventory waste by $30M annually." },
            { text: "Consolidated sample tracking, status management, exports, and reporting into one application for 16 stakeholders, saving approximately 800 hours annually." },
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
            { text: "Co-founded and built a social analytics platform with unified customer profiles; contributed to Go/DGraph ingestion pipelines and owned Docker-based infrastructure and AWS CI/CD." },
          ],
        },
      ],
    },
  ],
  education: [
    { school: "Hack Reactor", degree: "Advanced Software Engineering Immersive", year: "2021" },
    { school: "American River College", degree: "A.S. Computer Science", year: "2020" },
  ],
  seo: {
    title: "resume",
    description:
      "resume for Jean-Dominique Stepek — software engineer building interfaces for data-heavy and financial software.",
  },
};
