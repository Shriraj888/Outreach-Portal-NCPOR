# 🧭 Integrated Polar Science Outreach, Knowledge Repository and Media Dissemination Portal

**National Centre for Polar and Ocean Research (NCPOR) | Ministry of Earth Sciences (MoES), Government of India**

> **Smart India Hackathon 2026 — Problem Statement 26063** · Category: Software · Theme: Smart Education

| | |
|---|---|
| **PS ID** | 26063 |
| **Organization** | Ministry of Earth Sciences (MoES) |
| **Department** | National Centre for Polar and Ocean Research (NCPOR) |

---

## Problem Statement

> _Develop a comprehensive outreach portal that archives expedition reports, scientific datasets, publications, photographs, videos and institutional activities while generating content for websites and social media._

NCPOR conducts polar and ocean research expeditions across **Antarctica**, the **Arctic**, and the **Himalayas** that produce valuable scientific material. This content is currently scattered and not easily accessible — and there is no system to systematically archive it **and** repurpose it into outreach-ready content for websites and social media.

## Our Solution

1. **Public-facing discovery** — Browse expeditions, publications, datasets, and live polar station telemetry through an interactive, government-credible interface.
2. **Admin content management** — Upload, tag, and manage expedition archives with a streamlined dashboard.
3. **AI-powered outreach generation** — One-click generation of public summaries, platform-tuned social media captions (X/Twitter, Instagram, LinkedIn, Facebook), and WCAG-compliant alt-text — all reviewed by an admin before publishing.

---

## Features

### Public Portal

| Feature | Description |
|---|---|
| **Home & Hero** | Featured expeditions, latest activities feed, national statistics |
| **Expedition Browser** | Filter by region (Antarctica / Arctic / Himalaya) and year |
| **Expedition Detail** | Full report summaries, photo galleries, video embeds, key findings, related publications |
| **Interactive Polar Map** | 3D globe (Three.js) with live weather from Open-Meteo, NOAA aurora Kp index, SARAL/AltiKa satellite tracks, and station pins |
| **Publications Library** | Real-time NCPOR publications via OpenAlex API + datasets via DataCite, with keyword search and discipline filters |
| **PDF Export** | One-click official NCPOR-branded PDF download for any publication |
| **Bilingual UI** | English ↔ Hindi toggle across all navigation and content labels |
| **Accessibility** | Text resizer, high-contrast mode, screen-reader alt-text (WCAG AA) |

### Admin Studio

| Feature | Description |
|---|---|
| **Dashboard** | Overview of all expeditions, reports, datasets, media — with draft/published status |
| **Upload Studio** | Multi-category upload interface for reports, datasets, media, and activities |
| **Expedition Form** | Create/edit expedition metadata (title, region, year, chief scientist, stations, tags) |
| **AI Verification Studio** | Generate → review → approve outreach content per expedition |
| **Selective AI Studio** | Pick any individual asset (report, dataset, media) and generate targeted content with audience-tone control |
| **Social Card Preview** | Live multi-platform card previews (Twitter, Instagram, LinkedIn, Facebook, Press Release) before publishing |

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React 19 + Vite 8 | SPA with fast HMR and optimized chunked builds |
| **Styling** | Vanilla CSS with custom properties | Institutional design system — no utility framework dependency |
| **3D / Geospatial** | Three.js, D3-Geo, TopoJSON, world-atlas | Interactive 3D polar globe and map projections |
| **Icons** | Lucide React | Consistent, accessible icon set |
| **PDF** | jsPDF | Client-side branded publication PDF export |
| **Effects** | canvas-confetti | Celebration micro-interactions |
| **Live Data APIs** | Open-Meteo, NOAA SWPC, OpenAlex, DataCite | Real-time weather, aurora, publications, datasets |
| **AI** | Google Gemini API (configurable) | Outreach summary, social caption, and alt-text generation |
| **Hosting** | Vercel | Zero-config SPA deployment with SPA rewrites and security headers |

---

## Architecture

```
src/
├── components/          # Reusable UI (Header, Footer, ExpeditionCard, PolarGlobeMap, SocialCardPreview)
├── context/             # PortalContext — global state (expeditions, publications, auth, i18n, a11y)
├── data/                # Mock/seed data (expeditions, stations, translations)
├── hooks/               # usePolarData — live telemetry hook (Open-Meteo, NOAA, Celestrak)
├── pages/
│   ├── Home.jsx         # Landing page with hero, stats, latest activities
│   ├── Expeditions.jsx  # Browse & filter grid
│   ├── ExpeditionDetail.jsx  # Full expedition view
│   ├── PolarMap.jsx     # 3D interactive globe
│   ├── Publications.jsx # Live research registry
│   └── admin/
│       ├── AdminLogin.jsx
│       ├── AdminDashboard.jsx
│       ├── UploadStudio.jsx
│       ├── ExpeditionForm.jsx
│       ├── AIGenerateStudio.jsx      # Per-expedition AI generation
│       └── SelectiveAIStudio.jsx     # Per-asset AI generation
├── services/
│   ├── aiService.js         # Prompt engineering, audience tones, content generation engine
│   └── ncporApiService.js   # OpenAlex & DataCite API client with caching
└── utils/
    ├── routes.js            # Hash-based SPA router with browser history sync
    └── pdfGenerator.js      # Official NCPOR publication PDF builder
```

**Routing** uses hash-based navigation (`#/expeditions`, `#/admin/dashboard`, etc.) enabling deep linking and full browser back/forward support without a server-side router.

**State** is managed via React Context (`PortalContext`) with `localStorage` persistence — no external state library needed.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Install & Run

```bash
# Clone the repository
git clone https://github.com/Shriraj888/Outreach-Portal-NCPOR.git
cd Outreach-Portal-NCPOR

# Install dependencies
npm install

# Start development server
npm run dev
```

The app opens at `http://localhost:5173` by default.

### Environment Variables

Copy the template and fill in your keys:

```bash
cp .env.example .env
```

Key variables:

| Variable | Required | Description |
|---|---|---|
| `VITE_GEMINI_API_KEY` | For AI features | Google Gemini API key for content generation |
| `VITE_OPENALEX_API_URL` | No (has default) | OpenAlex endpoint for live publications |
| `VITE_DATACITE_API_URL` | No (has default) | DataCite endpoint for live datasets |
| `VITE_OPEN_METEO_API_URL` | No (has default) | Open-Meteo endpoint for station weather |

> All public API endpoints (OpenAlex, DataCite, Open-Meteo, NOAA) work out of the box without keys.

### Build for Production

```bash
npm run build    # Outputs to dist/
npm run preview  # Preview the production build locally
```

---

## Deployment (Vercel)

The repo includes a pre-configured [`vercel.json`](./vercel.json) with:

- SPA catch-all rewrite (`/*` → `index.html`)
- Immutable asset caching (`Cache-Control: max-age=31536000`)
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`)

**Deploy in one step:**

```bash
npx vercel --prod
```

Or import the repo directly from the [Vercel Dashboard](https://vercel.com/dashboard) — framework detection is automatic.

---

## Build Optimizations

Vite is configured with manual chunk splitting for optimal load performance:

| Chunk | Contents |
|---|---|
| `vendor-react` | React, React DOM |
| `vendor-three` | Three.js (3D globe) |
| `vendor-geo` | D3-Geo, TopoJSON, world-atlas |
| `vendor-icons` | Lucide React |
| `vendor-other` | Remaining node_modules |

This ensures the 3D and geospatial libraries don't block initial page render.

---

## Live Data Sources

| Source | What It Powers | Auth Required |
|---|---|---|
| [OpenAlex](https://openalex.org) | NCPOR publications (Institution: `I106814784`) | No |
| [DataCite](https://datacite.org) | NCPOR-affiliated scientific datasets | No |
| [Open-Meteo](https://open-meteo.com) | Real-time weather at Bharati, Maitri, Himadri, Himansh stations | No |
| [NOAA SWPC](https://www.swpc.noaa.gov) | Geomagnetic Kp index (aurora forecasting) | No |
| [Celestrak](https://celestrak.org) | SARAL/AltiKa satellite TLE orbital data | No |

---

## Problem Statement Alignment (SIH 26063)

| PS Requirement | How the Portal Addresses It |
|---|---|
| _"Archive expedition content"_ | Admin Upload Studio with metadata tagging, multi-category asset management |
| _"Generate content for websites and social media"_ | AI engine produces summaries + platform-tuned captions in one click |
| _"Accessible to students, researchers, journalists, public"_ | Four distinct audience tones; bilingual UI; accessibility controls |
| _"Smart Education theme"_ | Educational explainers, simplified language, student-oriented tone option |

---

## License

Built for the **National Centre for Polar and Ocean Research (NCPOR)**, Ministry of Earth Sciences, Government of India — as part of the Smart India Hackathon 2026 initiative.
