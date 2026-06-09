// // src/pages/auth/InvitePage.tsx
// // Route: /invite?token=abc123
// // Flow:
// //   1. On mount → GET /invitations/:token → show workspace name + role
// //   2. User fills register or login form
// //   3. Submit → POST /invitations/:token/accept → store JWT → redirect

// import React, { useEffect, useState } from "react";
// import { useSearchParams, useNavigate, Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Building2, Loader2, AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
// import { useInvitationQueries } from "../hooks/api/useInvitationQueries";
// import { useAuth } from "../hooks/AuthContext";
// // import { useInvitationQueries } from "../../hooks/useInvitationQueries";
// // import { useAuthStore } from "../../store/authStore"; // adjust to your auth store

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface FormState {
//     name: string;
//     email: string;
//     password: string;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// const InvitePage: React.FC = () => {
//     const [searchParams] = useSearchParams();
//     const navigate = useNavigate();
//     const token = searchParams.get("token") ?? "";
//     const { refetch } = useAuth();
//     const [isNewUser, setIsNewUser] = useState(true);
//     const [showPassword, setShowPassword] = useState(false);
//     const [form, setForm] = useState<FormState>({ name: "", email: "", password: "" });
//     const [fieldErrors, setFieldErrors] = useState<Partial<FormState>>({}); //every property becomes optional.
//     const [submitError, setSubmitError] = useState("");
//     const [done, setDone] = useState(false);

//     const { validateInvite, acceptInvite } = useInvitationQueries(undefined, token);
//     //const setAuth = useAuthStore((s) => s.setAuth); // { setAuth(token, user) }

//     // Pre-fill email from the invite once loaded
//     useEffect(() => {
//         if (validateInvite.data?.email) {
//             setForm((prev) => ({ ...prev, email: validateInvite.data!.email }));
//         }
//     }, [validateInvite.data?.email]);

//     const set = (key: keyof FormState, val: string) => {
//         setForm((prev) => ({ ...prev, [key]: val }));
//         setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
//         setSubmitError("");
//     };

//     const validate = (): boolean => {
//         const errs: Partial<FormState> = {};
//         if (isNewUser && !form.name.trim()) errs.name = "Name is required.";
//         if (!form.email.trim()) errs.email = "Email is required.";
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email.";
//         if (!form.password) errs.password = "Password is required.";
//         if (isNewUser && form.password.length < 8) errs.password = "Min 8 characters.";
//         setFieldErrors(errs);
//         return Object.keys(errs).length === 0;
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!validate()) return;
//         setSubmitError("");

//         try {
//             const result = await acceptInvite.mutateAsync({
//                 name: isNewUser ? form.name.trim() : undefined,
//                 email: form.email.trim(),
//                 password: form.password,
//                 isNewUser,
//             });

//             // 1. Store the JWT (axios interceptor picks it up automatically)
//             localStorage.setItem("token", result.token);

//             // 2. Refetch /auth/me to populate workspace + role in context
//             await refetch();

//             setDone(true);

//             // 3. Navigate to role-based home — RoleRedirect handles the rest
//             setTimeout(() => navigate("/"), 1500);

//         } catch (err: unknown) {
//             setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
//         }
//     };

//     // const inputBase =
//     //     "w-full rounded-xl border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm " +
//     //     "text-slate-800 dark:text-slate-200 outline-none transition-colors " +
//     //     "disabled:opacity-50 disabled:cursor-not-allowed";

//     // const inputCls = (field: keyof FormState) =>
//     //     `${inputBase} ${fieldErrors[field]
//     //         ? "border-red-400 dark:border-red-500 focus:border-red-400"
//     //         : "border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500"
//     //     }`;

//     // ── No token in URL ────────────────────────────────────────────────────────
//     if (!token) return <ErrorScreen message="No invite token found in this link." />;

//     // ── Validating token ───────────────────────────────────────────────────────
//     if (validateInvite.isLoading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <Loader2 size={28} className="animate-spin text-indigo-500" />
//             </div>
//         );
//     }

//     // ── Invalid / expired token ────────────────────────────────────────────────
//     if (validateInvite.isError || !validateInvite.data) {
//         return <ErrorScreen message="This invite link is invalid or has expired. Ask your admin to resend it." />;
//     }

//     const { workspace_name, role } = validateInvite.data;

//     // ── Success state ──────────────────────────────────────────────────────────
//     if (done) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
//                 <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     className="text-center space-y-3"
//                 >
//                     <CheckCircle size={44} className="text-emerald-500 mx-auto" />
//                     <p className="text-base font-semibold text-slate-900 dark:text-white">
//                         You've joined {workspace_name}!
//                     </p>
//                     <p className="text-sm text-slate-400">Redirecting to your dashboard…</p>
//                 </motion.div>
//             </div>
//         );
//     }

//     // ── Main page ──────────────────────────────────────────────────────────────
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-10">
//             <motion.div
//                 initial={{ opacity: 0, y: 12 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.22 }}
//                 className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
//             >

//                 {/* ── Workspace banner ── */}
//                 <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800">
//                     <div className="flex items-center gap-3 mb-3">
//                         <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
//                             <Building2 size={20} className="text-indigo-600 dark:text-indigo-400" />
//                         </div>
//                         <div>
//                             <p className="text-xs text-slate-400 mb-0.5">You've been invited to</p>
//                             <p className="text-base font-semibold text-slate-900 dark:text-white leading-tight">
//                                 {workspace_name}
//                             </p>
//                         </div>
//                     </div>
//                     <span
//                         className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full capitalize ${role === "manager"
//                             ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
//                             : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
//                             }`}
//                     >
//                         Role: {role}
//                     </span>
//                 </div>

//                 {/* ── Tab toggle ── */}
//                 <div className="flex border-b border-slate-100 dark:border-slate-800">
//                     {([true, false] as const).map((val) => (
//                         <button
//                             key={String(val)}
//                             type="button"
//                             onClick={() => {
//                                 setIsNewUser(val);
//                                 setFieldErrors({});
//                                 setSubmitError("");
//                             }}
//                             className={`flex-1 py-3 text-sm font-medium transition-colors ${isNewUser === val
//                                 ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500"
//                                 : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
//                                 }`}
//                         >
//                             {val ? "Create account" : "I already have an account"}
//                         </button>
//                     ))}
//                 </div>

//                 {/* ── Form ── */}
//                 <form onSubmit={handleSubmit} noValidate className="px-6 py-5">
//                     <AnimatePresence mode="wait">
//                         <motion.div
//                             key={String(isNewUser)}
//                             initial={{ opacity: 0, x: isNewUser ? -10 : 10 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0 }}
//                             transition={{ duration: 0.15 }}
//                             className="space-y-4"
//                         >
//                             {/* Name — new users only */}
//                             {isNewUser && (
//                                 <div>
//                                     <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
//                                         Full name <span className="text-red-500">*</span>
//                                     </label>
//                                     {/* <input
//                     className={inputCls("name")}
//                     placeholder="Priya Sharma"
//                     value={form.name}
//                     onChange={(e) => set("name", e.target.value)}
//                     disabled={acceptInvite.isPending}
//                     autoComplete="name"
//                   /> */}
//                                     <input
//                                         className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm
//   text-slate-800 dark:text-slate-200 outline-none transition-colors
//   disabled:opacity-50 disabled:cursor-not-allowed
//   ${fieldErrors.name
//                                                 ? "border-red-400 dark:border-red-500 focus:border-red-400"
//                                                 : "border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500"
//                                             }`}
//                                         placeholder="Priya Sharma"
//                                         value={form.name}
//                                         onChange={(e) => set("name", e.target.value)}
//                                         disabled={acceptInvite.isPending}
//                                         autoComplete="name"
//                                     />
//                                     {fieldErrors.name && (
//                                         <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
//                                     )}
//                                 </div>
//                             )}

//                             {/* Email */}
//                             <div>
//                                 <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
//                                     Email <span className="text-red-500">*</span>
//                                 </label>
//                                 {/* <input
//                                     type="email"
//                                     className={`${inputCls("email")} bg-slate-50 dark:bg-slate-800/80`}
//                                     value={form.email}
//                                     onChange={(e) => set("email", e.target.value)}
//                                     disabled={acceptInvite.isPending}
//                                     autoComplete="email"
//                                 /> */}
//                                 <input
//                                     type="email"
//                                     className={`w-full rounded-xl border bg-slate-50 dark:bg-slate-800/80 px-3 py-2.5 text-sm
//                                             text-slate-800 dark:text-slate-200 outline-none transition-colors
//                                             disabled:opacity-50 disabled:cursor-not-allowed
//                                         ${fieldErrors.email
//                                             ? "border-red-400 dark:border-red-500 focus:border-red-400"
//                                             : "border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500"
//                                         }`}
//                                     value={form.email}
//                                     onChange={(e) => set("email", e.target.value)}
//                                     disabled={acceptInvite.isPending}
//                                     autoComplete="email"
//                                 />
//                                 <p className="mt-1 text-xs text-slate-400">Must match the email that was invited.</p>
//                                 {fieldErrors.email && (
//                                     <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
//                                 )}
//                             </div>

//                             {/* Password */}
//                             <div>
//                                 <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
//                                     Password <span className="text-red-500">*</span>
//                                 </label>
//                                 <div className="relative">
//                                     {/* <input
//                                         type={showPassword ? "text" : "password"}
//                                         className={`${inputCls("password")} pr-10`}
//                                         placeholder={isNewUser ? "Min. 8 characters" : "Your password"}
//                                         value={form.password}
//                                         onChange={(e) => set("password", e.target.value)}
//                                         disabled={acceptInvite.isPending}
//                                         autoComplete={isNewUser ? "new-password" : "current-password"}
//                                     /> */}
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-3 py-2.5 pr-10 text-sm
//                                             text-slate-800 dark:text-slate-200 outline-none transition-colors
//                                             disabled:opacity-50 disabled:cursor-not-allowed
//                                             ${fieldErrors.password
//                                                 ? "border-red-400 dark:border-red-500 focus:border-red-400"
//                                                 : "border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500"
//                                             }`}
//                                         placeholder={isNewUser ? "Min. 8 characters" : "Your password"}
//                                         value={form.password}
//                                         onChange={(e) => set("password", e.target.value)}
//                                         disabled={acceptInvite.isPending}
//                                         autoComplete={isNewUser ? "new-password" : "current-password"}
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword((p) => !p)}
//                                         className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
//                                         tabIndex={-1}
//                                     >
//                                         {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
//                                     </button>
//                                 </div>
//                                 {fieldErrors.password && (
//                                     <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
//                                 )}
//                             </div>

//                             {/* Submit error */}
//                             {submitError && (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: -4 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2.5"
//                                 >
//                                     <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
//                                     <p className="text-xs text-red-600 dark:text-red-400">{submitError}</p>
//                                 </motion.div>
//                             )}

//                             {/* Submit button */}
//                             <button
//                                 type="submit"
//                                 disabled={acceptInvite.isPending}
//                                 className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 mt-2"
//                             >
//                                 {acceptInvite.isPending && <Loader2 size={14} className="animate-spin" />}
//                                 {isNewUser ? "Create account & join workspace" : "Log in & join workspace"}
//                             </button>

//                             {/* Footer link */}
//                             {!isNewUser && (
//                                 <p className="text-center text-xs text-slate-400 mt-2">
//                                     Don't have an account?{" "}
//                                     <button
//                                         type="button"
//                                         onClick={() => setIsNewUser(true)}
//                                         className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
//                                     >
//                                         Register here
//                                     </button>
//                                 </p>
//                             )}
//                         </motion.div>
//                     </AnimatePresence>
//                 </form>

//                 {/* ── Info footer ── */}
//                 <div className="px-6 pb-5">
//                     <div className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
//                         This invite link is valid for <span className="font-medium text-slate-700 dark:text-slate-300">7 days</span>.
//                         By joining you'll get access to{" "}
//                         <span className="font-medium text-slate-700 dark:text-slate-300">{workspace_name}</span>{" "}
//                         as a <span className="font-medium capitalize">{role}</span>.
//                     </div>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };

// // ── Error screen ───────────────────────────────────────────────────────────────
// const ErrorScreen: React.FC<{ message: string }> = ({ message }) => (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
//         <div className="text-center max-w-sm space-y-3">
//             <AlertCircle size={40} className="text-red-400 mx-auto" />
//             <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{message}</p>
//             <Link
//                 to="/login"
//                 className="inline-block text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
//             >
//                 Go to login →
//             </Link>
//         </div>
//     </div>
// );

// export default InvitePage;

// src/pages/auth/InvitePage.tsx
// Route: /invite?token=abc123
// Flow:
//   1. On mount → GET /invitations/:token → show workspace name + role
//   2. User fills register or login form (RHF + Zod)
//   3. Submit → POST /invitations/:token/accept → set session → redirect

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Loader2, AlertCircle, Eye, EyeOff, CheckCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/AuthContext";
import { useInvitationQueries } from "../hooks/api/useInvitationQueries";


// ─── Zod schemas ──────────────────────────────────────────────────────────────

const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .min(2, "Name must be at least 2 characters."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Minimum 8 characters."),
});

const loginSchema = z.object({
  name: z.string().optional(),  // not used but keeps type consistent
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

// Union — which schema we use depends on isNewUser tab
type FormValues = z.infer<typeof registerSchema>;

// ─── Shared input class helper ────────────────────────────────────────────────

const inputCls = (hasError: boolean) =>
  [
    "w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors",
    "bg-white dark:bg-slate-800",
    "text-slate-800 dark:text-slate-200",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    hasError
      ? "border-red-400 dark:border-red-500 focus:border-red-400"
      : "border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500",
  ].join(" ");

// ─── Component ────────────────────────────────────────────────────────────────

const InvitePage: React.FC = () => {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();
  const token           = searchParams.get("token") ?? "";
  const { refetch, setAuth }     = useAuth();

  const [isNewUser, setIsNewUser]       = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError]   = useState("");
  const [done, setDone]                 = useState(false);

//  const { validateInvite, acceptInvite } = useInvitationQueries(token);
const { validateInvite, acceptInvite } = useInvitationQueries(undefined, token)
  // ── RHF setup ──────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(isNewUser ? registerSchema : loginSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onTouched",   // validate field on blur, then live on change
  });

  // Pre-fill email from invite data
  useEffect(() => {
    if (validateInvite.data?.email) {
      setValue("email", validateInvite.data.email, { shouldValidate: false });
    }
  }, [validateInvite.data?.email, setValue]);

  // Reset errors when switching tabs
  const switchTab = (val: boolean) => {
    setIsNewUser(val);
    setSubmitError("");
    reset({ name: "", email: validateInvite.data?.email ?? "", password: "" });
  };

  // ── Submit handler ─────────────────────────────────────────────────────────
  const onSubmit = async (data: FormValues) => {
    setSubmitError("");

    try {
      const result=await acceptInvite.mutateAsync({
        name:      isNewUser ? data.name : undefined,
        email:     data.email,
        password:  data.password,
        isNewUser,
      });
      setAuth(result.user);        // workspace/role resolved by refetch below
 
   
      // Refetch /auth/me to populate workspace + role in context
      await refetch();

      setDone(true);

      // RoleRedirect in AppLayout handles where each role lands
      setTimeout(() => navigate("/"), 1500);

    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };
  const formValues = watch();
  console.log("Form values:", formValues);
  // ── Guards ─────────────────────────────────────────────────────────────────

  if (!token) {
    return <ErrorScreen message="No invite token found in this link." />;
  }

  if (validateInvite.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  if (validateInvite.isError || !validateInvite.data) {
    return (
      <ErrorScreen message="This invite link is invalid or has expired. Ask your admin to resend it." />
    );
  }

  const { workspace_name, role } = validateInvite.data;

  // ── Success screen ─────────────────────────────────────────────────────────

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-3"
        >
          <CheckCircle size={44} className="text-emerald-500 mx-auto" />
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            You've joined {workspace_name}!
          </p>
          <p className="text-sm text-slate-400">Redirecting to your dashboard…</p>
        </motion.div>
      </div>
    );
  }

  // ── Main page ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
      >

        {/* ── Workspace banner ── */}
        <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
              <Building2 size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">You've been invited to</p>
              <p className="text-base font-semibold text-slate-900 dark:text-white leading-tight">
                {workspace_name}
              </p>
            </div>
          </div>
          <span
            className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
              role === "manager"
                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
            }`}
          >
            Role: {role}
          </span>
        </div>

        {/* ── Tab toggle ── */}
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          {([true, false] as const).map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => switchTab(val)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                isNewUser === val
                  ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              {val ? "Create account" : "I already have an account"}
            </button>
          ))}
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={String(isNewUser)}
              initial={{ opacity: 0, x: isNewUser ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >

              {/* ── Name (new users only) ── */}
              {isNewUser && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("name")}
                    placeholder="Priya Sharma"
                    autoComplete="name"
                    disabled={isSubmitting}
                    className={inputCls(!!errors.name)}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>
              )}

              {/* ── Email ── */}
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className={inputCls(!!errors.email)}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Must match the email that was invited.
                </p>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* ── Password ── */}
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder={isNewUser ? "Min. 8 characters" : "Your password"}
                    autoComplete={isNewUser ? "new-password" : "current-password"}
                    disabled={isSubmitting}
                    className={`${inputCls(!!errors.password)} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* ── Submit error ── */}
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2.5"
                >
                  <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-600 dark:text-red-400">{submitError}</p>
                </motion.div>
              )}

              {/* ── Submit button ── */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 mt-2"
              >
                {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                {isNewUser ? "Create account & join workspace" : "Log in & join workspace"}
              </button>

              {/* ── Footer link ── */}
              {!isNewUser && (
                <p className="text-center text-xs text-slate-400 mt-2">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab(true)}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Register here
                  </button>
                </p>
              )}

            </motion.div>
          </AnimatePresence>
        </form>

        {/* ── Info footer ── */}
        <div className="px-6 pb-5">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            This invite link is valid for{" "}
            <span className="font-medium text-slate-700 dark:text-slate-300">7 days</span>.
            By joining you'll get access to{" "}
            <span className="font-medium text-slate-700 dark:text-slate-300">{workspace_name}</span>{" "}
            as a <span className="font-medium capitalize">{role}</span>.
          </div>
        </div>

      </motion.div>
    </div>
  );
};

// ─── Error screen ──────────────────────────────────────────────────────────────

const ErrorScreen: React.FC<{ message: string }> = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
    <div className="text-center max-w-sm space-y-3">
      <AlertCircle size={40} className="text-red-400 mx-auto" />
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{message}</p>
      <Link
        to="/login"
        className="inline-block text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        Go to login →
      </Link>
    </div>
  </div>
);

export default InvitePage;