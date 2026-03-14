---
title: Keep the path explicit
summary: A surprising amount of delivery friction comes from pretending the route is obvious when it is not.
published: 2026-03-09
type: note
tags: [opinion, engineering]
---

When a system touches multiple environments, teams, or delivery steps, I would rather make the path explicit than elegant.

That usually means naming the route, the dependency, and the fallback right in the implementation instead of hiding them behind a "clean" shortcut.

It is not as pretty on day one, but it tends to age better because:

- failures are easier to trace
- handoffs are easier to explain
- future cleanup has a visible target instead of a mystery

I have ended up trusting obvious wiring more than clever indirection, especially on projects that need to survive more than one owner.
