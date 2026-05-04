export const PROJECTS = [
  {
    id: 'studywise',
    name: 'StudyWise AI',
    tags: ['AI', 'NODE.JS', 'TYPESCRIPT', 'SUPABASE'],
    oneLiner: 'Intelligent test generator powered by multi-provider AI.',
    description: 'StudyWise AI is a modern full-stack intelligent test generator that transforms any text content into personalized study materials using Google Gemini, Claude, and GPT models.',
    problem: 'Modern learners needed a way to quickly turn dense documents into practice materials without losing source context.',
    solution: 'Implemented a resilient multi-AI system with intelligent failover. Features source-linked questions, real-time tests with auto-save, and comprehensive learning analytics.',
    stack: ['Zustand', 'Node.js', 'PDF.js', 'TypeScript', 'Gemini'],
    image: 'https://res.cloudinary.com/cloudinary-lycan-xx/image/upload/v1776321894/portfolio/qgt62ajonllg3jmors5k.jpg',
    gridSpan: 'col-span-12 md:col-span-7',
    height: 'h-[420px]',
  },
  {
    id: 'abkhd',
    name: 'ABKHD Store',
    tags: ['E-COMMERCE', 'ASTRO', 'APPWRITE', 'SQUAD'],
    oneLiner: 'High-performance ecommerce platform for the Nigerian tech market.',
    description: 'ABKHD Store is a modern, high-performance ecommerce platform purpose-built for tech enthusiasts in the Nigerian market, delivering a premium shopping experience with lightning-fast static pages.',
    problem: 'The Nigerian market lacked an open-source, production-ready ecommerce platform optimized for local payment infrastructure and regional delivery logistics.',
    solution: 'Developed using Astro 5 and Appwrite, integrating Squad payment gateway natively. Includes delivery zone support for Yola/Jimeta and WhatsApp ordering fallback.',
    stack: ['Astro', 'Appwrite', 'Squad Payments', 'Tailwind CSS'],
    image: 'https://res.cloudinary.com/cloudinary-lycan-xx/image/upload/v1776307469/portfolio/fqwipu0lono4badrjzdw.png',
    gridSpan: 'col-span-12 md:col-span-5',
    height: 'h-[420px]',
  },
  {
    id: 'kugal-jobs',
    name: 'Kugal Jobs',
    tags: ['MARKETPLACE', 'TYPESCRIPT', 'SUPABASE', 'RESEND'],
    oneLiner: 'Privacy-first job board for the Northern Nigerian tech community.',
    description: 'Kugals Jobs is a modern, privacy-first job board platform built specifically for the Northern Nigerian tech and professional community, eliminating registration barriers for job seekers.',
    problem: 'Traditional hiring systems in Northern Nigeria were high-friction, often requiring complex registrations just to browse or apply for jobs.',
    solution: 'Built with React and Supabase, allowing application via email tokens. Includes an automated fraud detection system and custom application form builders for employers.',
    stack: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Resend'],
    image: 'https://res.cloudinary.com/cloudinary-lycan-xx/image/upload/v1776308688/portfolio/igfrwvtqv8kav7ndklbo.png',
    gridSpan: 'col-span-12 md:col-span-5',
    height: 'h-[360px]',
    textForward: true,
  },
  {
    id: 'jalolink',
    name: 'Jalolink',
    tags: ['MARKETPLACE', 'APPWRITE', 'PAYSTACK', 'MOBILE'],
    oneLiner: 'Mobile-first campus marketplace with privacy-centric design.',
    description: 'Jalolink is a modern, mobile-first e-commerce platform purpose-built for campus communities, designed to eliminate friction in student purchasing.',
    problem: 'University students needed a trusted, low-friction way to buy and sell on campus without permanent data storage risks.',
    solution: 'Full-stack React app with Appwrite and Paystack. Features client-side image compression, anti-forgery PNG receipts, and 48-hour data retention for privacy.',
    stack: ['React', 'TypeScript', 'Appwrite', 'Paystack', 'Tailwind CSS'],
    image: 'https://res.cloudinary.com/cloudinary-lycan-xx/image/upload/v1776309526/portfolio/ziuymlcx6cvnchybyp9c.png',
    gridSpan: 'col-span-12 md:col-span-7',
    height: 'h-[360px]',
  },
  {
    id: 'resumeforge',
    name: 'ResumeForge',
    tags: ['OPEN SOURCE', 'REACT', 'FIREBASE', 'OFFLINE-FIRST'],
    oneLiner: 'ATS-optimized resume builder with real-time PDF generation.',
    description: 'ResumeForge is a modern, open-source offline-first resume builder designed for real-time PDF generation and reliable cloud syncing.',
    problem: 'Most resume builders are either complex or hide PDF exports behind paywalls, lacking reliable offline capabilities.',
    solution: 'Queue-based sync system with Firebase and local storage. Uses @react-pdf/renderer for real-time visual feedback and exports unlimited free PDFs.',
    stack: ['React', 'Firebase', 'Vite', 'Tailwind CSS', 'shadcn'],
    image: 'https://res.cloudinary.com/cloudinary-lycan-xx/image/upload/v1776306778/portfolio/pooiummhlqfgro6qntnj.png',
    gridSpan: 'col-span-12',
    height: 'h-[420px]',
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
