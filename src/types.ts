export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Project {
  id: number;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  tasks?: Task[];
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  project: Project;
  dueDate?: string;
  createdAt: string;
}
