import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';

const reports = [
  { id: 'r1', name: 'Monthly Workspace Summary', type: 'PDF', date: 'May 2026', size: '2.4 MB' },
  { id: 'r2', name: 'Team Performance Report', type: 'Excel', date: 'May 2026', size: '1.1 MB' },
  { id: 'r3', name: 'Project Status Overview', type: 'PDF', date: 'Apr 2026', size: '3.2 MB' },
  { id: 'r4', name: 'Task Completion Analysis', type: 'PDF', date: 'Apr 2026', size: '1.8 MB' },
  { id: 'r5', name: 'Revenue & Billing Summary', type: 'Excel', date: 'Q1 2026', size: '0.9 MB' },
];

export const AdminReports: React.FC = () => (
  <div className="space-y-5">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reports</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">Download workspace reports and exports</p>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-sm"
    >
      {reports.map((report, i) => (
        <div key={report.id} className={`flex items-center gap-4 p-4 ${i > 0 ? 'border-t border-slate-100 dark:border-slate-700/50' : ''} hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors`}>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
            <FileText size={18} className="text-indigo-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{report.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{report.date} · {report.size} · {report.type}</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/15 rounded-lg transition-colors">
            <Download size={13} />
            Download
          </button>
        </div>
      ))}
    </motion.div>
  </div>
);

export const AdminSettings: React.FC = () => (
  <div className="space-y-5 max-w-2xl">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">Manage workspace preferences</p>
    </motion.div>

    {[
      { section: 'Workspace', fields: [{ label: 'Workspace Name', value: 'Acme Corp' }, { label: 'Slug', value: 'acme-corp' }] },
      { section: 'Security', fields: [{ label: 'Two-Factor Auth', value: 'Enabled' }, { label: 'Session Timeout', value: '7 days' }] },
    ].map((group, gi) => (
      <motion.div key={group.section} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.1 + 0.1 }}
        className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm"
      >
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">{group.section}</h3>
        <div className="space-y-3">
          {group.fields.map(field => (
            <div key={field.label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
              <span className="text-sm text-slate-600 dark:text-slate-400">{field.label}</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">{field.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    ))}
  </div>
);