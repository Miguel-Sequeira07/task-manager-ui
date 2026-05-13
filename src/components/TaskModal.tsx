import { useState } from 'react';
import { X } from 'lucide-react';
import type { Task, TaskStatus, Priority, Project } from '../types';

interface Props {
  task?: Task;
  projects: Project[];
  defaultStatus?: TaskStatus;
  defaultProjectId?: number;
  onSave: (data: { title: string; description?: string; status: TaskStatus; priority: Priority; projectId: number; dueDate?: string }) => void;
  onClose: () => void;
}

export default function TaskModal({ task, projects, defaultStatus = 'TODO', defaultProjectId, onSave, onClose }: Props) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? defaultStatus);
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'MEDIUM');
  const [projectId, setProjectId] = useState<number>(task?.project?.id ?? defaultProjectId ?? projects[0]?.id);
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;
    onSave({ title: title.trim(), description: description || undefined, status, priority, projectId, dueDate: dueDate || undefined });
  };

  const inputClass = "w-full bg-slate-800 border border-slate-600 rounded-2xl px-5 py-4 text-base text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all";
  const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-8" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        {/* Modal header */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-slate-800">
          <h2 className="text-3xl font-black text-white">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal body */}
        <form onSubmit={handleSubmit} className="px-10 py-8 space-y-6">
          <div>
            <label className={labelClass}>Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className={inputClass} placeholder="Task title" required />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Optional description" />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)} className={inputClass}>
                <option value="TODO" className="bg-slate-800">To Do</option>
                <option value="IN_PROGRESS" className="bg-slate-800">In Progress</option>
                <option value="REVIEW" className="bg-slate-800">Review</option>
                <option value="DONE" className="bg-slate-800">Done</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as Priority)} className={inputClass}>
                <option value="LOW" className="bg-slate-800">Low</option>
                <option value="MEDIUM" className="bg-slate-800">Medium</option>
                <option value="HIGH" className="bg-slate-800">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Project *</label>
              <select value={projectId} onChange={e => setProjectId(Number(e.target.value))} className={inputClass} required>
                {projects.map(p => <option key={p.id} value={p.id} className="bg-slate-800">{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inputClass} />
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
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
