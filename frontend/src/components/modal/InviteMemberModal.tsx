// src/components/modals/InviteMemberModal.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";

type Role = "manager" | "employee";

interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string, role: Role) => Promise<void>;
  loading?: boolean;
}

const InviteMemberModal = ({
  open,
  onClose,
  onSubmit,
  loading = false,
}:InviteMemberModalProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("employee");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail("");
      setRole("employee");
      setError("");
      setSuccess(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const validate = () => {
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    await onSubmit(email.trim(), role);
    setSuccess(true);
  };

  const inputBase =
    "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 " +
    "px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none " +
    "focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors disabled:opacity-50";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Invite member
              </h2>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            {success ? (
              <div className="flex flex-col items-center justify-center gap-3 px-5 py-10">
                <CheckCircle size={40} className="text-emerald-500" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Invite sent!
                </p>
                <p className="text-xs text-slate-500 text-center">
                  An invite link has been sent to <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span>.
                  It expires in 7 days.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-2 text-xs text-indigo-600 hover:underline"
                >
                  Invite another member
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="px-5 py-5 space-y-4">

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        className={`${inputBase} pl-9`}
                        placeholder="priya@company.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        disabled={loading}
                      />
                    </div>
                    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                      Role
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["manager", "employee"] as Role[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          disabled={loading}
                          className={`px-4 py-2.5 rounded-xl border text-sm font-medium capitalize transition-all ${
                            role === r
                              ? r === "manager"
                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                                : "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                              : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">
                      {role === "manager"
                        ? "Can manage tasks and track project progress."
                        : "Can view assigned tasks and log time."}
                    </p>
                  </div>

                  {/* Info box */}
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    They'll receive an email with a link to join your workspace. The link expires in <span className="font-medium text-slate-700 dark:text-slate-300">7 days</span>.
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-60"
                  >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    Send invite
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InviteMemberModal;