import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeader({ number, title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn("space-y-4 mb-16", className)}>
      <p className="font-mono text-accent text-xs uppercase tracking-[0.14em] font-medium">
        {number} — {title.toUpperCase()}
      </p>
      <h2 className="text-3xl md:text-4xl text-white">
        {subtitle || title}
      </h2>
    </div>
  );
}
