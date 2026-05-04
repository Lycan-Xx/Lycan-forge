import { motion } from 'motion/react';
import { Icon } from '@iconify/react';

const stats = [
  { value: '15+', label: 'Projects Shipped' },
  { value: '3–4 yrs', label: 'Building Software' },
  { value: '5+', label: 'Stacks Mastered' },
  { value: '1', label: 'Agency Registered' },
];

const techStack = [
  'React', 'TypeScript', 'Next.js', 'Node.js', 'Supabase', 'Firebase',
  'Appwrite', 'Tailwind CSS', 'Framer Motion', 'Astro', 'Vite',
  'WhatsApp Cloud API', 'Termii', 'Clerk', 'PostgreSQL', 'Linux'
];

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-bg-base pt-40 pb-32"
    >
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <header className="mb-20 space-y-6">
          <p className="font-mono text-accent text-xs uppercase tracking-widest font-medium">ABOUT</p>
          <h1 className="text-4xl md:text-5xl text-white font-display leading-[1.1]">
            Built from the Northeast.<br />For anyone who needs it done right.
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-24 items-start">
          {/* Main Story */}
          <div className="space-y-12">
            <div className="prose prose-invert max-w-none space-y-8 text-text-secondary text-lg leading-relaxed">
              <p>
                LycanForge was started by Mohammad Bello — a full-stack developer and technical co-founder based in Yola, Adamawa State — with a straightforward conviction: the quality of software you can access shouldn't depend on where you live.
              </p>
              <p>
                The agency is a registered trading name of LYCAN TECHNICAL AND ENGINEERING SERVICES (CAC: 9364181) and operates from the Northeast — a region historically underserved by the technology industry and increasingly in need of it. We work with clients across Nigeria and take on international projects remotely.
              </p>
              
              <div className="h-px w-32 bg-bg-border" />
              
              <h2 className="text-2xl text-white font-display">Why LycanForge exists.</h2>
              <p>
                Before starting the agency, several years were spent shipping software — fintech wallets, job marketplaces, e-commerce platforms, campus tools, and AI-integrated applications. A pattern emerged: most clients didn't need the cheapest developer. They needed someone who would show up with a written scope, build what they agreed to build, and not disappear after the invoice.
              </p>
              <p>That's the agency we built.</p>

              <div className="h-px w-32 bg-bg-border" />

              <h2 className="text-2xl text-white font-display">What we believe.</h2>
              <ul className="space-y-6">
                <li className="flex gap-4 items-start">
                  <span className="text-accent shrink-0">→</span>
                  <span>Agreements before code. Every project starts with a signed document. No exceptions.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="text-accent shrink-0">→</span>
                  <span>Honest scoping. We tell you what's realistic in your timeline and budget — not what you want to hear.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="text-accent shrink-0">→</span>
                  <span>Fewer projects, done properly. We don't take on more than we can deliver well.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar / Founder Card */}
          <aside className="sticky top-32 space-y-12">
            <div className="bg-bg-surface border border-bg-border/60 p-8 rounded-[24px] space-y-6">
              <div className="w-24 h-24 bg-bg-raised border border-bg-border rounded-[20px] overflow-hidden flex items-center justify-center relative group">
                <img 
                  src="https://www.linkedin.com/in/mohammad-bello/overlay/photo/" 
                  alt="Mohammad Bello"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if direct LinkedIn scraping fails
                    e.currentTarget.src = "https://ui-avatars.com/api/?name=Mohammad+Bello&background=0D1117&color=6366f1";
                  }}
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-white text-lg">Mohammad Bello</h3>
                <p className="text-accent text-sm font-medium">Founder & Lead Developer</p>
              </div>
              
              <div className="flex gap-4 pt-2">
                <a href="https://www.linkedin.com/in/mohammad-bello/" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors">
                  <Icon icon="linguo:linkedin" className="w-5 h-5" />
                </a>
                <a href="https://github.com/Lycan-Xx" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors">
                  <Icon icon="mdi:github" className="w-5 h-5" />
                </a>
                <a href="https://x.com/LycanXx0" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors">
                  <Icon icon="linguo:twitter" className="w-5 h-5" />
                </a>
              </div>

              <div className="space-y-4 text-xs text-text-secondary leading-relaxed border-t border-bg-border pt-6">
                <p>CTO, Hacksat Tech Ltd</p>
                <p>Technical Co-Founder, Kugal.jobs</p>
                <p>Full Stack Lead, eVault</p>
                <p>B.Sc. Chemistry, Modibbo Adama University (in progress)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="font-mono text-xl text-accent leading-none">{stat.value}</p>
                  <p className="text-[10px] text-text-muted uppercase tracking-[0.1em]">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <p className="text-xs font-mono text-text-muted uppercase tracking-widest font-medium">TECH STACK</p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span key={tech} className="bg-bg-surface border border-bg-border px-2.5 py-1 rounded-[4px] text-[10px] font-mono text-text-secondary">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}
