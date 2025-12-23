
import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Calendar, Quote, Download, Loader2, Lock } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { UserTier } from '../types';

interface PlanViewProps {
  plan: string;
  motivation: string;
  userTier: UserTier;
  onTriggerUpgrade: () => void;
}

export const PlanView: React.FC<PlanViewProps> = ({ 
  plan, 
  motivation, 
  userTier, 
  onTriggerUpgrade 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const isFree = userTier === UserTier.FREE;

  const handleDownload = async () => {
    if (isFree) {
      onTriggerUpgrade();
      return;
    }

    if (!contentRef.current) return;
    setIsDownloading(true);

    try {
      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#0f172a',
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('GlowAI-TransformationPlan.pdf');
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Controls */}
      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`
            flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-all shadow-lg
            ${isFree 
              ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700' 
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20'
            }
          `}
        >
          {isFree ? (
            <>
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">Unlock PDF Download</span>
            </>
          ) : isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Plan</span>
            </>
          )}
        </button>
      </div>

      <div ref={contentRef} className="space-y-6 p-4 -m-4 bg-slate-950">
        {/* Motivation Banner */}
        {motivation && (
          <div className="bg-gradient-to-r from-indigo-900/40 to-fuchsia-900/40 rounded-xl p-6 border border-indigo-500/20 flex items-start gap-4">
            <Quote className="w-8 h-8 text-fuchsia-400 flex-shrink-0 fill-fuchsia-400/20" />
            <div>
              <p className="text-slate-200 italic font-medium">"{motivation}"</p>
            </div>
          </div>
        )}

        {/* Main Plan Content */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {isFree ? "Basic 7-Day Transformation Plan" : "Your 30-Day Transformation Plan"}
            </h2>
          </div>
          
          <div className="prose prose-invert prose-headings:text-indigo-300 prose-strong:text-fuchsia-200 prose-li:text-slate-300 text-slate-400 max-w-none">
            <ReactMarkdown 
              components={{
                h1: ({node, ...props}) => <h3 className="text-xl font-bold mt-6 mb-3 text-indigo-400" {...props} />,
                h2: ({node, ...props}) => <h4 className="text-lg font-semibold mt-5 mb-2 text-fuchsia-300" {...props} />,
                h3: ({node, ...props}) => <h5 className="text-base font-semibold mt-4 mb-2 text-slate-200" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />
              }}
            >
              {plan}
            </ReactMarkdown>
          </div>

          {/* Upsell overlay for Free users */}
          {isFree && (
            <div className="mt-8 p-4 bg-gradient-to-r from-indigo-900/20 to-fuchsia-900/20 border border-indigo-500/20 rounded-xl text-center">
              <p className="text-slate-300 text-sm mb-3">Want a full 30-day detailed plan including diet & fitness?</p>
              <button 
                onClick={onTriggerUpgrade}
                className="text-indigo-400 text-sm font-semibold hover:text-indigo-300 transition-colors"
              >
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>
        
        {/* Footer for PDF context */}
        <div className="text-center pt-8 pb-4 opacity-30">
           <p className="text-xs text-slate-500">Generated by Glow AI - Beauty Transformation Engine</p>
        </div>
      </div>
    </div>
  );
};
