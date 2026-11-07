# Repository Guide & Editorial System: `kmleow.github.io`

Central architectural guide, editorial standard, and agent instructions for the technical publication of **Leow Kah Man** ([www.leowkahman.com](https://www.leowkahman.com)).

---

## 1. Editorial Persona & Positioning

### Target Persona: CTO & Head of Engineering
Every publication in this repository must project executive technical leadership, deep systems competence, and engineering pragmatism.

- **Tone & Voice**: Authoritative, analytical, disciplined, and concise. Avoid novice tutorial phrasing ("Today I will show you how to..."). Frame problems through architectural trade-offs, performance ceilings, cost implications, and production reliability.
- **Language Standard**: **International English** (British/Commonwealth spelling: e.g. *optimise*, *prioritise*, *decoupling*, *orchestration*, *fibre*, *defence*, *synchronised*, *behaviour*) for all article prose, headings, and descriptions. **Strict exception**: never alter code syntax, CLI parameters, API schemas, language keywords, or variable names.
- **Human Opinion, AI-Augmented Authorship**: While post drafting, formatting, diagrams, and prose synthesis are assisted by AI, **all core architectural opinions, engineering stances, problem contexts, and technical decisions originate directly from human author Leow Kah Man**. AI serves as an execution harness to articulate the author's real-world systems engineering experience.
- **Core Philosophies**:
  - **Pragmatic Technology Choices**: Prioritising boring, high-efficiency, maintainable stacks (Go, Astro, Svelte, robust primitives) over short-lived hype.
  - **Defence in Depth**: Zero Trust ingress, origin cloaking, netfilter packet filtering, and mutual TLS (mTLS).
  - **Code Craftsmanship & Composability**: Designing readable, self-documenting codebases and small composable functions.
  - **Hands-On Infrastructure**: Leveraging homelab infrastructure (K3s, custom DNS, edge routers) as an active R&D engine for real-world enterprise architectures.

---

## 2. Technical Stack Architecture

- **Engine**: Astro 5.x with Content Layer (`glob` loader in `src/content.config.ts`).
- **Styling**: Tailwind CSS with custom `brand` palette and news-card container queries (`modern-web-guidance`).
- **Hosting**: GitHub Pages (statically generated to `dist/`, zero server runtime, zero JS execution required for content delivery).
- **SEO & Feeds**: `@astrojs/sitemap` (filtered), `@astrojs/rss` (Google News-compliant RSS 2.0 at `/rss.xml`), JSON-LD `TechArticle` structured data.
- **Analytics & Monetisation**: Google Analytics 4 (`G-96D364YPM0`) with privacy anonymisation, Google AdSense (`ca-pub-8585963436723502`) with fixed containers and strict policy compliance.

---

## 3. Directory Topology

```
kmleow.github.io/
├── .github/workflows/deploy.yml   (GitHub Actions CI/CD pipeline)
├── public/
│   ├── CNAME                      (Custom domain: www.leowkahman.com)
│   ├── ads.txt                    (AdSense verification: pub-8585963436723502)
│   ├── robots.txt                 (Disallows /page/, /tags/, links sitemap-index.xml)
│   ├── BingSiteAuth.xml           (Bing webmaster verification)
│   ├── google2e6e06ece1efb8b3.html (Google search console verification)
│   ├── yandex_c29e9c1084b24e1d.html (Yandex verification)
│   ├── images/heroes/             (High-resolution SVG and WebP article thumbnails)
│   └── favicon*                   (Multi-resolution favicons)
├── src/
│   ├── content.config.ts          (Zod schema & glob loader for blog collection)
│   ├── content/
│   │   └── blog/                  (Markdown & MDX articles with frontmatter)
│   ├── components/
│   │   ├── Header.astro           (Sticky header with branding and dark/light toggle)
│   │   ├── Footer.astro           (Executive bio, LinkedIn, legal links)
│   │   ├── PostCard.astro         (News card with 16:9 thumbnail and stretched link)
│   │   ├── Pagination.astro       (Numbered page controls - NO infinite scroll)
│   │   ├── AdSense.astro          (Compliant ad container with CLS safeguards)
│   │   └── Analytics.astro        (GA4 telemetry with anonymize_ip)
│   ├── layouts/
│   │   ├── BaseLayout.astro       (Root HTML, security meta, JSON-LD, AdSense, GA4)
│   │   └── PostLayout.astro       (Article layout, hero image, byline, reading time)
│   ├── pages/
│   │   ├── index.astro            (Lead hero article + secondary grid)
│   │   ├── [...slug].astro        (Direct root slug article routing)
│   │   ├── page/[page].astro      (Numbered pagination archives)
│   │   ├── about.astro            (Executive profile & direct LinkedIn channel)
│   │   ├── privacy-policy.astro   (Legal disclosures for GA4 and AdSense)
│   │   ├── rss.xml.ts             (Google News RSS 2.0 generator)
│   │   └── 404.astro              (Smart client-side fallback redirector)
│   └── styles/
│       └── global.css             (Tailwind layers, typography, card container rules)
├── astro.config.mjs               (Config with automated legacy redirect stub hook)
└── package.json
```

---

## 4. Content Schema & Frontmatter Standard

Every post in `src/content/blog/[slug].md` must comply with this schema:

```yaml
---
title: "Article Headline"
description: "Executive summary (1-2 sentences) describing the problem, methodology, and outcome."
pubDate: YYYY-MM-DD
updatedDate: YYYY-MM-DD # Optional
heroImage: "/images/heroes/example-slug.svg" # REQUIRED - Must be 16:9 ratio
heroAlt: "Descriptive alt text for accessibility and SEO"
category: "Networking & Kernel" # Options: Networking & Kernel, Security Architecture, Platform Engineering, Software Architecture
tags: ["Linux", "Performance", "Cloud"]
author: "Leow Kah Man"
legacyUrls: # Optional: maps old /YYYY/MM/DD/slug/ paths to auto-generate 301 redirect stubs
  - "/YYYY/MM/DD/old-slug/"
---
```

---

## 5. Hero Thumbnail Workflow

Every article **must** feature a hero image (16:9 aspect ratio, minimum 1200x675 resolution):

1. **Author-Supplied Image**:
   - If the author provides an image file or URL, crop to 16:9, convert to WebP or SVG, and store in `public/images/heroes/[slug].webp`.
2. **AI-Generated / Schematic Image**:
   - If no image is supplied, the agent must either:
     - Generate an architectural vector graphic (SVG) illustrating the system topology, packet flow, or data pipeline into `public/images/heroes/[slug].svg`.
     - Or prompt the author with 2-3 visual concepts to approve or generate.

---

## 6. Article Creation Waterfall Workflow

When authoring a new article, agents must strictly adhere to this sequential waterfall process. **Do not skip ahead** or bundle stages prematurely:

```
[ Stage 1: Ideation & Topic Alignment ]
                   │
                   ▼
[ Stage 2: Collaborative Architectural Interview ]
                   │
                   ▼
[ Stage 3: Post Drafting & Review (Iterate Until Satisfied) ]
                   │
                   ▼
[ Stage 4: Hero Image Generation & Visual Review ]
                   │
                   ▼
[ Stage 5: Local Build & Quality Verification ]
                   │
                   ▼
[ Stage 6: Publishing & Git Push Approval ]
                   │
                   ▼
[ Stage 7: LinkedIn Engagement Workflow ]
```

### Stage 1: Ideation & Topic Alignment
- The agent or author proposes an engineering topic (e.g., cloud efficiency, offline-first architectures, monorepo orchestration, low-latency queues).
- Align on the core thesis and target audience (CTOs, Heads of Engineering, Staff Engineers).

### Stage 2: Collaborative Architectural Interview
The agent interviews author Leow Kah Man with 2–3 targeted questions to extract authentic human experience and technical opinions:
- *"What was the critical failure mode or bottleneck that prompted this architectural choice?"*
- *"Why did you reject the mainstream/conventional alternative?"*
- *"What were the measured production metrics or latency improvements?"*

### Stage 3: Post Drafting & Textual Review
- The agent drafts the complete article in `src/content/blog/[slug].md` following the 5-part structure:
  1. **Executive Summary / Problem Statement**: Engineering stakes and reliability/cost impact.
  2. **Architecture & Topology**: ASCII or Mermaid diagram of the subsystem.
  3. **Deep Technical Implementation**: Exact configuration directives, kernel commands, or code patterns.
  4. **Verification & Telemetry**: Empirical benchmarks, ping logs, or profiling results.
  5. **Architectural Takeaways**: Strategic insights for engineering leadership.
- **Review Gate**: Present the draft directly to the author for critique. Refine and iterate on prose until the author is completely satisfied. **Do not generate hero images or run git push during this stage.**

### Stage 4: Hero Image Generation & Visual Review
- Once the post text is approved:
  - If the author provides an image, crop to 16:9, convert to WebP/SVG, and place in `public/images/heroes/[slug].webp`.
  - If AI-generated, design a clean 16:9 vector schematic (SVG) featuring the standard soft cream background (`#FAF7F2` to `#F4EFE6`) and high-contrast dark text into `public/images/heroes/[slug].svg`.
- **Review Gate**: Present the generated hero image to the author for visual approval.

### Stage 5: Local Build & Quality Verification
- Run `npm run build` locally to verify:
  - Frontmatter schema compliance (Zod).
  - Proper sitemap and RSS 2.0 integration (`/rss.xml`).
  - Minified HTML/CSS generation without errors.
- Preview locally on `http://localhost:4321/` to verify layout and typography.

### Stage 6: Publishing & Git Push Approval
- **Explicit Author Gate**: Present a summary of changes and ask the author for explicit confirmation before pushing commits to the remote repository. Never push automatically.

### Stage 7: LinkedIn Engagement Workflow
- Upon publishing, the agent must draft an executive-level **LinkedIn post** for the author to share:
  - Hook highlighting the core architectural paradox or failure mode.
  - 3–4 bullet points of high-value technical takeaways.
  - Direct canonical link to the new article on `www.leowkahman.com`.
  - Purpose: Spark peer discussion with fellow engineering directors, architects, and recruiters on LinkedIn to drive organic professional engagement.

---

## 7. Developer & Build Commands

```bash
# Start local dev server
npm run dev

# Build production bundle (generates dist/, sitemaps, and legacy redirect stubs)
npm run build

# Preview production build locally
npm run preview
```
