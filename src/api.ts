import axios from 'axios';
import type { Project, Task, TaskStatus, Priority } from './types';
import { DEMO_PROJECTS, DEMO_TASKS } from './mockData';

const api = axios.create({ baseURL: '/api' });

// In-memory demo state (mutations work during the session)
let demoProjects = [...DEMO_PROJECTS];
let demoTasks    = [...DEMO_TASKS];
let nextProjId   = 100;
let nextTaskId   = 100;

async function withFallback<T>(apiFn: () => Promise<T>, mockFn: () => T): Promise<T> {
  try {
    return await apiFn();
  } catch {
    return mockFn();
  }
}

export const projectsApi = {
  getAll: () =>
    withFallback(
      () => api.get<Project[]>('/projects').then(r => r.data),
      () => [...demoProjects]
    ),

  create: (data: { name: string; description?: string; color?: string }) =>
    withFallback(
      () => api.post<Project>('/projects', data).then(r => r.data),
      () => {
        const p: Project = {
          id: nextProjId++,
          name: data.name,
          description: data.description,
          color: data.color ?? '#6366f1',
          createdAt: new Date().toISOString(),
        };
        demoProjects = [...demoProjects, p];
        return p;
      }
    ),

  update: (id: number, data: { name: string; description?: string; color?: string }) =>
    withFallback(
      () => api.put<Project>(`/projects/${id}`, data).then(r => r.data),
      () => {
        demoProjects = demoProjects.map(p =>
          p.id === id ? { ...p, ...data } : p
        );
        return demoProjects.find(p => p.id === id)!;
      }
    ),

  remove: (id: number) =>
    withFallback(
      () => api.delete(`/projects/${id}`),
      () => {
        demoProjects = demoProjects.filter(p => p.id !== id);
        demoTasks    = demoTasks.filter(t => t.project.id !== id);
        return undefined as any;
      }
    ),
};

export const tasksApi = {
  getAll: (projectId?: number) =>
    withFallback(
      () => api.get<Task[]>('/tasks', { params: projectId ? { projectId } : {} }).then(r => r.data),
      () => projectId
        ? demoTasks.filter(t => t.project.id === projectId)
        : [...demoTasks]
    ),

  create: (data: { title: string; description?: string; status?: TaskStatus; priority?: Priority; projectId: number; dueDate?: string }) =>
    withFallback(
      () => api.post<Task>('/tasks', data).then(r => r.data),
      () => {
        const proj = demoProjects.find(p => p.id === data.projectId)!;
        const t: Task = {
          id: nextTaskId++,
          title: data.title,
          description: data.description,
          status: data.status ?? 'TODO',
          priority: data.priority ?? 'MEDIUM',
          project: proj,
          dueDate: data.dueDate,
          createdAt: new Date().toISOString(),
        };
        demoTasks = [...demoTasks, t];
        return t;
      }
    ),

  update: (id: number, data: Partial<{ title: string; description: string; status: TaskStatus; priority: Priority; projectId: number; dueDate: string }>) =>
    withFallback(
      () => api.put<Task>(`/tasks/${id}`, data).then(r => r.data),
      () => {
        demoTasks = demoTasks.map(t => {
          if (t.id !== id) return t;
          const proj = data.projectId
            ? demoProjects.find(p => p.id === data.projectId) ?? t.project
            : t.project;
          return { ...t, ...data, project: proj };
        });
        return demoTasks.find(t => t.id === id)!;
      }
    ),

  remove: (id: number) =>
    withFallback(
      () => api.delete(`/tasks/${id}`),
      () => {
        demoTasks = demoTasks.filter(t => t.id !== id);
        return undefined as any;
      }
    ),
};
