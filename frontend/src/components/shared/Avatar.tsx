import React from 'react'

interface AvatarProps {
  initials: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-14 h-14 text-lg',
}

const gradientMap: Record<string, string> = {
  RS: 'from-indigo-500 to-violet-600',
  PV: 'from-pink-500 to-rose-600',
  AS: 'from-sky-500 to-blue-600',
  NK: 'from-emerald-500 to-teal-600',
  VJ: 'from-amber-500 to-orange-600',
  SP: 'from-purple-500 to-fuchsia-600',
  KM: 'from-cyan-500 to-sky-600',
  AR: 'from-red-500 to-pink-600',
  SY: 'from-slate-400 to-slate-500',
}

const Avatar: React.FC<AvatarProps> = ({ initials, size = 'md', className = '' }) => {
  const gradient = gradientMap[initials] || 'from-indigo-500 to-violet-600'
  return (
    <div className={`${sizeMap[size]} bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}>
      {initials}
    </div>
  )
}

export default Avatar