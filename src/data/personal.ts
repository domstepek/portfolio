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
    intro: "The short version is that I care about the whole loop, not just the code in front of me.",
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
          "I work best with people who like direct feedback, quick iteration, and clear tradeoffs. I document decisions, surface risks early, and try to make handoffs lighter instead of louder.",
      },
    },
  },
  openTo: {
    title: "Open to",
    intro:
      "I'm looking for full-time roles where I can own product problems end-to-end and work across the stack to ship them.",
    roles: [
      "Senior full-stack or product engineering roles",
      "Roles where product work touches deployment, data, or platform concerns",
      "Founding or early-team roles where scope is wide and ownership is real",
    ],
    problemSpaces: [
      "Internal tools and operational systems",
      "Analytics, data, or AI-adjacent workflows",
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
      "Short version: I've spent most of my time building operational tools, data-heavy products, and the glue between product intent and real delivery constraints.",
    highlights: [
      "Product surfaces, operational tools, and workflow-heavy internal software",
      "Analytics platforms, AI-assisted tooling, and data-driven interfaces",
      "Developer tooling, shared systems, and team-facing enablement work",
    ],
    note: "The domain pages have full project walkthroughs with stack details, decisions, and outcomes.",
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
