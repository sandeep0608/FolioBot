import { PortfolioConfig } from '../types';

export const SANDEEP_PORTFOLIO_CONFIG: PortfolioConfig = {
  name: 'Sandeep Tharakaram',
  title: 'Data-Driven Marketer, Vision AI Practitioner & Avid Gamer',
  bio: 'Having spent 8+ years driving growth funnels, content, and go-to-market strategies across multiple domains. Over the past 2 years my focus shifted toward Computer Vision. The more I started to explore and write about Computer Vision the more I wanted to actually build in it. Today, I explore the modern CV pipeline hands-on building projects around it. Parallel to vision tech, I’m a passionate PC gamer fascinated by game engines, real-time rendering pipelines, and immersive systems.',
  location: 'Bangalore, India (Open to Remote Worldwide)',
  email: 'tstsandeep@gmail.com',
  hireAvailability: 'Available for Vision AI GTM consulting, B2B AI marketing, and applied CV collaborations',
  socialLinks: [
    { id: '1', platform: 'Website', url: 'https://tsandeep.vercel.app/' },
    { id: '2', platform: 'GitHub', url: 'https://github.com/sandeep0608' },
    { id: '3', platform: 'LinkedIn', url: 'https://www.linkedin.com/in/sandeep-tharakaram/' },
  ],
  skills: [
    'Computer Vision',
    'OpenCV / OpenCV.js',
    'Python',
    'Model Context Protocol (MCP)',
    'Go-to-Market (GTM)',
    'B2B Product Marketing',
    'VLM / Qwen-VL',
    'Object Detection (RF-DETR)',
    'Data Analysis (pandas)',
    'SEO & Content Strategy',
    'Marketo & Email Marketing',
    'A/B Testing (VWO)',
    'React & Vite'
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Marketing Specialist',
      company: 'Big Vision LLC',
      period: 'Feb 2026 — Present',
      description: 'Own end-to-end GTM infrastructure for B2B AI consulting — positioning, case studies, and vertical-specific messaging. Built ICP and buyer-persona documentation for enterprise technical buyers (CTOs, Heads of Engineering) across 3 verticals. Run LinkedIn content strategy and outbound email sequences with full pipeline attribution; manage social presence across 12 channels.'
    },
    {
      id: 'exp-2',
      role: 'Marketing Specialist',
      company: 'OpenCV University',
      period: 'Nov 2024 — Jan 2026',
      description: 'Led email campaign strategy that lifted lead conversion from 0.15% to 1.5%. Authored 26 blog articles generating 130K+ views and a 2% conversion rate into bootcamp enrollments. Ran A/B testing (VWO) on key site elements and led influencer outreach to expand course reach.'
    },
    {
      id: 'exp-3',
      role: 'Marketing Manager',
      company: 'Soliflex Packaging Pvt Ltd',
      period: 'Dec 2023 — Oct 2024',
      description: 'Designed Marketo email campaigns averaging 26% open and 5% click-through. Led cross-platform lead generation and go-to-market strategy for product launches.'
    },
    {
      id: 'exp-4',
      role: 'Senior Marketing Executive',
      company: 'Great Learning',
      period: 'Jan 2021 — Sep 2023',
      description: 'Ran on-page SEO and keyword research driving organic blog traffic. A/B tested email and landing pages in Marketo for a 10% conversion lift; managed webinars and live events.'
    },
    {
      id: 'exp-5',
      role: 'Associate Category Manager',
      company: 'Unacademy',
      period: 'Sep 2019 — Nov 2020',
      description: 'Launched the CA and CLAT test-prep categories, owned category P&L and operations, onboarded educators, and grew the YouTube channel.'
    },
    {
      id: 'exp-6',
      role: 'Education',
      company: 'VTU & PES Institute of Technology, Bangalore',
      period: '2013 — 2017',
      description: 'MBA in Marketing (PESIT, 2017) and Bachelor of Engineering (B.E.) in Computer Science & Engineering (VTU, Bangalore).'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'CV Radar',
      description: 'An MCP server that keeps you current in computer vision - pulls new research and community activity from arXiv, Hugging Face, Reddit, Hacker News, Bluesky, and GitHub, and surfaces it on demand inside Claude from plain-language questions like "show me the latest CV papers." Built in Python with Model Context Protocol; text is sanitized to guard against prompt injection.',
      tech: ['Python', 'MCP (Model Context Protocol)', 'Computer Vision', 'APIs'],
      link: 'https://github.com/sandeep0608/cv_radar',
      metrics: 'Surfaces arXiv, Hugging Face & GitHub papers directly inside Claude'
    },
    {
      id: 'proj-2',
      title: 'Document Scanner',
      description: 'A client-side document scanner built with OpenCV.js and React/Vite. Perspective-corrects a photo of a page, cleans it up (color / grayscale / stroke-preserving B&W), and exports PNG or multi-page PDF - all in browser, nothing uploaded.',
      tech: ['OpenCV.js', 'React', 'Vite', 'Computer Vision'],
      link: 'https://tstsandeep.netlify.app',
      metrics: '100% client-side zero-upload private document correction'
    },
    {
      id: 'proj-3',
      title: 'Hot Wheels Finish-Line Detector',
      description: 'An OpenCV script that settles which toy car crosses the finish line first. Click two points to set the line; background subtraction detects each lane\'s crossing and reports the winning lane and time gap. Works from webcam or recorded video.',
      tech: ['Python', 'OpenCV', 'NumPy'],
      link: 'https://github.com/sandeep0608/Hot-Wheels-Finish-Line-Detector',
      metrics: 'Precision video frame lane tracking and winning time gap measurement'
    },
    {
      id: 'proj-4',
      title: 'RipeSense 2.0 (In Progress)',
      description: 'Multi-fruit detection + ripeness grading: detect and grade several fruits in one market-stall photo. Auto-labeling with Grounding DINO / SAM 3, a fine-tuned RF-DETR detector, proper mAP evaluation, and a live demo.',
      tech: ['RF-DETR', 'Grounding DINO', 'SAM 3', 'Object Detection'],
      metrics: 'Automated ripeness grading for market stalls'
    },
    {
      id: 'proj-5',
      title: 'DocSense-VL (In Progress)',
      description: 'A fine-tuned, optimized Vision-Language Model for structured data extraction and spatial reasoning over documents. QLoRA fine-tuning, INT8/FP8 quantization, FlashAttention, served via FastAPI on AWS.',
      tech: ['VLM', 'Qwen-VL', 'QLoRA', 'Quantization', 'FastAPI'],
      metrics: 'Sub-second spatial reasoning on complex multi-page layouts'
    },
    {
      id: 'proj-6',
      title: 'SocialPulse',
      description: 'A one-command social-media analytics dashboard generator: feed it a weekly CSV export and it builds a self-contained, interactive multi-page HTML report — KPIs, platform/timing breakdowns, hashtags, and a searchable post table.',
      tech: ['Python', 'pandas', 'Data Visualization'],
      link: 'https://github.com/sandeep0608/SocialPulse',
      metrics: 'Zero-dependency standalone HTML dashboard generator'
    },
    {
      id: 'proj-7',
      title: 'brand_voice_linter',
      description: 'A Python CLI that uses an LLM to check marketing copy against a brand\'s voice and compliance rules before human review. Flags risky guarantees, spam triggers, passive voice, and weak CTAs with severity scores.',
      tech: ['Python', 'LLM', 'CLI', 'Compliance'],
      link: 'https://github.com/sandeep0608/brand_voice_linter',
      metrics: 'Automated compliance and brand-guideline tone enforcement'
    },
    {
      id: 'proj-8',
      title: 'email_scrapper',
      description: 'A Python script that connects to Gmail over IMAP, finds every email from a given sender, and exports them to CSV while saving attachments locally. Standard library only.',
      tech: ['Python', 'IMAP', 'Automation'],
      link: 'https://github.com/sandeep0608/email_scrapper',
      metrics: 'Extracts message history and attachments without external dependencies'
    }
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'How do you bridge both Marketing and Computer Vision?',
      answer: 'With a B.E. in Computer Science and an MBA in Marketing, combined with 8+ years leading GTM and 2 years deeply implementing Computer Vision pipelines (OpenCV, MCP, VLMs), I uniquely bridge the gap between complex AI technical architecture and revenue-generating GTM strategies.'
    },
    {
      id: 'faq-2',
      question: 'What is CV Radar and how does it work?',
      answer: 'CV Radar is a Model Context Protocol (MCP) server written in Python. It aggregates fresh research and community updates from arXiv, Hugging Face, Reddit, Hacker News, Bluesky, and GitHub, letting users query the latest computer vision trends naturally inside Claude.'
    },
    {
      id: 'faq-3',
      question: 'What was your impact at OpenCV University and Big Vision?',
      answer: 'At OpenCV University, I lifted lead conversion from 0.15% to 1.5% and authored 26 articles with 130K+ views. At Big Vision LLC, I lead GTM infrastructure, ICP documentation for CTOs/Heads of Engineering, and multi-channel pipeline generation.'
    },
    {
      id: 'faq-4',
      question: 'Are you open to consulting or new opportunities?',
      answer: 'Yes! Sandeep is available for AI product marketing consulting, GTM strategy for AI/CV startups, and hands-on computer vision collaborations. Feel free to leave a message in the chat or email tstsandeep@gmail.com.'
    }
  ],
  persona: {
    botName: "Sandeep's Portfolio AI",
    avatarIcon: 'sparkles',
    primaryColor: '#0ea5e9',
    tone: 'friendly',
    speakingStyle: 'third_person_assistant',
    greetingMessage: "Hi there! 👋 I'm Sandeep's AI assistant. Ask me anything about Sandeep's work at Big Vision & OpenCV University, his Computer Vision projects (CV Radar, Document Scanner, Hot Wheels Detector), or how to collaborate!",
    inputPlaceholder: "Ask about Sandeep's projects, CV experience, or marketing...",
    customPrompt: 'Speak knowledgeably about both Computer Vision tech (OpenCV, MCP, VLMs) and B2B AI marketing/GTM strategy.',
    quickPrompts: [
      'Tell me about CV Radar',
      'What did you do at OpenCV University?',
      'Tell me about the Document Scanner project',
      'How can I get in touch with Sandeep?'
    ]
  }
};

export const TEMPLATES: Record<string, { label: string; config: PortfolioConfig }> = {
  tsandeep: {
    label: '⭐️ Sandeep Tharakaram (tsandeep.vercel.app)',
    config: SANDEEP_PORTFOLIO_CONFIG,
  },
  fullstack: {
    label: 'Full-Stack Engineer',
    config: SANDEEP_PORTFOLIO_CONFIG,
  },
  designer: {
    label: 'UI/UX & Product Designer',
    config: {
      ...SANDEEP_PORTFOLIO_CONFIG,
      name: 'Maya Chen',
      title: 'Principal Product & Interaction Designer',
      persona: {
        ...SANDEEP_PORTFOLIO_CONFIG.persona,
        botName: "Maya's Design Bot",
        primaryColor: '#ec4899',
      }
    }
  }
};
