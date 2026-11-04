import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
app.use(express.json());

// Enable CORS so external sites like tsandeep.vercel.app can call this API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// In-memory lead capture store (resets on restart, can be viewed and exported in UI)
interface Lead {
  id: string;
  name?: string;
  email: string;
  company?: string;
  message: string;
  createdAt: string;
  source: string;
}

const capturedLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@techventures.io',
    company: 'TechVentures Studio',
    message: 'Loved your frontend architecture projects. We are looking for a senior lead for Q2.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    source: 'Portfolio Chatbot - Recruiter flow'
  }
];

// Helper to get Gemini client
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Generate system instruction based on portfolio configuration
function buildSystemInstruction(config: any): string {
  const {
    name = 'Portfolio Owner',
    title = 'Software Engineer & Designer',
    bio = '',
    location = 'Remote / Global',
    email = '',
    socialLinks = [],
    skills = [],
    experience = [],
    projects = [],
    faqs = [],
    persona = {},
    hireAvailability = 'Actively exploring exciting opportunities',
  } = config || {};

  const botName = persona.botName || `${name}'s AI Assistant`;
  const tone = persona.tone || 'friendly';
  const style = persona.speakingStyle || 'third_person_assistant';
  const customPrompt = persona.customPrompt || '';

  const toneInstructions = {
    friendly: 'Warm, personable, enthusiastic, and approachable while maintaining professional credibility.',
    professional: 'Polished, crisp, executive, direct, and focused on value delivery and technical depth.',
    concise: 'Very short, punchy, high-signal bulleted answers. Get straight to the point without filler.',
    techie: 'Technically articulate, mentioning architecture, design patterns, trade-offs, and tech stacks with nuance.',
  }[tone as 'friendly' | 'professional' | 'concise' | 'techie'] || 'Helpful and professional';

  const perspectiveInstruction = style === 'first_person'
    ? `You speak in the FIRST PERSON as ${name} ("I built...", "My experience at...", "Feel free to email me at...").`
    : `You are ${botName}, an intelligent interactive portfolio agent representing ${name}. Refer to ${name} in the third person ("${name} specializes in...", "You can reach out to ${name} at...") while being friendly and responsive.`;

  return `You are ${botName}, the dedicated AI representative on ${name}'s personal portfolio website.
${perspectiveInstruction}

Tone and Persona:
- ${toneInstructions}
${customPrompt ? `- Additional custom rule: ${customPrompt}` : ''}

Key Knowledge about ${name}:
- Full Name: ${name}
- Current Title / Headline: ${title}
- Location & Work Mode: ${location}
- Availability for Hire / Projects: ${hireAvailability}
- Contact Email: ${email || 'Not provided directly; suggest leaving a message here'}
${socialLinks.length ? `- Social Profiles: ${socialLinks.map((s: any) => `${s.platform}: ${s.url}`).join(', ')}` : ''}

Summary Bio:
${bio || 'A passionate technologist dedicated to building exceptional user experiences and robust software.'}

Core Technical Skills & Stack:
${skills.join(', ') || 'Modern full-stack development'}

Featured Projects:
${projects.map((p: any) => `* **${p.title}** (${(p.tech || []).join(', ')}): ${p.description || ''}${p.metrics ? ` [Outcome/Metrics: ${p.metrics}]` : ''}${p.link ? ` [Demo/Repo: ${p.link}]` : ''}`).join('\n')}

Work Experience & Background:
${experience.map((e: any) => `* **${e.role}** at ${e.company} (${e.period}): ${e.description}`).join('\n')}

Frequently Asked Questions & Pre-answered Answers:
${faqs.map((f: any) => `* Q: "${f.question}" -> A: "${f.answer}"`).join('\n')}

CRITICAL INSTRUCTIONS FOR PORTFOLIO CONVERSATIONS:
1. Always ground your facts strictly in the profile data above. If a visitor asks about something not mentioned (like undisclosed hobbies or proprietary info not listed), politely say so or invite them to get in touch directly with ${name}.
2. Whenever a visitor expresses interest in hiring, contract work, consulting, or interviewing ${name}, encourage them and offer to take their name, email, and project details right here in the chat, or direct them to ${email || 'the contact form'}.
3. Keep responses conversational, concise, and easy to read on mobile screens (use markdown bolding and bullet points where helpful).
4. Do not make up non-existent projects or false credentials. Be confident yet authentic.
5. If the user asks for a quick summary or overview, highlight the top 2-3 most impressive skills or projects.`;
}

// 1. Streaming Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], portfolioConfig = {} } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check Settings > Secrets.',
      });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const systemInstruction = buildSystemInstruction(portfolioConfig);

    // Format chat turns for Gemini API
    // SDK expects contents: string or Array of Content objects { role: 'user' | 'model', parts: [{ text }] }
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(m.content || m.text || '') }],
    }));

    // Setup SSE response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    // Retry helper for transient 503 / 429
    let streamResponse: any = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        streamResponse = await ai.models.generateContentStream({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
          },
        });
        break;
      } catch (err: any) {
        if (attempts >= maxAttempts) throw err;
        // Wait 1.5s then retry
        await new Promise((resolve) => setTimeout(resolve, 1500 * attempts));
      }
    }

    for await (const chunk of streamResponse) {
      const text = chunk.text || '';
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || 'Stream error occurred' })}\n\n`);
      res.end();
    }
  }
});

// 2. Auto-generate FAQ ideas using Gemini
app.post('/api/generate-faqs', async (req, res) => {
  try {
    const { portfolioConfig } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const prompt = `Based on the following portfolio profile, generate 4 high-converting, smart FAQ items that recruiters, clients, and collaborators frequently ask.
Profile:
Name: ${portfolioConfig?.name || 'Developer'}
Title: ${portfolioConfig?.title || 'Engineer'}
Skills: ${(portfolioConfig?.skills || []).join(', ')}
Bio: ${portfolioConfig?.bio || ''}
Projects: ${(portfolioConfig?.projects || []).map((p: any) => p.title).join(', ')}

Return a JSON array of 4 objects with keys: "question" and "answer". Do not wrap in markdown quotes if possible or output clean JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ faqs: parsed });
  } catch (error: any) {
    console.error('Generate FAQs error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate FAQs' });
  }
});

// 3. Lead Capture Endpoints
app.get('/api/leads', (_req, res) => {
  res.json({ leads: capturedLeads });
});

app.post('/api/leads', (req, res) => {
  const { name, email, company, message, source = 'Portfolio Chat' } = req.body;
  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required' });
  }

  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    name: name || 'Website Visitor',
    email,
    company: company || '',
    message,
    createdAt: new Date().toISOString(),
    source,
  };

  capturedLeads.unshift(newLead);
  res.status(201).json({ success: true, lead: newLead });
});

app.delete('/api/leads/:id', (req, res) => {
  const index = capturedLeads.findIndex((l) => l.id === req.params.id);
  if (index !== -1) {
    capturedLeads.splice(index, 1);
  }
  res.json({ success: true });
});

// Serve frontend in dev or prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FolioBot Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
