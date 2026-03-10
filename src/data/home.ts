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
  eyebrow: "dom stepek / systems, products, and tooling",
  title:
    "i work across analytics, infrastructure, ai / ml, product, and developer experience.",
  lead:
    "most of what i build sits where data, platform, workflow, and internal tooling overlap — the kind of work that only makes sense when you see the full loop.",
  domainIntro:
    "pick the domain that matches the problem.",
  personalTeaser: {
    heading: "personal context",
    body:
      "if you want the shorter version of how i work, what kinds of teams i fit best, and where the compact resume lives, start here.",
    aboutLabel: "about",
    resumeLabel: "resume",
  },
  contactHeading: "contact",
  contactLinks: [
    {
      key: "github",
      label: "github",
      href: "https://github.com/domstepek",
    },
    {
      key: "linkedin",
      label: "linkedin",
      href: "https://linkedin.com/in/jean-dominique-stepek",
    },
    {
      key: "email",
      label: "email",
      href: "mailto:domstepek@gmail.com",
    },
  ],
  freshness: {
    label: "currently",
    value:
      "exploring agent-style workflows and how model context protocol changes the shape of internal tooling.",
    note: "last updated march 2026.",
  },
  seo: {
    title: "systems, products, and tooling",
    description:
      "homepage for dom's work across analytics platforms, infrastructure, ai / ml tooling, product systems, and developer experience.",
  },
} satisfies HomePageData;
