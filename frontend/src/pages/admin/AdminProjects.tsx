import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import ProjectCard from '../../components/cards/ProjectCard';
// import { projects asprojects } from '../../data/mockData';

import ProjectModal, { type Manager, type ProjectFormData } from '../../components/modal/ProjectModal';
import { useProjectQueries } from '../../hooks/api/useProjectQueries';
import { useAuth } from '../../hooks/AuthContext';
import { useMemberQueries } from '../../hooks/api/useMemberQueries';
// import { useMemberQueries } from '../../hooks/api/useMemberQueries';

// ─── Mock managers (replace with real API call) ───────────────────────────────
// const MOCK_MANAGERS : Manager[] = [
//   { id: 1, name: 'Priya Sharma' },
//   { id: 2, name: 'Vikram Nair' },
// ];
//const workspaceId = 1; // from params/context


// ─── Types ────────────────────────────────────────────────────────────────────

type FilterStatus =  'all'| 'active' | 'completed' | 'hold' ;

// Minimal shape needed from your existing Project type for the edit modal
interface ProjectForEdit {
  id: number;
  name: string;
  description: string;
  manager_id: number | '';
  start_date: string;
  due_date: string;
  status: ProjectFormData['status'];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminProjects: React.FC = () => {
   const { workspace,role } = useAuth()
      const workspaceId= Number(workspace?.id)
      console.log(workspaceId);
        const { managers} =useMemberQueries(workspaceId);
        console.log(managers.data,"managers");
        const MOCK_MANAGERS =managers.data ?? [];
        
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<(ProjectFormData & { id: number }) | null>(null);
  const [submitting, setSubmitting] = useState(false);
    const {createProject,projects} = useProjectQueries({workspaceId,role: role!,});
    const projectList = projects.data ?? [];
    console.log('projects', projectList);
  const filtered = projectList?.filter(p =>
    (filter === 'all' || p.status === filter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  /**
   * Call this from ProjectCard's edit button.
   * Map your existing project shape to ProjectFormData fields.
   */
  const openEdit = (project: ProjectForEdit) => {
    setEditingProject({
      id: project.id,
      name: project.name,
      description: project.description ?? '',
      manager_id: project.manager_id ?? '',
      start_date: project.start_date ?? '',
      due_date: project.due_date ?? '',
      status: project.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (data: ProjectFormData) => {
    setSubmitting(true);
    const payload = {
  ...data,
  manager_id:
    data.manager_id === ""
      ? undefined
      : Number(data.manager_id)
};
    try {
      if (editingProject) {
        // ── EDIT ──────────────────────────────────────────────────────────
        // await api.put(`/workspaces/${workspaceId}/projects/${editingProject.id}`, data);
        console.log('UPDATE project', editingProject.id, data);
      } else {
        // ── CREATE ────────────────────────────────────────────────────────
        // await api.post(`/workspaces/${workspaceId}/projects`, data);
        await createProject.mutateAsync(payload);
        console.log('CREATE project', payload);
      }
      setModalOpen(false);
      // Refresh your project list here (invalidate query / re-fetch)
    } catch (err) {
      console.error(err);
      // Show a toast / error message
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Projects</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {projectList.length} total projects
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-indigo-500/25"
        >
          <Plus size={15} />
          New Project
        </button>
      </motion.div>

      {/* Filters + Search */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
      >
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-0.5">
          {(['all', 'active', 'on_hold', 'completed', 'archived'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="pl-8 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-300 dark:focus:border-indigo-600 text-slate-700 dark:text-slate-300 transition-colors"
          />
        </div>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            delay={i * 0.06}
            // Wire your ProjectCard's edit button to openEdit:
            onEdit={() => openEdit(project as unknown as ProjectForEdit)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📁</p>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No projects found</p>
        </div>
      )}

      {/* Modal — shared for create & edit */}
      <ProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        project={editingProject}
        managers={MOCK_MANAGERS}
        onSubmit={handleSubmit}
        loading={submitting}
      />
    </div>
  );
};

export default AdminProjects;