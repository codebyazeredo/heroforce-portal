import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 disabled:opacity-30 hover:text-blue-600 transition-colors"
      >
        <ChevronLeft size={18} /> Anterior
      </button>

      <div className="flex gap-1">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'hover:bg-slate-200 text-slate-600'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 disabled:opacity-30 hover:text-blue-600 transition-colors"
      >
        Próximo <ChevronRight size={18} />
      </button>
    </div>
  );
};