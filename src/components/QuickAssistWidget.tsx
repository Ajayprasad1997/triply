import React, { useState } from 'react';
import { ChatCircle, X, ShieldCheck, PaperPlaneTilt, CheckCircle, HandWaving } from '@phosphor-icons/react';

interface QuickAssistWidgetProps {
  onOpenRegister: () => void;
}

export const QuickAssistWidget: React.FC<QuickAssistWidgetProps> = ({ onOpenRegister }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage('');
      setIsOpen(false);
      onOpenRegister();
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-slate-900 to-blue-950 text-white shadow-2xl border border-slate-700 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Open partner assistance chat"
        >
          <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">
            <ChatCircle size={18} weight="duotone" />
          </div>
          <span className="text-xs font-bold hidden sm:inline">Partner Assistance</span>
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 absolute -top-1 -right-1 animate-ping"></span>
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-xs">
                TR
              </div>
              <div>
                <p className="font-bold text-xs">Triiply Onboarding Desk</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online • Partner Specialist
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close assistance widget"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-slate-50 min-h-[160px] text-xs">
            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 leading-relaxed shadow-sm flex items-start gap-2">
              <HandWaving size={18} weight="duotone" className="text-amber-500 shrink-0 mt-0.5" />
              <span>Hi there! Have a quick question about agency verification or package listing on Triiply? Leave us a note!</span>
            </div>

            {sent ? (
              <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle size={18} weight="fill" className="text-emerald-600 shrink-0" />
                <span>Message received! Opening Partner Registration...</span>
              </div>
            ) : null}
          </div>

          {/* Input Footer */}
          {!sent && (
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask a quick question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-100 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-colors shadow-sm cursor-pointer"
                aria-label="Send message"
              >
                <PaperPlaneTilt size={16} weight="bold" />
              </button>
            </form>
          )}

        </div>
      )}
    </div>
  );
};
