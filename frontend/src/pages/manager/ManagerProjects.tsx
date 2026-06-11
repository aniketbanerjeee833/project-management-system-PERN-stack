

// import { motion } from 'framer-motion'
// import ProjectCard from '../../components/cards/ProjectCard'
// import { useAuth } from '../../hooks/AuthContext'
// import { useProjectQueries } from '../../hooks/api/useProjectQueries'
// // import { projects } from '../../data/mockData'

// // const managerProjects = projects.filter(p => p.managerId === 'u2')

// const ManagerProjects = () => {
//    const { role,workspace } = useAuth()
//         const workspaceId= Number(workspace?.id)
//         console.log(workspaceId);
//   const {managerProjects} = useProjectQueries({workspaceId,role: role!,});
//   const managerProjectList= managerProjects.data ?? [];
//   console.log(managerProjectList);
//   return (
//     <div className="space-y-5">
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Projects</h2>
//           <p className="text-sm text-slate-500 dark:text-slate-400">{managerProjectList?.length} projects assigned to you</p>
//         </div>
//         {/* <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-indigo-500/25">
//           <Plus size={15} />
//           New Project
//         </button> */}
//       </motion.div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//         {managerProjectList?.map((project, i) => (
//           <ProjectCard key={project.id} project={project} delay={i * 0.08} />
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ManagerProjects

// src/pages/manager/ManagerProjects.tsx
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectCard from '../../components/cards/ProjectCard';
import { useAuth } from '../../hooks/AuthContext';
import { useProjectQueries } from '../../hooks/api/useProjectQueries';

const ManagerProjects = () => {
  const { role, workspace } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const workspaceId = Number(workspace?.id);
  const { managerProjects } = useProjectQueries({ workspaceId, role: role! });
  const managerProjectList = managerProjects.data ?? [];

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Projects</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {managerProjectList.length} projects assigned to you
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {managerProjectList.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            delay={i * 0.08}
            onClick={() => navigate(`/${slug}/manager/projects/${project.id}/kanban`)}
          />
        ))}
      </div>

      {managerProjectList.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No projects assigned to you yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default ManagerProjects;