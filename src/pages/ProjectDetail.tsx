import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { PROJECTS } from '../constants';

export default function ProjectDetail() {
  const { id } = useParams();
  const project = PROJECTS.find((item) => item.id === id);

  if (!project) return <Navigate to="/work" replace />;

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-bg-base pb-24 pt-28 md:pb-32 md:pt-32">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <div className="mb-5 flex items-center justify-between gap-4 text-sm">
          <Link to="/work" className="rounded-full border border-text-primary/25 px-4 py-2 transition-colors hover:bg-bg-surface">← All work</Link>
          <p className="eyebrow hidden sm:block">Case study · {project.name}</p>
        </div>

        <figure className="h-[44vh] min-h-[340px] overflow-hidden rounded-[24px] border border-bg-border bg-bg-raised md:h-[62vh]">
          <img src={project.image} alt={`${project.name} product interface`} className="h-full w-full object-cover" />
        </figure>

        <section className="grid gap-8 py-10 md:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)] md:gap-14 md:py-16">
          <div>
            <p className="eyebrow mb-5">{project.tags.slice(0, 3).join(' · ')}</p>
            <h1 className="max-w-4xl text-5xl leading-[0.9] md:text-8xl">{project.name}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">{project.oneLiner}</p>
          </div>

          <aside className="editorial-panel self-start p-5 md:p-6">
            <p className="eyebrow mb-4">Project stack</p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((technology) => (
                <span key={technology} className="rounded-full border border-bg-border bg-bg-raised px-3 py-2 text-xs text-text-secondary">{technology}</span>
              ))}
            </div>
            <Link to="/contact" className="cta-pill mt-6 flex w-full items-center justify-between">
              Build something similar <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        </section>

        <section className="grid gap-4 border-t border-bg-border pt-8 md:grid-cols-2 md:gap-6 md:pt-12">
          <article className="rounded-[24px] bg-bg-surface/75 p-6 md:p-9">
            <p className="eyebrow mb-5">The problem</p>
            <h2 className="mb-5 text-3xl">What needed to change.</h2>
            <p className="leading-relaxed text-text-secondary">{project.problem}</p>
          </article>
          <article className="rounded-[24px] bg-bg-raised p-6 md:p-9">
            <p className="eyebrow mb-5">The response</p>
            <h2 className="mb-5 text-3xl">What we built.</h2>
            <p className="leading-relaxed text-text-secondary">{project.solution}</p>
          </article>
        </section>
      </div>
    </motion.main>
  );
}
