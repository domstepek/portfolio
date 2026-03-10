export type DomainSlug =
  | "product"
  | "analytics-ai"
  | "developer-experience";

export interface ProofLink {
  label: string;
  href: string;
}

export interface FlagshipVisual {
  src?: string;
  alt: string;
  caption?: string;
  mermaid?: string;
}

export interface ScreenshotItem {
  src: string;
  alt: string;
  caption?: string;
}

export interface FlagshipHighlight {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  role: string;
  constraints: string[];
  decisions: string[];
  outcomes: string[];
  stack: string[];
  proofLinks?: ProofLink[];
  visual?: FlagshipVisual;
  screenshots?: ScreenshotItem[];
}

export interface SupportingWorkItem {
  title: string;
  context: string;
  proofLinks?: ProofLink[];
  overlapNote?: string;
  relatedDomains?: DomainSlug[];
}

export interface DomainEntry {
  slug: DomainSlug;
  order: number;
  title: string;
  summary: string;
  seoDescription: string;
  thesis: string;
  scope: string;
  belongsHere: string[];
  flagships?: FlagshipHighlight[];
  supportingWork: SupportingWorkItem[];
  relatedDomains?: DomainSlug[];
}
