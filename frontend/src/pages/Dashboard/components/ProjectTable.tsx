import { User as UserIcon, CheckCircle2, Eye, Pencil, Trash2 } from 'lucide-react';
import { ProjectStatusType, ProjectStatusTypeLabel } from '../../../types/project-status-type';


interface Props {
  projects: any[];
  isAdmin: boolean;
  onView: (p: any) => void;
  onEdit: (p: any) => void;
  onDelete: (id: number) => void;
}

export const ProjectTable = ({ projects, isAdmin, onView, onEdit, onDelete }: Props) => (
  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Projeto</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Responsável</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Metas</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {projects.length > 0 ? projects.map((project) => {
            const g = project.goals;
            const progress = g ? Math.round((g.agility + g.enchantment + g.efficiency + g.excellence + g.transparency + g.ambition) / 6) : 0;

            return (
              <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{project.name}</div>
                  <div className="text-xs text-slate-400 line-clamp-1 max-w-[250px]">{project.description}</div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={project.status} />
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
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                      <span>Progresso</span>
                      <span className="ml-1">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onView(project)} className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50" title="Visualizar">
                      <Eye size={18} />
                    </button>
                    {isAdmin && (
                      <>
                        <button onClick={() => onEdit(project)} className="text-slate-400 hover:text-amber-600 p-2 rounded-lg hover:bg-amber-50" title="Editar">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => onDelete(project.id)} className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50" title="Excluir">
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Nenhum projeto encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: number }) => {
  const styles: any = {
    [ProjectStatusType.PLANNING]: 'bg-amber-100 text-amber-600',
    [ProjectStatusType.IN_PROGRESS]: 'bg-blue-100 text-blue-600',
    [ProjectStatusType.CRITICAL]: 'bg-red-100 text-red-600',
    [ProjectStatusType.COMPLETED]: 'bg-green-100 text-green-600',
  };
  return (
    <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase ${styles[status] || 'bg-slate-100'}`}>
      {ProjectStatusTypeLabel[status as keyof typeof ProjectStatusTypeLabel] || status}
    </span>
  );
};

const TaskIcons = ({ tasks }: { tasks: any[] }) => (
  <div className="flex -space-x-2">
    {tasks?.slice(0, 3).map((task: any) => (
      <div key={task.id} className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-green-500 shadow-sm">
        <CheckCircle2 size={14} />
      </div>
    ))}
    {tasks?.length > 3 && (
      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
        +{tasks.length - 3}
      </div>
    )}
  </div>
);