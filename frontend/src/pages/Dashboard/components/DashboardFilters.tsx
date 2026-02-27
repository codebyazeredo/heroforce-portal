import { Search } from 'lucide-react';
import { ProjectStatusLabel } from '../../../../../backend/src/projects/enums/project-status.enum';

interface Props {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  filterHero: string;
  setFilterHero: (v: string) => void;
  heroes: any[];
  resultsCount: number;
  totalCount: number;
}

export const DashboardFilters = ({ 
  searchTerm, setSearchTerm, filterStatus, setFilterStatus, 
  filterHero, setFilterHero, heroes, resultsCount, totalCount 
}: Props) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Buscar projeto..."
          className="bg-slate-50 border border-slate-200 text-sm rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <select
        className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="">Todos os Status</option>
        {Object.entries(ProjectStatusLabel).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select
        className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        value={filterHero}
        onChange={(e) => setFilterHero(e.target.value)}
      >
        <option value="">Todos os Responsáveis</option>
        {heroes.map((hero) => (
          <option key={hero.id} value={hero.id}>{hero.name}</option>
        ))}
      </select>
    </div>

    <div className="text-slate-400 text-xs font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
      Exibindo {resultsCount} de {totalCount} resultados
    </div>
  </div>
);