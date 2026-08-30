# Product Requirements Document (PRD)
## Integrated Polar Science Outreach Portal
**Smart India Hackathon 2026 — Problem Statement 26063**
**Organization:** Ministry of Earth Sciences (MoES) | **Department:** National Centre for Polar and Ocean Research (NCPOR)
**Category:** Software | **Theme:** Smart Education

---

## 1. Problem Statement

NCPOR conducts polar and ocean research expeditions (Antarctica, Arctic, Himalaya) that generate expedition reports, scientific datasets, publications, photographs, and videos. This material is currently scattered and not easily accessible to students, researchers, journalists, or the general public. There is no system to systematically archive this content **and** repurpose it into outreach-ready material for websites and social media.

## 2. Goal

Build a single, unified **Outreach Portal** that:
1. Serves as the **public-facing front door** to NCPOR's polar science work — accessible, educational, and visually engaging.
2. Lets NCPOR staff **archive and organize** expedition content in one repository.
3. **Auto-generates** outreach-ready content (captions, summaries, fact cards) from archived material to reduce manual effort in producing social media/web content.

## 3. Target Users

| Persona | Need |
|---|---|
| **Student / Educator** | Learn about polar science in simple language; use content for projects |
| **Researcher** | Locate specific expedition reports, datasets, or publications quickly |
| **Journalist / Media** | Find media-ready photos, videos, and summaries for stories |
| **General Public** | Browse and get excited about India's polar missions |
| **NCPOR Admin/Comms Team** | Upload, tag, and publish content; generate outreach material without a designer/writer for every post |

## 4. Scope (Hackathon MVP)

### In Scope
- Public outreach portal (browse, search, view expeditions/publications/media)
- Admin panel for content upload and metadata tagging
- AI-assisted content generation (summaries, social captions, alt text)
- Basic search and filtering (by year, region, expedition, content type)
- Responsive design (desktop + mobile)

### Out of Scope (future/stretch)
- Real scientific dataset visualization/analysis tools (beyond basic preview)
- Multi-institution federated access (other MoES bodies)
- Native mobile app
- Direct auto-posting to social media APIs (demo will show "ready-to-post" drafts instead, due to API approval constraints)

## 5. Core Features & User Stories

### 5.1 Public Outreach Portal
- **US1:** As a visitor, I can browse expeditions by region (Antarctica/Arctic/Himalaya) and year.
- **US2:** As a visitor, I can view an expedition's report summary, photos, and videos in one page.
- **US3:** As a visitor, I can search publications/datasets by keyword.
- **US4:** As a visitor, I can view a "Latest Activities" feed of recent institutional news.
- **US5:** As a visitor, I can view an interactive polar map showing expedition locations.
- **US6:** As a student, I can access a "Learn" section with simplified explainers on polar science topics.

### 5.2 Admin / Content Management
- **US7:** As an admin, I can log in securely and upload expedition reports, datasets, photos, and videos.
- **US8:** As an admin, I can tag content with metadata (expedition name, year, region, researchers, content type).
- **US9:** As an admin, I can edit or remove previously published content.
- **US10:** As an admin, I can view all content in a dashboard with status (draft/published).

### 5.3 AI Content Generation (Differentiator)
- **US11:** As an admin, after uploading an expedition report, I can click "Generate Outreach Content" and receive:
  - A public-friendly summary (2–3 paragraphs)
  - 2–3 social media captions (Twitter/X, Instagram, LinkedIn tone variants)
  - Auto-generated alt text for uploaded images (accessibility)
- **US12:** As an admin, I can edit AI-generated drafts before publishing.
- **US13:** As an admin, I can export generated captions in a copy-ready format.

## 6. Non-Functional Requirements

| Requirement | Detail |
|---|---|
| Performance | Public pages load < 3s on average connection |
| Accessibility | WCAG-AA basics: alt text, contrast, keyboard nav |
| Responsiveness | Mobile-first layout for outreach pages |
| Security | Admin routes protected via JWT auth; file upload validation |
| Scalability (future) | Modular repository so other MoES departments could plug in later |
| Localization (stretch) | English + Hindi content toggle |

## 7. Success Metrics (for demo/judging)

- Working end-to-end flow: **upload → tag → AI-generate → publish → public view**
- At least 3 sample expeditions populated with realistic dummy content
- AI-generated content demonstrably reduces manual writing effort (show before/after)
- Clean, credible public portal UI that could plausibly be an official Government of India site

## 8. Key Differentiators to Highlight to Judges

1. **Not just a CMS** — the AI content-generation layer directly answers the PS line "generating content for websites and social media."
2. **Accessibility-by-design** — auto alt text for all polar imagery.
3. **Education-first framing** — ties to the "Smart Education" theme via a dedicated "Learn" section for students.
4. **Government-plausible design** — professional, trustworthy UI matching MoES/NCPOR branding conventions.

## 9. Assumptions & Constraints

- No real NCPOR data/API access — dummy/sample data will be used for the demo.
- No production social media API integration within hackathon timeframe.
- AI generation will use an LLM API (e.g., Claude/GPT) with hardcoded prompts tuned for polar science tone.

## 10. Milestones (Hackathon Timeline Alignment)

| Phase | Deliverable |
|---|---|
| Design | Wireframes, schema, PRD, Design doc (this document) |
| Build 1 | Backend APIs + DB schema + auth |
| Build 2 | Public portal pages + admin dashboard |
| Build 3 | AI content-generation module |
| Polish | Search/filter, responsive fixes, seed data |
| Demo Prep | Script, sample data walkthrough, slide deck |
