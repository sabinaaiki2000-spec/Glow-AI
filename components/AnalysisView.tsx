import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Search, Sparkles } from 'lucide-react';

interface AnalysisViewProps {
  summary: string;
  opportunities: string;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ summary, opportunities }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Summary Card */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-4">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Search className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Analysis Summary</h2>
        </div>
        <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      </div>

      {/* Opportunities Card */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-4 relative">
          <div className="p-2 bg-fuchsia-500/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-fuchsia-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Enhancement Opportunities</h2>
        </div>
        <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
          <ReactMarkdown>{opportunities}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
