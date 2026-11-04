import React from 'react';
import { Bot, Sparkles, Layout, Code2, Users, BookOpen, RotateCcw } from 'lucide-react';
import { ActiveTab, PortfolioConfig } from '../types';
import { TEMPLATES } from '../data/templates';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  portfolioConfig: PortfolioConfig;
  onSelectTemplate: (templateKey: string) => void;
  onResetToDefault: () => void;
  leadsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  portfolioConfig,
  onSelectTemplate,
  onResetToDefault,
  leadsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: portfolioConfig.persona.primaryColor || '#3b82f6' }}
          >
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                FolioBot <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium">Studio</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Portfolio Chatbot Builder & Embed Generator
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <SlidersIcon className="w-3.5 h-3.5" />
            <span>Bot Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Live Portfolio Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('embed')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'embed'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Embed & Code</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>How to Build Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap relative ${
              activeTab === 'leads'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Leads</span>
            {leadsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-[10px] text-white flex items-center justify-center font-bold">
                {leadsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Template Switcher & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <select
              aria-label="Preset Portfolio Template"
              onChange={(e) => {
                if (e.target.value) onSelectTemplate(e.target.value);
              }}
              defaultValue="fullstack"
              className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="" disabled>Load Preset...</option>
              {Object.entries(TEMPLATES).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onResetToDefault}
            title="Reset to default config"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

function SlidersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="1" x2="7" y1="14" y2="14" />
      <line x1="9" x2="15" y1="8" y2="8" />
      <line x1="17" x2="23" y1="16" y2="16" />
    </svg>
  );
}
