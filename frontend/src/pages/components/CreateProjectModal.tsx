import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash, X, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  heroes: any[]; 
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSuccess, heroes }) => {
  const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      responsibleId: '',
      tasks: [{ description: '' }] 
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks"
  });

  const onSubmit = async (data: any) => {
    try {
      const payload = { ...data, responsibleId: Number(data.responsibleId) };
      await api.post('/projects', payload);
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao criar projeto", error);
      alert("Falha ao salvar o projeto.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Criar novo Projeto</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Nome do Projeto</label>
              <input {...register('name', { required: true })} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Operação Ultron" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Responsável (Herói)</label>
              <select {...register('responsibleId', { required: true })} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Selecione um herói...</option>
                {heroes.map(hero => (
                  <option key={hero.id} value={hero.id}>{hero.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-500">Descrição</label>
            <textarea {...register('description', { required: true })} rows={3} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Descreva os detalhes do projeto..." />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase text-slate-500">Metas</label>
              <button 
                type="button" 
                onClick={() => append({ description: '' })}
                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-100 flex items-center gap-1"
              >
                <Plus size={14} /> Adicionar Meta
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input 
                  {...register(`tasks.${index}.description` as const, { required: true })} 
                  className="flex-1 border rounded-lg p-2 text-sm focus:border-blue-400 outline-none" 
                  placeholder={`Meta #${index + 1}`}
                />
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors">
                    <Trash size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg">Cancelar</button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirmar Lançamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};