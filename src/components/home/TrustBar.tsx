export default function TrustBar() {
  const partners = [
     'PhiloPay', 'ABKHD Store', 'Jalolink',
  ];

  return (
    <div className="w-full bg-bg-surface border-y border-bg-border py-6 overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
        <p className="font-mono text-[10px] text-text-muted uppercase tracking-[0.1em] shrink-0">
          DELIVERED FOR
        </p>
        
        <div className="flex flex-nowrap overflow-x-auto no-scrollbar items-center gap-6 md:gap-10 text-sm text-text-secondary whitespace-nowrap scroll-smooth">
          {partners.map((partner, idx) => (
            <div key={partner} className="flex items-center gap-6 md:gap-10">
              <span>{partner}</span>
              {idx < partners.length - 1 && (
                <span className="text-text-ghost">·</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
