import React, { useState, useEffect } from 'react';
import { getHomepageConfig } from '../data/mockData';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle 
} from '@phosphor-icons/react';
import { TriiplyLogo } from './TriiplyLogo';

interface FinalCTAProps {
  onOpenRegister: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenRegister }) => {
  const [config, setConfig] = useState(() => getHomepageConfig().finalCta);

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getHomepageConfig().finalCta);
    };
    window.addEventListener('triiply_homepage_updated', handleUpdate);
    return () => window.removeEventListener('triiply_homepage_updated', handleUpdate);
  }, []);

  const guarantee = config.guaranteeNote || (config as any).subheadline || 'No credit card required • Instant account activation • 0% commission guaranteed';
  const guaranteeItems = guarantee.split('•').map((s: string) => s.trim()).filter(Boolean);

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white via-blue-50/50 to-sky-50 text-slate-900 relative overflow-hidden border-t border-slate-100">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[40rem] h-[25rem] bg-gradient-to-b from-blue-200/40 via-sky-200/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
          <TriiplyLogo className="h-14 sm:h-16" showTagline={true} />
        </div>

        <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight text-slate-900">
          {config.headlineStart || 'Ready to Transform Your Travel Agency into a'}{' '}
          <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
            {config.headlineGradient || 'High-Conversion Digital Brand?'}
          </span>
        </h2>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
          {config.subtitle || 'Join top DMCs and holiday providers worldwide. Publish your first interactive itinerary in minutes.'}
        </p>

        {/* Primary CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 text-white font-extrabold text-base shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer"
          >
            <ShieldCheck size={22} weight="fill" className="text-emerald-300" />
            <span>{config.buttonText || 'Get Started with 12 Months Free'}</span>
            <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Micro Guarantee Row */}
        {guaranteeItems.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-600 font-semibold">
            {guaranteeItems.map((b: string, i: number) => (
              <span key={i} className="flex items-center gap-2">
                <CheckCircle size={16} weight="fill" className="text-emerald-600" /> {b}
              </span>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
