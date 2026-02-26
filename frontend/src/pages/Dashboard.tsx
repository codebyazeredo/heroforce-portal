import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { Filter, Plus, Pencil, Target, User as UserIcon } from 'lucide-react';
import { UserRole } from '../../../backend/src/users/enums/user-role.enum';
import { ProjectStatus, ProjectStatusLabel } from '../../../backend/src/projects/enums/project-status.enum';
import { UserCharacterLabel } from '../../../backend/src/users/enums/user-character.enum';

export const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');

  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    api.get('/projects').then(res => setProjects(res.data)).catch(() => { });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão de Projetos</h2>
          <p className="text-slate-500 text-sm">Monitore metas e status das missões ativas.</p>
        </div>

        {isAdmin && (
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md active:scale-95">
            <Plus size={18} /> Novo Projeto
          </button>
        )}
      </div>

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

        <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
          {Object.entries(UserCharacterLabel).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.length > 0 ? (
          projects.map((project: any) => (
            <div key={project.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-slate-800">{project.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${project.status === ProjectStatus.CRITICAL ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                      {ProjectStatusLabel[project.status as ProjectStatus]}
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

              <div className="mt-6 pt-4 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Target size={16} className="text-blue-500" />
                    <span className="text-sm font-medium">{project.goal}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <UserIcon size={16} className="text-slate-400" />
                    <span className="text-sm font-medium">{project.responsibleHero?.name}</span>
                  </div>
                </div>

                <div className="w-full md:w-48 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl py-12 text-center">
            <p className="text-slate-400">Nenhum projeto encontrado para os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};