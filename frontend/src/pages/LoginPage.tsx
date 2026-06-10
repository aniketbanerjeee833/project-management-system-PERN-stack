// src/pages/auth/LoginPage.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

import { useAuth } from "../hooks/AuthContext";
import { useAuthQueries } from "../hooks/api/useAuthQueries";
// ─── Zod schema ───────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

// ─── Role → route map ─────────────────────────────────────────────────────────

const ROLE_HOME = {
  admin: "/admin",
  manager: "/manager",
  employee: "/employee",
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth, isAuthenticated, role, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { login } = useAuthQueries();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Already logged in — redirect away from login page
  if (!isLoading && isAuthenticated && role) {
    return <Navigate to={ROLE_HOME[role]} replace />;
  }

  const onSubmit = async (values: LoginForm) => {
    setServerError("");
    try {
      const result = await login.mutateAsync(values);
      console.log(result);
      // Cookie already set by backend — update React state
      setAuth(result.user, result.workspace, result.role);

      if (result.needsWorkspace) {
        navigate("/create-workspace", { replace: true });
        return;
      }

      // Navigate to the role's home
      const home = result.role ? ROLE_HOME[result.role] : "/";
      navigate(home, { replace: true });

    } catch (err: unknown) {
      console.log(err)
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  const inputCls = (hasError: boolean) =>
    `w-full rounded-xl border px-3 py-2.5 text-sm bg-white dark:bg-slate-800 
     text-slate-800 dark:text-slate-200 outline-none transition-colors
     disabled:opacity-50 ${hasError
      ? "border-red-400 dark:border-red-500 focus:border-red-400"
      : "border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">

          {/* Header */}
          <div className="px-7 pt-7 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <LogIn size={16} className="text-white" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Sign in
              </h1>
            </div>
            <p className="text-sm text-slate-400">
              Enter your credentials to access your workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-7 py-6 space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className={inputCls(!!errors.email)}
                disabled={isSubmitting}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Your password"
                  className={`${inputCls(!!errors.password)} pr-10`}
                  disabled={isSubmitting}
                  {...register("password")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Server error */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3.5 py-2.5 text-xs text-red-600 dark:text-red-400"
              >
                {serverError}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {isSubmitting
                ? <><Loader2 size={14} className="animate-spin" /> Signing in…</>
                : "Sign in"
              }
            </button>
          </form>
        </div>

        {/* Footer note */}
        {/* Footer note — replace the existing one */}
        <div className="text-center text-xs text-slate-400 mt-4 space-y-1">
          <p>
            New admin ?{" "}
            <Link
              to="/register"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Create an account for your workspace
            </Link>
          </p>
          <p>Invited by your admin? Check your email for the invite link.</p>
        </div>
        {/* <p className="text-center text-xs text-slate-400 mt-4">
          Don't have an account? Ask your workspace admin to invite you.
        </p> */}
      </motion.div>
    </div>
  );
};

export default LoginPage;