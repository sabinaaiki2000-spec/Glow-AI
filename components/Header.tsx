import React from 'react';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 flex justify-center items-center bg-slate-900/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-fuchsia-400 animate-pulse" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent tracking-wider">
          GLOW AI
        </h1>
      </div>
    </header>
  );
};
