---
title: "Building this site with GSD: seven milestones of agent-driven development"
summary: Shipped a personal portfolio site across seven milestones using GSD v2, going from static Astro on GitHub Pages to Next.js 16 with server-side auth, a handmade WebGPU shader, and an AI agent writing the journal entry you're reading.
published: 2026-03-14
tags: [nextjs, webdev, engineering, webgpu]
type: journal
readTime: 5
---

I built this site the way I build most things now: I tell an AI agent what I want and steer while it writes the code. Seven milestones in, the site runs on Next.js 16 with server-side auth, a custom GPU shader, and a markdown pipeline that syntax-highlights the code blocks in this entry.

## The starting point

The original idea was a domain-first portfolio: a site organized by the kinds of systems I build (product engineering, analytics and AI, developer experience) instead of a gallery of repos, with deeper proof pages behind each domain. I wanted someone to land on the homepage, pick a domain that matched their context, and drill into real project details.

M001 shipped that as a static Astro site on GitHub Pages. Dark retro terminal aesthetic, Space Mono font, muted greens, CRT overlay. The information architecture (the domain-first homepage, the deeper proof pages, the casual tone) has survived every rewrite since. The stack underneath has been replaced twice.

## The portfolio gate

M002 added a passcode gate on the domain proof pages. GitHub Pages has no server runtime, so the gate was a client-side SHA-256 hash check, and the passcode hash shipped in the HTML. A determined reader could extract it. I only wanted a polite boundary.

I also introduced a DOM marker contract (`data-route-visibility`, `data-gate-state`, `data-visual-state`) that every test and validator checks against. Twenty browser tests and three dist validators are wired into a single `pnpm validate:site` gate. That contract survived the entire framework migration and still holds.

## Handmade GPU shader

M003 was the most fun: a custom WebGPU shader with a WebGL2 fallback. It draws animated gradient blobs through Bayer 8×8 ordered dithering and pulls colors from CSS custom properties so it matches the site's palette. I wrote it from scratch in WGSL and GLSL without a library.

The shader runs site-wide as a background canvas at `z-index: -1`. It respects `prefers-reduced-motion`, pauses when the tab isn't visible, and reacts a little to the cursor. The renderer detection chain tries WebGPU first, falls back to WebGL2, and sets a `data-shader-renderer` attribute so tests can verify which path activated.

## The big migration

M005 replaced Astro and GitHub Pages with Next.js 16 App Router on Vercel. I did it for the portfolio gate more than for any framework preference. With a server runtime, I could replace the client-side hash check with actual authentication:

```typescript
export default async function DomainPage({ params }: PageProps) {
  const { slug } = await params;
  const domain = getDomainBySlug(slug);
  if (!domain) notFound();

  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has('portfolio-gate');

  if (!isAuthenticated) {
    return <DomainGatePage slug={slug} domain={domain} />;
  }
  return <DomainProofPage domain={domain} />;
}
```

Unauthenticated requests now get no proof content at all, only a gate form at the same URL. The server action validates the passcode with `crypto.createHash`, sets an HttpOnly cookie, and redirects back. Nothing secret ships to the client.

The migration also replaced 23 Puppeteer tests with 18 Playwright tests (fewer because the new architecture collapsed several edge cases), swapped plain CSS for Tailwind v4, and ported the shader engine to work with Turbopack's module resolution.

One surprise: Next.js 16 changed route params from sync to async. Every dynamic route component needs `const { slug } = await params`, and accessing `params.slug` directly throws. Small thing, but it broke every route on first compile.

## The markdown pipeline

The notes section needed a new pipeline since Astro content collections don't exist in Next.js. The replacement is gray-matter for frontmatter plus unified for markdown processing, with Shiki wired in via `@shikijs/rehype` for build-time syntax highlighting:

```typescript
const result = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeShiki, { theme: 'tokyo-night' })
  .use(rehypeStringify)
  .process(content);
```

That pipeline is what renders the code blocks in this entry. The `parseFrontmatter()` function silently falls back to defaults for malformed fields (empty strings, empty arrays, `note` type) instead of throwing, so a bad frontmatter field displays wrong but doesn't break the build. Verification catches this with a source-level grep plus a look at the rendered output.

## Agent-driven development

Every milestone was planned and executed through GSD v2, a structured planning system that breaks work into milestones, slices, and tasks. Each slice gets a branch, each task gets a plan, and verification is defined before code is written.

One pattern came out of this: the agent writes code that a future agent (with no memory of writing it) will need to debug. So the codebase is built for that, with stable DOM marker contracts, console logging with `[shader]` prefixes, `data-*` attributes that tests and humans can grep for, explicit error states instead of silent failures.

Sixty-four architectural decisions are recorded in `DECISIONS.md`. Some of them were wrong and got superseded. D003 (all-lowercase copy) was replaced by D031 (sentence case) when the original choice started reading as millennial texting rather than intentionally casual. D009 (client-side passcode gate) was replaced by D033 (server-side HttpOnly cookie) when the hosting constraint disappeared.

> The site has been rewritten twice, moved between hosting providers, and had its auth model replaced entirely. The domain-first homepage, the proof pages, and the casual tone haven't changed.

## What's next

The journal you're reading is M007's final deliverable. The engineering journal skill that wrote it is a reusable agent tool. It scans conversation context, generates frontmatter matching the site's parser contract, and writes directly to `src/content/notes/`. The site has no active requirements left. Everything from here is new capability.

This entry was written by the same agent system that built the site. It read the milestone summaries, pulled real code from the codebase, and followed a four-phase authoring skill. The quality bar was whether I'd publish it under my name.

The full source is at [github.com/domstepek/website](https://github.com/domstepek/website).
