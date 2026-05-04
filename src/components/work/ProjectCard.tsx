import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { Icon } from '@iconify/react';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    tags: string[];
    oneLiner: string;
    gridSpan: string;
    height: string;
    image?: string;
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
        "group relative bg-bg-surface/40 backdrop-blur-sm border border-bg-border/30 rounded-[20px] overflow-hidden transition-all duration-500 hover:bg-bg-surface hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        project.gridSpan,
        project.height
      )}
    >
      <Link to={`/work/${project.id}`} className="flex flex-col h-full p-6">
        {!project.textForward && (
          <div className="flex-grow mb-5 relative overflow-hidden rounded-[14px] bg-bg-border/20 border border-white/5">
             {project.image ? (
               <img 
                 src={project.image} 
                 alt={project.name} 
                 className="absolute inset-0 w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-100 group-hover:brightness-110" 
               />
             ) : (
               <div className="absolute inset-0 flex items-center justify-center text-text-muted font-mono text-[10px]">
                 [ PREVIEW: {project.name} ]
               </div>
             )}
          </div>
        )}

        <div className="mt-auto space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-x-3">
              {project.tags.slice(0, 2).map(tag => (
                <span key={tag} className="font-mono text-[9px] text-accent tracking-[0.15em] uppercase font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <h3 className={cn(
            "text-white leading-[1.2] font-display",
            project.textForward ? "text-3xl md:text-3xl" : "text-lg md:text-xl"
          )}>
            {project.name}
          </h3>
          
          <p className="text-text-secondary text-xs leading-relaxed max-w-[320px]">
            {project.oneLiner}
          </p>

          <div className="pt-1 overflow-hidden h-6">
            <div className="flex flex-col transition-transform duration-300 group-hover:-translate-y-6">
              <span className="h-6 text-text-muted text-[10px] uppercase font-mono tracking-widest flex items-center gap-2">
                Explore Case <Icon icon="material-symbols:arrow-right-alt-rounded" className="w-3.5 h-3.5" />
              </span>
              <span className="h-6 text-accent text-[10px] uppercase font-mono tracking-widest flex items-center gap-2">
                View Work <Icon icon="material-symbols:arrow-right-alt-rounded" className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
