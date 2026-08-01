import { useState } from 'react';
import { Icon } from '@iconify/react';

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

/**
 * ProjectCard — homepage teaser variant
 *
 * Fixes vs. the original inline JSX:
 * 1. Mobile always shows name + top tag (no hover needed on touch devices)
 * 2. `textForward` projects (currently just kugal-jobs) render info as a
 *    persistent bottom bar instead of hover-only — respects the flag that
 *    was already in the data but never consumed
 * 3. Skeleton placeholder while the image loads, so the bento grid doesn't
 *    show blank/white tiles while WebGL + images are both initializing
 */
export default function ProjectCard({ project }: { project: Project }) {
  const [loaded, setLoaded] = useState(false);
  const primaryTag = project.tags[0];

  return (
    <div
      className={`${project.gridSpan} ${project.height} rounded-lg overflow-hidden group cursor-pointer pointer-events-auto relative bg-bg-raised`}
      role="article"
      tabIndex={0}
    >
      {/* Skeleton — visible until image reports loaded */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-bg-raised to-bg-surface animate-pulse" />
      )}

      <img
        src={project.image}
        alt={project.name}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-focus:scale-105 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* textForward cards: info bar always visible (any breakpoint) */}
      {project.textForward ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end">
          <h3 className="text-2xl font-display font-medium text-white mb-2">{project.name}</h3>
          <p className="text-text-secondary text-sm mb-3">{project.oneLiner}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Mobile: persistent minimal bar (name + primary tag only) */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4 flex items-center justify-between md:hidden">
            <span className="text-base font-display font-medium text-white">{project.name}</span>
            <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-1 rounded">
              {primaryTag}
            </span>
          </div>

          {/* Desktop: full hover reveal, unchanged from original behavior */}
          <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 flex-col justify-end p-6">
            <h3 className="text-2xl font-display font-medium text-white mb-2">{project.name}</h3>
            <p className="text-text-secondary text-sm mb-4">{project.oneLiner}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Drop-in replacement for the grid block inside HtmlOverlay.tsx's
 * "Section 3: Portfolio Teaser". Uses all 5 projects, fills every
 * row's 12 columns exactly, and closes on the full-width open-source
 * project as a strong final beat:
 *
 * Row 1: studywise (7) + abkhd (5)       = 12
 * Row 2: jalolink (7)  + kugal-jobs (5)  = 12
 * Row 3: resumeforge (12)                = 12
 */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const order = ['studywise', 'abkhd', 'jalolink', 'kugal-jobs', 'resumeforge'];
  const ordered = order
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean) as Project[];

  return (
    <div className="grid grid-cols-12 gap-6 mb-12">
      {ordered.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}