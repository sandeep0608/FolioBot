import React, { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  Building,
  Calendar,
  Trash2,
  Download,
  Copy,
  Check,
  Sparkles,
  Inbox,
  Send,
} from 'lucide-react';
import { Lead } from '../types';

interface LeadsTabProps {
  onRefreshLeads?: () => void;
}

export const LeadsTab: React.FC<LeadsTabProps> = ({ onRefreshLeads }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (e) {
      console.error('Failed to load leads', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      setLeads((prev) => prev.filter((l) => l.id !== id));
      onRefreshLeads?.();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['Name', 'Email', 'Company', 'Message', 'Created At', 'Source'];
    const rows = leads.map((l) => [
      `"${l.name || ''}"`,
      `"${l.email}"`,
      `"${l.company || ''}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${l.createdAt}"`,
      `"${l.source}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `portfolio-leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Captured Inquiries & Client Leads
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
              {leads.length} Received
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            When recruiters and visitors leave contact details inside your portfolio chatbot, they appear here instantly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            disabled={leads.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium border border-slate-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Opportunities</span>
          <div className="text-2xl font-bold text-white">{leads.length}</div>
          <span className="text-[11px] text-emerald-400">Captured via AI Chatbot</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Conversion Action</span>
          <div className="text-2xl font-bold text-blue-400">1-Click Email</div>
          <span className="text-[11px] text-slate-400">Direct Recruiter Outreach</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Response Rate</span>
          <div className="text-2xl font-bold text-purple-400">100% Instant</div>
          <span className="text-[11px] text-slate-400">24/7 Automated Availability</span>
        </div>
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading inquiries...</div>
      ) : leads.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-3">
          <Inbox className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No inquiries yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Test the chatbot in the Live Preview tab and click &ldquo;Leave Message&rdquo; or ask to hire you to see leads populate here in real-time!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-md flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-base text-white">{lead.name || 'Anonymous Visitor'}</span>
                  {lead.company && (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                      <Building className="w-3 h-3 text-slate-400" />
                      {lead.company}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(lead.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-blue-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {lead.email}
                  </a>
                  <button
                    onClick={() => handleCopyEmail(lead.email)}
                    className="p-1 text-slate-400 hover:text-white rounded"
                    title="Copy Email"
                  >
                    {copiedEmail === lead.email ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-200 leading-relaxed font-normal">
                  {lead.message}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-start">
                <a
                  href={`mailto:${lead.email}?subject=Regarding your message on my portfolio`}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Reply</span>
                </a>
                <button
                  onClick={() => handleDelete(lead.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Delete lead"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
