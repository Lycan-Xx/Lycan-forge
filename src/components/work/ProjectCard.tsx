import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface Project {
  id: string;
  name: string;
  tags: string[];
  oneLiner: string;
  image: string;
  gridSpan: string;
  height: string;
  textForward?: boolean;
}

export default function ProjectCard({ project }: { project: Project }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className={`${project.gridSpan} editorial-panel group overflow-hidden p-2`}
    >
      <Link to={`/work/${project.id}`} className="block rounded-[18px] focus:outline-none" aria-label={`View ${project.name} case study`}>
        <div className={`relative overflow-hidden rounded-[18px] bg-bg-raised ${project.height.includes('360') ? 'h-[280px] md:h-[360px]' : 'h-[300px] md:h-[420px]'}`}>
          {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-bg-raised to-bg-surface" />}
          <img
            src={project.image}
            alt=""
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.025] ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        <div className="flex items-start justify-between gap-5 px-3 pb-3 pt-4 md:px-4 md:pb-4">
          <div>
            <p className="eyebrow mb-2">{project.tags.slice(0, 2).join(' · ')}</p>
            <h2 className="text-2xl leading-tight">{project.name}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">{project.oneLiner}</p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-bg-border bg-bg-raised transition-transform group-hover:-translate-y-1" aria-hidden="true">↗</span>
        </div>
      </Link>
    </motion.article>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const order = ['studywise', 'abkhd', 'jalolink', 'kugal-jobs', 'resumeforge'];
  const ordered = order.map((id) => projects.find((project) => project.id === id)).filter(Boolean) as Project[];

  return (
    <div className="grid grid-cols-12 gap-6">
      {ordered.map((project) => <ProjectCard key={project.id} project={project} />)}
    </div>
  );
}
