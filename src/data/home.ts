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

export interface HomeHighlight {
  title: string;
  body: string;
}

export interface HomeCurrentRole {
  company: string;
  meta: string;
  intro: string;
  highlights: HomeHighlight[];
  link: { label: string; href: string };
    secondaryLink: { label: string; href: string };
}

export interface HomePageData {
  avatar: string;
  eyebrow: string;
  title: string;
  lead: string;
  paletteLead: string;
  now: string;
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
    "I build interfaces for data\u2011heavy financial software.",
  lead:
    "Right now that's Godel Terminal: real-time research tools, a mobile trading app, and the shared components underneath them. Before that, four years building analytics and planning tools at Tapestry.",
  paletteLead:
    "Dom Stepek, software engineer at Godel Terminal. Type a command or pick one below.",
  now: "Currently at Godel, building a financial terminal: live market data, the mobile app, and the shared components behind both.",
  current: {
    company: "Godel Terminal",
    meta: "May 2026 to now",
    intro:
      "Godel is a financial research terminal with a mobile app for research and trading. I work on the parts people look at all day: the tables, the charts, and the app.",
    highlights: [
      { title: "Live data grids", body: "Sorting, filtering, and virtualized rows. A price tick from the Kafka-backed WebSocket feed re-renders only the cell it affects." },
      { title: "Shared components", body: "The terminal's first component library. Nearly every table and shared chart renders through it." },
      { title: "Mobile app", body: "React Native, from discovery to research to placing an order. Live on Android, in private beta on iOS." },
      { title: "Atlas", body: "Supply-chain views, including 3D in Three.js, across 15,184 companies and 56,340 relationships." },
    ],
    link: { label: "Open Atlas", href: "https://atlas.godelterminal.com/" },
    secondaryLink: { label: "Supply chain for AAPL", href: "https://app.godelterminal.com/splc/AAPL.US" },
  },
  workHeading: "Earlier work",
  domainIntro:
    "Tapestry and Charla, grouped by the kind of problem. Each case study needs a passcode.",
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
      "Working on the Godel mobile app and the terminal's shared components.",
    note: "Last updated November 2026.",
  },
  seo: {
    title: "Software engineer",
    description:
      "Dom builds interfaces for data-heavy financial software: real-time UIs, shared component systems, and the product work around them.",
  },
} satisfies HomePageData;
