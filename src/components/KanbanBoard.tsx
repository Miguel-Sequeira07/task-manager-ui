import { Plus } from 'lucide-react';
import type { Task, TaskStatus } from '../types';

const COLUMNS: { status: TaskStatus; label: string; accent: string; dot: string }[] = [
  { status: 'TODO',        label: 'To Do',      accent: 'border-slate-600',  dot: 'bg-slate-400'  },
  { status: 'IN_PROGRESS', label: 'In Progress', accent: 'border-blue-500',   dot: 'bg-blue-500'   },
  { status: 'REVIEW',      label: 'Review',      accent: 'border-yellow-500', dot: 'bg-yellow-500' },
  { status: 'DONE',        label: 'Done',        accent: 'border-green-500',  dot: 'bg-green-500'  },
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
    /* Horizontal scroll on mobile, grid on desktop */
    <div className="flex gap-5 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-x-visible lg:pb-0 h-full">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.status);
        return (
          <div key={col.status} className="flex flex-col gap-4 min-w-[280px] sm:min-w-[300px] lg:min-w-0 flex-shrink-0 lg:flex-shrink lg:w-auto">
            {/* Column header */}
            <div className={`flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/50 border-l-4 ${col.accent}`}>
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                <span className="text-sm font-bold text-white">{col.label}</span>
                <span className="text-xs bg-slate-700 text-slate-400 rounded-full px-2.5 py-0.5 font-semibold">{colTasks.length}</span>
              </div>
              <button onClick={() => onAddTask(col.status)} className="text-slate-500 hover:text-blue-400 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3 flex-1">
              {colTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer group"
                  onClick={() => onEditTask(task)}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <p className="text-sm font-semibold text-white leading-snug">{task.title}</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${PRIORITY_STYLES[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
                  )}

                  {task.dueDate && (
                    <p className="text-xs text-slate-500 mt-2">📅 {task.dueDate}</p>
                  )}

                  {/* Actions — always visible on mobile, hover on desktop */}
                  <div className="mt-4 flex flex-wrap gap-1.5 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    {COLUMNS.filter(c => c.status !== task.status).map(c => (
                      <button
                        key={c.status}
                        onClick={e => { e.stopPropagation(); onStatusChange(task, c.status); }}
                        className="text-xs px-2.5 py-1.5 rounded-lg font-semibold bg-slate-700 text-slate-300 hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap"
                      >
                        → {c.label}
                      </button>
                    ))}
                    <button
                      onClick={e => { e.stopPropagation(); onDeleteTask(task.id); }}
                      className="text-xs px-2.5 py-1.5 rounded-lg font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => onAddTask(col.status)}
                className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl p-4 text-xs text-slate-600 hover:text-blue-400 transition-all font-medium"
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
