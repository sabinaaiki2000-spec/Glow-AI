import React, { useState, useEffect } from 'react';
import { Check, X, Crown, Sparkles, CreditCard, Lock, ShieldCheck, Calendar, ArrowLeft } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

type Step = 'OFFER' | 'PAYMENT';

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const [step, setStep] = useState<Step>('OFFER');
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset step when modal closes/opens
  useEffect(() => {
    if (isOpen) setStep('OFFER');
  }, [isOpen]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onUpgrade();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container: Added max-h-[90vh] and flex-col for internal scrolling */}
      <div className="relative w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl shadow-indigo-500/20 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Scrollable Area */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          
          {/* Render Step 1: Offer Page */}
          {step === 'OFFER' && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-br from-indigo-900 via-fuchsia-900 to-slate-900 p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Crown className="w-32 h-32 rotate-12" />
                </div>
                
                <div className="inline-flex p-3 bg-white/10 rounded-full mb-4 backdrop-blur-md shadow-xl ring-1 ring-white/20">
                  <Crown className="w-8 h-8 text-amber-300 fill-amber-300/20" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Glow AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">Premium</span></h2>
                <p className="text-indigo-200 text-sm">Unlock your full transformation potential</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <FeatureRow text="Unlimited Glow-Up Images" />
                  <FeatureRow text="HD & Watermark-Free Downloads" />
                  <FeatureRow text="Full 30-Day Personalized Plans" />
                  <FeatureRow text="Diet, Fitness & Meal Plans" />
                  <FeatureRow text="Downloadable PDF Plans" />
                  <FeatureRow text="AI Beauty Habit Tracker" />
                </div>

                {/* Pricing */}
                <div className="text-center mb-6 bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                  <p className="text-slate-400 text-xs mb-0.5 line-through">$19.99/month</p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-2xl font-bold text-white">$5.99</span>
                    <span className="text-slate-400 text-sm mb-1">/month</span>
                  </div>
                  <p className="text-[10px] text-emerald-400 font-medium mt-1">Limited Time Offer</p>
                </div>

                <button
                  onClick={() => setStep('PAYMENT')}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-400 hover:to-fuchsia-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>Start 3-Day Free Trial</span>
                </button>
                
                <button 
                  onClick={onClose}
                  className="w-full mt-3 py-2 text-slate-500 hover:text-slate-300 text-xs transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </>
          )}

          {/* Render Step 2: Payment Form */}
          {step === 'PAYMENT' && (
            <div className="bg-slate-900 min-h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-slate-800 flex items-center gap-4 sticky top-0 bg-slate-900 z-10">
                  <button onClick={() => setStep('OFFER')} className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-white font-semibold text-sm">Secure Checkout</h3>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                      <Lock className="w-3 h-3" />
                      <span>256-bit SSL Encrypted</span>
                    </div>
                  </div>
              </div>

              <form onSubmit={handlePayment} className="p-6 space-y-5">
                  {/* Summary */}
                  <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                          <Crown className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">Glow AI Premium</p>
                          <p className="text-slate-400 text-xs">3-Day Free Trial</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-white font-bold text-sm">$0.00</p>
                        <p className="text-slate-500 text-[10px]">then $5.99/mo</p>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">Card Number</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="0000 0000 0000 0000"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 pl-10"
                            required
                          />
                          <CreditCard className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-400 ml-1">Expiry Date</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-400 ml-1">CVC</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              placeholder="123"
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                              required
                            />
                            <ShieldCheck className="absolute right-3 top-3 w-4 h-4 text-slate-500" />
                          </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">Cardholder Name</label>
                        <input 
                          type="text" 
                          placeholder="John Doe"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          required
                        />
                    </div>
                  </div>

                  {/* Pay Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span className="text-sm">Processing...</span>
                        </>
                      ) : (
                        <span className="text-sm">Start Free Trial</span>
                      )}
                    </button>
                    <p className="text-center text-[10px] text-slate-500 mt-2">
                      Cancel anytime in settings. No charges until trial ends.
                    </p>
                  </div>
              </form>
            </div>
          )}
        </div>

        {/* Close button (Absolute position, z-index above scroll content) */}
        {step === 'OFFER' && (
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/70 hover:text-white transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

const FeatureRow: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
      <Check className="w-3.5 h-3.5 text-indigo-400" />
    </div>
    <span className="text-slate-300 text-sm font-medium">{text}</span>
  </div>
);
