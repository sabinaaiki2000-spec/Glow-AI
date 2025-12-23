import React, { useState } from 'react';
import { Wand2, Loader2, Lock, Crown, Download, ChevronRight, Star } from 'lucide-react';
import { generateEnhancedImage } from '../services/geminiService';
import { UserTier } from '../types';

interface TransformationViewProps {
  originalImage: string; // Base64
  description: string;
  userTier: UserTier;
  onTriggerUpgrade: () => void;
}

export const TransformationView: React.FC<TransformationViewProps> = ({ 
  originalImage, 
  description, 
  userTier,
  onTriggerUpgrade
}) => {
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const base64Data = originalImage.includes(',') ? originalImage.split(',')[1] : originalImage;
      const result = await generateEnhancedImage(base64Data, description);
      setEnhancedImage(result);
    } catch (err) {
      setError("Failed to generate transformation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAttempt = () => {
    if (isFree) {
      onTriggerUpgrade();
    } else {
      // Real download logic would go here for premium
      const link = document.createElement('a');
      link.href = enhancedImage || '';
      link.download = 'glow-ai-transformation.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isFree = userTier === UserTier.FREE;

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-fuchsia-500/10 rounded-lg">
              <Wand2 className="w-5 h-5 text-fuchsia-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">AI Transformation</h2>
          </div>
          {isFree && (
            <button 
              onClick={onTriggerUpgrade}
              className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400/10 to-amber-600/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-medium hover:bg-amber-400/20 transition-colors"
            >
              <Crown className="w-3 h-3" />
              <span>Upgrade to HD</span>
            </button>
          )}
        </div>

        <p className="text-slate-400 text-sm mb-6">
          Visualize your potential results based on the analysis.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current</span>
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative group">
              <img 
                src={originalImage} 
                alt="Original" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Enhanced */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-fuchsia-500 uppercase tracking-wider">Glow AI Goal</span>
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative flex items-center justify-center">
              {enhancedImage ? (
                <div className="relative w-full h-full group">
                  <img 
                    src={enhancedImage} 
                    alt="Enhanced" 
                    className="w-full h-full object-cover animate-fade-in" 
                  />
                  
                  {/* Action Bar Overlay - Only visible on hover/tap */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                    <button 
                      onClick={handleDownloadAttempt}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold backdrop-blur-md transition-all ${
                        isFree 
                          ? 'bg-slate-800/80 text-slate-300 border border-slate-600' 
                          : 'bg-white text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      {isFree ? <Lock className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                      <span>{isFree ? 'Unlock HD Download' : 'Download Image'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  {loading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-fuchsia-500 animate-spin" />
                      <p className="text-xs text-slate-400">Rendering your glow up...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                        <Wand2 className="w-6 h-6 text-slate-600" />
                      </div>
                      <p className="text-sm text-slate-500 max-w-[150px]">
                        Ready to visualize the improved aesthetics?
                      </p>
                      <button 
                        onClick={handleGenerate}
                        className="mt-2 px-6 py-2 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm font-medium transition-colors shadow-lg shadow-fuchsia-900/20"
                      >
                        Generate Look
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
            {error}
          </div>
        )}
        
        {/* Description */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Target Aesthetic Description</h4>
          <p className="text-xs text-slate-500 leading-relaxed italic">
            "{description}"
          </p>
        </div>

        {/* Premium Upsell CTA Card - Only show if image is generated and user is free */}
        {isFree && enhancedImage && (
          <div 
            onClick={onTriggerUpgrade}
            className="mt-8 relative overflow-hidden rounded-xl border border-amber-500/30 cursor-pointer group hover:border-amber-500/50 transition-all"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-amber-900/20 to-slate-900"></div>
            
            <div className="relative p-5 flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/20">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    Unlock Full Potential
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-900 uppercase">Pro</span>
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 max-w-sm">
                    Get HD downloads, remove limits, and access your full 30-day personalized beauty plan.
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                     <span className="text-xs text-amber-200/80 flex items-center gap-1">
                       <Star className="w-3 h-3 fill-amber-200/80" /> 4.9/5 User Rating
                     </span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                 <ChevronRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
