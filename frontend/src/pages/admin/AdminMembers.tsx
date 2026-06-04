// src/pages/admin/AdminMembers.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Search, MoreHorizontal, Shield, Trash2, Eye, Clock, Loader2 } from "lucide-react";
import Avatar from "../../components/shared/Avatar";
import Badge from "../../components/shared/Badge";
import { formatDate } from "../../utils";
import InviteMemberModal from "../../components/modal/InviteMemberModal";
import { useMemberQueries } from "../../hooks/api/useMemberQueries";
import { useInvitationQueries } from "../../hooks/api/useInvitationQueries";
import type { Member } from "../../api/member.api";

// TODO: get from auth context / route params
const WORKSPACE_ID = 1;

const roleColors: Record<string, "info" | "purple" | "default"> = {
  admin: "purple",
  manager: "info",
  employee: "default",
};

type Tab = "members" | "pending";

const AdminMembers: React.FC = () => {
  const [search, setSearch]       = useState("");
  const [tab, setTab]             = useState<Tab>("members");
  const [actionMenu, setActionMenu] = useState<number | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const { members, pendingInvites, removeMember, changeRole } =
    useMemberQueries(WORKSPACE_ID);

  const { sendInvite } = useInvitationQueries(WORKSPACE_ID);

  // ── Filtered members list ─────────────────────────────────────────────────
  const filteredMembers = (members.data ?? []).filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPending = (pendingInvites.data ?? []).filter((i) =>
    i.email.toLowerCase().includes(search.toLowerCase())
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleInvite = async (email: string, role: "manager" | "employee") => {
    await sendInvite.mutateAsync({ email, role });
  };

  const handleRemove = async (userId: number) => {
    if (!confirm("Remove this member from the workspace?")) return;
    await removeMember.mutateAsync(userId);
    setActionMenu(null);
  };

  const handleChangeRole = async (userId: number, role: "manager" | "employee") => {
    await changeRole.mutateAsync({ userId, role });
    setActionMenu(null);
  };

  // ── Loading / error ───────────────────────────────────────────────────────
  if (members.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
      </div>
    );
  }

  if (members.isError) {
    return (
      <div className="text-center py-20 text-red-500 text-sm">
        Failed to load members.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Members</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {members.data?.length ?? 0} members in workspace
          </p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-indigo-500/25"
        >
          <UserPlus size={15} />
          Invite Member
        </button>
      </motion.div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Search + tabs */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-300 dark:focus:border-indigo-600 transition-colors"
            />
          </div>

          {/* Tab toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-0.5">
            <button
              onClick={() => setTab("members")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === "members"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Members ({members.data?.length ?? 0})
            </button>
            <button
              onClick={() => setTab("pending")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === "pending"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Clock size={11} />
              Pending ({pendingInvites.data?.length ?? 0})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {/* ── MEMBERS TAB ── */}
          {tab === "members" && (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60">
                  {["Member", "Role", "Joined", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((user: Member, i: number) => (
                  <motion.tr
                    key={user.user_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar initials={user.name.slice(0, 2).toUpperCase()} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={roleColors[user.role]} size="sm">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(user.joined_at)}
                    </td>
                    <td className="px-4 py-3.5">
                      {/* Don't show action menu for admin */}
                      {user.role !== "admin" && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActionMenu(actionMenu === user.user_id ? null : user.user_id)
                            }
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                          >
                            <MoreHorizontal size={15} className="text-slate-400" />
                          </button>
                          {actionMenu === user.user_id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden"
                            >
                              <button
                                onClick={() => setActionMenu(null)}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                              >
                                <Eye size={13} /> View Profile
                              </button>
                              <button
                                onClick={() =>
                                  handleChangeRole(
                                    user.user_id,
                                    user.role === "manager" ? "employee" : "manager"
                                  )
                                }
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                              >
                                <Shield size={13} />
                                Make {user.role === "manager" ? "employee" : "manager"}
                              </button>
                              <button
                                onClick={() => handleRemove(user.user_id)}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <Trash2 size={13} /> Remove Member
                              </button>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-sm text-slate-400">
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* ── PENDING TAB ── */}
          {tab === "pending" && (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60">
                  {["Email", "Role", "Expires", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPending.map((invite, i) => (
                  <motion.tr
                    key={invite.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-t border-slate-100 dark:border-slate-700/50"
                  >
                    <td className="px-4 py-3.5 text-sm text-slate-700 dark:text-slate-300">
                      {invite.email}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={roleColors[invite.role]} size="sm">
                        {invite.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(invite.expires_at)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-amber-500 font-medium">Pending</span>
                    </td>
                  </motion.tr>
                ))}
                {filteredPending.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-sm text-slate-400">
                      No pending invites.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* Invite Modal */}
      <InviteMemberModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSubmit={handleInvite}
        loading={sendInvite.isPending}
      />
    </div>
  );
};

export default AdminMembers;