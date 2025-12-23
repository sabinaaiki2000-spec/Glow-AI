import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { AnalysisView } from './components/AnalysisView';
import { TransformationView } from './components/TransformationView';
import { PlanView } from './components/PlanView';
import { UpgradeModal } from './components/UpgradeModal';
import { LandingPage } from './components/LandingPage';
import { analyzeImage } from './services/geminiService';
import { compressImage, parseAnalysisResult } from './utils';
import { ParsedAnalysis, AppState, Tab, UserTier } from './types';
import { Loader2, AlertCircle, FileText, Sparkles, Calendar, Crown } from 'lucide-react';

// Local storage keys
const STORAGE_KEYS = {
  TIER: 'glowAI_tier',
  LAST_SCAN: 'glowAI_last_scan_date',
  SCAN_COUNT: 'glowAI_scan_count_week',
  HAS_SEEN_INTRO: 'glowAI_has_seen_intro' // Optional: if you want to skip intro on subsequent visits
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ANALYSIS);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<ParsedAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Freemium State
  const [userTier, setUserTier] = useState<UserTier>(UserTier.FREE);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  // Load user data on mount
  useEffect(() => {
    const savedTier = localStorage.getItem(STORAGE_KEYS.TIER) as UserTier;
    if (savedTier) {
      setUserTier(savedTier);
    }
    // Note: We currently show landing page every refresh as requested. 
    // If you want to persist the "seen" state, uncomment below:
    // const hasSeenIntro = localStorage.getItem(STORAGE_KEYS.HAS_SEEN_INTRO);
    // if (hasSeenIntro) setShowLanding(false);
  }, []);

  const handleStartApp = () => {
    setShowLanding(false);
    // localStorage.setItem(STORAGE_KEYS.HAS_SEEN_INTRO, 'true');
  };

  const checkUsageLimit = (): boolean => {
    if (userTier === UserTier.PREMIUM) return true;

    const lastScanStr = localStorage.getItem(STORAGE_KEYS.LAST_SCAN);
    const now = Date.now();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

    // If never scanned or last scan was over a week ago, reset
    if (!lastScanStr || (now - parseInt(lastScanStr)) > oneWeekMs) {
      localStorage.setItem(STORAGE_KEYS.LAST_SCAN, now.toString());
      localStorage.setItem(STORAGE_KEYS.SCAN_COUNT, '0');
      return true;
    }

    // Check count for current week
    const count = parseInt(localStorage.getItem(STORAGE_KEYS.SCAN_COUNT) || '0');
    if (count >= 1) {
      return false; // Limit reached
    }

    return true;
  };

  const incrementUsage = () => {
    if (userTier === UserTier.PREMIUM) return;
    const count = parseInt(localStorage.getItem(STORAGE_KEYS.SCAN_COUNT) || '0');
    localStorage.setItem(STORAGE_KEYS.SCAN_COUNT, (count + 1).toString());
    // Ensure we set the date if it's the first scan of the period
    if (count === 0) {
      localStorage.setItem(STORAGE_KEYS.LAST_SCAN, Date.now().toString());
    }
  };

  const handleImageSelected = async (file: File) => {
    if (!checkUsageLimit()) {
      setShowUpgradeModal(true);
      return;
    }

    setImageFile(file);
    setAppState(AppState.ANALYZING);
    setErrorMsg(null);

    try {
      // Compress and resize image to optimize API usage and prevent errors
      const { base64, mimeType } = await compressImage(file);
      setImageBase64(`data:${mimeType};base64,${base64}`);
      
      const rawText = await analyzeImage(base64, userTier);
      const parsed = parseAnalysisResult(rawText);
      setAnalysisData(parsed);
      setAppState(AppState.RESULT);
      
      incrementUsage();
    } catch (err) {
      console.error(err);
      setErrorMsg("We couldn't analyze this image. Please ensure you are using a valid API key and try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleUpgrade = () => {
    setUserTier(UserTier.PREMIUM);
    localStorage.setItem(STORAGE_KEYS.TIER, UserTier.PREMIUM);
    setShowUpgradeModal(false);
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setImageFile(null);
    setImageBase64(null);
    setAnalysisData(null);
    setActiveTab(Tab.ANALYSIS);
  };

  if (showLanding) {
    return <LandingPage onStart={handleStartApp} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      
      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        onUpgrade={handleUpgrade}
      />

      <main className="w-full max-w-3xl px-4 flex-1 flex flex-col">
        {/* Tier Badge / Status */}
        <div className="flex justify-end pt-4 pb-2">
           {userTier === UserTier.FREE ? (
             <button onClick={() => setShowUpgradeModal(true)} className="text-xs text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-1">
               <span>Free Tier</span>
               <span className="bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">Upgrade</span>
             </button>
           ) : (
             <div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-950/30 px-3 py-1 rounded-full border border-amber-500/20">
               <Crown className="w-3 h-3" />
               <span className="font-medium">Premium Member</span>
             </div>
           )}
        </div>

        {appState === AppState.IDLE && (
          <div className="flex-1 flex items-center justify-center">
            <ImageUpload onImageSelected={handleImageSelected} />
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-fuchsia-500 blur-2xl opacity-20 animate-pulse rounded-full"></div>
              <Loader2 className="w-16 h-16 text-fuchsia-400 animate-spin relative z-10" />
            </div>
            <h2 className="mt-8 text-xl font-medium text-white">Analyzing Your Glow...</h2>
            <p className="mt-2 text-slate-400 text-center max-w-sm">
              Our AI is detecting facial features, skin health, and calculating your optimal transformation plan.
            </p>
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
            <div className="p-4 rounded-full bg-red-500/10 mb-6">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Analysis Failed</h3>
            <p className="text-slate-400 mb-8 text-center max-w-md">{errorMsg}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {appState === AppState.RESULT && analysisData && imageBase64 && (
          <div className="flex-1 flex flex-col mt-6">
            {/* Tabs */}
            <div className="flex p-1 bg-slate-900/80 backdrop-blur rounded-xl border border-slate-800 mb-8 sticky top-[80px] z-40 shadow-lg">
              <button
                onClick={() => setActiveTab(Tab.ANALYSIS)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === Tab.ANALYSIS 
                    ? 'bg-slate-800 text-indigo-300 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Analysis</span>
              </button>
              <button
                onClick={() => setActiveTab(Tab.VISUALIZE)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === Tab.VISUALIZE
                    ? 'bg-slate-800 text-fuchsia-300 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Visualize</span>
              </button>
              <button
                onClick={() => setActiveTab(Tab.PLAN)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === Tab.PLAN 
                    ? 'bg-slate-800 text-emerald-300 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Plan</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1">
              {activeTab === Tab.ANALYSIS && (
                <AnalysisView 
                  summary={analysisData.analysisSummary} 
                  opportunities={analysisData.enhancementOpportunities} 
                />
              )}
              {activeTab === Tab.VISUALIZE && (
                <TransformationView 
                  originalImage={imageBase64} 
                  description={analysisData.visualDescription}
                  userTier={userTier}
                  onTriggerUpgrade={() => setShowUpgradeModal(true)}
                />
              )}
              {activeTab === Tab.PLAN && (
                <PlanView 
                  plan={analysisData.transformationPlan} 
                  motivation={analysisData.motivationalClosing}
                  userTier={userTier}
                  onTriggerUpgrade={() => setShowUpgradeModal(true)}
                />
              )}
            </div>

            <div className="py-8 flex justify-center border-t border-slate-900 mt-auto">
              <button 
                onClick={handleReset}
                className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
              >
                Analyze Another Photo
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;