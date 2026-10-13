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
- `src/config/animationConfig.ts`: derived scroll layout (`SCROLL_LAYOUT`), scroll ranges and shared animation configuration.
- `src/utils/gallerySequence.ts`: pure scroll-to-project sequence math shared by the scene and overlay.
- `api/contact.ts`: Vercel serverless function that emails contact-form enquiries via Resend (see Contact form below).
- `src/constants.ts`: canonical project and service content. Project IDs are route IDs.
- `src/index.css`: design tokens, global styling, and shared component classes.
- `src/pages/Work.tsx` and `src/components/work/ProjectCard.tsx`: conventional project index.
- `src/pages/ProjectDetail.tsx`: case-study route at `/work/:id`.
- `src/utils/motionPreferences.ts`: WebGL, reduced-motion, and mobile helpers.
- `src/store/useStore.ts`: controls whether shared navigation/footer/CTA are hidden on the immersive home route.

## Home-page interaction contract

The home page is one `ScrollControls` journey. Its length is **derived**, not hard-coded: `createScrollLayout()` in `src/config/animationConfig.ts` builds `SCROLL_LAYOUT` from `PROJECTS.length`. Measured in pages (1 page = one viewport height):

1. Brand/hero: pages `0–1`
2. Principles: `1–2`
3. Capabilities: `2–3`
4. Selected-work transition ("Proof, not promises."): `3–4`
5. Pinned project stage ("Choose a case study."): starts at `galleryStart` (4) and stays pinned for `pin` pages (one page of scroll per project step plus a short end dwell)
6. Contact CTA: arrives as the released stage scrolls away (`ctaStart`)

Adding or removing a project in `PROJECTS` lengthens or shortens the pinned stage automatically; `ANIMATION_CONFIG.sections.*` ranges are converted from page positions with `at()`.

`Home` owns `activeProjectId`. Both `Scene` and `HtmlOverlay` consume it. Scroll position is the source of truth for which project is focused:

- `getGalleryState(scrollPages)` in `src/utils/gallerySequence.ts` is the single scroll-to-sequence function. Both the 3D scene and the DOM overlay call it with the same damped offset (`scroll.offset * (scroll.pages - 1)`), so they cannot disagree.
- Cards "hold, glide, hold" (`dwellEase`): scrolling is never hijacked, but each project settles before the next one arrives.
- Desktop: DOM column pinned on the left (title, details, numbered buttons); 3D cards ride a vertical track on the right and slide up one at a time. Pointer tilt applies to the focused card only; hover does **not** change the selection; click opens `/work/:id`.
- Mobile: title pinned at top, details panel at the bottom, the card crossfades with a short slide in the band between them. No essential action depends on hover.
- Numbered buttons scroll to that project (they do not just highlight it). They are real buttons with `aria-pressed`; the focused project always has a normal link.
- Reduced motion or unavailable WebGL: render `HtmlOverlay variant="static"`, a DOM version using native `position: sticky` and plain images. Same selection logic, no canvas.

## Important rendering rules

- Keep `Canvas` on `frameloop="demand"`. Any animation that must continue must call `state.invalidate()` only while it is visible or moving.
- Keep device pixel ratio capped for mobile performance. The current effective cap is 1.5 in `Home.tsx`.
- Avoid full-screen postprocessing, dense particles, shadows, and continuous decorative animation unless profiling proves the cost acceptable on mobile.
- Use delta-time damping (`maath/easing` or `THREE.MathUtils.damp`) instead of frame-dependent interpolation.
- Dispose or unmount new geometries, materials, textures, listeners, and timers correctly.
- Keep image delivery transformed through Cloudinary (`f_auto,q_auto,w_1000`) unless a specific view needs another size.
- Treat console errors, infinite `useFrame` invalidation, and idle GPU work as regressions.

## Scroll layer warning: CSS `sticky` does not work inside `<Scroll html>`

Drei renders `<Scroll html>` into an `overflow: hidden` container and moves the whole layer with `translate3d(0, -offset * (pages - 1) * height)` every frame. Nothing in it scrolls natively, so `position: sticky` has no effect. The project stage is pinned by counter-translating it by the pinned distance (`ScrollProjectSpace` in `HtmlOverlay.tsx`). Related rules:

- Inside the scroll variant a page must be `h-full` (= the canvas height Drei scrolls by), never `h-screen`, or mobile browser toolbars make DOM and 3D drift apart. The static variant uses `h-screen` because it lives in normal document flow.
- Native `scrollTop` maps onto the 0..1 offset over `scrollHeight - clientHeight`, which is one page longer than `pages - 1`. To jump to a position, convert through the offset (see `scrollToProject`), never `page * clientHeight`.
- `useFrame`, `useThree` and `useScroll` work inside `<Scroll html>` because Drei forwards R3F's context into that root.

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
- Projects can be added, removed or reordered freely: card positions and the pinned scroll length are derived from the index and `PROJECTS.length` (`getTrackLayout`, `createScrollLayout`).
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

## Contact form

`src/pages/Contact.tsx` POSTs JSON to `/api/contact` (`api/contact.ts`), which sends through Resend to `client@lycanforge.com.ng`; Cloudflare Email Routing forwards that address to the owner's inbox. `Reply-To` is the visitor.

- Server-only env vars (Vercel dashboard): `RESEND_API_KEY` (required), optional `CONTACT_TO`, `CONTACT_FROM`. Never prefix with `VITE_`.
- The sending domain must be verified in Resend (DNS records added in Cloudflare, "DNS only"). Keep the Cloudflare Email Routing MX/SPF records intact.
- `vite dev` does not serve `/api`; test the form with `vercel dev`, or accept the error state locally.
- The form shows success only on an HTTP 200 from the endpoint and shows an error with WhatsApp/email fallbacks otherwise. A hidden `website` honeypot field is silently rejected server-side.
