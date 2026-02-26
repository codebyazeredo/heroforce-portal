import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { Filter, Plus, Pencil, User as UserIcon, CheckCircle2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { UserRole } from '../../../backend/src/users/enums/user-role.enum';
import { ProjectStatus, ProjectStatusLabel } from '../../../backend/src/projects/enums/project-status.enum';
import { CreateProjectModal } from './components/CreateProjectModal';

export const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterHero, setFilterHero] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const isAdmin = user?.role === UserRole.ADMIN;

  const fetchProjects = useCallback(async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error("Erro ao buscar projetos", error);
    }
  }, []);

  const fetchHeroes = useCallback(async () => {
    try {
      const response = await api.get('/users');
      setHeroes(response.data);
    } catch (error) {
      console.error("Erro ao buscar heróis", error);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchHeroes();
  }, [fetchProjects, fetchHeroes]);

  const filteredProjects = useMemo(() => {
  return projects.filter((project: any) => {
    const matchStatus = filterStatus !== "" ? project.status === Number(filterStatus) : true;
    const matchSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchHero = filterHero ? String(project.responsible?.id) === filterHero : true;
    
    return matchStatus && matchSearch && matchHero;
  });
}, [projects, filterStatus, searchTerm, filterHero]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    return filteredProjects.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProjects, currentPage]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão de Projetos</h2>
          <p className="text-slate-500 text-sm">Base de dados central das operações HeroForce.</p>
        </div>

        {isAdmin && (
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-sm transition-all" >
            <Plus size={18} /> Novo Projeto
          </button>
        )}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProjects}
        heroes={heroes}
      />

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Buscar projeto..."
              className="bg-slate-50 border border-slate-200 text-sm rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <select 
            className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" 
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} 
          >
            <option value="">Todos os Status</option>
            {Object.entries(ProjectStatusLabel).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select 
            className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" 
            value={filterHero}
            onChange={(e) => { setFilterHero(e.target.value); setCurrentPage(1); }} 
          >
            <option value="">Todos os Responsáveis</option>
            {heroes.map((hero: any) => (
              <option key={hero.id} value={hero.id}>{hero.name}</option>
            ))}
          </select>
        </div>
        
        <div className="text-slate-400 text-xs font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          Exibindo {paginatedProjects.length} de {filteredProjects.length} resultados
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Projeto</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Responsável</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Metas</th>
                {isAdmin && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedProjects.length > 0 ? (
                paginatedProjects.map((project: any) => (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{project.name}</div>
                      <div className="text-xs text-slate-400 line-clamp-1 max-w-[250px]">{project.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase ${
                        project.status === 'PLANNING' ? 'bg-amber-100 text-amber-600' : 
                        project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' : 
                        'bg-green-100 text-green-600'
                      }`}>
                        {ProjectStatusLabel[project.status as keyof typeof ProjectStatusLabel] || project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                          <UserIcon size={14} />
                        </div>
                        <span className="text-sm font-medium">{project.responsible?.name || 'Não atribuído'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {project.tasks?.slice(0, 3).map((task: any) => (
                          <div key={task.id} title={task.description} className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-green-500 shadow-sm">
                            <CheckCircle2 size={14} />
                          </div>
                        ))}
                        {project.tasks?.length > 3 && (
                          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            +{project.tasks.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-center">
                        <button className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all">
                          <Pencil size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center text-slate-400 italic">
                    Nenhum projeto encontrado para os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 disabled:opacity-30 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={18} /> Anterior
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 disabled:opacity-30 hover:text-blue-600 transition-colors"
            >
              Próximo <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};  