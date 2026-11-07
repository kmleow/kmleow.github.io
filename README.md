# kmleow.github.io — Architectural Systems & Engineering Leadership

The official technical publication and systems architecture journal of **Leow Kah Man** ([www.leowkahman.com](https://www.leowkahman.com)).

---

## 1. Editorial Focus & Positioning

This publication documents real-world production engineering, systems architecture, and engineering leadership derived from two decades of hands-on experience:

* **AI-First Engineering & Autonomous SDLC**: Agentic development pipelines, multi-agent workflows, and automated PR quality gates that accelerate delivery cadence while preserving architectural integrity.
* **Engineering Craftsmanship & Mentorship**: Clean code, composable architectures, readable functional pipelines, and cultivating high-ownership engineering cultures.
* **Systems Decoupling & Microservices**: Pragmatic monolithic decomposition, Domain-Driven Design (DDD), event-driven messaging, and eliminating single points of failure.
* **Cloud Architecture & Operational Resilience**: High-availability hybrid/multi-cloud platforms, zero-trust network ingress, Linux kernel fastpaths, and battle-tested infrastructure primitives.

---

## 2. Architecture & Tech Stack

This repository is a **pure source repository** (the published HTML is generated ephemerally in CI/CD and never committed to git):

* **Engine**: [Astro 5.x](https://astro.build/) with Content Collections and type-safe Zod schemas (`src/content.config.ts`).
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) with modern container queries and responsive typography.
* **Hosting & CDN**: GitHub Pages fronted by the Fastly edge network, delivering zero-client-runtime static HTML.
* **Visual Identity**:
  * **Hero Banners** (`public/images/heroes/`): Pure abstract architectural vector art (16:9 SVG), zero embedded text, optimized for responsive news cards and mobile viewports.
  * **In-Article Diagrams** (`public/images/diagrams/`): High-contrast, responsive SVGs with prominent typography (`16px`–`24px`) matching article prose.
* **SEO & Metadata**: JSON-LD `TechArticle` structured data, Google News-compliant RSS 2.0 (`/rss.xml`), and XML sitemaps (`/sitemap-index.xml`).
* **Monetisation & Telemetry**: Content-length-aware Google AdSense integration (<600w: 1 ad; 600–1400w: 2 ads; >1400w: 3 ads) with strict CLS safeguards, and anonymised Google Analytics 4.

---

## 3. Directory Topology

```
kmleow.github.io/
├── .github/workflows/deploy.yml   # GitHub Actions CI/CD pipeline
├── public/                        # Static assets (favicons, CNAME, ads.txt, robots.txt)
│   ├── images/heroes/             # Abstract 16:9 vector hero banners (SVG)
│   └── images/diagrams/           # High-resolution in-article technical schematics (SVG)
├── src/
│   ├── content/blog/              # Markdown & MDX technical publications
│   ├── components/                # Astro components (Header, Footer, PostCard, AdSense)
│   ├── layouts/                   # BaseLayout and PostLayout templates
│   ├── pages/                     # Root routes (index, about, privacy-policy, rss.xml, 404)
│   └── styles/                    # Global Tailwind layers and container queries
├── AGENTS.md                      # Editorial standards and agent instructions
├── astro.config.mjs               # Build config and automated legacy redirect engine
├── package.json                   # Dependencies and scripts
└── .npmrc                         # Peer dependency resolution configuration
```

---

## 4. Local Development

```bash
# 1. Install dependencies
npm ci

# 2. Start local development server (with HMR)
npm run dev

# 3. Build production static bundle (generates dist/)
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 5. Deployment & CI/CD

Deployments are automated via **GitHub Actions** (`.github/workflows/deploy.yml`):
* Pushing to `main` triggers a clean build on Node.js 24 (Active LTS).
* Astro generates the static distribution to `./dist`.
* The build artifact is uploaded and deployed to GitHub Pages with zero downtime.
* Legacy URLs from 2016–2020 are automatically redirected to canonical root slugs via build-time redirect stubs.

---

## 6. Editorial Independence & Licensing

* **Editorial Independence**: Every writeup, architectural analysis, and engineering opinion published across this repository is an individual personal expression of **Leow Kah Man**, independent of and not representing the views, positions, or strategies of his employer.
* **Human Authorship**: While formatting, synthesis, and diagrams are assisted by AI execution harnesses, all core architectural opinions, trade-offs, and technical stances originate 100% from human author Leow Kah Man.
* **Licensing**:
  * Articles, diagrams, and written content: [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/).
  * Source code and configuration: [MIT License](https://opensource.org/licenses/MIT).
