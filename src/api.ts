import axios from 'axios';
import type { Project, Task, TaskStatus, Priority } from './types';

const api = axios.create({ baseURL: '/api' });

export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects').then(r => r.data),
  create: (data: { name: string; description?: string; color?: string }) =>
    api.post<Project>('/projects', data).then(r => r.data),
  update: (id: number, data: { name: string; description?: string; color?: string }) =>
    api.put<Project>(`/projects/${id}`, data).then(r => r.data),
  remove: (id: number) => api.delete(`/projects/${id}`),
};

export const tasksApi = {
  getAll: (projectId?: number) =>
    api.get<Task[]>('/tasks', { params: projectId ? { projectId } : {} }).then(r => r.data),
  create: (data: { title: string; description?: string; status?: TaskStatus; priority?: Priority; projectId: number; dueDate?: string }) =>
    api.post<Task>('/tasks', data).then(r => r.data),
  update: (id: number, data: Partial<{ title: string; description: string; status: TaskStatus; priority: Priority; projectId: number; dueDate: string }>) =>
    api.put<Task>(`/tasks/${id}`, data).then(r => r.data),
  remove: (id: number) => api.delete(`/tasks/${id}`),
};
