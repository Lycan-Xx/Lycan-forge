import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Check, Loader2, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    id: 'needs',
    question: 'What are you looking to build?',
    options: [
      { id: 'web', label: 'Web Application', icon: '⬡', desc: 'Custom platforms & dashboards' },
      { id: 'wa', label: 'WhatsApp Automation', icon: '◎', desc: 'AI-powered chat flows' },
      { id: 'sms', label: 'SMS Campaign', icon: '◈', desc: 'Large scale messaging' },
      { id: 'maint', label: 'Maintenance Retainer', icon: '⬔', desc: 'Ongoing support' },
      { id: 'unknown', label: 'Not sure yet', icon: '◌', desc: 'Let\'s figure it out' },
    ]
  },
  {
    id: 'budget',
    question: 'What\'s your approximate budget?',
    options: [
      { id: 'b1', label: 'Under ₦100k' },
      { id: 'b2', label: '₦100k – ₦300k' },
      { id: 'b3', label: '₦300k – ₦600k' },
      { id: 'b4', label: '₦600k – ₦1.5M' },
      { id: 'b5', label: 'Above ₦1.5M' },
    ]
  },
  {
    id: 'timeline',
    question: 'When do you need this?',
    options: [
      { id: 'asap', label: 'As soon as possible' },
      { id: '1m', label: 'Within 1 month' },
      { id: '3m', label: '1–3 months' },
      { id: 'later', label: 'No fixed deadline' },
    ]
  }
];

export default function Contact() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [details, setDetails] = useState({ name: '', email: '', phone: '', message: '' });

  const handleOptionSelect = (stepId: string, optionId: string) => {
    setAnswers({ ...answers, [stepId]: optionId });
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(steps.length); // Final details step
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const progress = ((currentStep + 1) / (steps.length + 1)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-bg-base pt-40 pb-32"
    >
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <header className="mb-20 space-y-6">
          <p className="font-mono text-accent text-xs uppercase tracking-widest font-medium">CONTACT</p>
          <h1 className="text-4xl md:text-5xl text-white font-display">
            Let's talk about<br />what you're building.
          </h1>
          <p className="text-text-secondary max-w-sm">
            Walk us through it. We'll respond within 24 hours.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-24 items-start">
          {/* Multi-step Flow */}
          <div className="space-y-12">
            {!isSuccess ? (
              <div className="space-y-12">
                {/* Progress bar */}
                <div className="space-y-4">
                  <div className="w-full h-px bg-bg-border relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="absolute inset-y-0 left-0 bg-accent"
                    />
                  </div>
                  <p className="font-mono text-[10px] text-text-muted">
                    0{Math.min(currentStep + 1, steps.length + 1)} / 0{steps.length + 1}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {currentStep < steps.length ? (
                    <motion.div
                      key={steps[currentStep].id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <h2 className="text-2xl md:text-3xl text-white font-display">
                        {steps[currentStep].question}
                      </h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {steps[currentStep].options.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => handleOptionSelect(steps[currentStep].id, opt.id)}
                            className={cn(
                              "text-left p-6 rounded-[14px] bg-bg-surface border border-bg-border transition-all hover:bg-bg-raised group",
                              answers[steps[currentStep].id] === opt.id && "border-accent bg-accent-glow shadow-[0_0_20px_var(--color-accent-glow)]"
                            )}
                          >
                            <div className="flex items-start gap-4">
                              {opt.icon && <span className="text-2xl text-accent font-mono">{opt.icon}</span>}
                              <div>
                                <p className="text-white font-medium">{opt.label}</p>
                                {opt.desc && <p className="text-xs text-text-muted mt-1">{opt.desc}</p>}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="final-details"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-10"
                    >
                       <h2 className="text-2xl md:text-3xl text-white font-display">
                        Tell us more + Your details
                      </h2>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <textarea 
                          required
                          placeholder="Tell us what you're building. The more specific you are, the faster we can give you a useful response."
                          value={details.message}
                          onChange={(e) => setDetails({ ...details, message: e.target.value })}
                          className="w-full bg-bg-raised border border-bg-border rounded-xl p-5 min-h-[160px] text-white focus:border-accent outline-none transition-colors"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input 
                            required
                            type="text" 
                            placeholder="Full Name" 
                            value={details.name}
                            onChange={(e) => setDetails({ ...details, name: e.target.value })}
                            className="bg-bg-raised border border-bg-border rounded-xl px-5 py-4 text-white focus:border-accent outline-none"
                          />
                          <input 
                            required
                            type="email" 
                            placeholder="Email Address" 
                            value={details.email}
                            onChange={(e) => setDetails({ ...details, email: e.target.value })}
                            className="bg-bg-raised border border-bg-border rounded-xl px-5 py-4 text-white focus:border-accent outline-none"
                          />
                          <input 
                            required
                            type="tel" 
                            placeholder="Phone Number" 
                            value={details.phone}
                            onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                            className="bg-bg-raised border border-bg-border rounded-xl px-5 py-4 text-white focus:border-accent outline-none"
                          />
                        </div>

                        <button 
                          disabled={isSubmitting}
                          className="cta-pill w-full flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <Loader2 className="animate-spin" size={20} />
                          ) : (
                            <>Send Message <Send size={18} /></>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 space-y-8"
              >
                <div className="w-20 h-20 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_var(--color-accent-glow)]">
                  <Check size={40} strokeWidth={3} />
                </div>
                <h2 className="text-3xl text-white font-display">Message received.</h2>
                <div className="space-y-4">
                  <p className="text-text-secondary">
                    We'll come back to you within 24 hours at <span className="text-white font-medium">{details.email}</span>.
                  </p>
                  <p className="text-text-secondary">
                    While you wait — here's our latest work.
                  </p>
                </div>
                <div className="pt-8">
                  <Link to="/work" className="text-accent hover:underline inline-flex items-center gap-2">
                    → View our projects
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Contact Details Sticky */}
          <aside className="sticky top-32 space-y-12 pl-0 lg:pl-12">
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xs font-mono text-text-muted uppercase tracking-widest">DIRECT CONTACT</p>
                <div className="flex flex-col gap-2">
                  <a href="mailto:hello@lycanforge.com.ng" className="text-text-secondary hover:text-white transition-colors flex items-center justify-between group">
                    hello@lycanforge.com.ng <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </a>
                  <a href="https://wa.me/2348000000000" className="text-accent hover:text-accent-dim transition-colors flex items-center justify-between group">
                    Message on WhatsApp <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-mono text-text-muted uppercase tracking-widest">BASED IN</p>
                <p className="text-text-secondary leading-relaxed">
                  Yola, Adamawa State<br />Nigeria
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-mono text-text-muted uppercase tracking-widest">LEGAL</p>
                <p className="text-text-secondary leading-normal text-sm">
                  LycanForge is a trading name of Lycan Technical and Engineering Services<br />
                  CAC Reg: BN-3542109
                </p>
              </div>

              <div className="bg-bg-surface border border-bg-border p-6 rounded-xl space-y-3">
                 <p className="text-xs font-mono text-accent uppercase tracking-widest">RESPONSE</p>
                 <p className="text-xs text-text-secondary leading-relaxed">
                   We respond to all enquiries within 24 hours on business days.
                 </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}
