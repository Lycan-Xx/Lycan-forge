# LycanForge Agent Guide

This file is the durable working contract for AI coding agents in this repository. Read `CONTEXT.md` immediately after this file for the current implementation handoff and unfinished work.

## Product direction

LycanForge is a portfolio and agency site whose home page is an immersive, scroll-driven Three.js journey. The experience must introduce the studio and its principles before revealing the project gallery. The visual language is deliberately minimal and editorial: pale sky, muted sage, warm cream, dark ink, and dark-plum controls.

The project has one overriding interface priority: **mobile first**. Desktop effects are enhancements. A phone user must still be able to read every section, select every project, open every case study, and navigate without relying on hover or precise pointer input.

## Stack

- React 19 and TypeScript
- Vite 6
- Tailwind CSS 4 through `@tailwindcss/vite`
- React Router 7
- React Three Fiber and Drei
- Three.js
- `maath/easing` for damped 3D motion
- Motion for DOM transitions
- Zustand for the small global layout state

Use the installed packages before adding another dependency. Do not replace React Three Fiber with imperative Three.js unless there is a measured reason.

## Commands

```sh
npm install
npm run dev
npm run lint
npm run build
```

`npm run lint` currently runs `tsc --noEmit`. There is no unit or browser-test suite yet. After a UI change, run both `npm run lint` and `npm run build`; manually test the home page at phone and desktop widths when browser access is available.

## Architecture map

- `src/App.tsx`: router and shared non-home chrome.
- `src/pages/Home.tsx`: owns WebGL detection, reduced-motion fallback, canvas setup, project selection, and route navigation from the canvas.
- `src/components/canvas/Scene.tsx`: all R3F scene objects and per-frame behavior.
- `src/components/home3D/HtmlOverlay.tsx`: accessible DOM content laid over the scroll-controlled canvas.
- `src/config/animationConfig.ts`: scroll ranges and shared animation configuration.
- `src/constants.ts`: canonical project and service content. Project IDs are route IDs.
- `src/index.css`: design tokens, global styling, and shared component classes.
- `src/pages/Work.tsx` and `src/components/work/ProjectCard.tsx`: conventional project index.
- `src/pages/ProjectDetail.tsx`: case-study route at `/work/:id`.
- `src/utils/motionPreferences.ts`: WebGL, reduced-motion, and mobile helpers.
- `src/store/useStore.ts`: controls whether shared navigation/footer/CTA are hidden on the immersive home route.

## Home-page interaction contract

The home page uses six `ScrollControls` pages. Keep the DOM sections and the scene ranges synchronized:

1. Brand/hero: `0.00–0.16`
2. Principles: `0.16–0.34`
3. Capabilities: `0.34–0.52`
4. Selected-work transition: `0.52–0.66`
5. Interactive project gallery: `0.66–0.90`
6. Contact CTA: `0.90–1.00`

`Home` owns `activeProjectId`. Both `Scene` and `HtmlOverlay` consume it. A project selection in either layer must update the other layer. The interaction rules are:

- Desktop: card proximity creates restrained tilt and forward movement; hover activates a card; click opens `/work/:id`.
- Mobile: the active card is centered in a horizontal spatial deck; visible previous/next controls change the active card; no essential action depends on hover.
- Keyboard: numbered project controls are real buttons, expose `aria-pressed`, activate on focus, and each selected project has a normal link.
- Reduced motion or unavailable WebGL: render `HtmlOverlay` as a static DOM journey instead of mounting the canvas.

## Important rendering rules

- Keep `Canvas` on `frameloop="demand"`. Any animation that must continue must call `state.invalidate()` only while it is visible or moving.
- Keep device pixel ratio capped for mobile performance. The current effective cap is 1.5 in `Home.tsx`.
- Avoid full-screen postprocessing, dense particles, shadows, and continuous decorative animation unless profiling proves the cost acceptable on mobile.
- Use delta-time damping (`maath/easing` or `THREE.MathUtils.damp`) instead of frame-dependent interpolation.
- Dispose or unmount new geometries, materials, textures, listeners, and timers correctly.
- Keep image delivery transformed through Cloudinary (`f_auto,q_auto,w_1000`) unless a specific view needs another size.
- Treat console errors, infinite `useFrame` invalidation, and idle GPU work as regressions.

## Router boundary warning

Drei's `<Scroll html>` content can be rendered through a separate React root. In this project, React Router's `<Link>` inside `HtmlOverlay` previously crashed because router context was `null`. Therefore:

- Keep normal `<a href="...">` elements inside `HtmlOverlay`, or prove router context is available before changing them.
- Canvas project clicks must call the `navigate` callback created in `Home.tsx` and passed into `Scene` as `onProjectOpen`.
- React Router `<Link>` remains appropriate in ordinary application pages such as `Work`.

## Design system

The current palette lives in `src/index.css`:

- Base sage: `#c7ddb0`
- Surface cream: `#f3f1dd`
- Raised neutral: `#e8e9d1`
- Pale sky: `#dceaf4`
- Primary ink: `#11140f`
- Accent plum: `#22112e`

The intended qualities are clean, calm, practical, image-led, and lightly tactile. Favor large editorial type, rounded cream panels, thin quiet borders, compact eyebrow labels, generous spacing, and restrained motion. Avoid neon sci-fi styling, glass-heavy interfaces, star fields, excessive gradients, and visual noise.

Reuse `.editorial-panel`, `.eyebrow`, `.cta-pill`, and `.ghost-pill` before introducing new equivalents. Maintain at least 44px touch targets on mobile.

## Data and routing invariants

- `PROJECTS` in `src/constants.ts` is the single source of truth for the 3D gallery, work listing, and detail pages.
- Every project must have a unique stable `id`; its detail URL is `/work/<id>`.
- Do not reorder or add projects without checking both desktop constellation positions and the mobile active-index deck.
- If project count becomes dynamic, replace the desktop hard-coded five-position layout in `getGalleryLayout`.
- Unknown project IDs currently fall back through `ProjectDetail`; preserve or improve that behavior deliberately.

## Accessibility and resilience

- Preserve semantic headings and `aria-labelledby` relationships in each full-screen section.
- All functionality must be available without WebGL, hover, or animation.
- Respect `prefers-reduced-motion`.
- Keep focus-visible treatments and adequate color contrast.
- Do not hide meaningful project text inside the canvas; DOM content is the accessible source.
- Verify page navigation resets scroll and that global navigation is restored after leaving `/`.

## Change discipline

- The working tree may contain uncommitted user work. Inspect `git status` and relevant diffs before editing; never discard unrelated changes.
- Keep animation numbers centralized in `animationConfig.ts` where practical.
- Prefer focused components and derive UI from `PROJECTS`/`SERVICES` rather than duplicating content.
- Do not mass-format the repository or change line endings as part of an unrelated task.
- Update `CONTEXT.md` after material architectural, visual, performance, or interaction changes so the next agent receives an accurate handoff.

