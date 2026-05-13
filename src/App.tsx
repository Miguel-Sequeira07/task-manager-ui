import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import Dashboard from './components/Dashboard';
import TaskModal from './components/TaskModal';
import ProjectModal from './components/ProjectModal';
import { projectsApi, tasksApi } from './api';
import type { Project, Task, TaskStatus } from './types';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [taskModal, setTaskModal] = useState<{ open: boolean; task?: Task; status?: TaskStatus }>({ open: false });
  const [projectModal, setProjectModal] = useState<{ open: boolean; project?: Project }>({ open: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [ps, ts] = await Promise.all([projectsApi.getAll(), tasksApi.getAll()]);
      setProjects(ps);
      setTasks(ts);
      setError(null);
    } catch {
      setError('Cannot connect to backend. Make sure the Spring Boot server is running on port 8080.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const visibleTasks = selectedProject ? tasks.filter(t => t.project?.id === selectedProject) : tasks;
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-400 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        onNewProject={() => setProjectModal({ open: true })}
      />

      <main className="flex-1 flex flex-col overflow-hidden bg-slate-900">
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-14 py-9 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black text-white">
              {selectedProject ? currentProject?.name : 'Dashboard'}
            </h2>
            {selectedProject && currentProject?.description && (
              <p className="text-sm text-slate-400 mt-1">{currentProject.description}</p>
            )}
          </div>
          <div className="flex gap-3">
            {selectedProject && (
              <button
                onClick={() => setProjectModal({ open: true, project: currentProject })}
                className="border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white font-semibold px-7 py-3.5 rounded-xl transition-all whitespace-nowrap"
              >
                Edit Project
              </button>
            )}
            {projects.length > 0 && (
              <button
                onClick={() => setTaskModal({ open: true, status: 'TODO' })}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> New Task
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-14">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm">
              {error}
            </div>
          )}

          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-0">
              <div className="w-28 h-28 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center justify-center mb-8">
                <Plus className="w-14 h-14 text-blue-400" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">Create your first project</h3>
              <p className="text-slate-400 text-lg mb-10">Start by creating a project to organise your tasks.</p>
              <button
                onClick={() => setProjectModal({ open: true })}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-base px-10 py-5 rounded-2xl transition-all shadow-lg shadow-blue-600/20"
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
