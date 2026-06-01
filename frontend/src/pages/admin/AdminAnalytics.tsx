import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import ChartCard from '../../components/charts/ChartCard';
import { analytics } from '../../data/mockData';

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ name?: string; value?: string | number; color?: string }>
  label?: string
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

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

const pieData = [
  { name: 'Completed', value: 34 },
  { name: 'In Progress', value: 22 },
  { name: 'Backlog', value: 18 },
  { name: 'Review', value: 12 },
];

const AdminAnalytics: React.FC = () => (
  <div className="space-y-5">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analytics</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">Workspace performance overview</p>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartCard title="Project Growth" subtitle="Projects created over time" delay={0.1}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={analytics.projectGrowth}>
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="projects" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} name="Projects" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Task Distribution" subtitle="By current status" delay={0.15}>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Weekly Task Completion" subtitle="Completed vs total tasks" delay={0.2}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={analytics.taskCompletion}>
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
            <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Total" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Team Performance Scores" subtitle="Individual member scores" delay={0.25}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={analytics.teamPerformance} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" fill="#6366f1" radius={[0, 6, 6, 0]} name="Score" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  </div>
);

export default AdminAnalytics;