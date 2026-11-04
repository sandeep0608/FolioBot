import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudioTab } from './components/StudioTab';
import { PortfolioPreviewTab } from './components/PortfolioPreviewTab';
import { EmbedGuideTab } from './components/EmbedGuideTab';
import { LeadsTab } from './components/LeadsTab';
import { GuideTab } from './components/GuideTab';
import { ActiveTab, PortfolioConfig } from './types';
import { TEMPLATES } from './data/templates';

const STORAGE_KEY = 'foliobot_config_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');
  const [config, setConfig] = useState<PortfolioConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If saved belongs to old mock data, upgrade to Sandeep's actual website
        if (parsed.name === 'Alex Rivera' || !parsed.name.includes('Sandeep')) {
          return TEMPLATES.tsandeep.config;
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return TEMPLATES.tsandeep.config;
  });

  const [leadsCount, setLeadsCount] = useState<number>(1);

  // Sync config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }, [config]);

  // Fetch leads count
  const refreshLeadsCount = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.leads && Array.isArray(data.leads)) {
        setLeadsCount(data.leads.length);
      }
    } catch (e) {
      // Ignore
    }
  };

  useEffect(() => {
    refreshLeadsCount();
  }, []);

  const handleSelectTemplate = (templateKey: string) => {
    if (TEMPLATES[templateKey]) {
      setConfig(TEMPLATES[templateKey].config);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset all portfolio details back to the default profile?')) {
      setConfig(TEMPLATES.fullstack.config);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        portfolioConfig={config}
        onSelectTemplate={handleSelectTemplate}
        onResetToDefault={handleResetToDefault}
        leadsCount={leadsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'studio' && (
          <StudioTab
            config={config}
            onChange={setConfig}
            onTestNow={() => setActiveTab('preview')}
          />
        )}

        {activeTab === 'preview' && (
          <PortfolioPreviewTab
            config={config}
            onLeadCaptured={() => refreshLeadsCount()}
          />
        )}

        {activeTab === 'embed' && (
          <EmbedGuideTab config={config} />
        )}

        {activeTab === 'guide' && (
          <GuideTab
            onGoToStudio={() => setActiveTab('studio')}
            onGoToPreview={() => setActiveTab('preview')}
            onGoToEmbed={() => setActiveTab('embed')}
          />
        )}

        {activeTab === 'leads' && (
          <LeadsTab onRefreshLeads={() => refreshLeadsCount()} />
        )}
      </main>
    </div>
  );
}
