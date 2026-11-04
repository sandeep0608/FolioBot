export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  link?: string;
  metrics?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface BotPersona {
  botName: string;
  avatarIcon: 'bot' | 'sparkles' | 'user' | 'code' | 'zap' | 'brain';
  primaryColor: string;
  tone: 'friendly' | 'professional' | 'concise' | 'techie';
  speakingStyle: 'first_person' | 'third_person_assistant';
  greetingMessage: string;
  inputPlaceholder: string;
  customPrompt?: string;
  quickPrompts: string[];
}

export interface PortfolioConfig {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  hireAvailability: string;
  socialLinks: SocialLink[];
  skills: string[];
  experience: Experience[];
  projects: Project[];
  faqs: FAQ[];
  persona: BotPersona;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface Lead {
  id: string;
  name?: string;
  email: string;
  company?: string;
  message: string;
  createdAt: string;
  source: string;
}

export type ActiveTab = 'studio' | 'preview' | 'embed' | 'leads' | 'guide';
