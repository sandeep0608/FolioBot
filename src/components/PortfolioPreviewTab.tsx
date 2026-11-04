import React, { useState } from 'react';
import {
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  Smartphone,
  Monitor,
  Bot,
  Terminal,
  Code2,
} from 'lucide-react';
import { PortfolioConfig } from '../types';
import { ChatWidget } from './ChatWidget';

interface PortfolioPreviewTabProps {
  config: PortfolioConfig;
  onLeadCaptured: () => void;
}

export const PortfolioPreviewTab: React.FC<PortfolioPreviewTabProps> = ({
  config,
  onLeadCaptured,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeNav, setActiveNav] = useState<'Home' | 'Work' | 'Projects'>('Home');

  const primaryColor = config.persona.primaryColor || '#0ea5e9';

  const testPersonas = [
    {
      title: 'Vision AI Recruiter',
      badge: 'Hiring',
      question: `What is ${config.name}'s experience in Computer Vision and B2B AI marketing?`,
    },
    {
      title: 'Senior Engineer',
      badge: 'Tech Stack',
      question: `Can you explain the technical architecture of CV Radar (MCP Server) and Document Scanner?`,
    },
    {
      title: 'AI Startup Founder',
      badge: 'GTM Strategy',
      question: `What results did ${config.name} achieve at Big Vision LLC and OpenCV University?`,
    },
    {
      title: 'Prospective Client',
      badge: 'Availability',
      question: `Is Sandeep available for consulting, and what is the best way to contact him?`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Simulation Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">Live Simulator: tsandeep.vercel.app</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Astro + Vercel Preview
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive preview of your actual website with FolioBot docked at the bottom right.
            </p>
          </div>
        </div>

        {/* Viewport switch */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 flex items-center gap-1">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 font-medium transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 font-medium transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Visitor Persona Test Chips */}
      <div className="mb-6 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Test As Website Visitor (Clicking opens the floating bot with this question):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {testPersonas.map((persona, i) => (
            <div
              key={i}
              className="text-left p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-sky-500/40 transition-all group"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-200 group-hover:text-sky-400 transition-colors">
                  {persona.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                  {persona.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                &ldquo;{persona.question}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Container Wrapper */}
      <div
        className={`mx-auto transition-all duration-300 ${
          deviceMode === 'mobile' ? 'max-w-[420px]' : 'max-w-full'
        }`}
      >
        <div className="relative bg-[#0d1117] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl min-h-[750px] font-sans">
          {/* Mock Browser Header */}
          <div className="bg-[#161b22] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            </div>
            <div className="bg-[#0d1117] px-4 py-1 rounded-md text-slate-300 font-mono text-[11px] truncate max-w-[260px] sm:max-w-md border border-slate-800">
              https://tsandeep.vercel.app/
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Astro • Vercel</span>
            </div>
          </div>

          {/* Actual Header of tsandeep.vercel.app */}
          <header className="px-6 sm:px-12 py-5 border-b border-slate-800/80 flex items-center justify-between max-w-4xl mx-auto">
            <a href="#home" className="font-bold text-lg text-white hover:text-sky-400 transition-colors">
              Sandeep T
            </a>
            <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400">
              <button
                onClick={() => setActiveNav('Home')}
                className={`transition-colors ${activeNav === 'Home' ? 'text-white font-medium underline underline-offset-4' : 'hover:text-slate-200'}`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveNav('Work')}
                className={`transition-colors ${activeNav === 'Work' ? 'text-white font-medium underline underline-offset-4' : 'hover:text-slate-200'}`}
              >
                Work
              </button>
              <button
                onClick={() => setActiveNav('Projects')}
                className={`transition-colors ${activeNav === 'Projects' ? 'text-white font-medium underline underline-offset-4' : 'hover:text-slate-200'}`}
              >
                Projects
              </button>
              <span className="hover:text-slate-200 cursor-pointer hidden sm:inline">Writing</span>
              <span className="hover:text-slate-200 cursor-pointer hidden sm:inline">Blog</span>
              <span className="hover:text-slate-200 cursor-pointer hidden sm:inline">Books</span>
              <span className="hover:text-slate-200 cursor-pointer hidden sm:inline">Now</span>
            </nav>
          </header>

          {/* Content Body */}
          <main className="p-6 sm:p-12 text-slate-200 max-w-4xl mx-auto space-y-10">
            {activeNav === 'Home' && (
              <>
                {/* Intro / Hero */}
                <section className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {config.name}
                  </h1>
                  <p className="text-sm sm:text-base text-sky-400 font-medium">
                    {config.title}
                  </p>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    Hi, I am <strong>Sandeep T</strong>.<br />
                    Having spent 8+ years driving growth funnels, content, and go-to-market strategies across multiple domains. Over the past 2 years my focus shifted toward <strong>Computer Vision</strong>. The more I started to explore and write about Computer Vision the more I wanted to actually build in it.<br />
                    Today, I explore the modern CV pipeline hands-on building projects around it.
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Parallel to vision tech, I’m a passionate PC gamer fascinated by game engines, real-time rendering pipelines, and immersive systems.
                  </p>
                </section>

                {/* Interests */}
                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-white">Interests</h2>
                  <p className="text-sm text-slate-400">
                    Computer vision, Product Marketing, go-to-market and growth, content strategy, data analysis &amp; gaming.
                  </p>
                </section>

                {/* Featured Projects snippet */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Featured projects</h2>
                    <button
                      onClick={() => setActiveNav('Projects')}
                      className="text-xs text-sky-400 hover:underline"
                    >
                      All projects &rarr;
                    </button>
                  </div>

                  <div className="space-y-3">
                    {config.projects.slice(0, 3).map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-xl bg-[#161b22] border border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm text-white">{proj.title}</h3>
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-sky-400 hover:underline flex items-center gap-1"
                            >
                              <span>{proj.link.includes('netlify') ? 'Live' : 'Code'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {proj.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.tech.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {activeNav === 'Work' && (
              <section className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">Work Experience</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    8+ years across marketing, growth, and go-to-market — increasingly at the intersection with AI and computer vision.
                  </p>
                </div>

                <div className="space-y-6 border-l-2 border-slate-800 pl-4">
                  {config.experience.map((exp) => (
                    <div key={exp.id} className="relative space-y-1.5">
                      <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-sky-500" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                        <strong className="text-sm font-semibold text-white">
                          {exp.role} · <span className="text-slate-300">{exp.company}</span>
                        </strong>
                        <span className="text-slate-400">{exp.period}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeNav === 'Projects' && (
              <section className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">Projects</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Hands-on Computer Vision, MCP servers, and data intelligence tools.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {config.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-base text-white">{proj.title}</h3>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-sky-400 hover:underline flex items-center gap-1"
                          >
                            <span>Visit / Source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {proj.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.tech.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-sky-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Footer */}
            <footer className="pt-8 border-t border-slate-800 text-xs text-slate-500 space-y-2">
              <div className="flex gap-4">
                <a href="https://github.com/sandeep0608" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/sandeep-tharakaram/" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
                  LinkedIn
                </a>
                <a href="mailto:tstsandeep@gmail.com" className="text-sky-400 hover:underline">
                  Email
                </a>
              </div>
              <p>© {new Date().getFullYear()} Sandeep Tharakaram · Bangalore, India</p>
            </footer>
          </main>

          {/* Docked FolioBot Widget */}
          <ChatWidget
            config={config}
            isOpenDefault={false}
            onLeadCaptured={onLeadCaptured}
            floating={true}
          />
        </div>
      </div>
    </div>
  );
};
