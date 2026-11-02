export interface PersonalPrinciple {
  title: string;
  body: string;
}

export interface PersonalCraft extends PersonalPrinciple {
  link?: { label: string; href: string };
}

export interface PersonalPageData {
  title: string;
  lead: string;
  craft: {
    title: string;
    items: {
      performance: PersonalCraft;
      components: PersonalCraft;
      interaction: PersonalCraft;
      visualization: PersonalCraft;
    };
  };
  howIWork: {
    title: string;
    principles: {
      product: PersonalPrinciple;
      quality: PersonalPrinciple;
      collaboration: PersonalPrinciple;
    };
  };
  toolkit: {
    title: string;
    items: string[];
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
  };
  seo: {
    title: string;
    description: string;
  };
}

export const personalPage = {
  title: "About",
  lead:
    "I'm a UI engineer. I build the screens people keep open all day in data-heavy financial software: live grids, charts, and the component systems underneath them.",
  craft: {
    title: "What I build",
    items: {
      performance: {
        title: "Live data that stays fast",
        body:
          "Grids with sorting, filtering, and virtualized rows, fed by Kafka-backed WebSocket prices. Each cell subscribes to its own value, so a price tick repaints one cell and leaves the rest of the table alone.",
        link: { label: "Try the live grid", href: "/work/#live-grid" },
      },
      components: {
        title: "Component systems",
        body:
          "I introduced Godel's first shared UI component library. It now renders nearly every table and shared chart in the terminal.",
      },
      interaction: {
        title: "Interaction detail",
        body:
          "Keyboard navigation, drag and drop, and PDF export in a presentation editor at Tapestry. At Godel, desktop terminal commands rebuilt as guided mobile flows in React Native.",
      },
      visualization: {
        title: "Large datasets you can explore",
        body:
          "Godel Atlas and the supply-chain views, including Three.js 3D, for exploring 15,184 companies and 56,340 relationships between them.",
        link: { label: "See Apple's supply chain", href: "https://app.godelterminal.com/splc/AAPL.US" },
      },
    },
  },
  howIWork: {
    title: "How I work",
    principles: {
      product: {
        title: "Close to the product",
        body:
          "I work on requirements with the people who own them. At Godel that means trading-product decisions with engineering leadership and the CEO, ranked by what customers tell us.",
      },
      quality: {
        title: "Quality by default",
        body:
          "Type checking, linting, React Doctor, and Playwright run in CI, so UI regressions show up in review before they reach anyone's screen.",
      },
      collaboration: {
        title: "Collaboration",
        body:
          "I work best with teams that have adopted fully agentic workflows, love rapid iteration, and believe we should always be shipping, using AI to monitor production and build the fixes.",
      },
    },
  },
  toolkit: {
    title: "Toolkit",
    items: ["TypeScript", "React", "React Native", "Next.js", "Legend State", "TanStack Virtual", "Three.js", "Tailwind CSS", "Playwright"],
  },
  openTo: {
    title: "Open to",
    intro: "Full-time UI and frontend roles where I own the interface end to end, from the component library to the last interaction.",
    roles: [
      "UI engineering on data-heavy financial software",
      "Frontend roles that own a design system or component library",
      "Small teams where frontend scope is wide and the interface is mine to shape",
    ],
    problemSpaces: [
      "Real-time grids, charts, and dashboards that have to stay fast",
      "Dense workflows turned into clear, keyboard-friendly screens",
      "Mobile versions of tools that started on the desktop",
    ],
    boundaries: [
      "I'm a better fit where the interface is the product than where the frontend is an afterthought.",
      "I care more about the problem and the team than about matching one exact title.",
    ],
  },
  resume: {
    title: "Next",
    summary:
      "Short version: financial research and trading interfaces at Godel, and before that four years of analytics and planning interfaces at Tapestry.",
  },
  seo: {
    title: "About",
    description:
      "Dom is a UI engineer building interfaces for data-heavy financial software: live grids, component systems, and the interaction detail around them.",
  },
} satisfies PersonalPageData;
