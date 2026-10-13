import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { PROJECTS } from '../../constants';
import { SCROLL_LAYOUT } from '../../config/animationConfig';
import { getGalleryState } from '../../utils/gallerySequence';

interface HtmlOverlayProps {
  /**
   * 'scroll': rendered inside Drei's <Scroll html> (a transformed layer, so CSS sticky
   *           cannot work; the project stage is pinned by counter-translating it).
   * 'static': rendered in normal document flow (no WebGL / reduced motion), where
   *           native `position: sticky` works.
   */
  variant: 'scroll' | 'static';
  activeProjectId: string;
  onProjectActivate: (projectId: string) => void;
}

const clamp01 = (value: number) => Math.max(0, Math.min(value, 1));

/* -------------------------------------------------------------------------- */
/* Shared presentational pieces                                               */
/* -------------------------------------------------------------------------- */

function ProjectHeading() {
  return (
    <div className="pointer-events-none">
      <p className="eyebrow mb-3">04 · Project space</p>
      <h2 id="gallery-title" className="text-4xl leading-none md:text-6xl">Choose a case study.</h2>
    </div>
  );
}

function ProjectDetails({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const project = PROJECTS[activeIndex];

  return (
    <article className="editorial-panel pointer-events-auto w-full max-w-2xl p-5 max-md:bg-bg-surface md:max-w-[480px] md:p-7">
      {/* Keyed so the details re-animate each time the focused project changes. */}
      <div key={project.id} className="detail-swap">
        <p className="eyebrow mb-3">
          {String(activeIndex + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
        </p>
        <h3 className="text-3xl leading-[0.95] md:text-5xl">{project.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary md:text-base">{project.oneLiner}</p>
        <p className="mt-4 hidden min-h-[6.5rem] text-sm leading-relaxed text-text-secondary md:block">{project.description}</p>
        <ul className="mt-4 hidden flex-wrap gap-2 md:flex" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-bg-border px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-text-muted">
              {tag}
            </li>
          ))}
        </ul>
        <a
          href={`/work/${project.id}`}
          className="cta-pill mt-5 inline-flex items-center gap-2 text-sm"
          aria-label={`Open ${project.name} case study`}
        >
          Open case study <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-bg-border pt-4" role="group" aria-label="Select project">
        {PROJECTS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(index)}
            className={`flex h-11 w-11 items-center justify-center rounded-full border text-xs transition-colors ${
              index === activeIndex
                ? 'border-accent bg-accent text-bg-surface'
                : 'border-bg-border bg-bg-raised text-text-secondary hover:border-text-primary/30'
            }`}
            aria-label={`Show ${item.name}`}
            aria-pressed={index === activeIndex}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Project stage: scroll variant (pinned by counter-translate)                */
/* -------------------------------------------------------------------------- */

function ScrollProjectSpace({
  activeProjectId,
  onProjectActivate,
}: Pick<HtmlOverlayProps, 'activeProjectId' | 'onProjectActivate'>) {
  const scroll = useScroll();
  const stageRef = useRef<HTMLDivElement>(null);
  const lastIndex = useRef(0);
  const activeIndex = Math.max(0, PROJECTS.findIndex((project) => project.id === activeProjectId));

  useFrame((state) => {
    const stage = stageRef.current;
    if (!stage) return;

    // Same damped offset Drei uses to move this whole layer, converted to pages.
    const scrollPages = scroll.offset * (scroll.pages - 1);
    const gallery = getGalleryState(scrollPages);

    // The layer is translating upward by `scrollPages`; pushing the stage down by the
    // pinned amount cancels that out, so it appears fixed until the pin releases.
    stage.style.transform = `translate3d(0, ${gallery.pinned * state.size.height}px, 0)`;

    // Whichever project is centred drives the shared selection state.
    if (gallery.index !== lastIndex.current) {
      lastIndex.current = gallery.index;
      onProjectActivate(PROJECTS[gallery.index].id);
    }
  });

  const scrollToProject = (index: number) => {
    // Drei maps native scrollTop onto the 0..1 offset over (scrollHeight - clientHeight),
    // so jump targets go through the offset rather than raw page multiples.
    const el = scroll.el;
    const targetOffset = (SCROLL_LAYOUT.galleryStart + index) / (scroll.pages - 1);
    el.scrollTo({ top: targetOffset * (el.scrollHeight - el.clientHeight), behavior: 'smooth' });
  };

  return (
    <section
      className="relative w-full"
      style={{ height: `${SCROLL_LAYOUT.sectionPages * 100}%` }}
      aria-labelledby="gallery-title"
    >
      <div
        ref={stageRef}
        className="absolute inset-x-0 top-0 flex flex-col justify-between px-5 py-7 will-change-transform md:px-10 md:py-10"
        style={{ height: `${100 / SCROLL_LAYOUT.sectionPages}%` }}
      >
        <ProjectHeading />
        <div className="flex justify-center md:justify-start">
          <ProjectDetails activeIndex={activeIndex} onSelect={scrollToProject} />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Project stage: static variant (native sticky, DOM images)                  */
/* -------------------------------------------------------------------------- */

function StaticProjectSpace({
  activeProjectId,
  onProjectActivate,
}: Pick<HtmlOverlayProps, 'activeProjectId' | 'onProjectActivate'>) {
  const sectionRef = useRef<HTMLElement>(null);
  const lastIndex = useRef(0);
  const activeIndex = Math.max(0, PROJECTS.findIndex((project) => project.id === activeProjectId));
  const project = PROJECTS[activeIndex];

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(rect.height - window.innerHeight, 1);
      const index = Math.round(clamp01(-rect.top / travel) * (PROJECTS.length - 1));
      if (index !== lastIndex.current) {
        lastIndex.current = index;
        onProjectActivate(PROJECTS[index].id);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [onProjectActivate]);

  const scrollToProject = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: window.scrollY + section.getBoundingClientRect().top + index * window.innerHeight,
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: `${PROJECTS.length * 100}vh` }}
      aria-labelledby="gallery-title"
    >
      <div className="sticky top-0 flex h-screen flex-col px-5 py-7 md:px-10 md:py-10">
        <ProjectHeading />
        <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 md:grid md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-end md:gap-10">
          <a
            href={`/work/${project.id}`}
            className="order-1 block min-h-[160px] flex-1 overflow-hidden rounded-[24px] border border-bg-border bg-bg-raised md:order-2 md:h-full md:max-h-[70vh] md:flex-none"
            aria-label={`Open ${project.name} case study`}
          >
            <img src={project.image} alt={`${project.name} preview`} className="h-full w-full object-cover" loading="lazy" />
          </a>
          <div className="order-2 flex justify-center md:order-1 md:justify-start">
            <ProjectDetails activeIndex={activeIndex} onSelect={scrollToProject} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function HtmlOverlay({ variant, activeProjectId, onProjectActivate }: HtmlOverlayProps) {
  // Inside <Scroll html> a "page" must equal the canvas height Drei scrolls by (not 100vh,
  // which differs from the visual viewport on mobile browsers with collapsing toolbars).
  const page = variant === 'scroll' ? 'h-full' : 'h-screen';

  return (
    <main className={`w-full text-text-primary ${variant === 'scroll' ? 'h-full' : ''}`} aria-label="LycanForge introduction">
      <section className={`relative flex ${page} w-full flex-col px-5 py-6 md:px-10 md:py-8`} aria-labelledby="brand-title">
        <header className="pointer-events-auto flex items-center justify-between text-xs font-medium">
          <a href="/" className="font-display text-xl font-medium tracking-tight">Lycan<span className="text-accent">Forge</span></a>
          <nav aria-label="Landing navigation" className="hidden items-center gap-6 md:flex">
            <a href="/about" className="hover:opacity-60">About</a>
            <a href="/work" className="hover:opacity-60">Work</a>
            <a href="/services" className="hover:opacity-60">Services</a>
            <a href="/contact" className="rounded-full border border-text-primary/30 px-4 py-2 hover:bg-bg-surface/60">Start a project</a>
          </nav>
        </header>

        <div className="pointer-events-none mt-auto max-w-[760px] pb-16 md:pb-12">
          <p className="eyebrow mb-5">Digital products · automation · immersive web</p>
          <h1 id="brand-title" className="text-[clamp(3.1rem,9vw,7.8rem)] leading-[0.88]">
            Ideas made useful.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
            LycanForge designs and engineers clear, dependable digital systems for organisations ready to move forward.
          </p>
        </div>

        <div className="pointer-events-none absolute bottom-7 right-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-text-muted md:right-10">
          <span>Scroll to explore</span><span aria-hidden="true">↓</span>
        </div>
      </section>

      <section className={`flex ${page} w-full items-end px-5 pb-12 md:items-center md:px-10 md:pb-0`} aria-labelledby="values-title">
        <article className="editorial-panel pointer-events-none w-full max-w-xl p-6 md:p-9">
          <p className="eyebrow mb-5">01 · Principles</p>
          <h2 id="values-title" className="text-4xl leading-[0.95] md:text-6xl">Useful long after launch.</h2>
          <p className="mt-6 max-w-lg leading-relaxed text-text-secondary">
            Clear thinking, honest collaboration, and careful engineering. We build products around real people and real operating conditions.
          </p>
        </article>
      </section>

      <section className={`flex ${page} w-full items-end justify-end px-5 pb-12 md:items-center md:px-10 md:pb-0`} aria-labelledby="services-title">
        <article className="editorial-panel pointer-events-none w-full max-w-xl p-6 md:p-9">
          <p className="eyebrow mb-5">02 · Capabilities</p>
          <h2 id="services-title" className="text-4xl leading-[0.95] md:text-6xl">Ambition, made practical.</h2>
          <p className="mt-6 leading-relaxed text-text-secondary">
            Modern web applications, business automation, AI-assisted workflows, and immersive storytelling—from first brief to reliable deployment.
          </p>
        </article>
      </section>

      <section className={`flex ${page} w-full items-center justify-center px-5`} aria-labelledby="archive-title">
        <div className="pointer-events-none max-w-2xl text-center">
          <p className="eyebrow mb-5">03 · Selected work</p>
          <h2 id="archive-title" className="text-5xl leading-[0.92] md:text-7xl">Proof, not promises.</h2>
          <p className="mx-auto mt-6 max-w-lg leading-relaxed text-text-secondary">
            A selection of products shaped around concrete problems, thoughtful decisions, and outcomes that matter.
          </p>
        </div>
      </section>

      {variant === 'scroll' ? (
        <ScrollProjectSpace activeProjectId={activeProjectId} onProjectActivate={onProjectActivate} />
      ) : (
        <StaticProjectSpace activeProjectId={activeProjectId} onProjectActivate={onProjectActivate} />
      )}

      <section className={`flex ${page} w-full items-center justify-center px-5`} aria-labelledby="cta-title">
        <article className="editorial-panel pointer-events-auto w-full max-w-4xl p-7 text-center md:p-14">
          <p className="eyebrow mb-5">05 · Start something useful</p>
          <h2 id="cta-title" className="text-5xl leading-[0.92] md:text-7xl">Ready to build?</h2>
          <p className="mx-auto mt-6 max-w-lg text-text-secondary">Tell us what needs to work better. We will help shape the clearest route from idea to dependable software.</p>
          <a href="/contact" className="cta-pill mt-8 inline-flex items-center gap-3">Start a project <span aria-hidden="true">↗</span></a>
        </article>
      </section>
    </main>
  );
}
