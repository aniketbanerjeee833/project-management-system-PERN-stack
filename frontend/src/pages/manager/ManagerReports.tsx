import React from 'react'
import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'

const reports = [
  { id: 'r1', name: 'Sprint 12 Summary',       type: 'PDF',   date: 'May 2026', size: '1.2 MB' },
  { id: 'r2', name: 'Team Velocity Report',     type: 'Excel', date: 'May 2026', size: '0.8 MB' },
  { id: 'r3', name: 'Project Progress Report',  type: 'PDF',   date: 'Apr 2026', size: '2.1 MB' },
  { id: 'r4', name: 'Task Completion Summary',  type: 'PDF',   date: 'Apr 2026', size: '1.4 MB' },
]

const ManagerReports: React.FC = () => {
  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reports</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Team and project reports</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-sm"
      >
        {reports.map((report, i) => (
          <div
            key={report.id}
            className={`flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${i > 0 ? 'border-t border-slate-100 dark:border-slate-700/50' : ''}`}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
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
  )
}

export default ManagerReports