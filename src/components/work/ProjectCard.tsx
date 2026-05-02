import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    tags: string[];
    oneLiner: string;
    gridSpan: string;
    height: string;
    textForward?: boolean;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative bg-bg-surface border border-bg-border rounded-[20px] overflow-hidden transition-all duration-300 hover:bg-bg-raised hover:-translate-y-1 hover:shadow-[0_16px_48px_var(--color-accent-glow)]",
        project.gridSpan,
        project.height
      )}
    >
      {/* Accent Line Hover */}
      <div className="absolute top-0 left-0 w-0 h-[3px] bg-accent transition-all duration-300 group-hover:w-full" />

      <Link to={`/work/${project.id}`} className="flex flex-col h-full p-8">
        {!project.textForward && (
          <div className="flex-grow mb-6 relative overflow-hidden rounded-xl bg-bg-border/30 border border-bg-border/50">
             {/* Placeholder for screenshot */}
             <div className="absolute inset-0 flex items-center justify-center text-text-muted font-mono text-[10px]">
               [ SCREENSHOT: {project.name} ]
             </div>
          </div>
        )}

        <div className="mt-auto space-y-3">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {project.tags.map(tag => (
              <span key={tag} className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
          
          <h3 className={cn(
            "text-white leading-tight",
            project.textForward ? "text-4xl" : "text-xl"
          )}>
            {project.name}
          </h3>
          
          <p className="text-text-secondary text-sm max-w-[400px]">
            {project.oneLiner}
          </p>

          <div className="pt-2">
            <span className="text-accent text-sm font-medium inline-flex items-center group-hover:gap-2 transition-all">
              View Project <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
