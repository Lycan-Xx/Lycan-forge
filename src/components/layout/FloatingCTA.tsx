import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          href="https://wa.me/2348000000000?text=Hi LycanForge, I'd like to discuss a project."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-accent-muted bg-opacity-90 hover:bg-accent text-white p-4 rounded-full shadow-[0_4px_20px_var(--color-accent-glow)] transition-all hover:scale-105 active:scale-95 group"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute right-full mr-4 bg-bg-surface border border-bg-border px-3 py-1.5 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat with us
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
