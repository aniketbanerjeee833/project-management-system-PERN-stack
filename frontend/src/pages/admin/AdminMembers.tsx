import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, MoreHorizontal, Shield, Trash2, Eye } from 'lucide-react';
import Avatar from '../../components/shared/Avatar';
import Badge from '../../components/shared/Badge';
import { allUsers } from '../../data/mockData';
import { formatDate } from '../../utils';

const roleColors: Record<string, 'info' | 'purple' | 'default'> = {
  admin: 'purple',
  manager: 'info',
  employee: 'default',
};

const statusColors: Record<string, 'success' | 'warning' | 'default'> = {
  active: 'success',
  pending: 'warning',
  inactive: 'default',
};

const AdminMembers: React.FC = () => {
  const [search, setSearch] = useState('');
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const filtered = allUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Members</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{allUsers.length} members in workspace</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-indigo-500/25">
          <UserPlus size={15} />
          Invite Member
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-700/60">
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-300 dark:focus:border-indigo-600 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                {['Member', 'Role', 'Department', 'Joined', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={user.avatar} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={roleColors[user.role]} size="sm">{user.role}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-400">{user.department}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{formatDate(user.joinedDate)}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant={statusColors[user.status]} size="sm" dot>{user.status}</Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="relative">
                      <button
                        onClick={() => setActionMenu(actionMenu === user.id ? null : user.id)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        <MoreHorizontal size={15} className="text-slate-400" />
                      </button>
                      {actionMenu === user.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden"
                        >
                          {[
                            { icon: Eye, label: 'View Profile', color: '' },
                            { icon: Shield, label: 'Change Role', color: '' },
                            { icon: Trash2, label: 'Remove Member', color: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' },
                          ].map(({ icon: Icon, label, color }) => (
                            <button
                              key={label}
                              onClick={() => setActionMenu(null)}
                              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${color || 'text-slate-700 dark:text-slate-300'}`}
                            >
                              <Icon size={13} />
                              {label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminMembers;