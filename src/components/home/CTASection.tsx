import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="relative w-full py-32 overflow-hidden">
      {/* Radial Gradient Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 800px 400px at 50% 50%, var(--color-accent-glow) 0%, var(--color-bg-base) 80%)'
        }}
      />
      
      <div className="max-w-[1180px] mx-auto px-6 text-center relative z-10 space-y-8">
        <h2 className="text-4xl md:text-5xl text-white font-display">
          Have a project in mind?
        </h2>
        
        <p className="text-text-secondary text-lg max-w-[440px] mx-auto leading-relaxed">
          Tell us what you're building. We'll tell you honestly whether we're the right fit — and what it will cost.
        </p>

        <div className="pt-4">
          <Link to="/contact" className="cta-pill inline-block">
            Start a Project →
          </Link>
        </div>
      </div>
    </section>
  );
}
