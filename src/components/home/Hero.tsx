import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Reveal from '../ui/Reveal';

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] pt-32 pb-20 overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-16 lg:gap-24 w-full">
          
          {/* Left Column Content */}
          <div className="space-y-10 lg:pl-4">
            <div className="space-y-6">
              <Reveal delay={0}>
                <p className="font-mono text-accent text-xs uppercase tracking-[0.14em] font-medium">
                  SOFTWARE DEVELOPMENT AGENCY  ·  YOLA, NIGERIA
                </p>
              </Reveal>
              
              <div className="space-y-2">
                <Reveal delay={0.15}>
                  <h1 className="text-5xl md:text-[5.5rem] text-white leading-[0.95] tracking-tight">
                    We build software
                  </h1>
                </Reveal>
                <Reveal delay={0.28}>
                  <h1 className="text-5xl md:text-[5.5rem] text-white leading-[0.95] tracking-tight">
                    that earns its place.
                  </h1>
                </Reveal>
              </div>

              <Reveal delay={0.42} width="100%">
                <p className="text-text-secondary text-lg md:text-xl max-w-[440px] leading-relaxed">
                  LycanForge designs and develops custom web applications, 
                  institutional platforms, and business automation systems 
                  for organisations that need software to actually work.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.56}>
              <div className="flex flex-wrap gap-4">
                <Link to="/contact" className="cta-pill">
                  Start a Project →
                </Link>
                <Link to="/work" className="ghost-pill">
                  View Our Work
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right Column - Geometric Composition */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Dot Grid Background */}
            <div 
              className="absolute inset-0 opacity-[0.2]" 
              style={{ 
                backgroundImage: 'radial-gradient(circle at center, var(--color-text-ghost) 1px, transparent 0)',
                backgroundSize: '40px 40px' 
              }} 
            />
            
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
               className="relative w-full aspect-square"
            >
              {/* Rectangle 1 */}
              <div className="absolute top-1/4 left-1/4 w-48 h-64 bg-bg-raised border border-bg-border rotate-[3deg]" />
              
              {/* Rectangle 2 */}
              <div className="absolute top-1/3 left-1/3 w-64 h-48 bg-bg-surface border border-bg-border rotate-[-2deg]" />
              
              {/* Rectangle 3 - Accent Border */}
              <div className="absolute top-1/2 left-1/2 w-40 h-56 border border-accent/40 rotate-[5deg]" />
              
              {/* Horizontal Line */}
              <div className="absolute top-[60%] left-[20%] w-[70%] h-px bg-accent/60" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
