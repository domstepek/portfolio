# Dom Personal Site

## What This Is

A personal website for Dom that gives a minimal first impression and lets visitors drill into the main themes of his work. The site is for recruiters, collaborators, and curious peers who want a high-level view of the systems, products, and infrastructure he has built across analytics, platform, AI, and developer tooling.

The landing page should feel casual, direct, and lightweight, inspired by the sparse style of `snwy.me`, while the deeper pages organize Dom's work by domain instead of by raw project list.

## Core Value

Someone should be able to land on the site and quickly understand what kinds of complex systems Dom builds, then explore the domains that matter to them without getting buried in noise.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Create a minimal landing page with a short lowercase intro and clear personal framing
- [ ] Organize deeper content by domains/themes rather than a flat project gallery
- [ ] Highlight Dom's work across analytics platforms, infrastructure/devops, AI/ML tooling, full-stack product development, and developer experience
- [ ] Include lightweight domain pages with concise summaries plus deeper detail for 1-2 flagship projects per domain
- [ ] Deploy the site as a static site on GitHub Pages

### Out of Scope

- Blog or long-form publishing system — not part of the initial goal of presenting work at a high level
- Exhaustive project-by-project portfolio pages for every repo — domains/themes are the primary information architecture
- Heavy animations or complex visual effects — would work against the minimal, text-forward style

## Context

This project starts from an empty repository and is a greenfield build.

The site direction is informed by `snwy.me`, specifically its minimal layout, sparse copy, and text-first presentation. The desired adaptation is not a clone of that site's content density. Instead, the goal is a minimal landing page with expandable depth through domain pages.

Background gathered so far suggests Dom is a full-stack engineer at Tapestry with experience spanning frontend application development, backend APIs, infrastructure, analytics tooling, and AI-adjacent product work. Public context also indicates long-running interests in AI, VR, big data, philosophy, and large-scale problem solving.

Repository scan across Dom's local work shows recurring themes:
- Analytics platforms and internal web portals
- Infrastructure and platform engineering with AWS, EKS, ArgoCD, GitOps, and CDN/proxy systems
- AI/ML and agent-oriented tooling with LangChain, Bedrock, and MCP concepts
- Full-stack business/product applications
- Developer experience investments such as a design system, internal CLI tooling, and automated QA

External research access is partial. A repo scan and public LinkedIn profile were available. Jira ticket history and Slack history were requested as inputs but are not yet accessible through the current environment, so the first version should treat those as optional future enrichment rather than a blocker.

## Constraints

- **Hosting**: Must deploy cleanly to GitHub Pages — the site should be compatible with a static hosting workflow
- **Style**: Keep the overall presentation minimal, text-forward, and lightweight — this is central to the intended first impression
- **Information Architecture**: Organize content by domain/theme, not by a generic project gallery — this supports the story Dom wants the site to tell
- **Tone**: Use a casual, direct, lowercase voice on the landing page — this should feel more personal than corporate
- **Contact**: Surface GitHub, LinkedIn, and email on the landing page — these are the core outbound links
- **Content Depth**: Use brief summaries for most work and reserve more detail for a small number of flagship examples in each domain — avoids overwhelming visitors

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Minimal landing page with deeper linked pages | Preserves the clarity and low-friction feel of the reference site while allowing Dom's broader body of work to be explored | — Pending |
| Organize deeper content by domains/themes | Better communicates capabilities and patterns across projects than a repo-by-repo gallery | — Pending |
| Use a casual lowercase voice | Matches the desired feel and makes the site read as more personal and direct | — Pending |
| Build for GitHub Pages | Keeps hosting simple and aligned with the stated deployment target | — Pending |
| Use mixed detail on domain pages | Keeps pages scannable while still giving standout work enough depth to be convincing | — Pending |

---
*Last updated: 2026-03-09 after initialization*
