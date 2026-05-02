export const PROJECTS = [
  {
    id: 'philopay',
    name: 'PhiloPay',
    tags: ['FINTECH', 'REACT', 'TYPESCRIPT', 'FIREBASE', 'CLERK'],
    oneLiner: 'Nigerian fintech wallet built for compliance and scale.',
    problem: 'PhiloPay needed a full wallet system — airtime and data top-up, transfers, and tiered KYC — built to CBN standards, with Google OAuth and phone-first authentication.',
    solution: 'React + TypeScript frontend with Clerk for multi-step auth, Firebase for real-time transactions, and a progressive KYC onboarding flow with BVN/NIMC verification.',
    stack: ['React', 'TypeScript', 'Firebase', 'Clerk', 'Tailwind CSS'],
    gridSpan: 'col-span-12 md:col-span-7',
    height: 'h-[480px]',
  },
  {
    id: 'kugal-jobs',
    name: 'Kugal.jobs',
    tags: ['MARKETPLACE', 'REACT', 'TYPESCRIPT', 'SUPABASE'],
    oneLiner: 'An African job marketplace rebuilt from the ground up.',
    problem: 'Kugal.jobs had an existing product but needed a complete frontend redesign — professional for enterprise employers, accessible for first-time jobseekers across Africa.',
    solution: 'Full frontend rebuild with a warm dark palette, DM Sans typography, and shadcn/ui component system. Rebuilt auth, navbar, employer landing, and onboarding flows.',
    stack: ['React', 'TypeScript', 'Supabase', 'shadcn/ui', 'Tailwind'],
    gridSpan: 'col-span-12 md:col-span-5',
    height: 'h-[480px]',
  },
  {
    id: 'jalolink',
    name: 'Jalolink',
    tags: ['MARKETPLACE', 'REACT', 'APPWRITE', 'CLOUDFLARE'],
    oneLiner: 'A campus marketplace built for university students.',
    problem: 'Students at Nigerian universities needed a trusted platform to buy, sell, and discover products within their campus ecosystem — without the noise of national e-commerce apps.',
    solution: 'React + Appwrite marketplace with a hollow aesthetic — transparent backgrounds, ghost buttons, deep navy palette. Share functionality with native OS sheet fallback.',
    stack: ['React', 'TypeScript', 'Appwrite', 'Cloudflare Pages'],
    gridSpan: 'col-span-12 md:col-span-5',
    height: 'h-[360px]',
    textForward: true,
  },
  {
    id: 'abkhd-store',
    name: 'ABKHD Store',
    tags: ['E-COMMERCE', 'ASTRO', 'APPWRITE', 'SQUAD'],
    oneLiner: 'A full e-commerce platform with integrated payments.',
    problem: 'ABKHD needed a storefront with per-city delivery fees, a streamlined checkout, and Squad payment integration — built fast and maintainable long-term.',
    solution: 'Astro + Appwrite e-commerce site with a three-step checkout wizard, per-city delivery fee logic, and Squad payment integration.',
    stack: ['Astro', 'Appwrite', 'Squad Payments', 'Tailwind CSS'],
    gridSpan: 'col-span-12 md:col-span-7',
    height: 'h-[360px]',
  },
];

export const SERVICES = [
  {
    number: '01',
    name: 'Custom Web Applications',
    tag: 'WEB / PLATFORM',
    headline: 'A production-ready web application — scoped, designed, and delivered on a signed timeline.',
    description: 'We build full-stack web applications from brief to deployment. Marketplace, institutional platform, dashboard, or customer-facing tool — scoped in writing, built in milestones, deployed with docs.',
    included: [
      'Signed scope document before work begins',
      'UI/UX design in your brand language',
      'Frontend: React / Next.js / TypeScript',
      'Backend + DB: Supabase / Firebase / Node.js',
      'Hosting setup and deployment',
      '2 revision rounds',
      'Post-launch support period'
    ],
    rightForYou: 'You have a product idea or operational problem and need a technical partner who takes a brief and delivers software — not just code.'
  },
  {
    number: '02',
    name: 'WhatsApp & AI Automation',
    tag: 'AUTOMATION',
    headline: 'Your business stops manually replying 200 WhatsApp messages a day. An AI handles it.',
    description: 'WhatsApp Business API setup, intelligent automated conversation flows, and AI integration for responses beyond scripted replies. For schools, clinics, logistics companies, and NGOs still running WhatsApp manually.',
    included: [
      'WhatsApp Cloud API setup + verification',
      'Conversation flow design',
      'AI model integration (intelligent fallback responses)',
      'CRM / spreadsheet integration (optional)',
      'Staff training and handover docs',
      'Maintenance retainer available'
    ],
    rightForYou: 'Your team spends hours daily replying to the same WhatsApp questions — admissions, orders, appointments.'
  },
  {
    number: '03',
    name: 'SMS & Omnichannel Campaigns',
    tag: 'MESSAGING',
    headline: 'Your message reaches 10,000 people in four hours. With the right words, to the right segments.',
    description: 'Bulk SMS, WhatsApp broadcast, and email campaigns — managed end-to-end. Copy, segmentation, scheduling, delivery, and reporting. You provide the list and objective.',
    included: [
      'Contact list management and segmentation',
      'Campaign copywriting',
      'Delivery via Termii / Sendchamp',
      'NDPR-compliant data handling',
      'Post-campaign delivery and open rate report'
    ],
    rightForYou: 'You need to reach a large audience — beneficiaries, customers, students, members — done properly, not from someone\'s personal phone.'
  },
  {
    number: '04',
    name: 'Retainer & Maintenance',
    tag: 'SUPPORT',
    headline: 'A technical partner on call, not a vendor who disappears after launch.',
    description: 'Structured monthly retainers for organisations with existing software needing ongoing support, updates, and a reliable technical contact.',
    included: [
      'Defined update requests per month',
      '48-hour maximum response time',
      'Uptime monitoring',
      'Security patches + dependency updates',
      'Monthly activity report'
    ],
    rightForYou: 'You have a live website or application that must stay current and secure, and you want one person accountable for it — not a chase every time something breaks.'
  }
];

export const PROCESS_STEPS = [
  {
    number: '01',
    name: 'Brief & Scope',
    description: 'You explain the need. We ask the right questions and send a written proposal within 48 hours.'
  },
  {
    number: '02',
    name: 'Agreement & Deposit',
    description: 'Signed contract and 50% deposit before a single line of code is written. Both parties protected.'
  },
  {
    number: '03',
    name: 'Build & Review',
    description: 'Milestone-based development with check-ins at each stage. You review. We refine. No final-day surprises.'
  },
  {
    number: '04',
    name: 'Launch & Handover',
    description: 'Deployment, access credentials, documentation. On final payment. Then we stay available.'
  }
];
