import React, { useState } from 'react';
import {
  User,
  Wrench,
  FolderGit2,
  Briefcase,
  HelpCircle,
  Palette,
  Plus,
  Trash2,
  Sparkles,
  Bot,
  Zap,
  Brain,
  Code,
  Check,
  RotateCw
} from 'lucide-react';
import { PortfolioConfig, Project, Experience, FAQ, SocialLink } from '../types';

interface StudioTabProps {
  config: PortfolioConfig;
  onChange: (updated: PortfolioConfig) => void;
  onTestNow: () => void;
}

export const StudioTab: React.FC<StudioTabProps> = ({ config, onChange, onTestNow }) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'skills' | 'projects' | 'experience' | 'faqs' | 'persona'>('profile');
  const [newSkill, setNewSkill] = useState('');
  const [isGeneratingFaqs, setIsGeneratingFaqs] = useState(false);
  const [faqFeedback, setFaqFeedback] = useState<string | null>(null);

  // Profile update helpers
  const updateField = (field: keyof PortfolioConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const updatePersona = (field: string, value: any) => {
    onChange({
      ...config,
      persona: {
        ...config.persona,
        [field]: value,
      },
    });
  };

  // Skill helpers
  const addSkill = () => {
    if (newSkill.trim() && !config.skills.includes(newSkill.trim())) {
      updateField('skills', [...config.skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    updateField('skills', config.skills.filter((_, i) => i !== index));
  };

  // Project helpers
  const addProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: 'New Featured Project',
      description: 'Describe what problem this project solves and your architectural decisions.',
      tech: ['React', 'TypeScript'],
      link: 'https://github.com',
      metrics: 'Over 1,000 active users',
    };
    updateField('projects', [newProj, ...config.projects]);
  };

  const updateProject = (id: string, field: keyof Project, val: any) => {
    updateField(
      'projects',
      config.projects.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const removeProject = (id: string) => {
    updateField('projects', config.projects.filter((p) => p.id !== id));
  };

  // Experience helpers
  const addExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      role: 'Software Engineer',
      company: 'Tech Company',
      period: '2023 - Present',
      description: 'Key accomplishments, technologies used, and business impact.',
    };
    updateField('experience', [newExp, ...config.experience]);
  };

  const updateExperience = (id: string, field: keyof Experience, val: any) => {
    updateField(
      'experience',
      config.experience.map((e) => (e.id === id ? { ...e, [field]: val } : e))
    );
  };

  const removeExperience = (id: string) => {
    updateField('experience', config.experience.filter((e) => e.id !== id));
  };

  // FAQ helpers
  const addFaq = () => {
    const newFaq: FAQ = {
      id: `faq-${Date.now()}`,
      question: 'What is your preferred development workflow?',
      answer: 'I follow trunk-based development with comprehensive automated testing and continuous deployment.',
    };
    updateField('faqs', [...config.faqs, newFaq]);
  };

  const updateFaq = (id: string, field: keyof FAQ, val: any) => {
    updateField(
      'faqs',
      config.faqs.map((f) => (f.id === id ? { ...f, [field]: val } : f))
    );
  };

  const removeFaq = (id: string) => {
    updateField('faqs', config.faqs.filter((f) => f.id !== id));
  };

  // Auto-generate FAQs using Gemini API
  const handleAutoGenerateFaqs = async () => {
    setIsGeneratingFaqs(true);
    setFaqFeedback(null);
    try {
      const res = await fetch('/api/generate-faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioConfig: config }),
      });
      const data = await res.json();
      if (data.faqs && Array.isArray(data.faqs)) {
        const mapped = data.faqs.map((f: any, idx: number) => ({
          id: `ai-faq-${Date.now()}-${idx}`,
          question: f.question,
          answer: f.answer,
        }));
        updateField('faqs', [...config.faqs, ...mapped]);
        setFaqFeedback(`Generated ${mapped.length} new smart FAQs based on your profile!`);
      } else {
        setFaqFeedback('Could not parse generated FAQs.');
      }
    } catch (err: any) {
      setFaqFeedback('Error generating FAQs. Make sure Gemini API is available.');
    } finally {
      setIsGeneratingFaqs(false);
      setTimeout(() => setFaqFeedback(null), 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Studio Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Knowledge Base & Persona Studio
            </span>
            <span className="text-xs text-slate-400">Zero Hallucinations Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Configure Your Portfolio AI Persona
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Feed your actual skills, projects, and work history. When visitors chat with your portfolio, the Gemini AI stays strictly grounded in this knowledge base.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTestNow}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Test Live Chat</span>
          </button>
        </div>
      </div>

      {/* Main Studio Tabs & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-1 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl h-fit">
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Knowledge Modules
          </div>

          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
              activeSection === 'profile'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Bio</span>
          </button>

          <button
            onClick={() => setActiveSection('skills')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
              activeSection === 'skills'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Skills & Tech Stack</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {config.skills.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection('projects')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
              activeSection === 'projects'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Featured Projects</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {config.projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection('experience')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
              activeSection === 'experience'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Work Experience</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {config.experience.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection('faqs')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
              activeSection === 'faqs'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Pre-trained FAQs</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {config.faqs.length}
            </span>
          </button>

          <div className="pt-4 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-t border-slate-800">
            Bot Personality
          </div>

          <button
            onClick={() => setActiveSection('persona')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
              activeSection === 'persona'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Persona & Tone</span>
          </button>
        </div>

        {/* Editor Body */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100">
          {/* SECTION: PROFILE */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-semibold text-white">Portfolio Owner Profile</h2>
                <p className="text-sm text-slate-400">
                  Basic identifying details the chatbot uses to answer questions about who you are.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Sandeep Sharma"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Title / Role Headline</label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Senior Full-Stack Engineer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location & Remote Availability</label>
                  <input
                    type="text"
                    value={config.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. San Francisco, CA (Open to Remote Worldwide)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={config.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. hello@yourdomain.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Availability for Hire / Work Status</label>
                <input
                  type="text"
                  value={config.hireAvailability}
                  onChange={(e) => updateField('hireAvailability', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Available for Full-Time Staff roles & high-impact contracts starting in May"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Summary Bio / Elevator Pitch</label>
                <textarea
                  rows={4}
                  value={config.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Summarize your career, passion, and engineering philosophy..."
                />
              </div>

              {/* Social links */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Social / Portfolio Links</label>
                <div className="space-y-2">
                  {config.socialLinks.map((link, idx) => (
                    <div key={link.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={link.platform}
                        onChange={(e) => {
                          const updated = [...config.socialLinks];
                          updated[idx].platform = e.target.value;
                          updateField('socialLinks', updated);
                        }}
                        className="w-1/3 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                        placeholder="Platform (GitHub, LinkedIn)"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => {
                          const updated = [...config.socialLinks];
                          updated[idx].url = e.target.value;
                          updateField('socialLinks', updated);
                        }}
                        className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                        placeholder="https://..."
                      />
                      <button
                        onClick={() => {
                          updateField(
                            'socialLinks',
                            config.socialLinks.filter((_, i) => i !== idx)
                          );
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newLink: SocialLink = {
                        id: `link-${Date.now()}`,
                        platform: 'GitHub',
                        url: 'https://github.com/yourhandle',
                      };
                      updateField('socialLinks', [...config.socialLinks, newLink]);
                    }}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Social Link</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: SKILLS */}
          {activeSection === 'skills' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-semibold text-white">Skills & Technologies</h2>
                <p className="text-sm text-slate-400">
                  Add tools, languages, frameworks, and domains you excel at. The bot uses these to answer technical capability questions.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="e.g. Next.js, Kubernetes, Rust..."
                  className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>
              </div>

              {/* Tag Cloud */}
              <div className="flex flex-wrap gap-2 pt-2">
                {config.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-blue-300 border border-slate-700 text-xs font-medium group transition-all hover:border-slate-600"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(index)}
                      className="text-slate-400 hover:text-rose-400 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Quick suggestion pills */}
              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-400 mb-2">Common Quick Adds:</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'TypeScript',
                    'React',
                    'Next.js',
                    'Node.js',
                    'Python',
                    'Go',
                    'PostgreSQL',
                    'Tailwind CSS',
                    'Docker',
                    'AWS',
                    'GraphQL',
                    'Microservices',
                    'System Design',
                    'Gemini API'
                  ]
                    .filter((s) => !config.skills.includes(s))
                    .map((s) => (
                      <button
                        key={s}
                        onClick={() => updateField('skills', [...config.skills, s])}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800/50 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
                      >
                        + {s}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: PROJECTS */}
          {activeSection === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Featured Projects</h2>
                  <p className="text-sm text-slate-400">
                    Your chatbot will pitch these projects when visitors ask "What have you built?" or "Tell me about your best work".
                  </p>
                </div>
                <button
                  onClick={addProject}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-4">
                {config.projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                        className="font-semibold text-sm bg-transparent border-b border-transparent hover:border-slate-600 focus:border-blue-500 text-white focus:outline-none w-full"
                        placeholder="Project Title"
                      />
                      <button
                        onClick={() => removeProject(project.id)}
                        className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={project.description}
                      onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="What was built, technical challenges, and architecture..."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1">Tech Stack (comma separated)</label>
                        <input
                          type="text"
                          value={project.tech.join(', ')}
                          onChange={(e) =>
                            updateProject(
                              project.id,
                              'tech',
                              e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                            )
                          }
                          className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                          placeholder="React, TypeScript, Go..."
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Impact / Measurable Metrics</label>
                        <input
                          type="text"
                          value={project.metrics || ''}
                          onChange={(e) => updateProject(project.id, 'metrics', e.target.value)}
                          className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                          placeholder="e.g. 50k monthly active users, 40% latency reduction"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 block text-xs mb-1">Demo or Repository URL</label>
                      <input
                        type="text"
                        value={project.link || ''}
                        onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                        className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: EXPERIENCE */}
          {activeSection === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Work Experience</h2>
                  <p className="text-sm text-slate-400">
                    Roles, companies, and impact you've delivered throughout your career.
                  </p>
                </div>
                <button
                  onClick={addExperience}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-4">
                {config.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                          className="font-medium text-xs bg-slate-900/60 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-white"
                          placeholder="Role / Title"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          className="font-medium text-xs bg-slate-900/60 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-white"
                          placeholder="Company / Organization"
                        />
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                          className="font-medium text-xs bg-slate-900/60 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-white"
                          placeholder="e.g. 2021 - 2024"
                        />
                      </div>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-slate-400 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Key achievements, team size, core technologies, and outcomes..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: FAQS */}
          {activeSection === 'faqs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Frequently Asked Questions</h2>
                  <p className="text-sm text-slate-400">
                    Pre-set answers for common recruiter or client inquiries (rates, tech preferences, mentoring, relocation).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAutoGenerateFaqs}
                    disabled={isGeneratingFaqs}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-medium transition-all"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isGeneratingFaqs ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingFaqs ? 'Generating...' : 'Auto-Generate with AI'}</span>
                  </button>

                  <button
                    onClick={addFaq}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add FAQ</span>
                  </button>
                </div>
              </div>

              {faqFeedback && (
                <div className="p-3 bg-purple-950/40 border border-purple-800/60 text-purple-200 text-xs rounded-xl flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{faqFeedback}</span>
                </div>
              )}

              <div className="space-y-4">
                {config.faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(faq.id, 'question', e.target.value)}
                        className="font-medium text-xs bg-slate-900/60 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-white w-full"
                        placeholder="Question (e.g. What is your rate or availability?)"
                      />
                      <button
                        onClick={() => removeFaq(faq.id)}
                        className="text-slate-400 hover:text-rose-400 p-1 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => updateFaq(faq.id, 'answer', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                      placeholder="Answer..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: PERSONA & WIDGET */}
          {activeSection === 'persona' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-semibold text-white">Bot Personality & Appearance</h2>
                <p className="text-sm text-slate-400">
                  Customize how your chatbot introduces itself, speaks to visitors, and matches your portfolio's visual aesthetic.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bot Name</label>
                  <input
                    type="text"
                    value={config.persona.botName}
                    onChange={(e) => updatePersona('botName', e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Sandeep's Portfolio AI"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Brand Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config.persona.primaryColor}
                      onChange={(e) => updatePersona('primaryColor', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={config.persona.primaryColor}
                      onChange={(e) => updatePersona('primaryColor', e.target.value)}
                      className="w-32 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <div className="flex gap-1.5">
                      {['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'].map((col) => (
                        <button
                          key={col}
                          onClick={() => updatePersona('primaryColor', col)}
                          className="w-6 h-6 rounded-full border border-white/20 transition-transform hover:scale-110"
                          style={{ backgroundColor: col }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tone & Communication Style</label>
                  <select
                    value={config.persona.tone}
                    onChange={(e) => updatePersona('tone', e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="friendly">Friendly & Approachable (Warm & enthusiastic)</option>
                    <option value="professional">Executive & Professional (Direct & polished)</option>
                    <option value="concise">Concise & Direct (Brief bullets, high signal)</option>
                    <option value="techie">Technical & Architectural (Deep tech nuance)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Speaking Perspective</label>
                  <select
                    value={config.persona.speakingStyle}
                    onChange={(e) => updatePersona('speakingStyle', e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="third_person_assistant">AI Assistant ("Sandeep is a senior engineer who...")</option>
                    <option value="first_person">First-Person Digital Twin ("I am Sandeep, I built...")</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Welcome Greeting Message</label>
                <textarea
                  rows={2}
                  value={config.persona.greetingMessage}
                  onChange={(e) => updatePersona('greetingMessage', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Greeting shown when a visitor opens the chat widget..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Custom System Instruction Modifier (Optional)</label>
                <input
                  type="text"
                  value={config.persona.customPrompt || ''}
                  onChange={(e) => updatePersona('customPrompt', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Always highlight my passion for accessibility and distributed systems."
                />
              </div>

              {/* Quick Prompt Pills */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Suggested Quick-Click Prompts (Shown above the input)
                </label>
                <div className="space-y-2">
                  {config.persona.quickPrompts.map((prompt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={prompt}
                        onChange={(e) => {
                          const updated = [...config.persona.quickPrompts];
                          updated[idx] = e.target.value;
                          updatePersona('quickPrompts', updated);
                        }}
                        className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                      <button
                        onClick={() => {
                          updatePersona(
                            'quickPrompts',
                            config.persona.quickPrompts.filter((_, i) => i !== idx)
                          );
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      updatePersona('quickPrompts', [
                        ...config.persona.quickPrompts,
                        'Are you open to remote work?',
                      ]);
                    }}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Quick Prompt</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
