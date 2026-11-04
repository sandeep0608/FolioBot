import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Cpu,
  CheckCircle2,
  Globe,
  Rocket,
  FileCode,
} from 'lucide-react';
import { PortfolioConfig } from '../types';

interface EmbedGuideTabProps {
  config: PortfolioConfig;
}

export const EmbedGuideTab: React.FC<EmbedGuideTabProps> = ({ config }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'astro' | 'react' | 'script' | 'config'>('astro');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadConfig = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${config.name.toLowerCase().replace(/\s+/g, '-')}-portfolio-chatbot.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Astro API Route: src/pages/api/chat.ts
  const astroApiSnippet = `// File: src/pages/api/chat.ts (inside your Astro project)
import type { APIRoute } from 'astro';
import { GoogleGenAI } from '@google/genai';

// Mark route as dynamic serverless function on Vercel
export const prerender = false;

// Initialize Google GenAI client
const ai = new GoogleGenAI({
  apiKey: import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' },
  },
});

// Grounding Knowledge Base for Sandeep Tharakaram (tsandeep.vercel.app)
const SYSTEM_INSTRUCTION = \`You are Sandeep's AI representative on his personal portfolio website (https://tsandeep.vercel.app).
Refer to Sandeep in the third person or as his portfolio assistant in a warm, knowledgeable, and technically articulate tone.

Key Facts about Sandeep:
- Name: \${JSON.stringify("${config.name}")}
- Title: \${JSON.stringify("${config.title}")}
- Location: \${JSON.stringify("${config.location}")}
- Email: \${JSON.stringify("${config.email}")}
- Bio: \${JSON.stringify("${config.bio.replace(/"/g, '\\"')}")}
- Availability: \${JSON.stringify("${config.hireAvailability}")}

Featured Projects & Experience:
${config.projects.map((p) => `* **${p.title}** (${p.tech.join(', ')}): ${p.description} ${p.link ? `[${p.link}]` : ''}`).join('\n')}

Work Experience:
${config.experience.map((e) => `* **${e.role}** at ${e.company} (${e.period}): ${e.description}`).join('\n')}

Core FAQs:
${config.faqs.map((f) => `* Q: "${f.question}" -> A: "${f.answer}"`).join('\n')}

CRITICAL INSTRUCTIONS:
1. Always ground your facts strictly in the profile data above. Do not hallucinate credentials, clients, or skills not listed.
2. If asked about CV Radar, explain it is an MCP (Model Context Protocol) server in Python pulling research from arXiv, Hugging Face, Reddit, Hacker News, Bluesky, and GitHub inside Claude.
3. If asked about Document Scanner, explain it uses OpenCV.js in browser with React/Vite for client-side perspective correction.
4. If a visitor asks about hiring or consulting, invite them to email tstsandeep@gmail.com or leave a note.\`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages required' }), { status: 400 });
    }

    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(m.text || m.content || '') }],
    }));

    const streamResponse = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of streamResponse) {
          const text = chunk.text || '';
          if (text) {
            controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ text })}\\n\\n\`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\\n\\n'));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Chat generation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};`;

  // Astro Component: src/components/Chatbot.astro
  const astroComponentSnippet = `---
// File: src/components/Chatbot.astro
// Drops right into your Astro layout (e.g. src/layouts/Layout.astro)
---

<div id="foliobot-container" class="foliobot-root">
  <!-- Floating Launch Button -->
  <button id="foliobot-toggle" class="foliobot-btn" aria-label="Chat with Sandeep's AI">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  </button>

  <!-- Chat Window -->
  <div id="foliobot-window" class="foliobot-window foliobot-hidden">
    <div class="foliobot-header">
      <div class="foliobot-title">
        <span class="status-dot"></span>
        <strong>Sandeep's Portfolio AI</strong>
      </div>
      <button id="foliobot-close" class="close-btn" aria-label="Close chat">&times;</button>
    </div>

    <div id="foliobot-messages" class="foliobot-messages">
      <div class="msg assistant">
        Hi there! 👋 I'm Sandeep's AI assistant. Ask me anything about his work at Big Vision & OpenCV University, Computer Vision projects (CV Radar, Document Scanner, Hot Wheels Detector), or how to collaborate!
      </div>
    </div>

    <!-- Quick Prompt Chips -->
    <div class="foliobot-chips">
      <button class="chip" data-prompt="Tell me about CV Radar">CV Radar</button>
      <button class="chip" data-prompt="What did you do at OpenCV University?">OpenCV University</button>
      <button class="chip" data-prompt="Tell me about Document Scanner">Doc Scanner</button>
      <button class="chip" data-prompt="How can I contact Sandeep?">Contact</button>
    </div>

    <!-- Input Form -->
    <form id="foliobot-form" class="foliobot-form">
      <input
        type="text"
        id="foliobot-input"
        placeholder="Ask about projects, CV, marketing..."
        autocomplete="off"
      />
      <button type="submit" id="foliobot-send" aria-label="Send message">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  </div>
</div>

<style>
  .foliobot-root {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    font-family: system-ui, -apple-system, sans-serif;
  }
  .foliobot-btn {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #0ea5e9;
    color: white;
    border: none;
    box-shadow: 0 4px 20px rgba(14, 165, 233, 0.4);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
  }
  .foliobot-btn:hover {
    transform: scale(1.08);
  }
  .foliobot-window {
    width: 360px;
    max-width: calc(100vw - 32px);
    height: 520px;
    max-height: calc(100vh - 100px);
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: absolute;
    bottom: 64px;
    right: 0;
  }
  .foliobot-hidden {
    display: none !important;
  }
  .foliobot-header {
    background: #1f2937;
    padding: 12px 16px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }
  .foliobot-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
  }
  .close-btn {
    background: none;
    border: none;
    color: #9ca3af;
    font-size: 20px;
    cursor: pointer;
  }
  .foliobot-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 13px;
    color: #e5e7eb;
  }
  .msg {
    padding: 10px 14px;
    border-radius: 12px;
    line-height: 1.5;
    max-width: 85%;
    word-break: break-word;
  }
  .msg.assistant {
    background: #1f2937;
    color: #f3f4f6;
    align-self: flex-start;
  }
  .msg.user {
    background: #0ea5e9;
    color: white;
    align-self: flex-end;
  }
  .foliobot-chips {
    padding: 6px 12px;
    display: flex;
    gap: 6px;
    overflow-x: auto;
    background: #111827;
    border-top: 1px solid #1f2937;
  }
  .chip {
    background: #1f2937;
    color: #9ca3af;
    border: 1px solid #374151;
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 11px;
    cursor: pointer;
    white-space: nowrap;
  }
  .chip:hover {
    color: white;
    background: #374151;
  }
  .foliobot-form {
    padding: 12px;
    background: #111827;
    border-top: 1px solid #1f2937;
    display: flex;
    gap: 8px;
  }
  .foliobot-form input {
    flex: 1;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 8px;
    padding: 8px 12px;
    color: white;
    font-size: 13px;
    outline: none;
  }
  .foliobot-form button {
    background: #0ea5e9;
    color: white;
    border: none;
    border-radius: 8px;
    width: 36px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<script>
  const toggleBtn = document.getElementById('foliobot-toggle');
  const closeBtn = document.getElementById('foliobot-close');
  const chatWindow = document.getElementById('foliobot-window');
  const form = document.getElementById('foliobot-form');
  const input = document.getElementById('foliobot-input') as HTMLInputElement;
  const messagesBox = document.getElementById('foliobot-messages');
  const chips = document.querySelectorAll('.chip');

  const history: { role: 'user' | 'assistant'; text: string }[] = [];

  toggleBtn?.addEventListener('click', () => {
    chatWindow?.classList.toggle('foliobot-hidden');
    if (!chatWindow?.classList.contains('foliobot-hidden')) {
      input?.focus();
    }
  });

  closeBtn?.addEventListener('click', () => {
    chatWindow?.classList.add('foliobot-hidden');
  });

  chips.forEach((c) => {
    c.addEventListener('click', () => {
      const p = c.getAttribute('data-prompt');
      if (p) sendUserMessage(p);
    });
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input && input.value.trim()) {
      sendUserMessage(input.value.trim());
      input.value = '';
    }
  });

  async function sendUserMessage(text: string) {
    appendMsg(text, 'user');
    history.push({ role: 'user', text });

    const botMsgDiv = appendMsg('...', 'assistant');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error('Failed to fetch reply');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let botAccumulated = '';

      if (reader) {
        botMsgDiv.textContent = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split('\\n')) {
            if (line.startsWith('data: ')) {
              const data = line.replace('data: ', '').trim();
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  botAccumulated += parsed.text;
                  botMsgDiv.textContent = botAccumulated;
                  messagesBox?.scrollTo({ top: messagesBox.scrollHeight, behavior: 'smooth' });
                }
              } catch {}
            }
          }
        }
      }
      history.push({ role: 'assistant', text: botAccumulated });
    } catch (err) {
      botMsgDiv.textContent = "Sorry, I couldn't reach the server. Please email tstsandeep@gmail.com directly!";
    }
  }

  function appendMsg(text: string, role: 'user' | 'assistant') {
    const d = document.createElement('div');
    d.className = \`msg \${role}\`;
    d.textContent = text;
    messagesBox?.appendChild(d);
    messagesBox?.scrollTo({ top: messagesBox.scrollHeight, behavior: 'smooth' });
    return d;
  }
</script>`;

  // Astro Layout integration snippet:
  const layoutSnippet = `---
// src/layouts/Layout.astro
import Chatbot from '../components/Chatbot.astro';
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Sandeep T | Portfolio</title>
  </head>
  <body>
    <!-- Your existing site pages & content -->
    <slot />

    <!-- Add the Chatbot right before closing body tag -->
    <Chatbot />
  </body>
</html>`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Astro & Vercel Spotlight Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/60 to-slate-900 border border-sky-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5" />
              Tailored for Astro on Vercel
            </span>
            <span className="text-xs text-slate-400">Target: tsandeep.vercel.app</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How to Integrate FolioBot into your Astro Site on Vercel
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Follow these 4 simple steps to add the chatbot to your <code>tsandeep.vercel.app</code> repository. All your real Computer Vision projects, Big Vision LLC experience, and OpenCV background are already pre-loaded into the knowledge base below!
          </p>
        </div>

        <button
          onClick={handleDownloadConfig}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-all shadow-md shrink-0"
        >
          <Download className="w-4 h-4 text-sky-400" />
          <span>Export Knowledge JSON</span>
        </button>
      </div>

      {/* Step by step checklist for Astro on Vercel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FileCode className="w-5 h-5 text-sky-400" />
          <span>Step-by-Step Vercel + Astro Integration Guide</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-white">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[11px]">1</span>
              <span>Install @google/genai SDK</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              In your Astro portfolio project terminal, install the official Gemini SDK:
            </p>
            <div className="bg-slate-900 p-2 rounded-lg font-mono text-sky-300 text-[11px] flex justify-between items-center">
              <span>npm install @google/genai</span>
              <button
                onClick={() => handleCopy('npm', 'npm install @google/genai')}
                className="hover:text-white"
              >
                {copiedKey === 'npm' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-white">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[11px]">2</span>
              <span>Vercel Free Tier: Uncheck &quot;Sensitive&quot;</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>Why Vercel showed an upgrade prompt:</strong> In Vercel&apos;s UI, there is a toggle called <em>&quot;Sensitive Environment Variable&quot;</em> (a paid Pro feature).
              <strong className="text-emerald-400 block mt-1">Fix: Turn OFF &quot;Sensitive&quot;</strong>. Standard environment variables are <strong>100% free</strong> with unlimited builds on the Vercel Hobby plan!
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-white">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[11px]">3</span>
              <span>Create src/pages/api/chat.ts</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Create the dynamic serverless endpoint at <code>src/pages/api/chat.ts</code> with <code>export const prerender = false;</code> so Astro handles it dynamically on Vercel without rebuilding static pages.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-white">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[11px]">4</span>
              <span>Drop &lt;Chatbot /&gt; into Layout.astro</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Create <code>src/components/Chatbot.astro</code> and import it in your main layout file so the chatbot appears on all pages (Home, Work, Projects, Blog).
            </p>
          </div>
        </div>

        {/* Alternative 0-Env-Var Option */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/40 via-blue-950/30 to-slate-900 border border-sky-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Alternative: Zero Environment Variables Needed on Vercel!</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">Ready Now</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            If you prefer to keep your Astro site on Vercel 100% static with <strong>zero environment variables</strong>, you can point your chatbot in <code>Chatbot.astro</code> directly to this app&apos;s live hosted backend:
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-sky-300 flex items-center justify-between">
            <span className="truncate">https://ais-pre-gcli6ykx2dshbqkosgd6tq-994234305608.asia-southeast1.run.app/api/chat</span>
            <button
              onClick={() => handleCopy('direct-url', 'https://ais-pre-gcli6ykx2dshbqkosgd6tq-994234305608.asia-southeast1.run.app/api/chat')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] shrink-0 ml-2"
            >
              {copiedKey === 'direct-url' ? 'Copied' : 'Copy Endpoint'}
            </button>
          </div>
          <p className="text-slate-400 text-[11px]">
            CORS is enabled. Simply change <code>fetch(&apos;/api/chat&apos;)</code> to that URL in your frontend and it works immediately without any Vercel configuration!
          </p>
        </div>
      </div>

      {/* Code Viewer Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Sub-nav Tabs */}
        <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveCodeTab('astro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeCodeTab === 'astro'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. src/pages/api/chat.ts
            </button>
            <button
              onClick={() => setActiveCodeTab('react')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeCodeTab === 'react'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. src/components/Chatbot.astro
            </button>
            <button
              onClick={() => setActiveCodeTab('script')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeCodeTab === 'script'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3. src/layouts/Layout.astro
            </button>
            <button
              onClick={() => setActiveCodeTab('config')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeCodeTab === 'config'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Knowledge Base (JSON)
            </button>
          </div>

          <button
            onClick={() => {
              const code =
                activeCodeTab === 'astro'
                  ? astroApiSnippet
                  : activeCodeTab === 'react'
                  ? astroComponentSnippet
                  : activeCodeTab === 'script'
                  ? layoutSnippet
                  : JSON.stringify(config, null, 2);
              handleCopy(activeCodeTab, code);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors border border-slate-700 shrink-0"
          >
            {copiedKey === activeCodeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content Box */}
        <div className="p-4 bg-slate-950 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed text-slate-300">
          <pre>
            {activeCodeTab === 'astro' && astroApiSnippet}
            {activeCodeTab === 'react' && astroComponentSnippet}
            {activeCodeTab === 'script' && layoutSnippet}
            {activeCodeTab === 'config' && JSON.stringify(config, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
