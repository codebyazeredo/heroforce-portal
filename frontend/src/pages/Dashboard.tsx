import { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { Filter, Plus, Pencil, Target, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../../backend/src/users/enums/user-role.enum';
import { ProjectStatus, ProjectStatusLabel } from '../../../backend/src/projects/enums/project-status.enum';
import { CreateProjectModal } from './components/CreateProjectModal';

export const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão de Projetos</h2>
          <p className="text-slate-500 text-sm">Monitore metas e status dos projetos ativos.</p>
        </div>

        {isAdmin && (
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all" >
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

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mr-2">
          <Filter size={16} /> Filtrar por:
        </div>

        <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFilterStatus(e.target.value)} >
          <option value="">Todos os Status</option>
          {Object.entries(ProjectStatusLabel).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.length > 0 ? (
          projects.map((project: any) => (
            <div key={project.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-slate-800">{project.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                      project.status === ProjectStatus.CRITICAL ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {ProjectStatusLabel[project.status as keyof typeof ProjectStatusLabel]}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2">{project.description}</p>
                </div>

                {isAdmin && (
                  <button className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                    <Pencil size={18} />
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metas Estratégicas</p>
                <div className="flex flex-wrap gap-2">
                  {project.tasks?.map((task: any) => (
                    <div key={task.id} className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md text-xs text-slate-600">
                      <CheckCircle2 size={12} className="text-green-500" />
                      {task.description}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Target size={16} className="text-blue-500" />
                    <span className="text-sm font-medium">{project.tasks?.length || 0} Objetivos</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <UserIcon size={16} className="text-slate-400" />
                    <span className="text-sm font-medium">{project.responsible?.name || 'Sem responsável'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl py-12 text-center">
            <p className="text-slate-400">Nenhum projeto encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};