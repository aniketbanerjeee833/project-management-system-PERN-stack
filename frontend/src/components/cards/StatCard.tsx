import React from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: number
  trendLabel?: string
  color?: 'indigo' | 'emerald' | 'amber' | 'rose'
  delay?: number
}

const colorMap = {
  indigo:  { icon: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'   },
  emerald: { icon: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' },
  amber:   { icon: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30'       },
  rose:    { icon: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30'           },
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendLabel, color = 'indigo', delay = 0 }) => {
  const c = colorMap[color]
  const isPositive = (trend ?? 0) >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon}`}>
          <Icon size={18} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-slate-400">{trendLabel ?? 'vs last month'}</span>
        </div>
      )}
    </motion.div>
  )
}

export default StatCard