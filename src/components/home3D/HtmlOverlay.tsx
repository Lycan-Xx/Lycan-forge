import { useStore } from '../../store/useStore';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

export default function HtmlOverlay() {
  const scrollProgress = useStore((state) => state.scrollProgress);

  return (
    <div className="w-full text-white">
      {/* Section 0: Brand Intro */}
      <section className="w-full h-screen flex flex-col items-center justify-center relative pointer-events-none">
        <div 
          style={{ opacity: 1 - scrollProgress * 4, transform: `translateY(${scrollProgress * -200}px)` }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon icon="mdi:code-braces" className="w-12 h-12 text-accent" />
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-medium tracking-tight bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
            LycanForge
          </h1>
          <p className="text-xl text-text-secondary font-mono tracking-[0.3em] uppercase">
            Define Reality
          </p>
        </div>
        
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-70">
          <span className="text-[10px] uppercase tracking-widest font-mono text-text-muted">Scroll to explore</span>
          <div className="w-px h-16 bg-gradient-to-b from-accent to-transparent overflow-hidden object-left" />
        </div>
      </section>

      {/* Section 1: Core Values */}
      <section className="w-full h-screen flex items-center px-12 md:px-32 pointer-events-none">
        <div 
          style={{ 
            opacity: scrollProgress > 0.1 ? (scrollProgress < 0.4 ? 1 : 1 - (scrollProgress - 0.4) * 4) : (scrollProgress - 0.1) * 10,
            transform: `translateX(${scrollProgress < 0.25 ? -50 + (scrollProgress - 0.1) * 333 : 0}px)`
          }}
          className="max-w-2xl"
        >
          <span className="text-accent font-mono text-sm tracking-widest uppercase block mb-4">01. Doctrine</span>
          <h2 className="text-5xl md:text-7xl font-display mb-8">Core Values</h2>
          <p className="text-xl text-text-secondary leading-relaxed mb-8">
            Innovation, integrity, and exceptional quality. We build bespoke digital 
            experiences that outlast trends and outmaneuver the competition.
          </p>
        </div>
      </section>

      {/* Section 2: Services */}
      <section className="w-full h-screen flex items-center justify-end px-12 md:px-32 pointer-events-none">
        <div 
          style={{ 
            opacity: scrollProgress > 0.35 ? (scrollProgress < 0.65 ? 1 : 1 - (scrollProgress - 0.65) * 4) : (scrollProgress - 0.35) * 6,
            transform: `translateX(${scrollProgress < 0.5 ? 50 - (scrollProgress - 0.35) * 333 : 0}px)`
          }}
          className="max-w-2xl text-right"
        >
          <span className="text-accent font-mono text-sm tracking-widest uppercase block mb-4">02. Capabilities</span>
          <h2 className="text-5xl md:text-7xl font-display mb-8">Services</h2>
          <p className="text-xl text-text-secondary leading-relaxed mb-8">
            From modern web applications to immersive 3D storytelling, our elite
            tech stack handles the most ambitious enterprise challenges.
          </p>
        </div>
      </section>

      {/* Section 3: Portfolio Teaser */}
      <section className="w-full h-screen flex flex-col items-center justify-center pointer-events-none">
         <div 
          style={{ 
            opacity: scrollProgress > 0.6 ? (scrollProgress < 0.9 ? 1 : 1 - (scrollProgress - 0.9) * 4) : 0,
            transform: `translateY(${scrollProgress < 0.75 ? 50 - (scrollProgress - 0.6) * 333 : 0}px)`
          }}
          className="text-center"
        >
          <span className="text-accent font-mono text-sm tracking-widest uppercase block mb-4">03. Archive</span>
          <h2 className="text-5xl md:text-7xl font-display mb-12">Selected Work</h2>
          <div className="pointer-events-auto">
            <Link to="/work" className="cta-pill inline-flex items-center gap-3">
              Dive Into Projects <Icon icon="material-symbols:arrow-right-alt-rounded" className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: CTA */}
      <section className="w-full h-screen flex items-center justify-center pointer-events-none">
        <div 
          style={{ 
            opacity: scrollProgress > 0.85 ? (scrollProgress - 0.85) * 10 : 0,
            transform: `scale(${scrollProgress > 0.85 ? 0.9 + (scrollProgress - 0.85) * 0.6 : 0.9})`
          }}
          className="text-center space-y-12"
        >
          <span className="text-accent font-mono text-sm tracking-widest uppercase block mb-4">04. Initiate</span>
          <h2 className="text-6xl md:text-8xl font-display">Ready to build?</h2>
          <div className="pointer-events-auto mt-8 inline-block">
            <Link to="/contact" className="cta-pill px-10 py-5 text-lg inline-flex items-center gap-4 hover:shadow-[0_0_40px_var(--color-accent-glow)] transition-all duration-300">
              Start a Project <Icon icon="material-symbols:call-made-rounded" className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
