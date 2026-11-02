export interface PersonalPrinciple {
  title: string;
  body: string;
}

export interface PersonalPageData {
  title: string;
  lead: string;
  howIWork: {
    title: string;
    intro: string;
    principles: {
      systems: PersonalPrinciple;
      product: PersonalPrinciple;
      collaboration: PersonalPrinciple;
    };
  };
  openTo: {
    title: string;
    intro: string;
    roles: string[];
    problemSpaces: string[];
    boundaries: string[];
  };
  resume: {
    title: string;
    summary: string;
    highlights: string[];
    note: string;
  };
  notes: {
    intro: string;
    label: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

export const personalPage = {
  title: "About",
  lead:
    "I like work that sits between product questions, system shape, and the operational details that usually get hand-waved until they hurt.",
  howIWork: {
    title: "How I work",
    intro: "Short version: I care about the whole loop the code sits in.",
    principles: {
      systems: {
        title: "Systems",
        body:
          "I try to make the data model, workflows, and failure modes obvious early so the team is not discovering the real shape of the problem at the end.",
      },
      product: {
        title: "Product",
        body:
          "I like ambiguous product spaces where the right answer comes from tightening the loop between what users need, what the system can support, and what the team can actually maintain.",
      },
      collaboration: {
        title: "Collaboration",
        body:
          "I work best with teams that have adopted fully agentic workflows, love rapid iteration, and believe we should always be shipping, using AI to monitor production and build the fixes.",
      },
    },
  },
  openTo: {
    title: "Open to",
    intro:
      "I'm looking for full-time roles where I can own product problems end-to-end and work across the stack to ship them.",
    roles: [
      "Product-minded frontend or full-stack roles on complex, data-heavy financial software",
      "Senior full-stack or product engineering roles",
      "Roles where product work touches deployment, data, or platform concerns",
      "Founding or early-team roles where scope is wide and ownership is real",
    ],
    problemSpaces: [
      "Internal tools and operational systems",
      "Real-time, data-heavy financial interfaces",
      "Teams that need stronger handoffs between product, platform, and delivery",
    ],
    boundaries: [
      "I'm a better fit for systems with ownership and ambiguity than for narrow feature-factory work.",
      "I care more about the problem and the team than about matching one exact title.",
    ],
  },
  resume: {
    title: "Resume",
    summary:
      "Short version: financial research and trading interfaces at Godel, and before that four years of analytics and operations tools at Tapestry.",
    highlights: [
      "Product surfaces, operational tools, and workflow-heavy internal software",
      "Real-time, data-heavy financial interfaces for research and trading",
      "Design systems, shared components, and developer tooling",
    ],
    note: "The case studies have full walkthroughs with stack details, decisions, and outcomes.",
  },
  notes: {
    intro:
      "For the lighter field-note version of what I'm noticing while building and operating systems, head to the",
    label: "Notes index",
  },
  seo: {
    title: "About",
    description:
      "How Dom works across systems, product, collaboration, current fit, and a compact resume view.",
  },
} satisfies PersonalPageData;
