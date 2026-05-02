import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SectionHeader from '../components/ui/SectionHeader';
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
      className="bg-bg-base pt-40 pb-32"
    >
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <header className="mb-20 space-y-6">
          <p className="font-mono text-accent text-xs uppercase tracking-widest font-medium">OUR WORK</p>
          <h1 className="text-4xl md:text-5xl text-white font-display">
            Projects built<br />and shipped.
          </h1>
          <p className="text-text-secondary max-w-sm">
            Every project listed here is real, delivered, and available for reference on request.
          </p>
        </header>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-8 border-b border-bg-border mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pb-4 text-sm font-medium transition-all relative ${
                activeCategory === cat ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" 
                />
              )}
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
