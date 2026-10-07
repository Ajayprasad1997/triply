import React, { useState, useEffect } from 'react';
import { 
  Buildings, 
  ShieldCheck, 
  SuitcaseRolling, 
  ShareNetwork, 
  CheckCircle, 
  ArrowRight
} from '@phosphor-icons/react';
import { getHomepageConfig } from '../data/mockData';
import { TimelineSectionConfig } from '../types';

interface TravelTimelineProps {
  onOpenRegister: () => void;
}

export const TravelTimeline: React.FC<TravelTimelineProps> = ({ onOpenRegister }) => {
  const [timelineConfig, setTimelineConfig] = useState<TimelineSectionConfig>(getHomepageConfig().timeline);

  useEffect(() => {
    const handleUpdate = () => {
      setTimelineConfig(getHomepageConfig().timeline);
    };
    window.addEventListener('triiply_homepage_updated', handleUpdate);
    return () => window.removeEventListener('triiply_homepage_updated', handleUpdate);
  }, []);

  const stepsList = timelineConfig.steps || [];
  const ICONS = [Buildings, ShieldCheck, SuitcaseRolling, ShareNetwork, CheckCircle];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-black tracking-widest text-sky-600 uppercase block mb-1">
            {timelineConfig.badgeText || 'FAST 4-STEP ONBOARDING WORKFLOW'}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {timelineConfig.headingStart}{' '}
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
              {timelineConfig.headingGradient}
            </span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium">
            {timelineConfig.subtitle}
          </p>
        </div>

        {/* Timeline Horizontal / Vertical Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(stepsList.length, 4)} gap-4`}>
          {stepsList.map((step, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <div
                key={step.id || idx}
                className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-heading font-extrabold text-2xl text-slate-300 group-hover:text-blue-600 transition-colors">
                      {step.stepNumber}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                      <Icon size={20} weight="duotone" />
                    </div>
                  </div>

                  {step.highlightBadge && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-blue-700 text-[10px] font-bold mb-2 border border-slate-200">
                      {step.highlightBadge}
                    </span>
                  )}

                  <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Footer */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenRegister}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-extrabold text-xs shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <span>Register Your Agency Profile Free</span>
            <ArrowRight size={16} weight="bold" />
          </button>
        </div>

      </div>
    </section>
  );
};
