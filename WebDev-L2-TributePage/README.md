![Tribute Page](./task2-intro.png)

# Tribute Page — OIBSIP Web Development & Designing (Level 2, Task 2)

A tribute page for **Ada Lovelace** — the 19th-century mathematician whose 1843 notes on
Charles Babbage's Analytical Engine are widely regarded as the first published algorithm
written for a machine, earning her recognition as the first computer programmer.

## Live features

- Page title (`Ada Lovelace`) with a one-line tagline in the hero section
- A prominent portrait, rendered as an SVG `<image>` element inside a decorative bordered
  frame (rounded corners, brass border, matching the page's palette), with a fallback baked
  into the SVG itself if the photo can't load
- A biography section with four original paragraphs covering her upbringing, her collaboration
  with Charles Babbage, the 1843 Notes, and her early death
- A key-milestones timeline (`<ol>`) styled as a vertical timeline with year markers, from her
  birth in 1815 to the naming of the Ada programming language in her honour in 1980
- A distinctly styled quote block with a real, sourced quote and citation
- Four visually distinct background colours across sections (navy hero, parchment bio, sage
  timeline, navy quote block) — well above the required minimum of 2
- Two font families used intentionally: **Playfair Display** (serif) for headings, names, and
  the quote, and **Source Sans 3** (sans-serif) for body copy and labels
- Fully responsive: the hero portrait and text stack vertically below 640px, and all sections
  reflow cleanly on mobile

## Tech stack

- HTML5 (semantic elements: `<header>`, `<main>`, `<section>`, `<blockquote>`, `<ol>`)
- CSS3 (Flexbox, CSS variables, no framework)
- Inline SVG for the portrait frame, using `<image>`, `<clipPath>`, and a gradient `<rect>`
  fallback background
- A small `script.js` — its only job is to detect a failed `<image>` load and draw a simple
  "AL" monogram directly into the SVG as a fallback

## Attribution

- **Image:** *Ada Lovelace*, watercolor portrait by Alfred Edward Chalon (c. 1840). Public
  domain (the artist died in 1860, and the work is in the public domain in the US and other
  countries with a life-plus-100-years-or-fewer copyright term). Loaded directly from
  Wikimedia Commons:
  `https://upload.wikimedia.org/wikipedia/commons/a/a4/Ada_Lovelace_portrait.jpg`

  Wikimedia stores files at a path derived from the MD5 hash of the filename
  (`/first-hex-char/first-two-hex-chars/filename`). I independently recomputed
  `MD5("Ada_Lovelace_portrait.jpg")` and confirmed it starts with `a4`, matching the `a/a4/`
  segment in this URL — so this is a genuine, correctly-formed link to the real file, not a
  guessed or fabricated path.
- **Quote:** "That brain of mine is something more than merely mortal; as time will show." —
  a documented 1843 quote from Ada Lovelace's correspondence, corroborated across multiple
  biographical sources.
- **Biographical content:** written originally for this project, based on well-established,
  widely corroborated public facts about Ada Lovelace's life and work (not copied from any
  single source).

## How the portrait frame works

```html
<svg class="hero__portrait" viewBox="0 0 220 280" ...>
  <rect x="3" y="3" width="214" height="274" rx="12" fill="url(#cameoBg)" />   <!-- fallback backdrop -->
  <image id="portrait" x="3" y="3" width="214" height="274"
         href="...Ada_Lovelace_portrait.jpg" clip-path="url(#photoClip)"
         preserveAspectRatio="xMidYMid slice" />                              <!-- the real photo -->
  <rect x="3" y="3" width="214" height="274" rx="12" fill="none"
        stroke="#b08d57" stroke-width="5" />                                  <!-- brass border, drawn on top -->
</svg>
```
The navy gradient `<rect>` sits *behind* the `<image>`, so if the photo loads normally you
never see it — but if the photo fails to load, that gradient panel is what shows through
instead of a blank/broken square. `script.js` goes one step further: on the `<image>`'s
`error` event, it removes the broken image node and draws "AL" directly onto the SVG in the
same brass tone as the border, so an offline viewer sees a deliberate monogram rather than
nothing at all.

## How to run

**Extract the ZIP/RAR fully to a normal folder before opening the file — don't open it
straight out of the archive.** If you double-click `index.html` from inside WinRAR (or
Windows' built-in zip viewer) without extracting first, the file gets loaded from a
temporary, single-file folder — you'll usually see a giveaway path like
`...\AppData\Local\Temp\Rar$EX...\` in the address bar. From that state, browsers can throw a
security error along the lines of *"Unsafe attempt to load URL file:///... from frame with
URL file:///..."* — this is an artifact of how the archive tool staged that temporary copy,
not a bug in the page's HTML/CSS/JS.

**Even better than opening the file directly: use a local server**, such as VS Code's **Live
Server** extension (right-click `index.html` → "Open with Live Server") or run `npx serve .`
in the folder. Serving over `http://localhost` sidesteps `file://`-origin quirks entirely and
is the most reliable way to preview and record your demo video.

Steps:
1. Right-click the ZIP/RAR → **Extract All** to a real folder on disk.
2. Open the extracted folder in VS Code and use Live Server (recommended), or simply
   double-click `index.html` from that extracted folder in a normal file browser.
3. No build step or dependencies are required either way.

## How to test

Manual test checklist used during development, plus what I could verify programmatically
without a full browser available in my own environment:

| Scenario | Expected result | Verified |
|---|---|---|
| Inline SVG parses as well-formed XML | No malformed markup | ✅ programmatically confirmed |
| Wikimedia image URL is genuine (not guessed) | MD5 hash of the filename matches the `a/a4/` path segment in the URL | ✅ independently recomputed and confirmed |
| Footer/body text "Built as part of..." | Completely removed from the project | ✅ confirmed absent from every file |
| No inline `onclick`, no `eval()` anywhere in the project | Clean, delegated event handling only | ✅ confirmed via search |
| All HTML container tags balanced | `div`, `section`, `header`, `main`, `ol`, `li`, `blockquote`, `script` all matched | ✅ confirmed programmatically |
| Simulated `<image>` load failure (headless DOM test, `error` event dispatched) | Broken image node removed, "AL" monogram text drawn into the SVG, `aria-label` updated | ✅ confirmed via automated test |
| Actual photo rendering + clip-path corner rounding in a real browser | Photo fills the frame, corners rounded, brass border on top | ⚠️ **please verify yourself** — see note below |

**One honest limitation:** I wasn't able to render the final composited photo-in-frame myself
to visually confirm it in this environment (my local SVG preview tooling can't rasterize
embedded photos at all, regardless of format — a limitation of that specific tool, not of
SVG or of real browsers, which support `<image>` universally and natively). Please do a quick
visual check yourself once the page is open — that's a good idea before recording your demo
regardless.

## Folder contents

```
WebDev-L2-TributePage/
├── index.html
├── style.css
├── script.js
└── README.md
```
