# ⚡ FolioBot - AI-Driven Portfolio Chatbot Studio & Embed Generator

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Gemini API](https://img.shields.io/badge/Google%20GenAI-Gemini%20Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

> **FolioBot** is a full-stack developer platform designed to build, customize, test, and generate embeddable AI chatbots for personal portfolios, resumes, and developer websites. Powered by Google's **Gemini API** (`@google/genai`), FolioBot turns static portfolio data into an interactive, zero-hallucination conversational representative that pitches your projects and captures recruiter leads 24/7.

---

## 🏷️ Skills & Technologies Used

`React 19` `TypeScript` `Tailwind CSS v4` `Google Gemini API (@google/genai)` `Vite` `Express.js` `Server-Sent Events (SSE)` `System Instruction Grounding` `Conversational Lead Capture` `CORS Cross-Origin Architecture` `Web Speech API (Text-to-Speech)` `Astro & Vercel Integrations` `Local Storage Persistence`

---

## 🎯 Purpose & Problem Solved

Most personal portfolios are static pages where recruiters and clients scan text for 15 seconds before leaving. 

**FolioBot bridges this gap:**
1. **Interactive Discovery:** Visitors can ask specific questions like *"What is your experience with Kubernetes?"* or *"Tell me how you designed CV Radar."*
2. **Zero Hallucinations:** Employs strictly bounded System Instruction Grounding so the model never makes up false credentials or companies.
3. **Conversational Lead Capture:** Proactively collects recruiter inquiries, project requirements, and contact emails directly inside the chat interface.
4. **Universal Embeddability:** Produces one-click drop-in code for Astro, React, Next.js, Webflow, Framer, WordPress, or vanilla HTML sites.

---

## 🌟 Core Features

### 1. 🎛️ Knowledge Base & Persona Studio
- **Structured Profile Ingestion:** Manage biography, current headline, work availability, contact email, and social links.
- **Project Catalog with Metrics:** Input featured repositories, tech stacks, live links, and measurable business/technical outcomes.
- **Experience Timeline & Education:** Chronicle past roles, companies, key achievements, and academic credentials.
- **AI-Powered FAQ Generation:** Integrated Gemini feature that analyzes your profile and automatically suggests high-converting recruiter FAQs.
- **Persona & Tone Controls:** Configure communication style (Friendly, Executive, Concise, Technical Deep-Dive), speaking perspective (First-Person *"I built..."* vs. Third-Person Assistant *"Sandeep built..."*), custom prompts, and brand accent colors.

### 2. 📱 Interactive Live Portfolio Preview & Test Lab
- **Realistic Site Simulation:** Tests your chatbot widget docked on a simulated modern portfolio with both desktop and mobile viewports.
- **Simulated Visitor Scenarios:** One-click automated testing chips simulating:
  - *Tech Recruiter* (checking architectural experience and remote availability).
  - *Startup Founder / Client* (evaluating contract availability and turnaround times).
  - *Engineering Peer* (requesting deep technical breakdowns of specific projects).
- **Rich Media & Speech:** Real-time text-to-speech audio readout (TTS), code copy buttons, and Markdown rendering.

### 3. 💼 Inquiries & Lead Capture Funnel
- **Recruiter Contact Form:** When visitors express intent to collaborate, hire, or schedule an interview, FolioBot provides an inline lead capture modal.
- **Inquiries Dashboard:** Review captured leads (name, email, company, message, timestamp).
- **Exporting:** One-click CSV and JSON data export for CRM/spreadsheet integration.

### 4. 🚀 Universal Embed Code Generator
- **Astro Integration:** Tailored serverless proxy route and native Astro component snippet for seamless deployment on Vercel.
- **React & Next.js:** Self-contained TypeScript component (`<PortfolioChatbot />`) ready to paste into modern full-stack codebases.
- **Vanilla HTML / Script Embed:** Standalone bundle for Webflow, Framer, WordPress, Wix, or static Jamstack sites.
- **Backend Proxy Templates:** Edge and Serverless proxy handlers to keep your `GEMINI_API_KEY` shielded behind your own domain.

---

## 🏛️ Architecture Overview

```
[Portfolio Website Visitor] 
        │
        ▼ (Interacts with widget or clicks quick prompt)
[Frontend Widget (Astro / React / Vanilla)]
        │
        ▼ (HTTPS POST with chat history)
[Secure Serverless API Proxy (/api/chat)] ──(Holds GEMINI_API_KEY securely)
        │
        ▼ (Injects structured Knowledge Base into systemInstruction)
[Google Gemini API Engine (@google/genai)] ──(gemini-2.5-flash / gemini-3.8-flash)
        │
        ▼ (Real-time SSE text streaming)
[Streaming Response Delivered to Visitor]
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Google AI Studio API Key**: Free key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/foliobot.git
cd foliobot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```env
# Required for Gemini AI inference
GEMINI_API_KEY="your-google-ai-studio-api-key"

# Port (optional, defaults to 3000)
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to access the FolioBot Studio.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Project Directory Structure

```
foliobot/
├── api/
│   └── chat.js                 # Vercel serverless function proxy
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          # Top navigation and template switcher
│   │   ├── StudioTab.tsx       # Knowledge base, projects, FAQs & persona editor
│   │   ├── PortfolioPreviewTab.tsx # Live simulated website & docked chatbot widget
│   │   ├── ChatWidget.tsx      # Core chat widget with streaming, TTS & lead capture
│   │   ├── EmbedGuideTab.tsx   # Astro, React, and Vanilla script code generators
│   │   ├── LeadsTab.tsx        # Recruiter inquiries dashboard with CSV export
│   │   └── GuideTab.tsx        # Architectural guide & best practice documentation
│   ├── data/
│   │   └── templates.ts        # Presets (Sandeep Tharakaram, Full-Stack, Designer)
│   ├── types.ts                # TypeScript domain models and interfaces
│   ├── App.tsx                 # Root client application & state management
│   ├── main.tsx                # Client entry point
│   └── index.css               # Tailwind CSS styles
├── server.ts                   # Express full-stack backend with CORS & Gemini streaming
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🔒 Security & Best Practices

- **Zero Client-Side Keys:** The `GEMINI_API_KEY` is strictly handled on the server side; client bundles never expose sensitive credentials.
- **CORS Protection:** Configured cross-origin resource sharing allowing safe embeds across external domains.
- **Failover Handling:** Implements automatic model retry and fallback logic to gracefully handle transient quota spikes or upstream 503 errors.

---

## 📄 License

Distributed under the Apache-2.0 License. See `LICENSE` for details.
