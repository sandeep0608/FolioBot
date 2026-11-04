import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  Terminal,
  Cpu,
  Layers,
  HelpCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface GuideTabProps {
  onGoToStudio: () => void;
  onGoToPreview: () => void;
  onGoToEmbed: () => void;
}

export const GuideTab: React.FC<GuideTabProps> = ({
  onGoToStudio,
  onGoToPreview,
  onGoToEmbed,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-slate-100">
      {/* Hero */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 inline-flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          Complete Architectural Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How to Build an AI Chatbot for Your Portfolio Website
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Step-by-step blueprint for designing, grounding, securing, and embedding an intelligent AI representative on your portfolio.
        </p>
      </div>

      {/* Quick Nav Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={onGoToStudio}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-left transition-all group shadow-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-white group-hover:text-blue-400 transition-colors">
            1. Knowledge Base Studio
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Fill in your projects, resume, tech stack, and FAQs.
          </p>
        </button>

        <button
          onClick={onGoToPreview}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-left transition-all group shadow-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-white group-hover:text-purple-400 transition-colors">
            2. Live Test Lab
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Test as a Recruiter, Founder, or Tech Lead with streaming chat.
          </p>
        </button>

        <button
          onClick={onGoToEmbed}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group shadow-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-white group-hover:text-emerald-400 transition-colors">
            3. Copy Embed Code
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Grab the HTML script, React component, or backend proxy code.
          </p>
        </button>
      </div>

      {/* The 4-Step Breakdown */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3">
          The 4 Pillars of a Production Portfolio Chatbot
        </h2>

        {/* Step 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
              1
            </span>
            <h3 className="text-base font-semibold text-white">
              Data Grounding vs Fine-Tuning (Why RAG / Prompt Grounding Wins)
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-11">
            Many developers mistakenly think they need to fine-tune a model to build a portfolio bot. <strong>You don&apos;t!</strong> Fine-tuning is slow, expensive, and causes models to hallucinate past experience.
            Instead, we use <strong>System Instruction Grounding</strong> with <code>gemini-3.8-flash</code>. All your projects, tech stack, employment history, and FAQs are fed as structured context in the system prompt. The model reasons over your exact facts with near-zero latency and high fidelity.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-bold text-sm flex items-center justify-center">
              2
            </span>
            <h3 className="text-base font-semibold text-white">
              Securing Your Gemini API Key (The Proxy Architecture)
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-11">
            <strong>Never expose your API key in client-side JavaScript.</strong> Anyone inspecting browser DevTools could copy it and drain your quota.
            The correct architecture is:
          </p>
          <div className="bg-slate-950 p-3.5 rounded-xl text-xs font-mono text-slate-300 ml-11 border border-slate-800">
            [Portfolio Visitor Browser] ──▶ POST /api/chat (Serverless API) ──▶ [Gemini 3.8 Flash]
          </div>
          <p className="text-xs text-slate-400 pl-11">
            Your serverless route (Next.js <code>/api/chat/route.ts</code>, Netlify function, or Node.js Express server) holds <code>process.env.GEMINI_API_KEY</code> securely, checks rate limits, and streams tokens back to the visitor.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
              3
            </span>
            <h3 className="text-base font-semibold text-white">
              Delightful UX & Conversational Lead Capture
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-11">
            A portfolio chatbot is more than just Q&A—it is a 24/7 recruiter conversion engine! Key features we have included in FolioBot:
          </p>
          <ul className="text-xs text-slate-300 space-y-2 pl-15 list-disc ml-11">
            <li><strong>Quick-Reply Chips:</strong> Visitors can click &ldquo;What are your top projects?&rdquo; or &ldquo;Are you available for hire?&rdquo; without typing.</li>
            <li><strong>Voice Readout (TTS):</strong> Speaks the response aloud using the Web Speech API or Gemini audio.</li>
            <li><strong>Lead Capture Modal:</strong> Whenever a recruiter or prospective client wants to get in touch, they can leave their name and email directly in the chat widget.</li>
          </ul>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold text-sm flex items-center justify-center">
              4
            </span>
            <h3 className="text-base font-semibold text-white">
              Deploying onto Your Existing Portfolio Site
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pl-11">
            Depending on how your portfolio is hosted:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-11 pt-1">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span className="font-semibold text-white block mb-1">If using React, Next.js, or Astro:</span>
              Copy our <code>PortfolioChatbot.tsx</code> component directly into your <code>components/</code> directory.
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span className="font-semibold text-white block mb-1">If using Webflow, Framer, or HTML:</span>
              Paste the 1-line script tag snippet into your site&apos;s custom code settings before the <code>&lt;/body&gt;</code> tag.
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <h4 className="font-semibold text-xs text-white">How much does it cost to run?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gemini 3.8 Flash is extremely cost-efficient and includes a generous free tier. For a personal portfolio receiving hundreds of visits a month, it will typically cost less than a few cents.
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <h4 className="font-semibold text-xs text-white">How do I prevent hallucinations?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We configure the system prompt with strict bounding rules: &ldquo;Ground your answers strictly in the provided profile. If an item is not listed, say so politely.&rdquo;
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <h4 className="font-semibold text-xs text-white">Can it speak in first person?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes! In the Persona tab, you can toggle between <em>First-Person</em> (&ldquo;I am Sandeep, I built...&rdquo;) and <em>Third-Person Assistant</em> (&ldquo;Sandeep is an engineer who...&rdquo;).
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <h4 className="font-semibold text-xs text-white">Can I change colors to match my brand?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Absolutely. The primary accent color picker in the Studio tab dynamically alters the launcher bubble, badges, and user chat bubbles.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl font-bold text-white">Ready to customize your portfolio chatbot?</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Start in the Bot Studio tab to input your real experience and projects, or test it out right now in the Live Preview tab.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onGoToStudio}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-transform hover:scale-105"
          >
            Open Bot Studio
          </button>
          <button
            onClick={onGoToPreview}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-semibold transition-transform hover:scale-105"
          >
            Launch Live Preview
          </button>
        </div>
      </div>
    </div>
  );
};
