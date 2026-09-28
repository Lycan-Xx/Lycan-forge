import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ProjectCard from '../components/work/ProjectCard';
import { PROJECTS } from '../constants';

const categories = ['All', 'Web Apps', 'Fintech', 'Marketplace', 'Automation'];

export default function Work() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => {
        if (activeCategory === 'Web Apps') return p.tags.includes('PLATFORM') || p.tags.includes('WEB');
        if (activeCategory === 'Fintech') return p.tags.includes('FINTECH');
        if (activeCategory === 'Marketplace') return p.tags.includes('MARKETPLACE');
        if (activeCategory === 'Automation') return p.tags.includes('AUTOMATION');
        return true;
      });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-bg-base pb-24 pt-32 md:pb-32 md:pt-40"
    >
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <header className="mb-14 max-w-3xl space-y-6 md:mb-20">
          <p className="eyebrow">Our work</p>
          <h1 className="text-5xl leading-[0.92] md:text-7xl">
            Products made useful.
          </h1>
          <p className="max-w-xl text-text-secondary">
            Every project listed here is real, delivered, and available for reference on request.
          </p>
        </header>

        {/* Filter Tabs */}
        <div className="mb-10 flex flex-wrap gap-2 md:mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat ? 'border-accent bg-accent text-bg-surface' : 'border-bg-border bg-bg-surface/60 text-text-secondary hover:border-text-primary/25'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="work-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
