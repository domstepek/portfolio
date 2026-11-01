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

export interface HomePageData {
  avatar: string;
  eyebrow: string;
  title: string;
  lead: string;
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
  eyebrow: "Dom Stepek / Software engineer",
  title:
    "I build interfaces for data-heavy and financial software.",
  lead:
    "Right now that's Gödel Terminal: real-time research tools, a mobile trading app, and the shared components underneath them. Before that, four years building analytics and planning tools at Tapestry.",
  domainIntro:
    "Case studies, grouped by the kind of problem they solved.",
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
      "Software engineer at Gödel Terminal, building the research terminal on web and mobile. Its supply-chain map, Atlas, is public at atlas.godelterminal.com.",
    note: "Last updated November 2026.",
  },
  seo: {
    title: "Software engineer",
    description:
      "Dom builds interfaces for data-heavy and financial software: real-time UIs, shared component systems, and the product work around them.",
  },
} satisfies HomePageData;
