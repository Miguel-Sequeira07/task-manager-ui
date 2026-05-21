import { useState, useEffect, useCallback } from 'react';
import { Plus, Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import Dashboard from './components/Dashboard';
import TaskModal from './components/TaskModal';
import ProjectModal from './components/ProjectModal';
import { projectsApi, tasksApi } from './api';
import type { Project, Task, TaskStatus } from './types';

export default function App() {
  const [projects, setProjects]               = useState<Project[]>([]);
  const [tasks, setTasks]                     = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [taskModal, setTaskModal]             = useState<{ open: boolean; task?: Task; status?: TaskStatus }>({ open: false });
  const [projectModal, setProjectModal]       = useState<{ open: boolean; project?: Project }>({ open: false });
  const [loading, setLoading]                 = useState(true);

  const loadData = useCallback(async () => {
    const [ps, ts] = await Promise.all([projectsApi.getAll(), tasksApi.getAll()]);
    setProjects(ps);
    setTasks(ts);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const visibleTasks   = selectedProject ? tasks.filter(t => t.project?.id === selectedProject) : tasks;
  const currentProject = projects.find(p => p.id === selectedProject);

  const handleSaveTask = async (data: Parameters<typeof tasksApi.create>[0]) => {
    if (taskModal.task) {
      const updated = await tasksApi.update(taskModal.task.id, data);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } else {
      const created = await tasksApi.create(data);
      setTasks(prev => [...prev, created]);
    }
    setTaskModal({ open: false });
  };

  const handleDeleteTask = async (id: number) => {
    await tasksApi.remove(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    const updated = await tasksApi.update(task.id, { ...task, status, projectId: task.project?.id });
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleSaveProject = async (data: Parameters<typeof projectsApi.create>[0]) => {
    if (projectModal.project) {
      const updated = await projectsApi.update(projectModal.project.id, data);
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    } else {
      const created = await projectsApi.create(data);
      setProjects(prev => [...prev, created]);
      setSelectedProject(created.id);
    }
    setProjectModal({ open: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-slate-400 text-sm animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-900 overflow-hidden">
      <Sidebar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        onNewProject={() => setProjectModal({ open: true })}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-black text-white truncate">
                {selectedProject ? currentProject?.name : 'Dashboard'}
              </h2>
              {selectedProject && currentProject?.description && (
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5 truncate">{currentProject.description}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            {selectedProject && (
              <button
                onClick={() => setProjectModal({ open: true, project: currentProject })}
                className="border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all text-xs sm:text-sm"
              >
                Edit
              </button>
            )}
            {projects.length > 0 && (
              <button
                onClick={() => setTaskModal({ open: true, status: 'TODO' })}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/20 text-xs sm:text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden xs:inline">New Task</span>
                <span className="xs:hidden">Task</span>
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-10">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-0 px-4">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-blue-500/10 border border-blue-500/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6">
                <Plus className="w-10 h-10 sm:w-14 sm:h-14 text-blue-400" />
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-white mb-3">Create your first project</h3>
              <p className="text-slate-400 text-sm sm:text-lg mb-8">Start by creating a project to organise your tasks.</p>
              <button
                onClick={() => setProjectModal({ open: true })}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20"
              >
                New Project
              </button>
            </div>
          ) : selectedProject ? (
            <KanbanBoard
              tasks={visibleTasks}
              onAddTask={status => setTaskModal({ open: true, status })}
              onEditTask={task => setTaskModal({ open: true, task })}
              onDeleteTask={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <Dashboard tasks={tasks} projects={projects} />
          )}
        </div>
      </main>

      {taskModal.open && (
        <TaskModal
          task={taskModal.task}
          projects={projects}
          defaultStatus={taskModal.status}
          defaultProjectId={selectedProject ?? projects[0]?.id}
          onSave={handleSaveTask}
          onClose={() => setTaskModal({ open: false })}
        />
      )}

      {projectModal.open && (
        <ProjectModal
          project={projectModal.project}
          onSave={handleSaveProject}
          onClose={() => setProjectModal({ open: false })}
        />
      )}
    </div>
  );
}
