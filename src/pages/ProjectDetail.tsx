import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { PROJECTS } from '../constants';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const project = PROJECTS.find(p => p.id === id);

  if (!project) return <Navigate to="/work" />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-bg-base pt-40 pb-32"
    >
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <Link 
          to="/work" 
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors mb-12 text-sm font-mono"
        >
          <ArrowLeft size={16} /> BACK TO WORK
        </Link>

        <header className="mb-20 space-y-8">
          <div className="flex flex-wrap gap-3">
            {project.tags.map(tag => (
              <span key={tag} className="font-mono text-[10px] bg-bg-surface border border-bg-border px-2 py-1 text-text-muted rounded">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl text-white font-display leading-[0.9]">
              {project.name}
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl leading-relaxed">
              {project.oneLiner}
            </p>
          </div>
        </header>

        {/* Hero Image / Placeholder */}
        <div className="aspect-video w-full bg-bg-surface border border-bg-border rounded-[24px] mb-24 flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
          <p className="text-text-muted font-mono uppercase tracking-[0.2em] text-sm">
            Full Project Presentation Case Study
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-32">
          <div className="space-y-8">
            <h2 className="text-2xl text-white font-display">The Problem</h2>
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {project.problem}
            </p>
          </div>
          <div className="space-y-8">
            <h2 className="text-2xl text-white font-display">What We Built</h2>
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="pt-20 border-t border-bg-border flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
          <div className="space-y-4">
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest font-medium">TECH STACK</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-text-secondary">
              {project.stack.map(tech => (
                <span key={tech} className="font-display text-lg">{tech}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <a 
              href="#" 
              className="cta-pill inline-flex items-center gap-3 text-sm"
            >
              Live Project <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
