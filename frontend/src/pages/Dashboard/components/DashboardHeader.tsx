import React from 'react';
import { Plus } from 'lucide-react';

interface DashboardHeaderProps {
  isAdmin: boolean;
  onNewProject: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isAdmin, onNewProject }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Gestão de Projetos</h2>
        <p className="text-slate-500 text-sm">Base de dados central HeroForce.</p>
      </div>
      
      {isAdmin && (
        <button 
          onClick={onNewProject} 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} /> Novo Projeto
        </button>
      )}
    </div>
  );
};