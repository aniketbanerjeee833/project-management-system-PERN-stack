import React from 'react'
import { motion } from 'framer-motion'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  delay?: number
  className?: string
  action?: React.ReactNode
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children, delay = 0, className = '', action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={`bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm ${className}`}
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </motion.div>
)

export default ChartCard