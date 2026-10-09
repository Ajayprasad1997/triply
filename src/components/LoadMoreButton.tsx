import React from 'react';
import { CaretDown } from '@phosphor-icons/react';

interface LoadMoreButtonProps {
  visible: number;
  total: number;
  batchSize?: number;
  label?: string;
  onLoadMore: () => void;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  visible,
  total,
  batchSize = 6,
  label = 'cards',
  onLoadMore
}) => {
  if (visible >= total) return null;
  const remaining = total - visible;

  return (
    <div className="mt-10 flex flex-col items-center gap-2" aria-live="polite">
      <button
        type="button"
        onClick={onLoadMore}
        className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-extrabold text-white shadow-lg transition-all hover:bg-blue-600 hover:shadow-blue-500/20"
      >
        Show {Math.min(batchSize, remaining)} more {label}
        <CaretDown size={16} weight="bold" />
      </button>
      <span className="text-xs font-semibold text-slate-500">
        Showing {Math.min(visible, total)} of {total}
      </span>
    </div>
  );
};
