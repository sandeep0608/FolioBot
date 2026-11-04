import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Mail,
  ChevronDown,
  Maximize2,
  Minimize2,
  ExternalLink,
} from 'lucide-react';
import { PortfolioConfig, ChatMessage } from '../types';

interface ChatWidgetProps {
  config: PortfolioConfig;
  isOpenDefault?: boolean;
  onLeadCaptured?: () => void;
  floating?: boolean; // if true, docks at bottom right; if false, fits embedded container
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  config,
  isOpenDefault = false,
  onLeadCaptured,
  floating = true,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      role: 'assistant',
      text:
        config.persona.greetingMessage ||
        `Hi there! 👋 Ask me anything about my projects, technical stack, or availability.`,
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', company: '', message: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Update welcome message if config changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome-msg') {
        return [
          {
            id: 'welcome-msg',
            role: 'assistant',
            text:
              config.persona.greetingMessage ||
              `Hi there! 👋 Ask me anything about my projects, technical stack, or availability.`,
            timestamp: Date.now(),
          },
        ];
      }
      return prev;
    });
  }, [config.persona.greetingMessage]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    const botMessageId = `bot-${Date.now()}`;
    const initialBotMessage: ChatMessage = {
      id: botMessageId,
      role: 'assistant',
      text: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages([...newHistory, initialBotMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            text: m.text,
          })),
          portfolioConfig: config,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim();
              if (dataStr === '[DONE]') {
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  setMessages((current) =>
                    current.map((m) =>
                      m.id === botMessageId ? { ...m, text: accumulatedText } : m
                    )
                  );
                } else if (parsed.error) {
                  accumulatedText += `\n\n*(Error: ${parsed.error})*`;
                }
              } catch (e) {
                // Ignore parse errors on partial chunks
              }
            }
          }
        }
      }

      setMessages((current) =>
        current.map((m) =>
          m.id === botMessageId
            ? {
                ...m,
                text: accumulatedText || 'I am ready to help! Ask me anything about this portfolio.',
                isStreaming: false,
              }
            : m
        )
      );

      // Speak if enabled
      if (speechEnabled && 'speechSynthesis' in window && accumulatedText) {
        window.speechSynthesis.cancel();
        const cleanForSpeech = accumulatedText.replace(/[*_#`[\]()]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanForSpeech.slice(0, 300));
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((current) =>
        current.map((m) =>
          m.id === botMessageId
            ? {
                ...m,
                text: `⚠️ **Service Notice:** ${err.message || 'Unable to connect to Gemini API. Please verify server status.'}`,
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setMessages([
      {
        id: 'welcome-msg',
        role: 'assistant',
        text:
          config.persona.greetingMessage ||
          `Hi there! 👋 Ask me anything about my projects, technical stack, or availability.`,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.email || !leadForm.message) return;

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadForm.name,
          email: leadForm.email,
          company: leadForm.company,
          message: leadForm.message,
          source: 'Portfolio Chat Widget',
        }),
      });

      setLeadSubmitted(true);
      onLeadCaptured?.();
      setTimeout(() => {
        setShowLeadModal(false);
        setLeadSubmitted(false);
        setLeadForm({ name: '', email: '', company: '', message: '' });
      }, 2500);
    } catch (err) {
      console.error('Failed to submit lead', err);
    }
  };

  const primaryColor = config.persona.primaryColor || '#3b82f6';

  // Floating trigger button & modal container
  return (
    <div className={floating ? 'fixed bottom-6 right-6 z-50 flex flex-col items-end' : 'w-full h-full'}>
      {/* Floating Teaser Bubble (only when closed) */}
      {floating && !isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="mb-3 cursor-pointer group bg-slate-900/95 text-white text-xs px-3.5 py-2 rounded-2xl shadow-xl border border-slate-700/80 backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 animate-bounce"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-medium text-slate-200">
            Have questions about {config.name.split(' ')[0]}? Chat with my AI!
          </span>
        </div>
      )}

      {/* Floating Toggle Button */}
      {floating && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{ backgroundColor: primaryColor }}
          aria-label="Open portfolio chatbot"
        >
          <MessageSquare className="w-7 h-7" />
        </button>
      )}

      {/* Chat Window */}
      {(isOpen || !floating) && (
        <div
          className={`bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 transition-all duration-300 ${
            floating
              ? isExpanded
                ? 'w-[90vw] md:w-[680px] h-[85vh] max-h-[800px]'
                : 'w-[94vw] sm:w-[410px] h-[580px] max-h-[85vh]'
              : 'w-full h-full min-h-[500px]'
          }`}
        >
          {/* Header */}
          <div
            className="px-4 py-3 border-b border-slate-800 flex items-center justify-between text-white select-none"
            style={{
              background: `linear-gradient(to right, ${primaryColor}22, #0f172a 90%)`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow"
                style={{ backgroundColor: primaryColor }}
              >
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-xs tracking-tight">{config.persona.botName}</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Online" />
                </div>
                <p className="text-[10px] text-slate-400">
                  Grounded in {config.name}&apos;s verified portfolio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              {/* Text-to-speech toggle */}
              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                title={speechEnabled ? 'Mute speech output' : 'Enable voice responses'}
                className="p-1.5 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
              >
                {speechEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Clear chat */}
              <button
                onClick={handleClear}
                title="Restart conversation"
                className="p-1.5 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Expand / Shrink (if floating) */}
              {floating && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Minimize size' : 'Expand widget'}
                  className="p-1.5 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors hidden sm:block"
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              )}

              {/* Close (if floating) */}
              {floating && (
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Hire / Contact quick banner */}
          <div className="bg-slate-800/60 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-300 truncate mr-2">
              Want to hire or collaborate with {config.name.split(' ')[0]}?
            </span>
            <button
              onClick={() => setShowLeadModal(true)}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 whitespace-nowrap"
            >
              <Mail className="w-3 h-3" />
              <span>Leave Message</span>
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-normal">
            {messages.map((message) => {
              const isBot = message.role === 'assistant';
              return (
                <div
                  key={message.id}
                  className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs text-white ${
                      isBot ? 'shadow' : 'bg-slate-700'
                    }`}
                    style={isBot ? { backgroundColor: primaryColor } : {}}
                  >
                    {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`relative max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed group ${
                      isBot
                        ? 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-sm'
                        : 'text-white rounded-tr-sm shadow-md'
                    }`}
                    style={!isBot ? { backgroundColor: primaryColor } : {}}
                  >
                    {/* Formatted Text */}
                    <div className="whitespace-pre-wrap select-text break-words">
                      {formatMessageText(message.text)}
                    </div>

                    {/* Copy action for bot messages */}
                    {isBot && message.text && !message.isStreaming && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 pt-1 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <button
                          onClick={() => handleCopy(message.id, message.text)}
                          className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                        >
                          {copiedId === message.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Pulsing indicator when loading and no streaming text yet */}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-2.5 items-start">
                <div
                  className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts suggestions */}
          {config.persona.quickPrompts && config.persona.quickPrompts.length > 0 && (
            <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800/80 flex gap-1.5 overflow-x-auto no-scrollbar">
              {config.persona.quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  disabled={isLoading}
                  onClick={() => handleSend(prompt)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  <Sparkles className="w-2.5 h-2.5 text-blue-400" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={config.persona.inputPlaceholder || 'Ask me anything...'}
                disabled={isLoading}
                className="flex-1 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-xl text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="text-[10px] text-slate-500 text-center mt-1.5 flex items-center justify-center gap-1">
              <span>Powered by Gemini API</span>
              <span>•</span>
              <button
                onClick={() => setShowLeadModal(true)}
                className="hover:text-slate-300 underline"
              >
                Hire {config.name.split(' ')[0]}
              </button>
            </div>
          </div>

          {/* Lead Capture Modal Overlay */}
          {showLeadModal && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-30 p-4 flex flex-col justify-center animate-fade-in">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl relative">
                <button
                  onClick={() => setShowLeadModal(false)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                {leadSubmitted ? (
                  <div className="text-center py-6 space-y-2">
                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-sm text-white">Message Delivered!</h4>
                    <p className="text-xs text-slate-300">
                      Thanks for getting in touch. {config.name.split(' ')[0]} will follow up via email shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-white">Get in Touch with {config.name}</h4>
                      <p className="text-xs text-slate-400">
                        Leave your details to schedule a call, discuss a project, or send an inquiry.
                      </p>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        placeholder="Your Work Email *"
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Company or Project Name (Optional)"
                        value={leadForm.company}
                        onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <textarea
                        rows={3}
                        placeholder="Brief note about the project or role..."
                        value={leadForm.message}
                        onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl text-white font-medium text-xs shadow-md transition-all hover:opacity-90"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Send Inquiry
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowLeadModal(false)}
                        className="px-3 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Simple Markdown parser for bullet points, bolding, and links
function formatMessageText(text: string) {
  if (!text) return null;

  // Split lines
  const lines = text.split('\n');

  return lines.map((line, idx) => {
    // Process markdown bold (**text**)
    const parts = line.split(/(\*\*.*?\*\*)/g);

    const renderedLine = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    // Check if line is bullet list item
    const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');

    return (
      <span key={idx} className={isBullet ? 'block pl-3 relative my-0.5' : 'block'}>
        {isBullet && <span className="absolute left-0 text-blue-400">•</span>}
        {renderedLine}
      </span>
    );
  });
}
