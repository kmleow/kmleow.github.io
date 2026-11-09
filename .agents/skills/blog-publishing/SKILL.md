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
- **Tone Guardrails (Zero Boastfulness & Peer Respect)**: True authority comes from transparently detailing physical constraints, failures, and trade-offs. Avoid novice tutorials ("Today I will show you..."). Avoid hyperbole ("testing the contemporary frontier", "effortlessly", "with minimal effort"). Respect specialist disciplines (never claim AI lets an engineer "comfortably replace" designers or mobile devs). Treat readers as respected peers; never scold or lecture ("until you do X, your understanding is purely academic").
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
2. **Architecture & Topology**: Dedicated responsive vector SVG schematic in `public/images/diagrams/[slug].svg` (never raw Mermaid or ASCII blocks).
3. **Deep Technical Implementation**: Exact configuration directives, kernel commands, or code patterns.
4. **Verification & Telemetry**: Empirical benchmarks, logs, or profiling results.
5. **Architectural Takeaways**: Strategic insights for engineering leadership.

> [!IMPORTANT]
> **Stage 3 Review Gate & Diagram Standard**:
> - Present the draft directly to the author for critique. Iterate on prose until completely approved. Do not generate hero graphics or commit to git during this stage.
> - **Zero Raw Mermaid/ASCII Blocks**: All technical schematics, packet flow paths, and topologies must be authored as standalone responsive vector SVGs in `public/images/diagrams/[slug].svg` with bold typography (16px–24px) and zero client JavaScript.
> - **Zero SVG Text Overflow Rule**: Every badge, pill, or bounding box (`<rect>`) enclosing SVG text must be sized with safe margins: `rect_width >= (characters * font_size * 0.72) + 36px`. Always center with `text-anchor="middle"` at `x = rect_x + (rect_width / 2)` and visually audit via browser screenshot before publishing.
> - **Zero Raw LaTeX in Prose Rule**: Never use LaTeX math syntax (e.g. `$ ... $`, `\leftrightarrow`, `\rightarrow`, `\approx`, `\le`, `\ge`) in article prose. Use universal native Unicode characters (`↔`, `→`, `←`, `≈`, `≤`, `≥`, `×`) and backticks for algorithmic complexity (`` `O(1)` ``). Astro does not bundle a KaTeX runtime; raw LaTeX renders as unparsed plaintext.

### Stage 4: Content-Driven Hero Banner Generation & Visual Review
Once text is approved:
- Classify the post into one of the **4 Content-Driven Banner Archetypes**:
  1. **Empirical Benchmark**: High-contrast Before vs After (real metrics like `54 ms` vs `9 ms`, spike vs flatline curves).
  2. **Architecture Flow**: Exactly 3 macro-steps (min 32px text, 4–6px conduits, e.g. `[ Edge ] ──► [ WAF ] ══► [ Origin ]`).
  3. **Real Software Build**: Authentic screenshot from the post framed inside a modern 16:9 viewport (zero fake illustrations).
  4. **Code Craftsmanship**: Spaghetti vs Fluent Code Diff (28px+ monospace, imperative red vs declarative emerald).
- **Strict Hard Rules**:
  - **Zero Micro-Text**: No subtitles, descriptions, axis labels, or small badges. If text drops below 11px rendered size at 380px thumbnail width, it is strictly forbidden.
  - **Font Size Floors**: Headline 48px–56px+, metrics 64px–96px+, code 28px+.
  - **Zero Fake Data**: All numbers, UI screens, benchmarks, and code must come directly from authentic article evidence.
  - **Zero Canvas Overflow Rule**: All containers, drop shadows, and conduits must stay strictly within the **Safe Zone** (`X ∈ [60, 1140]`, `Y ∈ [50, 625]`). For 3-box flows: `3 * width + 2 * gap <= 1080px` (e.g. `width = 310px`, `gap = 75px`).
  - **Signature Palette**: Warm cream background (`#FAF7F2` to `#ECE2D0`), structural slate (`#0F172A`), emerald `#059669`, and red `#DC2626`.
- Render and verify at both 1200x675 and 380x214 thumbnail scale before presenting for author approval.

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
