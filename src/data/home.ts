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
  eyebrow: "Dom Stepek / Systems, products, and tooling",
  title:
    "I work across product, analytics & AI, and developer experience.",
  lead:
    "Most of what I build sits where data, platform, workflow, and internal tooling overlap — the kind of work that only makes sense when you see the full loop.",
  domainIntro:
    "Pick the domain that matches the problem.",
  personalTeaser: {
    heading: "Personal context",
    body:
      "How I work, what kinds of teams I fit best, and where the compact resume lives. I also keep an engineering journal with notes on what I'm building and how.",
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
      "Exploring agent-style workflows and how model context protocol changes the shape of internal tooling.",
    note: "Last updated March 2026.",
  },
  seo: {
    title: "Systems, products, and tooling",
    description:
      "Homepage for Dom's work across product systems, analytics & AI tooling, and developer experience.",
  },
} satisfies HomePageData;
