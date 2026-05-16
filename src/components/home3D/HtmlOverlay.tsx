import { useRef, useEffect, useState } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Icon } from '@iconify/react';
import { PROJECTS } from '../../constants';

export default function HtmlOverlay() {
  const scroll = useScroll();
  const brandRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Use state with requestAnimationFrame batching for DOM updates
  const [scrollState, setScrollState] = useState({
    brand: { opacity: 1, translateY: 0 },
    values: { opacity: 0, translateX: -50 },
    services: { opacity: 0, translateX: 50 },
    portfolio: { opacity: 0, translateY: 50 },
    cta: { opacity: 0, scale: 0.9 }
  });
  
  // Throttle scroll updates to requestAnimationFrame
  useFrame(() => {
    if (!scroll) return;
    
    const p = scroll.offset;
    
    // Batch all calculations first
    const newBrandOpacity = Math.max(0, 1 - p * 4);
    const newBrandTranslateY = p * -200;
    
    const newValuesOpacity = p > 0.1 ? (p < 0.4 ? 1 : Math.max(0, 1 - (p - 0.4) * 4)) : Math.max(0, (p - 0.1) * 10);
    const newValuesTranslateX = p < 0.25 ? -50 + (p - 0.1) * 333 : 0;
    
    const newServicesOpacity = p > 0.35 ? (p < 0.65 ? 1 : Math.max(0, 1 - (p - 0.65) * 4)) : Math.max(0, (p - 0.35) * 6);
    const newServicesTranslateX = p < 0.5 ? 50 - (p - 0.35) * 333 : 0;
    
    const newPortfolioOpacity = p > 0.6 ? (p < 0.9 ? 1 : Math.max(0, 1 - (p - 0.9) * 4)) : 0;
    const newPortfolioTranslateY = p < 0.75 ? 50 - (p - 0.6) * 333 : 0;
    
    const newCtaOpacity = p > 0.85 ? (p - 0.85) * 10 : 0;
    const newCtaScale = p > 0.85 ? 0.9 + (p - 0.85) * 0.6 : 0.9;
    
    // Only update state if values changed to prevent unnecessary renders
    setScrollState(prev => {
      if (
        prev.brand.opacity !== newBrandOpacity ||
        prev.brand.translateY !== newBrandTranslateY ||
        prev.values.opacity !== newValuesOpacity ||
        prev.values.translateX !== newValuesTranslateX ||
        prev.services.opacity !== newServicesOpacity ||
        prev.services.translateX !== newServicesTranslateX ||
        prev.portfolio.opacity !== newPortfolioOpacity ||
        prev.portfolio.translateY !== newPortfolioTranslateY ||
        prev.cta.opacity !== newCtaOpacity ||
        prev.cta.scale !== newCtaScale
      ) {
        return {
          brand: { opacity: newBrandOpacity, translateY: newBrandTranslateY },
          values: { opacity: newValuesOpacity, translateX: newValuesTranslateX },
          services: { opacity: newServicesOpacity, translateX: newServicesTranslateX },
          portfolio: { opacity: newPortfolioOpacity, translateY: newPortfolioTranslateY },
          cta: { opacity: newCtaOpacity, scale: newCtaScale }
        };
      }
      return prev;
    });
  });
  
  // Apply DOM styles via useEffect on state change (batched)
  useEffect(() => {
    if (brandRef.current) {
      brandRef.current.style.opacity = `${scrollState.brand.opacity}`;
      brandRef.current.style.transform = `translateY(${scrollState.brand.translateY}px)`;
    }
  }, [scrollState.brand]);
  
  useEffect(() => {
    if (valuesRef.current) {
      valuesRef.current.style.opacity = `${scrollState.values.opacity}`;
      valuesRef.current.style.transform = `translateX(${scrollState.values.translateX}px)`;
    }
  }, [scrollState.values]);
  
  useEffect(() => {
    if (servicesRef.current) {
      servicesRef.current.style.opacity = `${scrollState.services.opacity}`;
      servicesRef.current.style.transform = `translateX(${scrollState.services.translateX}px)`;
    }
  }, [scrollState.services]);
  
  useEffect(() => {
    if (portfolioRef.current) {
      portfolioRef.current.style.opacity = `${scrollState.portfolio.opacity}`;
      portfolioRef.current.style.transform = `translateY(${scrollState.portfolio.translateY}px)`;
    }
  }, [scrollState.portfolio]);
  
  useEffect(() => {
    if (ctaRef.current) {
      ctaRef.current.style.opacity = `${scrollState.cta.opacity}`;
      ctaRef.current.style.transform = `scale(${scrollState.cta.scale})`;
    }
  }, [scrollState.cta]);

  return (
    <div className="w-full text-white">
      {/* Section 0: Brand Intro */}
      <section className="w-full h-screen flex flex-col items-center justify-center relative pointer-events-none">
        <div 
          ref={brandRef}
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
          ref={valuesRef}
          className="max-w-2xl"
          style={{ opacity: 0 }}
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
          ref={servicesRef}
          className="max-w-2xl text-right"
          style={{ opacity: 0 }}
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
      <section className="w-full min-h-screen flex flex-col items-center justify-center pointer-events-none py-20">
        <div 
          ref={portfolioRef}
          className="w-full"
          style={{ opacity: 0 }}
        >
          <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
            <span className="text-accent font-mono text-sm tracking-widest uppercase block mb-4">03. Archive</span>
            <h2 className="text-5xl md:text-7xl font-display mb-16">Selected Work</h2>
            
            {/* Project Grid */}
            <div className="grid grid-cols-12 gap-6 mb-12">
              {PROJECTS.filter(p => ['studywise', 'abkhd', 'jalolink'].includes(p.id)).map((project) => (
                <div 
                  key={project.id}
                  className={`${project.gridSpan} ${project.height} rounded-lg overflow-hidden group cursor-pointer pointer-events-auto`}
                >
                  <div className="relative w-full h-full">
                    <img 
                      src={project.image} 
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
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
                  </div>
                </div>
              ))}
            </div>

            <div className="pointer-events-auto flex justify-center">
              <a href="/work" className="cta-pill inline-flex items-center gap-3">
                View All Projects <Icon icon="material-symbols:arrow-right-alt-rounded" className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: CTA */}
      <section className="w-full h-screen flex items-center justify-center pointer-events-none">
        <div 
          ref={ctaRef}
          className="text-center space-y-12"
          style={{ opacity: 0 }}
        >
          <span className="text-accent font-mono text-sm tracking-widest uppercase block mb-4">04. Initiate</span>
          <h2 className="text-6xl md:text-8xl font-display">Ready to build?</h2>
          <div className="pointer-events-auto mt-8 inline-block">
            <a href="/contact" className="cta-pill px-10 py-5 text-lg inline-flex items-center gap-4 hover:shadow-[0_0_40px_var(--color-accent-glow)] transition-all duration-300">
              Start a Project <Icon icon="material-symbols:call-made-rounded" className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
