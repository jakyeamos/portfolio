# Game Log — Experience Page Design

**Date:** 2026-04-23  
**Status:** Approved  
**Goal:** Add a dedicated experience page that surfaces measurable impact at every CV entry — professional and community/leadership — so reviewers never have to hunt for the numbers.

---

## Problem

Reviewers find it hard to locate measurable impacts alongside experiences. The current site isolates impact data on a separate Impact Report page with no per-role breakdown, and the Scouting Report has no experience section at all. Community and leadership impacts (Flea Market, AIDC, BEN committee) are treated as footnotes rather than first-class entries.

---

## Solution

A new page called **"Game Log"** added to the site nav between Scouting Report and Impact Report. Each entry in the log — professional and community — follows an impact-first card pattern: the headline metric comes before the context, not after.

---

## Page Structure

### 1. Header
- Section kicker: `Game Log`
- H1: `Every engagement. Every level of impact.`
- Brief subtext: one sentence framing that professional and community work are both counted.

### 2. Professional Entries
Three employer cards, displayed as full-width editorial cards stacked vertically.

#### Forward Automations — Lead Engineer (2023–Present)
Four sub-engagements, each with its own impact callout inside the card:

| Sub-engagement | Impact callout | Context |
|---|---|---|
| Cleveland Clinic | MVP shipped in **2 weeks** (90% faster than industry standard) | Full-stack clinical coaching MVP in a regulated healthcare environment |
| Cleveland architecture firm | **400%** operational output increase | Custom productivity software deployed in under 5 weeks |
| A16z startup | **90%** production timeline reduction · **1.5M** organic views | Proprietary AI marketing automation tools |
| STEM Playbook | End-to-end legacy refactor in **11 days** | Launched stable application for a major live event |

#### Deepr — Technical Consultant (2025)
Two entries:

| Sub-engagement | Impact callout | Context |
|---|---|---|
| AI carousel system | **1,000 → 500,000** views across Instagram and TikTok | AI-powered photo carousel driving content generation at scale |
| Coverage vector tool | In progress | Inline real-time testing coverage awareness during code reviews — qualitative impact only until shipped |

#### Amazon — SDE Intern, UCM-WFE & Fintech Teams (2023–2025, Multiple Terms)
Two entries:

| Sub-engagement | Impact callout | Context |
|---|---|---|
| Hiring analytics (Fintech) | High-use internal tool | Data analytics project providing actionable hiring insights to business leaders; described by management as a significant quarterly push |
| Ads distributed systems | Pipeline coverage improved | Enhanced customer process efficiency and ticket resolution across distributed systems infrastructure |

> **Content note:** Amazon hard metrics are not available. The hiring analytics framing ("high-use internal tool, significant quarterly push") is the strongest honest claim until manager outreach yields a quotable number or stat. Design the card to accept a metric callout as an optional slot that can be filled in later.

---

### 3. Community & Leadership Section
Separate section with its own header: `Community & Leadership`. Same card anatomy as professional entries.

| Entry | Impact callout | Context |
|---|---|---|
| CWRU Flea Market — Founder (2023–Present) | **600+** attendees/event · **50+** student & local vendors · **~$7K** revenue/event | Created CWRU's largest monthly campus event; mission is bringing students, faculty, staff, and Greater Cleveland residents together with a focus on student vendor growth and skill development |
| AIDC — VP (2023–Present) | **200+** student developers | Community-based learning environment for coders; leads technical development opportunities across the club |
| Amazon BEN Intern Leadership Committee | **2×** board member | Elected to the Black Employee Network intern leadership committee across two separate Amazon internship terms |
| Elevated Aperture — Founder (2020–Present) | TBD — no metrics available yet | Aerial photography company serving construction and arts industries |
| Volunteering | TBD — to be added | Placeholder until specific orgs/activities are documented |

---

## Card Anatomy

Each card (or sub-entry within a card) follows this hierarchy:

```
[ Kicker — type/domain ]
[ Company · Role · Dates ]
[ IMPACT CALLOUT — large, bold, primary color ]
[ 2–3 lines of context explaining what drove the number ]
```

- Impact callout is the **largest text element** in the card body after the company name
- Multi-metric entries stack callouts vertically (e.g., "90% timeline reduction" then "1.5M organic views")
- Community entries use the same anatomy — the attendance number or vendor count is the headline, not a bullet
- Cards with no hard metric use a qualitative callout in the same visual position but in a muted color to maintain layout consistency without fabricating data

---

## Navigation

- Add "Game Log" to `SideNavBar` between Scouting Report and Impact Report
- Route: `/game-log`
- Add `GameLog` page component at `src/pages/GameLog.tsx`
- Add content data to `src/content/portfolioContent.ts` under `GAME_LOG_*` exports

---

## Content Data Shape

```typescript
type GameLogSubEntry = {
  label: string;        // sub-engagement name
  impact: string;       // headline metric or qualitative callout
  impactIsQualitative?: boolean; // if true, render in muted color
  context: string;      // 1-2 sentence explanation
};

type GameLogEntry = {
  kicker: string;       // domain tag
  company: string;
  role: string;
  dates: string;
  entries: GameLogSubEntry[];
};

type GameLogCommunityEntry = {
  org: string;
  role: string;
  dates: string;
  impact: string;
  impactIsQualitative?: boolean;
  context: string;
};
```

---

## Out of Scope

- Modifying the existing Impact Report page
- Adding experience entries to the Scouting Report
- Any changes to the Film Room or Player Comps pages

---

## Open Items

1. **Amazon metrics** — reach out to past manager for a quotable stat or usage number on the hiring analytics project. Card is designed to accept it as a drop-in.
2. **Elevated Aperture metrics** — revenue, client count, or project count would strengthen this entry.
3. **Volunteering detail** — specific orgs/activities needed before this entry can be completed.
