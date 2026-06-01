import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
  size?: 'sm' | 'md'
  dot?: boolean
}

const variantMap = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  danger:  'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info:    'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  purple:  'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

const dotMap = {
  default: 'bg-slate-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
  info:    'bg-blue-500',
  purple:  'bg-purple-500',
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'sm', dot = false }) => {
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  return (
    <span className={`inline-flex items-center gap-1.5 ${padding} font-medium rounded-full ${variantMap[variant]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotMap[variant]}`} />}
      {children}
    </span>
  )
}

export default Badge