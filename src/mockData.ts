import type { Project, Task } from './types';

export const DEMO_PROJECTS: Project[] = [
  { id: 1, name: 'Portfolio Website', description: 'Personal developer portfolio built with Next.js', color: '#00c896', createdAt: '2026-01-10T10:00:00Z' },
  { id: 2, name: 'SaaS Platform', description: 'B2B SaaS landing page and dashboard', color: '#6366f1', createdAt: '2026-02-01T09:00:00Z' },
  { id: 3, name: 'Mobile App', description: 'Flutter caregiver companion app', color: '#f59e0b', createdAt: '2026-03-15T08:00:00Z' },
];

export const DEMO_TASKS: Task[] = [
  // Project 1
  { id: 1,  title: 'Design hero section',       description: 'Animated hero with typewriter effect', status: 'DONE',        priority: 'HIGH',   project: DEMO_PROJECTS[0], dueDate: '2026-01-15', createdAt: '2026-01-10T10:00:00Z' },
  { id: 2,  title: 'Build skills component',     description: 'Skill bars with categories',           status: 'DONE',        priority: 'MEDIUM', project: DEMO_PROJECTS[0], dueDate: '2026-01-18', createdAt: '2026-01-11T10:00:00Z' },
  { id: 3,  title: 'Projects section filtering', description: 'Filter projects by tech stack',        status: 'DONE',        priority: 'MEDIUM', project: DEMO_PROJECTS[0], dueDate: '2026-01-20', createdAt: '2026-01-12T10:00:00Z' },
  { id: 4,  title: 'Deploy to Vercel',           description: 'Setup CI/CD pipeline',                 status: 'DONE',        priority: 'HIGH',   project: DEMO_PROJECTS[0], dueDate: '2026-01-22', createdAt: '2026-01-13T10:00:00Z' },
  { id: 5,  title: 'Add live project demos',     description: 'Link all projects to live URLs',       status: 'IN_PROGRESS', priority: 'HIGH',   project: DEMO_PROJECTS[0], dueDate: '2026-05-25', createdAt: '2026-05-01T10:00:00Z' },
  { id: 6,  title: 'SEO optimization',           description: 'Meta tags and sitemap',                status: 'TODO',        priority: 'LOW',    project: DEMO_PROJECTS[0], dueDate: '2026-06-01', createdAt: '2026-05-10T10:00:00Z' },
  // Project 2
  { id: 7,  title: 'Design pricing section',     description: 'Three-tier pricing cards',             status: 'DONE',        priority: 'HIGH',   project: DEMO_PROJECTS[1], dueDate: '2026-02-10', createdAt: '2026-02-01T09:00:00Z' },
  { id: 8,  title: 'Testimonials carousel',      description: 'Auto-scrolling testimonials',          status: 'DONE',        priority: 'MEDIUM', project: DEMO_PROJECTS[1], dueDate: '2026-02-15', createdAt: '2026-02-03T09:00:00Z' },
  { id: 9,  title: 'CTA animations',             description: 'Framer Motion scroll animations',     status: 'IN_PROGRESS', priority: 'MEDIUM', project: DEMO_PROJECTS[1], dueDate: '2026-05-28', createdAt: '2026-02-05T09:00:00Z' },
  { id: 10, title: 'Contact form integration',   description: 'EmailJS form integration',             status: 'REVIEW',      priority: 'HIGH',   project: DEMO_PROJECTS[1], dueDate: '2026-05-30', createdAt: '2026-02-06T09:00:00Z' },
  { id: 11, title: 'Analytics setup',            description: 'Google Analytics 4 integration',      status: 'TODO',        priority: 'LOW',    project: DEMO_PROJECTS[1], dueDate: '2026-06-05', createdAt: '2026-05-12T09:00:00Z' },
  // Project 3
  { id: 12, title: 'Auth flow screens',          description: 'Login, register and onboarding',      status: 'DONE',        priority: 'HIGH',   project: DEMO_PROJECTS[2], dueDate: '2026-03-20', createdAt: '2026-03-15T08:00:00Z' },
  { id: 13, title: 'Routine management UI',      description: 'Daily care routines CRUD',            status: 'DONE',        priority: 'HIGH',   project: DEMO_PROJECTS[2], dueDate: '2026-03-28', createdAt: '2026-03-16T08:00:00Z' },
  { id: 14, title: 'Push notifications',         description: 'Reminder system with local notifs',   status: 'IN_PROGRESS', priority: 'MEDIUM', project: DEMO_PROJECTS[2], dueDate: '2026-06-01', createdAt: '2026-03-20T08:00:00Z' },
  { id: 15, title: 'Offline mode',               description: 'Cache data with Hive for offline use', status: 'TODO',        priority: 'HIGH',   project: DEMO_PROJECTS[2], dueDate: '2026-06-15', createdAt: '2026-04-01T08:00:00Z' },
];
