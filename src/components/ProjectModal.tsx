import { useState } from 'react';
import { X } from 'lucide-react';
import type { Project } from '../types';

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

interface Props {
  project?: Project;
  onSave: (data: { name: string; description?: string; color: string }) => void;
  onClose: () => void;
}

export default function ProjectModal({ project, onSave, onClose }: Props) {
  const [name, setName] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [color, setColor] = useState(project?.color ?? COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description || undefined, color });
  };

  const inputClass = "w-full bg-slate-800 border border-slate-600 rounded-2xl px-5 py-4 text-base text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all";
  const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-8" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        {/* Modal header */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-slate-800">
          <h2 className="text-3xl font-black text-white">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal body */}
        <form onSubmit={handleSubmit} className="px-10 py-8 space-y-7">
          <div>
            <label className={labelClass}>Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Project name" required />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Optional description" />
          </div>

          <div>
            <label className={labelClass}>Color</label>
            <div className="flex gap-4 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-11 h-11 rounded-full transition-all hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white scale-110' : 'opacity-60 hover:opacity-100'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 border border-slate-600 rounded-2xl px-8 py-4 text-base font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-all whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-8 py-4 text-base font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              {project ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
