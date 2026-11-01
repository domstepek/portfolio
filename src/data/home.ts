export type HomeContactKey = "github" | "linkedin" | "email";

export interface HomeContactLink {
  key: HomeContactKey;
  label: string;
  href: string;
}

export interface HomePersonalTeaser {
  heading: string;
  body: string;
  aboutLabel: string;
  resumeLabel: string;
  notesLabel: string;
}

export interface HomeCurrentRole {
  company: string;
  meta: string;
  intro: string;
  highlights: string[];
  link: { label: string; href: string };
}

export interface HomePageData {
  avatar: string;
  eyebrow: string;
  title: string;
  lead: string;
  current: HomeCurrentRole;
  workHeading: string;
  domainIntro: string;
  personalTeaser: HomePersonalTeaser;
  contactHeading: string;
  contactLinks: HomeContactLink[];
  freshness: {
    label: string;
    value: string;
    note: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

export const homePage = {
  avatar: "/images/avatar.png",
  eyebrow: "Dom Stepek, software engineer",
  title:
    "I build interfaces for data-heavy and financial software.",
  lead:
    "Right now that's Gödel Terminal: real-time research tools, a mobile trading app, and the shared components underneath them. Before that, four years building analytics and planning tools at Tapestry.",
  current: {
    company: "Gödel Terminal",
    meta: "Software engineer, May 2026 to now",
    intro:
      "Gödel is a financial research terminal with a mobile app for research and trading. I work on the parts people look at all day: the tables, the charts, and the app.",
    highlights: [
      "Live data grids with sorting, filtering, and virtualized rows. Prices update cell by cell from a Kafka-backed WebSocket feed, so a tick re-renders one cell instead of the table.",
      "The terminal's first shared component library. Nearly every table and shared chart now renders through it.",
      "The React Native app, which turns desktop terminal commands into guided flows from discovery to research to placing an order. Live on Android, in private beta on iOS.",
      "Atlas and the supply-chain views, including 3D views in Three.js, across 15,184 companies and 56,340 relationships.",
    ],
    link: { label: "Open Atlas", href: "https://atlas.godelterminal.com/" },
  },
  workHeading: "Earlier work",
  domainIntro:
    "Case studies from Tapestry and Charla, grouped by the kind of problem. They're passcode-protected, so email me if you'd like one.",
  personalTeaser: {
    heading: "More about me",
    body:
      "How I work, the teams I fit best, and my resume. I also keep an engineering journal with notes on what I'm building and how.",
    aboutLabel: "About",
    resumeLabel: "Resume",
    notesLabel: "Notes",
  },
  contactHeading: "Contact",
  contactLinks: [
    {
      key: "github",
      label: "GitHub",
      href: "https://github.com/domstepek",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: "https://linkedin.com/in/jean-dominique-stepek",
    },
    {
      key: "email",
      label: "Email",
      href: "mailto:domstepek@gmail.com",
    },
  ],
  freshness: {
    label: "Currently",
    value:
      "Working on the Gödel mobile app and the terminal's shared components.",
    note: "Last updated November 2026.",
  },
  seo: {
    title: "Software engineer",
    description:
      "Dom builds interfaces for data-heavy and financial software: real-time UIs, shared component systems, and the product work around them.",
  },
} satisfies HomePageData;
