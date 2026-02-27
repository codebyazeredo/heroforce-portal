import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash, X, Loader2 } from 'lucide-react';
import api from '../../../services/api';
import { ProjectStatusType, ProjectStatusTypeLabel } from '../../../types/project-status-type';

interface GoalValues {
  agility: number;
  enchantment: number;
  efficiency: number;
  excellence: number;
  transparency: number;
  ambition: number;
}

interface TaskInput {
  description: string;
}

interface Hero {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: number;
  responsible?: Hero;
  goals?: GoalValues;
  tasks?: { id: number; description: string }[];
}

interface ProjectFormData {
  name: string;
  description: string;
  status: number;
  responsibleId: number | null;
  goals: GoalValues;
  tasks: TaskInput[];
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  heroes: Hero[];
  project?: Project;
  mode?: 'create' | 'edit' | 'view';
}

const defaultGoals: GoalValues = {
  agility: 0,
  enchantment: 0,
  efficiency: 0,
  excellence: 0,
  transparency: 0,
  ambition: 0
};

const goalKeys: (keyof GoalValues)[] = [
  'agility',
  'enchantment',
  'efficiency',
  'excellence',
  'transparency',
  'ambition'
];

const goalLabels: Record<keyof GoalValues, string> = {
  agility: 'Agilidade',
  enchantment: 'Encantamento',
  efficiency: 'Eficiência',
  excellence: 'Excelência',
  transparency: 'Transparência',
  ambition: 'Ambição'
};

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  heroes,
  project,
  mode = 'create'
}) => {
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<ProjectFormData>({
    defaultValues: {
      name: '',
      description: '',
      status: ProjectStatusType.PLANNING,
      responsibleId: null,
      goals: defaultGoals,
      tasks: [{ description: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tasks'
  });

  useEffect(() => {
    if (!isOpen) return;

    if (project && (isEditMode || isViewMode)) {
      const sortedTasks = project.tasks && project.tasks.length > 0 ? [...project.tasks].sort((a, b) => a.id - b.id) : [{ description: '' }];

      reset({
        name: project.name,
        description: project.description,
        status: project.status,
        responsibleId: project.responsible?.id ?? null,
        goals: project.goals ?? defaultGoals,
        tasks: sortedTasks.map(t => ({ description: t.description }))
      });
    } else {
      reset({
        name: '',
        description: '',
        status: ProjectStatusType.PLANNING,
        responsibleId: null,
        goals: defaultGoals,
        tasks: [{ description: '' }]
      });
    }
  }, [project, mode, isOpen, reset, isEditMode, isViewMode]);

  const onSubmit = async (data: ProjectFormData) => {
    if (isViewMode) return;

    try {
      const payload = {
        ...data,
        responsibleId: data.responsibleId,
        status: Number(data.status)
      };

      if (isEditMode && project) {
        await api.patch(`/projects/${project.id}`, payload);
      } else {
        await api.post('/projects', payload);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar projeto', error);
      alert('Falha ao salvar o projeto.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {isViewMode ? 'Detalhes do Projeto' : isEditMode ? 'Editar Projeto' : 'Criar novo Projeto'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">
                Nome do Projeto
              </label>
              <input
                {...register('name', { required: true })}
                disabled={isViewMode}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">
                Responsável
              </label>
              <select
                {...register('responsibleId', { valueAsNumber: true })}
                disabled={isViewMode}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50"
              >
                <option value="">Selecione...</option>
                {heroes.map(hero => (
                  <option key={hero.id} value={hero.id}>
                    {hero.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-500">
              Status
            </label>
            <select
              {...register('status', { valueAsNumber: true })}
              disabled={isViewMode}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50"
            >
              {Object.entries(ProjectStatusTypeLabel).map(([value, label]) => (
                <option key={value} value={Number(value)}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-500">
              Descrição
            </label>
            <textarea
              {...register('description', { required: true })}
              disabled={isViewMode}
              rows={3}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            {goalKeys.map(goal => (
              <div key={goal} className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">
                  {goalLabels[goal]}
                </label>
                <input
                  type="number"
                  min={0}
                  {...register(`goals.${goal}`, { valueAsNumber: true })}
                  disabled={isViewMode}
                  className="w-full border rounded-lg p-2"
                />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center border-t pt-4">
              <label className="text-xs font-bold uppercase text-slate-500">
                Metas Estratégicas
              </label>

              {!isViewMode && (
                <button type="button" onClick={() => append({ description: '' })} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-100 flex items-center gap-1 transition-colors" >
                  <Plus size={14} /> Adicionar
                </button>
              )}
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`tasks.${index}.description`, { required: true })}
                  disabled={isViewMode}
                  className="flex-1 border rounded-lg p-2 text-sm outline-none disabled:bg-slate-50"
                  placeholder={`Meta #${index + 1}`}
                />

                {fields.length > 1 && !isViewMode && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isViewMode ? 'Fechar' : 'Cancelar'}
            </button>

            {!isViewMode && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
              >
                {isSubmitting ? (<Loader2 className="animate-spin" size={20} />) : isEditMode ? ('Salvar Alterações') : ('Confirmar Lançamento')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};