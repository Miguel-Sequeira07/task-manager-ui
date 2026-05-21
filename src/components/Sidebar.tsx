import { LayoutDashboard, FolderKanban, Plus, X } from 'lucide-react';
import type { Project } from '../types';

interface Props {
  projects: Project[];
  selectedProject: number | null;
  onSelectProject: (id: number | null) => void;
  onNewProject: () => void;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ projects, selectedProject, onSelectProject, onNewProject, open, onClose }: Props) {
  const handleSelect = (id: number | null) => {
    onSelectProject(id);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-72 bg-slate-950 flex flex-col border-r border-slate-800
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 lg:w-72 lg:shrink-0
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">
              task<span className="text-blue-400">flow</span>
            </h1>
            <p className="text-slate-500 text-xs mt-1">Project management</p>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-5 flex flex-col gap-2 overflow-y-auto">
          <button
            onClick={() => handleSelect(null)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              selectedProject === null
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            Dashboard
          </button>

          <div className="mt-6">
            <div className="flex items-center justify-between px-4 mb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Projects</span>
              <button
                onClick={onNewProject}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-600 hover:text-white hover:bg-slate-700 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    selectedProject === p.id
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <FolderKanban className="w-4 h-4 shrink-0" />
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
              {projects.length === 0 && (
                <p className="px-4 text-xs text-slate-700 mt-1">No projects yet</p>
              )}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-800">
          <button
            onClick={onNewProject}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </aside>
    </>
  );
}
