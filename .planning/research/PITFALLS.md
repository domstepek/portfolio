# Research: Pitfalls

**Project:** Dom Personal Site  
**Focus:** Common mistakes and failure modes for a domain-first engineering portfolio on GitHub Pages  
**Research Date:** 2026-03-09

## Major Pitfalls

| ID | Pitfall | Why It Matters Here |
|----|---------|---------------------|
| P1 | Trying to cover too much | Dom has a broad body of work. If the site tries to represent every repo or project equally, it stops feeling minimal and becomes noisy. |
| P2 | Letting GitHub structure drive the site | Repo names and code splits reflect implementation history, not the story visitors need. |
| P3 | Choosing fuzzy or overlapping domains | If the themes are vague, visitors will not know where to click and projects will get repeated in multiple places. |
| P4 | Writing polished but low-information copy | Broad engineering experience can easily turn into generic phrases like “platform,” “AI,” or “scalable” with little substance. |
| P5 | Making big claims without enough proof | High-level domain pages need concrete examples or they read like positioning rather than evidence. |
| P6 | Copying `snwy.me` too literally | The feel is useful, but this project needs more depth than the reference site. |
| P7 | Designing as if GitHub Pages were a full app platform | Static hosting constraints can break routing, asset paths, and runtime expectations if ignored early. |
| P8 | Choosing a stack heavier than the site | It is easy to overbuild a personal site before the core story exists. |
| P9 | Creating content that is expensive to keep current | If updates require editing many files or duplicating content, the site will go stale. |
| P10 | Confusing minimal design with weak readability | Minimal does not mean tiny type, low contrast, or unclear links. |

## Warning Signs

### P1: Trying To Cover Too Much

- More than 4-6 top-level sections appear
- The homepage starts needing “featured,” “archive,” or “misc” buckets
- The content inventory keeps growing without a curation rule

### P2: Letting GitHub Structure Drive The Site

- Page outlines are mostly repo lists
- One real-world system would require multiple repo cards just to explain the work
- Navigation quietly turns back into a project gallery

### P3: Choosing Fuzzy Or Overlapping Domains

- It is hard to decide where a project belongs
- The same blurb appears on multiple pages
- Domain labels sound clever but not predictive

### P4: Low-Information Copy

- Most sentences could describe almost any senior engineer
- The copy is heavy on adjectives and tool names but light on constraints, users, tradeoffs, and outcomes

### P5: Big Claims Without Proof

- A page says Dom has done analytics, platform, AI, or DX work but gives no concrete example
- Links go straight to GitHub with no context

### P6: Reference Site Copied Too Literally

- The homepage feels stylish but does not answer what Dom actually builds
- Deeper pages feel bolted on instead of intentional

### P7: GitHub Pages Constraints Ignored

- Local dev works only at `/`
- Refreshing a deep route breaks
- Asset URLs assume root hosting
- The implementation assumes server routes or secrets

### P8: Stack Too Heavy

- More time goes into framework evaluation and tooling than content
- There are multiple content sources before launch

### P9: Content Too Expensive To Maintain

- The same bio or project summary is repeated in several files
- Adding one new example means editing several pages manually

### P10: Weak Readability

- Light gray text dominates
- Links are unclear
- The design looks minimal in screenshots but is harder to scan in practice

## Prevention Strategies

### P1

- Set explicit inclusion rules early:
  - 4-6 domains max
  - 1-2 flagship examples per domain
  - a short set of supporting mentions
- Treat omission as a feature, not a failure.

### P2

- Make domains the primary navigation unit.
- Treat repos as evidence inside stories, not as the site structure itself.

### P3

- Write a one-line inclusion rule for each domain:
  - what belongs there
  - what does not
  - what visitor question it answers

### P4

- Force every page to answer:
  - what was built
  - what problem it solved
  - what made it hard
  - what changed because of it

### P5

- Give each domain page at least one proof block with:
  - context
  - role
  - constraints
  - decisions
  - outcome

### P6

- Borrow the reference site's restraint and tone, not its content thinness.
- The homepage should make Dom's focus clear within a few seconds.

### P7

- Choose a stack that is static-export-friendly from the beginning.
- Test the built site under the real GitHub Pages base path.
- Avoid server-dependent features in v1.

### P8

- Start with the smallest system that can ship the content.
- Add richer tooling only after the core content model and pages are working.

### P9

- Centralize repeated metadata.
- Use a small content model so adding or removing examples is cheap.
- Review the site periodically after major work changes.

### P10

- Optimize for reading:
  - strong contrast
  - obvious links
  - clear focus states
  - comfortable line height
  - generous spacing

## When To Address Each Pitfall

| Pitfall | Best Time To Address |
|---------|----------------------|
| P1 | Before content inventory turns into page outlines |
| P2 | During initial information architecture |
| P3 | Before naming top-level navigation |
| P4 | During first draft copy and again during editing |
| P5 | While selecting examples for each domain |
| P6 | During wireframes and first homepage review |
| P7 | Before choosing the framework and again before deployment |
| P8 | Before scaffolding the project |
| P9 | While defining the content model, then post-launch during reviews |
| P10 | During visual design, responsive work, and pre-launch QA |

## Most Relevant Risks For This Project

The three most likely failure points here are:

1. **Scope sprawl** from trying to include too much
2. **Weak domain boundaries** that make the information architecture muddy
3. **GitHub Pages pathing and static-hosting issues** if deployment constraints are not handled early

## Confidence Notes

- **High confidence:** The biggest risks are curation and information architecture more than visual polish alone.
- **High confidence:** Scope, domain clarity, and Pages constraints are the most likely failure points for this brief.
- **Medium confidence:** Some implementation pitfalls depend on the final stack, but the content and architecture risks are stable regardless.

---
*Last updated: 2026-03-09 after research*
