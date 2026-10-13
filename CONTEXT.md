# LycanForge Current Context

## Latest update (2026-10-13): sticky split "Selected work" + working contact form

- **Selected work redesign.** The project section is now a pinned split-scroll stage. Left: "Choose a case study." plus the focused project's details and numbered buttons (pinned). Right: 3D cards on a vertical track; each scroll step slides the next project up, the details follow whichever is centred, and after the last project the stage releases and "Ready to build?" scrolls in. Mobile stacks the same pieces (title top, card crossfade in the middle, details bottom). Reduced-motion/no-WebGL uses `HtmlOverlay variant="static"` with native sticky and DOM images.
- **How it works.** `SCROLL_LAYOUT` (derived from `PROJECTS.length`) defines the scroll geometry; `getGalleryState()` converts scroll to card progress for both layers; the DOM stage is pinned by counter-translate because CSS sticky cannot work inside Drei's `<Scroll html>` (details in `AGENTS.md`). `Home` no longer passes `onProjectActivate` to `Scene`; scroll drives selection.
- **Contact form.** Previously simulated (`setTimeout` + `console.log`). Now `api/contact.ts` (Vercel function, Resend) emails `client@lycanforge.com.ng`, which Cloudflare routes onward. Needs `RESEND_API_KEY` in Vercel and a verified Resend sending domain.
- **Cleanup in the same change.** Removed the unused `@google/genai` dependency and the `define` that injected `GEMINI_API_KEY` into the client bundle; `vercel.json` rewrite now excludes `/api/`.
- **Verified:** `tsc --noEmit`, `vite build`, sequence-math checks, API handler tests with a mocked Resend, and headless-Chromium scroll tests (desktop 1440x900, mobile 390x844, reduced-motion fallback) with stubbed images. **Not yet verified:** real project images, real devices/touch momentum, a live Resend send.

Last updated: 2026-09-22

This is the active handoff for the current uncommitted rebuild. Read `AGENTS.md` first for durable project rules.

## User's goal

The user wants the landing page to feel like a deliberate journey before visitors reach the work. The project section should feel as though case-study cards are floating in space. On desktop, cursor proximity should gently attract each card's facing direction; hovering highlights it and clicking opens its detail page. Mobile-first behavior is the priority, so selection and navigation cannot depend on hover.

The sole visual inspiration supplied for the rebuild was a clean solar-company landing page: airy sky imagery, pale green and cream blocks, black editorial typography, rounded controls, generous whitespace, and restrained visual hierarchy. The rebuild translates that language rather than copying its content.

## Problems that triggered the rebuild

- The previous landing page did substantial work while idle and appeared to lag.
- Scrolling caused repeated errors associated with the scroll-controlled scene.
- A React Router `<Link>` rendered inside Drei's HTML scroll root threw `useContext(...) is null` and crashed.
- The initial LycanForge text/identity was missing.
- Project cards were visually misaligned and did not convincingly read as objects floating in space.
- The old dark, particle-heavy visual direction did not match the requested minimal design.

The Vite `connected`, `visibility`, and `ping successful` messages shown by the user were development-server diagnostics, not themselves the application failure. The actionable runtime failure was the router-context crash.

## What has been implemented

### Landing journey

`src/components/home3D/HtmlOverlay.tsx` now contains six full-viewport chapters:

1. Hero — “Ideas made useful.”
2. Principles — “Useful long after launch.”
3. Capabilities — “Ambition, made practical.”
4. Work transition — “Proof, not promises.”
5. Project space — “Choose a case study.”
6. CTA — “Ready to build?”

The exact scroll ranges are in `src/config/animationConfig.ts` and documented in `AGENTS.md`.

### Three.js scene

`src/components/canvas/Scene.tsx` was substantially rewritten:

- Removed the star field, sparkles, mesh-distortion emphasis, and postprocessing-heavy presentation.
- Added restrained pale rounded geometry for the brand, principles, and capabilities chapters.
- Added `FloatingProjectGallery` and `FloatingProjectCard` using Drei `Image` and `RoundedBox`.
- Desktop cards form a loose five-card constellation based on viewport dimensions.
- Each card projects its world position into normalized screen space, measures pointer distance, and derives a proximity strength.
- Proximity drives damped pitch/yaw/roll and a small forward movement.
- Every card has an independent subtle vertical float.
- Active cards scale slightly and use brighter image/surface treatment.
- Hover activates the corresponding project; clicking invokes `onProjectOpen`.
- Mobile cards form a centered depth deck keyed to `activeProjectId`, with no pointer-tilt dependency.
- Event guards prevent canvas clicks from stealing clicks intended for overlaid anchors or buttons.
- The gallery invalidates the demand render loop only while visible/fading.
- The camera has restrained desktop parallax outside the gallery and settles centrally in the gallery.

`maath` was added explicitly to `package.json` for smooth delta-time damping.

### Shared project state and routing

`src/pages/Home.tsx` now owns `activeProjectId`, passes activation to both visual layers, and creates `openProject` with `useNavigate`. Canvas card clicks navigate to `/work/:id` through that callback.

Inside `HtmlOverlay`, links intentionally use normal `<a>` tags. A Router `<Link>` in this Drei-created HTML root caused the null-context crash and must not be reintroduced casually.

The project-space overlay includes:

- Active project number, title, and one-line description.
- A direct case-study link.
- Numbered accessible project buttons on larger screens.
- Previous/next controls on small screens.

### Performance and fallback behavior

- Canvas uses `frameloop="demand"`.
- DPR is capped at 1.5 at the Canvas boundary.
- Canvas alpha is enabled over a CSS sky-to-sage background.
- WebGL support is checked before mounting the scene.
- `prefers-reduced-motion` receives a complete static DOM version of the journey.
- Motion/mobile hooks initialize from the current browser state to reduce first-render mismatch.
- Project Cloudinary URLs request automatic format and quality at width 1000.

### Visual system and conventional pages

`src/index.css` was replaced with the light design system described in `AGENTS.md`. The work listing, project cards, project details, navigation, footer, services, about, contact, and legacy home components were adjusted to use the same light editorial language.

`src/pages/ProjectDetail.tsx` now presents:

- A large image-first header.
- Project title, summary, metadata, and stack.
- Separate problem and response panels.

`src/components/work/ProjectCard.tsx` is now an image-first cream editorial card and uses React Router's `Link`, which is safe in the normal application root.

## Current route map

- `/` — immersive landing journey
- `/work` — project index
- `/work/:id` — project detail
- `/services`
- `/about`
- `/contact`

The global `NavBar`, `Footer`, and `FloatingCTA` are hidden while `useStore().isHome` is true. `Home` sets this flag on mount and restores it on unmount.

## Files currently modified

The rebuild is not committed. At the time of this handoff, these pre-existing implementation changes are in the working tree:

- `package.json`
- `package-lock.json`
- `src/App.tsx`
- `src/components/canvas/Scene.tsx`
- `src/components/home/CTASection.tsx`
- `src/components/home/Hero.tsx`
- `src/components/home/ServiceRow.tsx`
- `src/components/home3D/HtmlOverlay.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/NavBar.tsx`
- `src/components/ui/SectionHeader.tsx`
- `src/components/work/ProjectCard.tsx`
- `src/config/animationConfig.ts`
- `src/constants.ts`
- `src/index.css`
- `src/pages/About.tsx`
- `src/pages/Contact.tsx`
- `src/pages/Home.tsx`
- `src/pages/ProjectDetail.tsx`
- `src/pages/Services.tsx`
- `src/pages/Work.tsx`
- `src/utils/motionPreferences.ts`

`AGENTS.md` and `CONTEXT.md` are newly added by this handoff. Preserve all of these changes unless the user explicitly requests a redesign or rollback.

The last three commits before this uncommitted rebuild were:

- `8399141` — merge from `main`
- `af7900a` — improve canvas gallery visibility and positioning
- `041d9a6` — refine gallery grid layout and lighting

Those commits represent the older gallery direction; the working tree supersedes much of their scene implementation.

## Verification already completed

- `npx tsc --noEmit --pretty false` passed.
- `npm run build` passed after the rebuild.
- The production build transformed 1022 modules.
- Final generated JS was approximately 1.376 MB, approximately 397 KB gzip.
- `git diff --check` passed after removing one trailing-space defect.
- The build emitted a chunk-size warning above 500 KB; it was a warning, not a failure.
- `npm install --package-lock-only --ignore-scripts` completed after adding `maath`.

The package audit reported 11 vulnerabilities (1 low, 5 moderate, 5 high). No force-fix was run because automatic major-version changes could break the app.

## Work still recommended

The next agent should begin with visual/runtime QA rather than another broad rewrite:

1. Run the dev server and test at approximately 360×800, 390×844, tablet, and desktop sizes.
2. Confirm the brand text is visible immediately and all six chapters align with their 3D elements.
3. Leave the page idle in the hero and gallery chapters and inspect CPU/GPU usage and repeated console errors.
4. Verify wheel, trackpad, touch scroll, keyboard focus, numbered selection, mobile previous/next, canvas click, and browser back navigation.
5. Tune project constellation spacing only after observing screenshots at real viewport sizes.
6. Check texture-loading behavior on a throttled mobile connection.
7. Consider route-level code splitting and/or a more focused Three.js bundle if mobile transfer size is unacceptable.
8. Add an error boundary around the home experience if runtime recovery is desired.
9. Decide whether to address dependency audit findings through deliberate package upgrades.

No automated browser or screenshot comparison was available during this implementation, so final visual polish is the largest remaining uncertainty.

## Likely tuning points

- Desktop card positions: `getGalleryLayout()` in `Scene.tsx`.
- Mobile card spacing/depth: the mobile branch of `getGalleryLayout()`.
- Card dimensions: `getProjectDimensions()`.
- Proximity radius and tilt: `distance`, `proximity`, `dampE`, and target positions in `FloatingProjectCard`.
- Gallery fade timing: `FloatingProjectGallery` enter/exit calculations.
- Section pacing: `ANIMATION_CONFIG.sections`.
- Scroll feel: `ANIMATION_CONFIG.scroll.damping` and `distance`.
- Palette and shared controls: `src/index.css` theme variables and component classes.

When tuning, change one behavior at a time and re-test mobile first. The intended motion is subtle attraction, not dramatic card spinning.

## Known cleanup opportunities

- `animationConfig.ts` still contains legacy particle and lighting configuration that the rebuilt scene does not consume. It can be removed after confirming no other component imports it.
- The repository `README.md` still describes the original AI Studio starter and mentions a Gemini API key. It does not currently document the portfolio architecture.
- The project name in `package.json` is still `react-example`.
- Route components are eagerly imported, contributing to bundle size.
- There is no automated testing or visual-regression setup.

These are follow-up opportunities, not reasons to undo the working interaction.

