# Design Document
## Integrated Polar Science Outreach Portal
**Smart India Hackathon 2026 — Problem Statement 26063 (NCPOR / MoES)**

---

## 1. System Overview

The portal has three logical layers:

```
┌─────────────────────────────┐
│   Public Outreach Portal    │  ← React frontend (visitors)
├─────────────────────────────┤
│   Admin Dashboard            │  ← React frontend (NCPOR staff)
├─────────────────────────────┤
│   Backend API (Node/Express) │  ← Auth, CRUD, AI orchestration
├─────────────────────────────┤
│  Database  │  File/Media Storage │  LLM API (content generation)
└─────────────────────────────┘
```

## 2. High-Level Architecture

- **Frontend:** React (Vite) + Tailwind CSS, deployed on Vercel
- **Backend:** Node.js + Express REST API, deployed on Render/Railway
- **Database:** PostgreSQL (structured metadata) — or MongoDB if the team prefers document-style flexibility for varied content types
- **File/Media Storage:** Cloudinary (images/video) — handles transformation, thumbnails, and CDN delivery out of the box, ideal for a hackathon timeframe
- **AI Layer:** LLM API (Claude/GPT) called from backend for content generation — never called directly from frontend, to protect API keys
- **Auth:** JWT-based, two roles — `admin` and `public` (public routes need no auth)

## 3. Data Model (Schema)

### `expeditions`
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| title | string | e.g. "40th Indian Antarctic Expedition" |
| region | enum | Antarctica / Arctic / Himalaya |
| year | int | |
| summary | text | short public description |
| status | enum | draft / published |
| created_by | FK → users | |
| created_at / updated_at | timestamp | |

### `reports`
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| expedition_id | FK → expeditions | |
| title | string | |
| file_url | string | link to stored PDF/doc |
| raw_text | text | extracted text (for AI input) |
| uploaded_at | timestamp | |

### `media_assets`
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| expedition_id | FK → expeditions | |
| type | enum | photo / video |
| url | string | Cloudinary URL |
| alt_text | text | AI-generated or manual |
| caption | text | |

### `publications`
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| title | string | |
| authors | string[] | |
| year | int | |
| link_or_file | string | |
| tags | string[] | for search/filter |

### `generated_content`
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| source_type | enum | report / media / expedition |
| source_id | UUID | polymorphic reference |
| content_type | enum | summary / social_caption / alt_text |
| platform | enum (nullable) | twitter / instagram / linkedin |
| draft_text | text | |
| is_approved | boolean | admin approval before publish |

### `users` (admin only)
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name, email | string | |
| password_hash | string | |
| role | enum | admin |

## 4. Key User Flows

### 4.1 Admin: Upload → Generate → Publish
1. Admin logs in → Dashboard
2. Clicks "New Expedition" → fills title, region, year, summary
3. Uploads report file(s) and media (photos/videos)
4. Backend extracts text from report (PDF text extraction)
5. Admin clicks "Generate Outreach Content"
6. Backend sends extracted text + metadata to LLM API with a tuned prompt
7. LLM returns: public summary, 3 social captions, alt text suggestions per image
8. Admin reviews/edits drafts in a preview panel → clicks "Approve & Publish"
9. Expedition status flips to `published` → now visible on public portal

### 4.2 Visitor: Discover Content
1. Visitor lands on Home → sees featured expedition + "Latest Activities"
2. Browses via filters (region/year/type) or search bar
3. Opens an expedition page → sees summary, photo gallery, video embeds, related publications
4. Optionally visits "Learn" section for simplified educational explainers
5. Optionally views interactive map of expedition locations

## 5. Page/Screen Map

**Public Portal**
- `/` — Home (hero, featured expedition, latest activities feed)
- `/expeditions` — Browse/filter grid
- `/expeditions/:id` — Expedition detail (summary, gallery, videos, related publications)
- `/publications` — Searchable publication library
- `/learn` — Educational explainers (Smart Education tie-in)
- `/map` — Interactive expedition map

**Admin Portal**
- `/admin/login`
- `/admin/dashboard` — Content overview, status table
- `/admin/expeditions/new` / `/edit/:id`
- `/admin/generate/:expeditionId` — AI content generation & review panel

## 6. AI Content Generation — Prompt Design Approach

Backend constructs a structured prompt per content type, e.g.:

- **Summary prompt:** feed report text + audience = "general public / students," instruct for plain-language, 2–3 paragraphs, no jargon.
- **Social caption prompt:** feed summary + platform tone rules (concise + hashtags for Instagram/Twitter; more formal for LinkedIn).
- **Alt text prompt:** feed image context (expedition name, region, type of shot if known) → concise descriptive alt text for accessibility.

All AI output is treated as a **draft** — never auto-published without admin approval (important trust/safety point to mention to judges).

## 7. UI/Visual Design Direction

- **Tone:** credible, government-institutional but modern — avoid looking like a generic template
- **Color palette:** cool blues/whites/icy teals reflecting polar theme, with an accent (e.g., amber/orange) for CTAs — echoing the official MoES/NCPOR-style palette
- **Typography:** clean sans-serif for body (readability for students), slightly bolder serif or geometric sans for headings
- **Imagery-first layout:** large hero photography of expeditions/glaciers; cards with photo thumbnails throughout
- **Map component:** stylized world/polar projection highlighting Antarctica/Arctic/Himalaya expedition pins

## 8. Tech Stack Summary

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Tailwind | Fast to build, matches existing skillset |
| Backend | Node.js + Express | Familiar, quick REST setup |
| Database | PostgreSQL | Structured relational data (expeditions/reports/publications) |
| Media Storage | Cloudinary | Free tier, CDN, transformations built-in |
| AI | Claude/GPT API | Content generation for summaries/captions/alt text |
| Auth | JWT | Simple, stateless, sufficient for admin-only auth |
| Hosting | Vercel (frontend) + Render/Railway (backend) | Fast free-tier deploys for demo |

## 9. Security & Reliability Notes

- File upload validation (type/size limits) to prevent abuse
- AI-generated content always requires human approval before going public
- Admin routes protected by JWT middleware; rate-limit login attempts
- Environment variables for all API keys (never exposed to frontend)

## 10. Demo Strategy

For judging, pre-seed the database with 3–4 realistic sample expeditions (e.g., a fictionalized "40th Indian Antarctic Expedition") complete with sample reports, photos, and generated captions — so the AI generation flow can be demonstrated live without depending on real NCPOR data access.
