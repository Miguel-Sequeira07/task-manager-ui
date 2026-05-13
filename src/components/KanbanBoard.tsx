import { Plus } from 'lucide-react';
import type { Task, TaskStatus } from '../types';

const COLUMNS: { status: TaskStatus; label: string; accent: string; dot: string }[] = [
  { status: 'TODO',         label: 'To Do',       accent: 'border-slate-600',  dot: 'bg-slate-400'  },
  { status: 'IN_PROGRESS',  label: 'In Progress',  accent: 'border-blue-500',   dot: 'bg-blue-500'   },
  { status: 'REVIEW',       label: 'Review',       accent: 'border-yellow-500', dot: 'bg-yellow-500' },
  { status: 'DONE',         label: 'Done',         accent: 'border-green-500',  dot: 'bg-green-500'  },
];

const PRIORITY_STYLES = {
  LOW:    'bg-slate-700 text-slate-300',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400',
  HIGH:   'bg-red-500/20 text-red-400',
};

interface Props {
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

export default function KanbanBoard({ tasks, onAddTask, onEditTask, onDeleteTask, onStatusChange }: Props) {
  return (
    <div className="grid grid-cols-4 gap-7 h-full">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.status);
        return (
          <div key={col.status} className="flex flex-col gap-5">
            {/* Column header */}
            <div className={`flex items-center justify-between px-5 py-4 rounded-2xl bg-slate-800/50 border-l-4 ${col.accent}`}>
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${col.dot}`} />
                <span className="text-base font-bold text-white">{col.label}</span>
                <span className="text-xs bg-slate-700 text-slate-400 rounded-full px-3 py-1 font-semibold">{colTasks.length}</span>
              </div>
              <button onClick={() => onAddTask(col.status)} className="text-slate-500 hover:text-blue-400 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-4 flex-1">
              {colTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer group"
                  onClick={() => onEditTask(task)}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <p className="text-base font-semibold text-white leading-snug">{task.title}</p>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 ${PRIORITY_STYLES[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
                  )}

                  {task.dueDate && (
                    <p className="text-sm text-slate-500 mt-3">📅 {task.dueDate}</p>
                  )}

                  {/* Hover actions */}
                  <div className="mt-5 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {COLUMNS.filter(c => c.status !== task.status).map(c => (
                      <button
                        key={c.status}
                        onClick={e => { e.stopPropagation(); onStatusChange(task, c.status); }}
                        className="text-xs px-3 py-2 rounded-xl font-semibold bg-slate-700 text-slate-300 hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap shrink-0"
                      >
                        → {c.label}
                      </button>
                    ))}
                    <button
                      onClick={e => { e.stopPropagation(); onDeleteTask(task.id); }}
                      className="text-xs px-3 py-2 rounded-xl font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => onAddTask(col.status)}
                className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-2xl p-6 text-sm text-slate-600 hover:text-blue-400 transition-all font-medium"
              >
                + Add task
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
