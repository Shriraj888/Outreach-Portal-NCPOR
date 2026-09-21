# NCPOR Polar Science Outreach Portal 🧭
### National Centre for Polar and Ocean Research (NCPOR)
**Ministry of Earth Sciences, Government of India**
 
An integrated, high-performance web platform delivering interactive public outreach, 3D cryosphere geospatial intelligence, educational discovery, and multi-tier archive management for India's scientific expeditions across **Antarctica**, the **Arctic**, and the **Himalayas (Third Pole)**.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start local Vite development server
npm run dev

# 3. Build optimized production bundle
npm run build

# 4. Preview local production build
npm run preview
```

---

## 🌐 Deploying to Vercel

The project is pre-configured with [`vercel.json`](./vercel.json) for instantaneous zero-configuration deployment with SPA client-side route rewrites, immutable asset caching, and security headers.

### Option 1: Deploy via Vercel Dashboard (Recommended)
1. Push your repository to **GitHub** / **GitLab** / **Bitbucket**.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Import your `outreach-portal` repository.
4. Vercel will automatically detect the **Vite** framework:
   - **Build Command:** `npm run build` (or `vite build`)
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**.

### Option 2: Deploy via Vercel CLI
```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Log in and deploy
vercel

# Deploy directly to production
vercel --prod
```

---

## 🛠️ Tech Stack & Key Modules
- **Framework:** React 19, Vite 8
- **Styling:** Custom Balanced Matte Institutional Design System (CSS Custom Properties)
- **Geospatial & 3D:** Three.js, D3-Geo, TopoJSON, React Simple Maps
- **Icons:** Lucide React
- **Live Real-time Data:** Open-Meteo API, NOAA Space Weather Prediction, NCPOR Open Data feeds
- **Accessibility:** WCAG AA/AAA Compliant (Text Resizer, High Contrast Mode, Screen Reader Alt-Text)

---

## 📜 License
Developed for National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, Government of India.
