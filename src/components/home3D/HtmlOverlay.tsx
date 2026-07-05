import { useRef, useEffect, useState, useMemo } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Icon } from '@iconify/react';
import { PROJECTS } from '../../constants';
import { ANIMATION_CONFIG, getSectionProgress, EASING } from '../../config/animationConfig';
import { useReducedMotion } from '../../utils/motionPreferences';

/**
 * Scroll state animation values
 */
interface ScrollAnimState {
  brand: { opacity: number; translateY: number };
  values: { opacity: number; translateX: number };
  services: { opacity: number; translateX: number };
  portfolio: { opacity: number; translateY: number };
  cta: { opacity: number; scale: number };
}

export default function HtmlOverlay() {
  const scroll = useScroll();
  const prefersReduced = useReducedMotion();
  
  // Refs for each section
  const brandRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Scroll state with batched updates
  const [scrollState, setScrollState] = useState<ScrollAnimState>({
    brand: { opacity: 1, translateY: 0 },
    values: { opacity: 0, translateX: -50 },
    services: { opacity: 0, translateX: 50 },
    portfolio: { opacity: 0, translateY: 50 },
    cta: { opacity: 0, scale: 0.9 }
  });

  // Memoize section config
  const sections = useMemo(() => ANIMATION_CONFIG.sections, []);

  // RAF-batched scroll calculations
  useFrame(() => {
    if (!scroll || prefersReduced) return;
    
    const p = scroll.offset;

    // Brand section: fade out as user scrolls
    const brandProgress = getSectionProgress(
      p, 
      sections.brand.start, 
      sections.brand.end
    );
    const newBrandOpacity = 1 - brandProgress;
    const newBrandTranslateY = brandProgress * -200;

    // Values section: fade in, slide from left
    const valuesProgress = getSectionProgress(
      p,
      sections.values.start,
      sections.values.end
    );
    const newValuesOpacity = EASING.easeOutQuad(valuesProgress);
    const newValuesTranslateX = (1 - valuesProgress) * -50;

    // Services section: fade in, slide from right
    const servicesProgress = getSectionProgress(
      p,
      sections.services.start,
      sections.services.end
    );
    const newServicesOpacity = EASING.easeOutQuad(servicesProgress);
    const newServicesTranslateX = (1 - servicesProgress) * 50;

    // Portfolio section: fade in, slide from below
    const portfolioProgress = getSectionProgress(
      p,
      sections.portfolio.start,
      sections.portfolio.end
    );
    const newPortfolioOpacity = EASING.easeOutQuad(portfolioProgress);
    const newPortfolioTranslateY = (1 - portfolioProgress) * 50;

    // CTA section: fade in, scale up
    const ctaProgress = getSectionProgress(
      p,
      sections.cta.start,
      sections.cta.end
    );
    const newCtaOpacity = EASING.easeOutQuad(ctaProgress);
    const newCtaScale = 0.9 + ctaProgress * 0.1;

    // Only update if values changed (prevent unnecessary re-renders)
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
  
  // Apply DOM styles - brand section
  useEffect(() => {
    if (brandRef.current) {
      brandRef.current.style.opacity = `${scrollState.brand.opacity}`;
      brandRef.current.style.transform = `translateY(${scrollState.brand.translateY}px)`;
      brandRef.current.style.willChange = 'transform, opacity';
    }
  }, [scrollState.brand]);
  
  // Apply DOM styles - values section
  useEffect(() => {
    if (valuesRef.current) {
      valuesRef.current.style.opacity = `${scrollState.values.opacity}`;
      valuesRef.current.style.transform = `translateX(${scrollState.values.translateX}px)`;
      valuesRef.current.style.willChange = 'transform, opacity';
    }
  }, [scrollState.values]);
  
  // Apply DOM styles - services section
  useEffect(() => {
    if (servicesRef.current) {
      servicesRef.current.style.opacity = `${scrollState.services.opacity}`;
      servicesRef.current.style.transform = `translateX(${scrollState.services.translateX}px)`;
      servicesRef.current.style.willChange = 'transform, opacity';
    }
  }, [scrollState.services]);
  
  // Apply DOM styles - portfolio section
  useEffect(() => {
    if (portfolioRef.current) {
      portfolioRef.current.style.opacity = `${scrollState.portfolio.opacity}`;
      portfolioRef.current.style.transform = `translateY(${scrollState.portfolio.translateY}px)`;
      portfolioRef.current.style.willChange = 'transform, opacity';
    }
  }, [scrollState.portfolio]);
  
  // Apply DOM styles - CTA section
  useEffect(() => {
    if (ctaRef.current) {
      ctaRef.current.style.opacity = `${scrollState.cta.opacity}`;
      ctaRef.current.style.transform = `scale(${scrollState.cta.scale})`;
      ctaRef.current.style.willChange = 'transform, opacity';
    }
  }, [scrollState.cta]);

  return (
    <div className="w-full text-white" role="region" aria-label="Main content">
      {/* Section 0: Brand Intro */}
      <section 
        className="w-full h-screen flex flex-col items-center justify-center relative pointer-events-none"
        aria-labelledby="brand-title"
      >
        <div 
          ref={brandRef}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon icon="mdi:code-braces" className="w-12 h-12 text-accent" aria-hidden="true" />
          </div>
          <h1 
            id="brand-title"
            className="text-6xl md:text-8xl font-display font-medium tracking-tight bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent"
          >
            LycanForge
          </h1>
          <p className="text-xl text-text-secondary font-mono tracking-[0.3em] uppercase">
            Define Reality
          </p>
        </div>
        
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-70" aria-hidden="true">
          <span className="text-[10px] uppercase tracking-widest font-mono text-text-muted">Scroll to explore</span>
          <div className="w-px h-16 bg-gradient-to-b from-accent to-transparent overflow-hidden object-left" />
        </div>
      </section>

      {/* Section 1: Core Values */}
      <section 
        className="w-full h-screen flex items-center px-12 md:px-32 pointer-events-none"
        aria-labelledby="values-title"
      >
        <div 
          ref={valuesRef}
          className="max-w-2xl"
        >
          <span className="text-accent font-mono text-sm tracking-widest uppercase block mb-4">01. Doctrine</span>
          <h2 id="values-title" className="text-5xl md:text-7xl font-display mb-8">Core Values</h2>
          <p className="text-xl text-text-secondary leading-relaxed mb-8">
            Innovation, integrity, and exceptional quality. We build bespoke digital 
            experiences that outlast trends and outmaneuver the competition.
          </p>
        </div>
      </section>

      {/* Section 2: Services */}
      <section 
        className="w-full h-screen flex items-center justify-end px-12 md:px-32 pointer-events-none"
        aria-labelledby="services-title"
      >
        <div 
          ref={servicesRef}
          className="max-w-2xl text-right"
        >
          <span className="text-accent font-mono text-sm tracking-widest uppercase block mb-4">02. Capabilities</span>
          <h2 id="services-title" className="text-5xl md:text-7xl font-display mb-8">Services</h2>
          <p className="text-xl text-text-secondary leading-relaxed mb-8">
            From modern web applications to immersive 3D storytelling, our elite
            tech stack handles the most ambitious enterprise challenges.
          </p>
        </div>
      </section>

      {/* Section 3: Portfolio Teaser */}
      <section 
        className="w-full min-h-screen flex flex-col items-center justify-center pointer-events-none py-20"
        aria-labelledby="portfolio-title"
      >
        <div 
          ref={portfolioRef}
          className="w-full"
        >
          <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
            <span className="text-accent font-mono text-sm tracking-widest uppercase block mb-4">03. Archive</span>
            <h2 id="portfolio-title" className="text-5xl md:text-7xl font-display mb-16">Selected Work</h2>
            
            {/* Project Grid */}
            <div className="grid grid-cols-12 gap-6 mb-12">
              {PROJECTS.filter(p => ['studywise', 'abkhd', 'jalolink'].includes(p.id)).map((project) => (
                <div 
                  key={project.id}
                  className={`${project.gridSpan} ${project.height} rounded-lg overflow-hidden group cursor-pointer pointer-events-auto`}
                  role="article"
                  tabIndex={0}
                >
                  <div className="relative w-full h-full">
                    <img 
                      src={project.image} 
                      alt={project.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 group-focus:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
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
              <a 
                href="/work" 
                className="cta-pill inline-flex items-center gap-3 hover:shadow-[0_0_40px_var(--color-accent-glow)] transition-all duration-300 focus:outline-offset-2 focus:outline-2 focus:outline-accent"
              >
                View All Projects <Icon icon="material-symbols:arrow-right-alt-rounded" className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: CTA */}
      <section 
        className="w-full h-screen flex items-center justify-center pointer-events-none"
        aria-labelledby="cta-title"
      >
        <div 
          ref={ctaRef}
          className="text-center space-y-12"
        >
          <span className="text-accent font-mono text-sm tracking-widest uppercase block mb-4">04. Initiate</span>
          <h2 id="cta-title" className="text-6xl md:text-8xl font-display">Ready to build?</h2>
          <div className="pointer-events-auto mt-8 inline-block">
            <a 
              href="/contact" 
              className="cta-pill px-10 py-5 text-lg inline-flex items-center gap-4 hover:shadow-[0_0_40px_var(--color-accent-glow)] transition-all duration-300 focus:outline-offset-2 focus:outline-2 focus:outline-accent"
              tabIndex={0}
            >
              Start a Project <Icon icon="material-symbols:call-made-rounded" className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
