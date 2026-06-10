import React, {  useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { useAuth } from "../hooks/AuthContext";
import { useAuthQueries } from "../hooks/api/useAuthQueries";


// ── Schema ────────────────────────────────────────────────────────────────────
const schema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type FormValues = z.infer<typeof schema>;

// ── Component ─────────────────────────────────────────────────────────────────
const RegisterPage: React.FC = () => {
  const navigate               = useNavigate();
  const { setAuth} = useAuth();
  const { register: registerUser } = useAuthQueries();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError,  setServerError]  = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // redirect if already has session
//   useEffect(() => {
//     if (isLoading || !isAuthenticated) return;
//     if (needsWorkspace) navigate("/create-workspace", { replace: true });
//     else                navigate("/",                 { replace: true });
//   }, [isAuthenticated, needsWorkspace, isLoading, navigate]);

  const onSubmit = async (values: FormValues) => {
    setServerError("");
    try {
      const result = await registerUser.mutateAsync(values);

      // session cookie set by backend automatically
      // setAuth with NO workspace — triggers needsWorkspace=true
      setAuth(result.user);
        navigate("/create-workspace", { replace: true });

      // useEffect above will fire and navigate to /create-workspace
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  };

  const inputCls = (hasError: boolean) =>
    [
      "w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors",
      "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      hasError
        ? "border-red-400 focus:border-red-400"
        : "border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500",
    ].join(" ");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">

          {/* Header */}
          <div className="px-7 pt-7 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <UserPlus size={16} className="text-white" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Create your account
              </h1>
            </div>
            <p className="text-sm text-slate-400">
              You'll set up your workspace in the next step.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-7 py-6 space-y-4">

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
                placeholder="Rahul Kumar"
                autoComplete="name"
                disabled={isSubmitting}
                className={inputCls(!!errors.name)}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="rahul@company.com"
                autoComplete="email"
                disabled={isSubmitting}
                className={inputCls(!!errors.email)}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  className={`${inputCls(!!errors.password)} pr-10`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 mt-2"
            >
              {isSubmitting
                ? <><Loader2 size={14} className="animate-spin" /> Creating account…</>
                : "Create account"
              }
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;