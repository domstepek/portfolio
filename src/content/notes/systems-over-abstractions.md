---
title: Systems over abstractions
summary: Usually the problem is a missing system boundary, and the abstraction takes the blame.
published: 2026-03-10
type: note
tags: [opinion, engineering]
---

Most internal tooling pain shows up as "the wrong abstraction" long before anyone names the actual boundary that is missing.

If the workflow is fuzzy, adding a nicer component or one more helper function rarely fixes the real issue. It just makes the unclear boundary easier to ignore for another sprint.

The pattern I keep coming back to is:

- name the handoff
- name the owner
- name the failure mode

Once those three things are explicit, the implementation choices usually get easier. The abstraction still matters, but it stops carrying work that belonged to the system design in the first place.
