import React from 'react';
import { motion } from 'framer-motion';
import { Users, FolderOpen, CheckSquare, DollarSign, Activity} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/cards/StatCard';
import ChartCard from '../../components/charts/ChartCard';

import { workspaceStats, analytics, recentActivities } from '../../data/mockData';
import { formatCurrency } from '../../utils';
import { useAuth } from '../../hooks/AuthContext';

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ name?: string; value?: string | number; color?: string }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-xl text-xs">
        <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="font-bold">{p.value}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboard: React.FC = () => {
  const activityTypeIcon: Record<string, string> = { project: '📁', task: '✅', member: '👤' };
    const { user } = useAuth()
      console.log(user)
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome, {user?.name} 👋</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Here's what's happening in your workspace today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/15 rounded-xl">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">All systems operational</span>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={workspaceStats.totalMembers} icon={Users} trend={12} color="indigo" delay={0} />
        <StatCard title="Total Projects" value={workspaceStats.totalProjects} icon={FolderOpen} trend={8} color="emerald" delay={0.05} />
        <StatCard title="Open Tasks" value={workspaceStats.openTasks} icon={CheckSquare} trend={-3} trendLabel="vs last week" color="amber" delay={0.1} />
        <StatCard title="Monthly Revenue" value={formatCurrency(workspaceStats.revenue)} icon={DollarSign} trend={14} color="rose" delay={0.15} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Revenue Growth" subtitle="Last 6 months" delay={0.2} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analytics.revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Team Performance" subtitle="Score by member" delay={0.25}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.teamPerformance} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} name="Score" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Task Completion Chart */}
        <ChartCard title="Task Completion" subtitle="Weekly completion rate" delay={0.3}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={analytics.taskCompletion} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
              <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recent Activity */}
        <ChartCard title="Recent Activity" subtitle="Latest workspace events" delay={0.35} className="lg:col-span-2">
          <div className="space-y-3">
            {recentActivities.map((act, i) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="flex items-center gap-3 py-2"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-sm flex-shrink-0">
                  {activityTypeIcon[act.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">{act.actor}</span> {act.action}{' '}
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">{act.target}</span>
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0">{act.time}</span>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Workspace Health */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity size={16} />
              <span className="text-sm font-semibold text-white/90">Workspace Health Score</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold">{workspaceStats.healthScore}</span>
              <span className="text-xl text-white/70">/100</span>
            </div>
            <p className="text-white/70 text-xs mt-1">Excellent health — keep it up!</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Velocity', value: '94%' },
              { label: 'Uptime', value: '99.9%' },
              { label: 'CSAT', value: '4.8★' },
            ].map(m => (
              <div key={m.label} className="text-center">
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-[10px] text-white/60 mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;