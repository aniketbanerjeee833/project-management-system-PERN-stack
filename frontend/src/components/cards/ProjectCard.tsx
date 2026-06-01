
import { motion } from 'framer-motion'
import { Calendar, Users, MoreHorizontal } from 'lucide-react'
import type { Project } from '../../types'
import Badge from '../shared/Badge'
import { formatDate } from '../../utils'

interface ProjectCardProps {
  project: Project
  delay?: number
}

const ProjectCard= ({ project, delay = 0 }: ProjectCardProps) => {
  const statusVariant = project.status === 'completed' ? 'success' : project.status === 'archived' ? 'default' : 'info'
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0" style={{ background: project.color }}>
            {project.name[0]}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">{project.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{project.description}</p>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
          <MoreHorizontal size={14} className="text-slate-400" />
        </button>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-500 dark:text-slate-400">Progress</span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{project.progress}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.8, delay: delay + 0.2 }}
            className="h-full rounded-full"
            style={{ background: project.color }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 text-[10px] font-medium bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 rounded-full border border-slate-200/60 dark:border-slate-600/60">{tag}</span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Users size={11} /><span>{project.teamCount}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={11} /><span>{formatDate(project.dueDate)}</span>
          </div>
        </div>
        <Badge variant={statusVariant} size="sm">{project.status}</Badge>
      </div>
    </motion.div>
  )
}

export default ProjectCard