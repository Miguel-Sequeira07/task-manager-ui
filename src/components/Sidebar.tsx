import { LayoutDashboard, FolderKanban, Plus } from 'lucide-react';
import type { Project } from '../types';

interface Props {
  projects: Project[];
  selectedProject: number | null;
  onSelectProject: (id: number | null) => void;
  onNewProject: () => void;
}

export default function Sidebar({ projects, selectedProject, onSelectProject, onNewProject }: Props) {
  return (
    <aside className="w-80 bg-slate-950 flex flex-col min-h-screen shrink-0 border-r border-slate-800">
      <div className="px-8 py-8 border-b border-slate-800">
        <h1 className="text-2xl font-black tracking-tight text-white">
          task<span className="text-blue-400">flow</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1.5">Project management</p>
      </div>

      <nav className="flex-1 px-5 py-7 flex flex-col gap-2">
        <button
          onClick={() => onSelectProject(null)}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-semibold transition-all whitespace-nowrap ${
            selectedProject === null
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          Dashboard
        </button>

        <div className="mt-8">
          <div className="flex items-center justify-between px-5 mb-4">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Projects</span>
            <button
              onClick={onNewProject}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-white hover:bg-slate-700 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => onSelectProject(p.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-semibold transition-all whitespace-nowrap ${
                  selectedProject === p.id
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <FolderKanban className="w-5 h-5 shrink-0" />
                <span className="truncate">{p.name}</span>
              </button>
            ))}

            {projects.length === 0 && (
              <p className="px-5 text-sm text-slate-700 mt-2">No projects yet</p>
            )}
          </div>
        </div>
      </nav>

      <div className="px-5 py-6 border-t border-slate-800">
        <button
          onClick={onNewProject}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" /> New Project
        </button>
      </div>
    </aside>
  );
}
