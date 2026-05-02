import { motion } from 'motion/react';
import Hero from '../components/home/Hero';
import TrustBar from '../components/home/TrustBar'; // Renaming as I realized I used .astro extension in previous call accidentally
import SectionHeader from '../components/ui/SectionHeader';
import ServiceRow from '../components/home/ServiceRow';
import ProjectCard from '../components/work/ProjectCard';
import CTASection from '../components/home/CTASection';
import { SERVICES, PROJECTS, PROCESS_STEPS } from '../constants';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-bg-base"
    >
      <Hero />
      <TrustBar />

      {/* Services Section */}
      <section className="py-32">
        <div className="max-w-[1180px] mx-auto px-6 mb-20">
          <SectionHeader 
            number="01" 
            title="Services" 
            subtitle="What we build." 
          />
          <p className="text-text-secondary text-base max-w-[520px] leading-relaxed -mt-10">
            Custom software for businesses, institutions, and organisations 
            that have outgrown generic tools and need something built for them.
          </p>
        </div>

        <div className="border-t border-bg-border">
          {SERVICES.map((service) => (
            <ServiceRow key={service.number} service={service} />
          ))}
        </div>

        <div className="max-w-[1180px] mx-auto px-6 mt-12 text-right">
          <Link to="/services" className="text-accent text-sm font-medium hover:mr-2 transition-all inline-flex items-center gap-2">
            Full services breakdown →
          </Link>
        </div>
      </section>

      {/* Work Section */}
      <section className="py-32 bg-bg-surface/30">
        <div className="max-w-[1180px] mx-auto px-6">
          <SectionHeader 
            number="02" 
            title="Work" 
            subtitle="What we've shipped." 
          />
          
          <div className="work-grid">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/work" className="ghost-pill inline-block">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 overflow-hidden">
        <div className="max-w-[1180px] mx-auto px-6">
          <SectionHeader 
            number="03" 
            title="Process" 
            subtitle="How we work." 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative pt-20">
            {/* Connector Line */}
            <div className="absolute top-[20px] left-0 right-0 h-px bg-bg-border hidden lg:block">
              <motion.div 
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="h-full bg-accent"
              />
            </div>

            {PROCESS_STEPS.map((step) => (
              <div key={step.number} className="relative space-y-4">
                <span className="absolute -top-32 -left-4 text-[120px] font-display font-black text-text-ghost select-none pointer-events-none opacity-40">
                  {step.number}
                </span>
                
                <div className="relative pt-8 space-y-4">
                  <span className="font-mono text-xs text-accent">{step.number}</span>
                  <h3 className="text-xl text-white font-display">{step.name}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </motion.div>
  );
}
