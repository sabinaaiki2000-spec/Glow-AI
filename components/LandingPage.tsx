import React from 'react';
import { Sparkles, ArrowRight, ScanFace, Wand2, FileHeart } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden bg-slate-950">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl flex flex-col items-center">
        
        {/* Logo / Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-full mb-8 shadow-lg shadow-indigo-500/10">
          <Sparkles className="w-4 h-4 text-fuchsia-400" />
          <span className="text-sm font-medium text-slate-300">#1 AI Beauty Consultant</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent mb-6 tracking-tight leading-[1.1]">
          Unlock Your Best Self with Glow AI
        </h1>

        <p className="text-lg text-slate-400 mb-10 max-w-lg leading-relaxed">
          Upload a photo to get a professional aesthetic analysis, realistic visualization, and a personalized 30-day glow-up plan.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-12">
            <FeatureCard 
                icon={<ScanFace className="w-6 h-6 text-indigo-400" />} 
                title="Face Analysis"
                desc="Detailed breakdown of your unique features."
            />
            <FeatureCard 
                icon={<Wand2 className="w-6 h-6 text-fuchsia-400" />} 
                title="AI Visualization"
                desc="See your potential results instantly."
            />
            <FeatureCard 
                icon={<FileHeart className="w-6 h-6 text-emerald-400" />} 
                title="Custom Plan"
                desc="Step-by-step skincare & fitness routines."
            />
        </div>

        <button 
          onClick={onStart}
          className="group relative px-8 py-4 bg-white text-slate-900 font-bold text-lg rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          <span>Start Your Transformation</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-8 text-xs text-slate-600">
            By continuing, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
    <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-5 rounded-2xl flex flex-col items-center hover:bg-slate-800/40 transition-colors">
        <div className="mb-3 p-3 bg-slate-800 rounded-xl shadow-inner">{icon}</div>
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-xs text-slate-400">{desc}</p>
    </div>
);
