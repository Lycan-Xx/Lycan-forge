import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface ServiceRowProps {
  service: {
    number: string;
    name: string;
    tag: string;
    headline: string;
    description: string;
    included: string[];
    rightForYou: string;
  };
}

export default function ServiceRow({ service }: ServiceRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={cn(
        "border-b border-bg-border hover:bg-bg-raised transition-colors group",
        isExpanded && "bg-bg-raised"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="max-w-[1180px] mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center gap-8 cursor-pointer">
        <div className="flex items-center gap-8 md:w-1/2">
          <span className={cn(
            "font-mono text-xs text-accent transition-all duration-400",
            isExpanded ? "scale-110 opacity-100" : "opacity-60"
          )}>
            {service.number}
          </span>
          <h3 className="text-xl md:text-2xl text-white font-display">
            {service.name}
          </h3>
        </div>
        
        <div className="flex-grow flex items-center justify-between">
          <div className="w-[1px] h-px bg-bg-border hidden md:block flex-grow mr-8" />
          <span className="font-mono text-[11px] text-text-muted uppercase tracking-widest bg-bg-border rounded-full px-3 py-1 shrink-0">
            {service.tag}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="max-w-[1180px] mx-auto px-6 pb-12 grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              <div className="space-y-6">
                <p className="text-text-secondary leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-mono text-text-muted uppercase">What's included:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-text-secondary">
                    {service.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="md:pl-12 flex flex-col justify-between">
                <div className="space-y-4">
                  <p className="text-xs font-mono text-text-muted uppercase">Right for you if:</p>
                  <p className="text-sm text-text-secondary italic">
                    "{service.rightForYou}"
                  </p>
                </div>
                <div className="pt-8">
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center gap-2 text-accent text-sm font-medium hover:gap-4 transition-all"
                  >
                    Start this project <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
