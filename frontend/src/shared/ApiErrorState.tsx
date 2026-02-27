import { AlertCircle, RefreshCw } from 'lucide-react';

export const ApiErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
    <div className="bg-red-100 p-4 rounded-full text-red-600 mb-4">
      <AlertCircle size={40} />
    </div>
    <h3 className="text-xl font-bold text-slate-800">Falha na comunicação com o servidor</h3>
    <button 
      onClick={onRetry}
      className="mt-6 flex items-center gap-2 bg-slate-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-700 transition-all"
    >
      <RefreshCw size={18} /> Tentar Novamente
    </button>
  </div>
);