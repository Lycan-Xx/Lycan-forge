import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Work', path: '/work' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 py-6",
        scrolled ? "py-4" : "py-8"
      )}
    >
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-white group">
          Lycan<span className="text-accent group-hover:text-white transition-colors">Forge</span>
        </Link>

        {/* Desktop Nav - Alien Pill System */}
        <nav className="hidden md:flex items-center relative">
          {/* Unified Background Capsule (appears on scroll) */}
          <motion.div 
            initial={false}
            animate={{ 
              opacity: scrolled ? 1 : 0,
              scale: scrolled ? 1 : 0.95
            }}
            className="absolute inset-y-[-8px] inset-x-[-12px] bg-bg-surface/80 backdrop-blur-xl border border-bg-border rounded-full -z-10 shadow-xl shadow-black/20"
          />

          <ul className="flex items-center">
            {navLinks.map((link, idx) => (
              <li key={link.path} className="flex items-center">
                <NavLink 
                  to={link.path}
                  className={({ isActive }) => cn(
                    "nav-pill relative z-10",
                    isActive && "active",
                    scrolled && "border-transparent bg-transparent hover:bg-bg-raised/50"
                  )}
                >
                  {link.name}
                </NavLink>
                {idx < navLinks.length - 1 && (
                  <motion.div 
                    animate={{ opacity: scrolled ? 0 : 1 }}
                    className="w-6 h-[1px] bg-bg-border shrink-0" 
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link to="/contact" className="cta-pill text-sm">
            Start a Project →
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 text-text-secondary hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-bg-base z-50 flex flex-col p-8"
          >
            <div className="flex items-center justify-between mb-12">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="font-display text-xl font-bold text-white">
                LycanForge
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-text-secondary">
                <X size={28} />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "font-display text-4xl text-text-secondary font-bold hover:text-white transition-colors",
                    isActive && "text-accent"
                  )}
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto pt-8 border-t border-bg-border">
              <p className="text-text-muted text-xs uppercase tracking-widest font-mono mb-4">Direct Links</p>
              <div className="flex flex-col gap-3">
                <a href="mailto:hello@lycanforge.com.ng" className="text-text-secondary hover:text-white transition-colors">hello@lycanforge.com.ng</a>
                <a href="https://wa.me/2348000000000" className="text-accent hover:text-accent-dim transition-colors">WhatsApp Direct</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
