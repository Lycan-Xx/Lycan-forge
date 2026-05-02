import { motion } from 'motion/react';
import SectionHeader from '../components/ui/SectionHeader';
import ServiceRow from '../components/home/ServiceRow';
import { SERVICES } from '../constants';
import { Link } from 'react-router-dom';

export default function Services() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-bg-base pt-40 pb-32"
    >
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <header className="mb-20 space-y-6">
          <p className="font-mono text-accent text-xs uppercase tracking-widest font-medium">SERVICES</p>
          <h1 className="text-4xl md:text-5xl text-white font-display">
            We build specific things.<br />We do them well.
          </h1>
          <p className="text-text-secondary max-w-sm">
            Not a "we do everything" shop. A focused agency with deep capability in a defined set of services.
          </p>
        </header>
      </div>

      <div className="border-t border-bg-border">
        {SERVICES.map((service) => (
          <ServiceRow key={service.number} service={service} />
        ))}
      </div>

      <div className="max-w-[1180px] mx-auto px-6 mt-32 text-center space-y-8">
        <p className="text-text-secondary text-lg max-w-md mx-auto">
          Not sure which service fits? Tell us what you're trying to solve. 
          We'll tell you honestly what makes sense — and what doesn't.
        </p>
        <Link to="/contact" className="cta-pill inline-block">
          Start a Conversation →
        </Link>
      </div>
    </motion.div>
  );
}
