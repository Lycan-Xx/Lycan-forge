import { PROJECTS } from '../../constants';

interface HtmlOverlayProps {
  activeProjectId: string;
  onProjectActivate: (projectId: string) => void;
}

export default function HtmlOverlay({ activeProjectId, onProjectActivate }: HtmlOverlayProps) {
  const activeIndex = Math.max(0, PROJECTS.findIndex((project) => project.id === activeProjectId));
  const activeProject = PROJECTS[activeIndex];
  const selectPrevious = () => onProjectActivate(PROJECTS[(activeIndex - 1 + PROJECTS.length) % PROJECTS.length].id);
  const selectNext = () => onProjectActivate(PROJECTS[(activeIndex + 1) % PROJECTS.length].id);

  return (
    <main className="w-full text-text-primary" aria-label="LycanForge introduction">
      <section className="relative flex h-screen w-full flex-col px-5 py-6 md:px-10 md:py-8" aria-labelledby="brand-title">
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

      <section className="flex h-screen w-full items-end px-5 pb-12 md:items-center md:px-10 md:pb-0" aria-labelledby="values-title">
        <article className="editorial-panel pointer-events-none w-full max-w-xl p-6 md:p-9">
          <p className="eyebrow mb-5">01 · Principles</p>
          <h2 id="values-title" className="text-4xl leading-[0.95] md:text-6xl">Useful long after launch.</h2>
          <p className="mt-6 max-w-lg leading-relaxed text-text-secondary">
            Clear thinking, honest collaboration, and careful engineering. We build products around real people and real operating conditions.
          </p>
        </article>
      </section>

      <section className="flex h-screen w-full items-end justify-end px-5 pb-12 md:items-center md:px-10 md:pb-0" aria-labelledby="services-title">
        <article className="editorial-panel pointer-events-none w-full max-w-xl p-6 md:p-9">
          <p className="eyebrow mb-5">02 · Capabilities</p>
          <h2 id="services-title" className="text-4xl leading-[0.95] md:text-6xl">Ambition, made practical.</h2>
          <p className="mt-6 leading-relaxed text-text-secondary">
            Modern web applications, business automation, AI-assisted workflows, and immersive storytelling—from first brief to reliable deployment.
          </p>
        </article>
      </section>

      <section className="flex h-screen w-full items-center justify-center px-5" aria-labelledby="archive-title">
        <div className="pointer-events-none max-w-2xl text-center">
          <p className="eyebrow mb-5">03 · Selected work</p>
          <h2 id="archive-title" className="text-5xl leading-[0.92] md:text-7xl">Proof, not promises.</h2>
          <p className="mx-auto mt-6 max-w-lg leading-relaxed text-text-secondary">
            A selection of products shaped around concrete problems, thoughtful decisions, and outcomes that matter.
          </p>
        </div>
      </section>

      <section className="flex h-screen w-full flex-col justify-between px-5 py-7 md:px-10 md:py-9" aria-labelledby="gallery-title">
        <div className="pointer-events-none">
          <p className="eyebrow mb-3">04 · Project space</p>
          <h2 id="gallery-title" className="text-4xl leading-none md:text-6xl">Choose a case study.</h2>
        </div>

        <article className="editorial-panel pointer-events-auto mx-auto w-full max-w-2xl p-4 md:p-5">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="eyebrow mb-2">{String(activeIndex + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}</p>
              <a href={`/work/${activeProject.id}`} className="block truncate text-xl font-medium hover:opacity-60 md:text-2xl">
                {activeProject.name}
              </a>
              <p className="mt-1 truncate text-sm text-text-secondary">{activeProject.oneLiner}</p>
            </div>
            <a href={`/work/${activeProject.id}`} className="cta-pill shrink-0 text-sm" aria-label={`Open ${activeProject.name} case study`}>
              Open <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-bg-border pt-4">
            <div className="flex gap-2" aria-label="Select project">
              {PROJECTS.map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => onProjectActivate(project.id)}
                  onFocus={() => onProjectActivate(project.id)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs transition-colors ${project.id === activeProjectId ? 'border-accent bg-accent text-bg-surface' : 'border-bg-border bg-bg-raised text-text-secondary hover:border-text-primary/30'}`}
                  aria-label={`Highlight ${project.name}`}
                  aria-pressed={project.id === activeProjectId}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="flex gap-2 md:hidden">
              <button type="button" onClick={selectPrevious} className="flex h-10 w-10 items-center justify-center rounded-full border border-bg-border" aria-label="Previous project">←</button>
              <button type="button" onClick={selectNext} className="flex h-10 w-10 items-center justify-center rounded-full border border-bg-border" aria-label="Next project">→</button>
            </div>
          </div>
        </article>
      </section>

      <section className="flex h-screen w-full items-center justify-center px-5" aria-labelledby="cta-title">
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
