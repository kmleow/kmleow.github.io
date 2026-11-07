---
name: blog-publishing
description: >-
  Editorial workflow for creating and publishing technical articles on
  www.leowkahman.com following the 7-stage waterfall: topic alignment,
  architectural interview, draft review, 16:9 hero graphic generation, build
  verification, git push approval, and LinkedIn engagement drafting.
---

# Blog Publishing & Editorial Workflow: `leowkahman.com`

This skill guides agents through drafting, illustrating, testing, and publishing executive-level technical publications for **Leow Kah Man**.

---

## 1. Editorial Voice & Cultural Standards

- **Executive Persona**: Authoritative, analytical, disciplined. Positioned for CTO, Head of Engineering, and Software Architect audiences.
- **Language Standard**: **International English** (British/Commonwealth spelling: *optimise*, *prioritise*, *decoupling*, *orchestration*, *fibre*, *defence*, *synchronised*). **Strict exception**: never alter code, CLI flags, API schemas, or variable names.
- **Human Opinion, AI-Augmented Authorship**: AI assists in structuring, formatting, and drafting, but all core technical opinions, trade-offs, and architectural stances originate directly from human author Leow Kah Man.
- **Editorial Independence & Employer Disclaimer**: Every publication is an individual personal expression of Leow Kah Man and does not represent the views, strategies, or opinions of his employer.
- **Tone Guardrails**: Avoid novice phrases ("Today I will show you..."). Avoid boastful claims. Ground claims in pragmatic systems engineering.
- **CDN Edge & Asset Caching (GitHub Pages)**: The site is fronted by GitHub Pages Fastly CDN edge. When modifying or replacing static assets in `public/` (heroes, diagrams, favicons), agents must be mindful of CDN edge cache retention. Use cache busting (e.g. `?v=...`) or distinct filenames when immediate cache invalidation is required.

---

## 2. Sequential Waterfall Process

When authoring a new article, agents must strictly follow this waterfall without skipping ahead:

### Stage 1: Ideation & Topic Alignment
- Propose or receive an engineering topic (e.g. distributed queues, event-driven decoupling, AI execution harnesses, multi-cloud resilience).
- Define the core thesis and target executive takeaway.

### Stage 2: Collaborative Architectural Interview
Ask author Leow Kah Man 2–3 targeted questions:
1. *"What was the critical failure mode or bottleneck that prompted this architectural choice?"*
2. *"Why did you reject the mainstream/conventional alternative?"*
3. *"What were the measured production metrics, latency improvements, or cost impacts?"*

### Stage 3: Post Drafting & Textual Review
Draft the article in `src/content/blog/[slug].md` following the 5-part structure:
1. **Executive Summary / Problem Statement**: Stakes, failure modes, and reliability impact.
2. **Architecture & Topology**: ASCII or Mermaid diagram of the subsystem.
3. **Deep Technical Implementation**: Exact configuration directives, kernel commands, or code patterns.
4. **Verification & Telemetry**: Empirical benchmarks, logs, or profiling results.
5. **Architectural Takeaways**: Strategic insights for engineering leadership.

> [!IMPORTANT]
> **Stage 3 Review Gate**: Present the draft directly to the author for critique. Iterate on prose until completely approved. Do not generate hero graphics or commit to git during this stage.

### Stage 4: Abstract Hero Graphic Generation & Visual Review
Once text is approved:
- If author provides an image, crop to 16:9 and save to `public/images/heroes/[slug].webp`.
- If generated, create a pure **abstract architectural vector graphic (SVG)** into `public/images/heroes/[slug].svg` with:
  - 16:9 aspect ratio (1200x675).
  - Soft cream gradient background: `#FAF7F2` to `#ECE2D0`.
  - Precision geometric motifs (isometric prisms, vector planes, reticles, coordinate ticks).
  - **Strict Zero-Text Policy**: Never include English text, titles, subtitles, labels, or flowcharts inside hero graphics. All technical diagrams belong exclusively inside the article body (`public/images/diagrams/`).
- **Stage 4 Review Gate**: Present the hero graphic to the author for visual approval.

### Stage 5: Local Build & Quality Verification
Run build verification:
```bash
npm run build
```
Verify:
- Frontmatter schema validation passes (Zod).
- Sitemap (`dist/sitemap-index.xml`) and RSS (`dist/rss.xml`) include the post.
- Dynamic AdSense in-article insertion works correctly.

### Stage 6: Publishing & Git Push Approval
- **Explicit Author Gate**: Present a summary of changes and ask the author for explicit confirmation before pushing commits to the remote repository. Never push automatically.

### Stage 7: LinkedIn Engagement Workflow
Draft an executive LinkedIn post for the author to share:
- **Hook**: Highlight the architectural dilemma or failure mode.
- **Body**: 3–4 bullet points of high-value takeaways.
- **Link**: Direct canonical link to the article on `www.leowkahman.com`.
- **Call to Discussion**: Prompt peer feedback from engineering directors, architects, and technical leaders.

---

## 3. Monetisation & AdSense Compliance Rules

- **Short Articles (<600 words)**: 1 ad unit (bottom only).
- **Standard Articles (600–1,400 words)**: 2 ad units (1 mid-article at ~40% depth, 1 bottom).
- **Deep-Dive Guides (>1,400 words)**: 3 ad units (1 at ~35% depth, 1 at ~70% depth, 1 bottom).
- Mid-article ads must only insert between clean paragraphs or before `<h2>` headings. Never bisect code blocks (`<pre><code>`), Mermaid diagrams, or data tables.
- All ad units must preserve the mandatory `"ADVERTISEMENT"` disclosure and CLS minimum height (`min-h-[90px]`).
