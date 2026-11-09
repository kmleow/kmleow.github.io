# Repository Guide & Editorial System: `kmleow.github.io`

Central architectural guide, editorial standard, and agent instructions for the technical publication of **Leow Kah Man** ([www.leowkahman.com](https://www.leowkahman.com)).

---

## 1. Editorial Persona & Positioning

### Target Persona: CTO & Head of Engineering
Every publication in this repository must project executive technical leadership, deep systems competence, and engineering pragmatism.

- **Tone & Voice**: Authoritative, analytical, disciplined, and concise. Avoid novice tutorial phrasing ("Today I will show you how to..."). Frame problems through architectural trade-offs, performance ceilings, cost implications, and production reliability.
- **Tone Guardrails (Zero Boastfulness & Peer Respect)**: Maintain unpretentious engineering humility. True technical authority stems from transparently documenting failures, hardware limits, and messy trade-offs, not from self-congratulation:
  - **Zero Hyperbole**: Never use grandiose or inflated phrasing ("testing the contemporary frontier", "effortlessly", "mastered", "with minimal effort", "superhuman 10x engineer").
  - **Respect for Specialist Crafts**: Never claim that AI allows a single engineer to "comfortably replace" or trivialize specialized disciplines (UI/UX designers, mobile developers, QA). Frame AI as an unblocking execution harness that aids a generalist in navigating unfamiliar stacks.
  - **Peer-to-Peer Camaraderie (No Lecturing)**: Avoid patronising or scolding the reader ("until you do X, your understanding is purely academic"). Address readers as respected peer architects and engineering directors who have their own battle scars.
- **Language Standard**: **International English** (British/Commonwealth spelling: e.g. *optimise*, *prioritise*, *decoupling*, *orchestration*, *fibre*, *defence*, *synchronised*, *behaviour*) for all article prose, headings, and descriptions. **Strict exception**: never alter code syntax, CLI parameters, API schemas, language keywords, or variable names.
- **Typography & Symbol Standard (Zero Raw LaTeX in Prose)**: Never use LaTeX math syntax (e.g. `$ ... $`, `\leftrightarrow`, `\rightarrow`, `\approx`, `\le`, `\ge`) in article prose. Because the site relies on pure Markdown/HTML without a client-side KaTeX engine, raw LaTeX commands render as broken plaintext. Always use universal native Unicode characters:
  - Arrows: `↔`, `→`, `←` (never `\leftrightarrow`, `\rightarrow`).
  - Relational operators: `≈`, `≤`, `≥`, `×`, `·` (never `\approx`, `\le`, `\ge`).
  - Big-O / Complexity: Use backticked code spans (e.g. `` `O(1)` ``, `` `O(n)` ``), never math mode (`$O(1)$`).
- **Human Opinion, AI-Augmented Authorship**: While post drafting, formatting, diagrams, and prose synthesis are assisted by AI, **all core architectural opinions, engineering stances, problem contexts, and technical decisions originate directly from human author Leow Kah Man**. AI serves as an execution harness to articulate the author's real-world systems engineering experience.
- **Editorial Independence & Employer Disclaimer**: Every publication, writeup, and architectural analysis across this repository is an **individual personal expression of Leow Kah Man**, independent of and not representing the views, positions, or strategies of his employer.
- **Core Philosophies**:
  - **Pragmatic Technology Choices**: Prioritising boring, high-efficiency, maintainable stacks (Go, Astro, Svelte, robust primitives) over short-lived hype.
  - **Defence in Depth**: Zero Trust ingress, origin cloaking, netfilter packet filtering, and mutual TLS (mTLS).
  - **Code Craftsmanship & Composability**: Designing readable, self-documenting codebases and small composable functions.
  - **Hands-On Infrastructure**: Leveraging homelab infrastructure (K3s, custom DNS, edge routers) as an active R&D engine for real-world enterprise architectures.

---

## 2. Technical Stack Architecture

- **Engine**: Astro 5.x with Content Layer (`glob` loader in `src/content.config.ts`).
- **Styling**: Tailwind CSS with custom `brand` palette and news-card container queries (`modern-web-guidance`).
- **Hosting & Edge Delivery**: GitHub Pages (statically generated to `dist/`, zero server runtime, zero JS execution required for content delivery).
- **CDN Caching & Static Asset Invalidation**: The site is fronted by **GitHub Pages CDN (Fastly edge network)**. Because the CDN edge and browsers cache static assets in `public/` (e.g. `/images/heroes/`, `/images/diagrams/`, icons, XML files):
  - Agents must be mindful when modifying or replacing existing static assets in `public/`.
  - While Astro hashes bundled JS/CSS in `_astro/` automatically, raw files in `public/` retain their exact path.
  - When updating critical images or assets where immediate edge cache busting is needed, use cache-busting query strings (e.g., `?v=YYYYMMDD`) or distinct asset filenames to prevent visitors from seeing stale cached copies.
- **SEO & Feeds**: `@astrojs/sitemap` (filtered), `@astrojs/rss` (Google News-compliant RSS 2.0 at `/rss.xml`), JSON-LD `TechArticle` structured data.
- **Analytics & Monetisation**: Google Analytics 4 (`G-96D364YPM0`) with privacy anonymisation, and Google AdSense Auto Ads (`ca-pub-8585963436723502`) loaded globally in `<head>` with `ads.txt` authorization.

---

## 3. Monetisation & AdSense Compliance Policy

The publication relies on **Google AdSense Auto Ads** (`ca-pub-8585963436723502`):

- **Auto Ads Model**: AdSense script is injected globally in `<head>`, allowing Google's machine learning engine to place and optimize non-intrusive responsive ad units dynamically without layout shift.
- **Verification & Ownership**: Authorized via `public/ads.txt` (`pub-8585963436723502`).
- **Policy Compliance (Valuable Inventory)**: Advertising is managed automatically by Google AdSense according to policy exclusions configured in the AdSense console.
- **Clean Article Layout**: No synthetic or broken manual slot wrappers pollute article reading flows.

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
category: "Engineering Leadership" # Options: Engineering Leadership, Software Architecture, Platform Engineering, Security Architecture, Networking & Kernel, Infrastructure & Protocols
tags: ["Linux", "Performance", "Cloud"]
author: "Leow Kah Man"
legacyUrls: # Optional: maps old /YYYY/MM/DD/slug/ paths to auto-generate 301 redirect stubs
  - "/YYYY/MM/DD/old-slug/"
---
```

---

## 5. Hero Graphics & In-Article Diagram Standard

Every publication uses a strict separation between **content-driven hero banners** and **in-article technical diagrams**:

### 1. Content-Driven Hero Banners (`public/images/heroes/[slug].svg` or `.webp`)
- **Aspect Ratio**: 16:9 (1200x675 canvas).
- **The 4 Content-Driven Banner Archetypes** (No one-size-fits-all):
  1. **Empirical Benchmark & Performance Tuning** (e.g. Bufferbloat, Flow Offloading):
     - High-contrast **Before vs After Delta**.
     - Real numbers only (e.g. `54 ms` vs `9 ms`).
     - Dual waveform curves (erratic latency spike vs flatline baseline).
  2. **Architecture Pipeline & Multi-Step Flow** (e.g. Zero Trust, CI/CD Runners, Multi-WAN):
     - Exactly **3 macro-step boxes** showing the state transition or network flow.
     - Thick conduits (4–6px), bold direction arrows, high-contrast badges (e.g. `DROP` vs `mTLS ALLOW`).
  3. **Real Software Build & UI Delivery** (e.g. Montessori Flashcard App, Mobile Tools):
     - The **actual, genuine screenshot from the article** (never a synthetic/fake drawing).
     - Centered inside a clean, modern device/viewport chassis with soft drop shadow.
     - Paired *only* with the bold 1–2 word project title (56px+).
  4. **Code Craftsmanship & Refactoring** (e.g. LINQ, Functional Pipelines):
     - High-contrast **Spaghetti vs Fluent Code Diff**.
     - Left: 3 lines of imperative/nested loop code (dimmed/strikethrough red).
     - Right: 3 lines of clean declarative code (crisp syntax highlighted emerald).
- **The Strict Hard Rules (The 380px Thumbnail & Canvas Safety Rules)**:
  - **Zero Micro-Text**: Never include subtitles, descriptive sentences, axis labels, micro-badges, or explanatory captions. If text drops below 11px at 380px thumbnail width, it is strictly forbidden.
  - **Font Size Floors**: Headlines must be **48px–56px+**, metrics and delta numbers must be **64px–96px+**, code diff tokens must be **28px+**.
  - **Zero Fake Data or Synthetic Illustrations**: Every number, metric, benchmark curve, code snippet, or UI screen must be extracted verbatim from authentic article evidence.
  - **Canvas Boundary & Safe Margin (Zero Canvas Overflow Rule)**:
    - Canvas is strictly 1200×675 (`viewBox="0 0 1200 675"`).
    - All elements, bounding boxes, and drop shadows MUST stay within the **Safe Zone**: `X ∈ [60, 1140]` (preserving at least 60px side margin) and `Y ∈ [50, 625]`.
    - **Multi-Box Horizontal Constraint**: For $N$ horizontal boxes with outer margin $X_{margin}$ and gap $G$:
      $X_{margin} + (N \times W_{box}) + ((N - 1) \times G) \le 1140\text{px}$.
      *(e.g., for 3 boxes with $X_{margin} = 60\text{px}$ and $G = 75\text{px}$, each box must be $W_{box} \le 310\text{px}$)*.
    - Every newly authored banner MUST be rendered to PNG and checked to guarantee zero elements or shadows clip past the canvas boundary.
  - **Color Palette Consistency**: Maintain the signature soft cream gradient background (`#FAF7F2` to `#ECE2D0`), midnight slate structure (`#0F172A`), and clear semantic indicators (emerald green `#059669` for wins/after, red `#DC2626` for bottlenecks/before).
- **Author-Supplied Image**: If the author supplies a photo or screenshot, frame it into 16:9 with clean elevation and save as WebP or SVG.

### 2. In-Article Diagrams (`public/images/diagrams/[slug].svg`)
- **Purpose**: Dedicated place for technical schematics, packet flow paths, kernel routing topologies, sequence diagrams, and subsystem architectures.
- **Typography Scale**: Must be bold, high-contrast slate (`#0F172A`), and sized between **`16px` and `24px`** to maintain parity with article prose (`max-w-4xl` / 896px container).
- **SVG Typography & Bounding Box Constraints (Zero Overflow Rule)**:
  - Text inside SVG does not wrap automatically. Every container pill or bounding box (`<rect>`) enclosing text MUST be calculated with generous visual margins to prevent text overflow:
    - Minimum safe pill width: `(characters * font_size * 0.72) + 36px` of horizontal padding.
    - Always center text within its enclosing rectangle using `text-anchor="middle"` at `x = rect_x + (rect_width / 2)`.
    - Every newly authored SVG schematic must be visually verified via browser inspection/screenshot to ensure zero text touches or spills past rectangle boundaries.
- **Performance**: Zero client JavaScript, lightweight SVG markup, responsive viewBox.

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
  2. **Architecture & Topology**: Dedicated responsive vector SVG schematic in `public/images/diagrams/`.
  3. **Deep Technical Implementation**: Exact configuration directives, kernel commands, or code patterns.
  4. **Verification & Telemetry**: Empirical benchmarks, ping logs, or profiling results.
  5. **Architectural Takeaways**: Strategic insights for engineering leadership.
- **Review Gate**: Present the draft directly to the author for critique. Refine and iterate on prose until the author is completely satisfied. **Do not generate hero images or run git push during this stage.**
- **Diagram Standard**: Never insert raw Mermaid or ASCII block diagrams in article prose. All technical schematics, topologies, and workflows must be authored as dedicated, responsive vector SVGs placed in `public/images/diagrams/[slug].svg` with bold, high-contrast typography (16px–24px) for zero-JS native rendering.

### Stage 4: Abstract Hero Image Generation & Visual Review
- Once the post text is approved:
  - If the author provides an image, crop to 16:9, convert to WebP/SVG, and place in `public/images/heroes/[slug].webp`.
  - If AI-generated, create a pure **abstract architectural vector graphic (SVG)** into `public/images/heroes/[slug].svg` with:
    - 16:9 aspect ratio (1200x675).
    - Signature cream gradient background (`#FAF7F2` to `#ECE2D0`).
    - Precision geometric motifs (isometric prisms, vector planes, reticles, coordinate ticks).
    - **Zero text or labels** inside the hero image.
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
