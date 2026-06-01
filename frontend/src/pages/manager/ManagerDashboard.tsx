import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, CheckSquare, Users, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/cards/StatCard';
import ChartCard from '../../components/charts/ChartCard';
import ProjectCard from '../../components/cards/ProjectCard';
import { projects, tasks, teamMembers, analytics } from '../../data/mockData';
import { getDaysUntil } from '../../utils';

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ name?: string; value?: string | number; color?: string }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-xl text-xs">
        <p className="font-semibold">{label}</p>
        {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
      </div>
    );
  }
  return null;
};

const managerProjects = projects.filter(p => p.managerId === 'u2');
const activeTasks = tasks.filter(t => t.status !== 'done' && managerProjects.some(p => p.id === t.projectId));
const upcomingDeadlines = tasks.filter(t => {
  const d = getDaysUntil(t.dueDate);
  return d >= 0 && d <= 7;
}).slice(0, 4);

const ManagerDashboard: React.FC = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Good morning, Priya 👋</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">Manage your projects and team efficiently.</p>
    </motion.div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="My Projects" value={managerProjects.length} icon={FolderOpen} color="indigo" delay={0} />
      <StatCard title="Active Tasks" value={activeTasks.length} icon={CheckSquare} color="emerald" delay={0.05} />
      <StatCard title="Team Members" value={teamMembers.length} icon={Users} color="amber" delay={0.1} />
      <StatCard title="Due This Week" value={upcomingDeadlines.length} icon={Clock} color="rose" delay={0.15} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <ChartCard title="Team Task Completion" subtitle="Weekly trends" delay={0.2} className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={analytics.taskCompletion}>
            <defs>
              <linearGradient id="manGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={2.5} fill="url(#manGrad)" name="Completed" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Upcoming Deadlines" delay={0.25}>
        <div className="space-y-3">
          {upcomingDeadlines.map((task, i) => {
            const d = getDaysUntil(task.dueDate);
            return (
              <motion.div key={task.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }}
                className="flex items-center gap-2.5 py-1.5"
              >
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${d === 0 ? 'bg-red-500' : d <= 3 ? 'bg-amber-500' : 'bg-indigo-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{task.title}</p>
                  <p className="text-[10px] text-slate-400">{task.projectName}</p>
                </div>
                <span className={`text-[10px] font-semibold flex-shrink-0 ${d === 0 ? 'text-red-500' : d <= 3 ? 'text-amber-500' : 'text-slate-400'}`}>
                  {d === 0 ? 'Today' : `${d}d`}
                </span>
              </motion.div>
            );
          })}
        </div>
      </ChartCard>
    </div>

    <div>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-3">My Projects</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {managerProjects.map((project, i) => (
          <ProjectCard key={project.id} project={project} delay={i * 0.08} />
        ))}
      </div>
    </div>
  </div>
);

export default ManagerDashboard;