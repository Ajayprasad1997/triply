import React, { useState } from 'react';

interface TriiplyLogoProps {
  className?: string;
  showTagline?: boolean;
  variant?: 'dark' | 'light' | 'white';
}

export const TriiplyLogo: React.FC<TriiplyLogoProps> = ({
  className = "h-8",
  showTagline = true,
  variant = 'dark'
}) => {
  const [imgError, setImgError] = useState(false);
  const isDarkBg = variant === 'white';

  return (
    <div className={`inline-flex items-center gap-2 group cursor-pointer select-none ${className}`}>
      {!imgError ? (
        <div className={`h-full flex items-center ${isDarkBg ? 'bg-white px-2.5 py-1 rounded-xl shadow-xs border border-white/20' : ''}`}>
          <img
            src="/logo.png"
            alt="Triiply"
            onError={() => setImgError(true)}
            className="h-full w-auto max-h-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* High-fidelity Brand Mark SVG Fallback */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-black text-sm">
            T
          </div>
          <div className="flex flex-col">
            <span className={`font-heading font-extrabold tracking-tight text-lg leading-tight ${isDarkBg ? 'text-white' : 'text-slate-900'}`}>
              TRIIPLY<span className="text-orange-500">.</span>
            </span>
            {showTagline && (
              <span className={`text-[8px] font-bold tracking-widest uppercase ${isDarkBg ? 'text-slate-400' : 'text-slate-500'}`}>
                Travel Ecosystem
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
