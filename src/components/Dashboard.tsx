import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import type { Task, Project } from '../types';

const STATUS_COLORS  = { TODO: '#64748b', IN_PROGRESS: '#3b82f6', REVIEW: '#eab308', DONE: '#22c55e' };
const PRIORITY_COLORS = { LOW: '#64748b', MEDIUM: '#f59e0b', HIGH: '#ef4444' };

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '16px',
  color: '#f1f5f9',
  padding: '12px 16px',
};

interface Props { tasks: Task[]; projects: Project[]; }

export default function Dashboard({ tasks, projects }: Props) {
  const statusData = Object.entries(STATUS_COLORS).map(([status, color]) => ({
    name: status.replace('_', ' '),
    count: tasks.filter(t => t.status === status).length,
    color,
  }));

  const priorityData = Object.entries(PRIORITY_COLORS).map(([priority, color]) => ({
    name: priority,
    value: tasks.filter(t => t.priority === priority).length,
    color,
  }));

  const projectData = projects.map(p => ({
    name: p.name.length > 18 ? p.name.slice(0, 18) + '…' : p.name,
    tasks: tasks.filter(t => t.project?.id === p.id).length,
    done:  tasks.filter(t => t.project?.id === p.id && t.status === 'DONE').length,
    color: p.color,
  }));

  const total      = tasks.length;
  const done       = tasks.filter(t => t.status === 'DONE').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Tasks',  value: total,           color: 'text-white',      border: 'border-slate-700',       bg: 'bg-slate-800'       },
          { label: 'In Progress',  value: inProgress,      color: 'text-blue-400',   border: 'border-blue-500/30',     bg: 'bg-blue-500/10'     },
          { label: 'Completed',    value: done,            color: 'text-green-400',  border: 'border-green-500/30',    bg: 'bg-green-500/10'    },
          { label: 'Projects',     value: projects.length, color: 'text-purple-400', border: 'border-purple-500/30',   bg: 'bg-purple-500/10'   },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-8 border ${s.border}`}>
            <p className="text-sm text-slate-400 mb-3 font-medium uppercase tracking-widest">{s.label}</p>
            <p className={`text-6xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tasks by status */}
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-7">Tasks by Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statusData} barSize={44} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 13, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 13, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks by priority */}
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-7">Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label>
                {priorityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend formatter={val => <span style={{ color: '#94a3b8' }}>{val}</span>} />
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress by project */}
      {projectData.length > 0 && (
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-8">Progress by Project</h3>
          <div className="space-y-6">
            {projectData.map(p => (
              <div key={p.name}>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-300 font-semibold">{p.name}</span>
                  <span className="text-slate-500">{p.done}/{p.tasks} done</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: p.tasks ? `${(p.done / p.tasks) * 100}%` : '0%', backgroundColor: p.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
