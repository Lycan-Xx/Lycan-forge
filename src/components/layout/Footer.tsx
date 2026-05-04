import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-bg-surface border-t border-bg-border pt-20 pb-10">
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Column 1 - Brand */}
          <div className="space-y-4">
            <Link to="/" className="font-display text-2xl font-bold text-white">
              LycanForge
            </Link>
            <p className="text-text-secondary max-w-[240px] text-sm leading-relaxed">
              Engineering Reliable Digital Solutions. Built for precision.
            </p>
          </div>

          {/* Column 2 - Links */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Link to="/work" className="text-text-secondary hover:text-accent transition-colors text-sm">Work</Link>
              <Link to="/services" className="text-text-secondary hover:text-accent transition-colors text-sm">Services</Link>
              <Link to="/about" className="text-text-secondary hover:text-accent transition-colors text-sm">About</Link>
              <Link to="/contact" className="text-text-secondary hover:text-accent transition-colors text-sm">Contact</Link>
            </div>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-text-secondary hover:text-accent transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-text-secondary hover:text-accent transition-colors text-sm">Terms of Service</a>
            </div>
          </div>

          {/* Column 3 - Contact */}
          <div className="space-y-4 text-sm text-text-secondary">
            <div className="flex flex-col gap-1">
              <a href="mailto:client@lycanforge.com.ng" className="hover:text-accent transition-colors">client@lycanforge.com.ng</a>
              <a href="https://wa.me/2347058392920" className="text-accent hover:text-accent-dim transition-colors">WhatsApp Direct →</a>
            </div>
            <p>
              Yola, Adamawa State, Nigeria<br />
              CAC Reg: 9364181
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-bg-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>LycanForge — Trading name of Lycan Technical and Engineering Services. CAC: 9364181</p>
          <div className="flex items-center gap-6">
            <a href="https://x.com/LycanXx0" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X (Twitter)</a>
            <a href="https://www.linkedin.com/in/mohammad-bello/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="https://github.com/Lycan-Xx" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
