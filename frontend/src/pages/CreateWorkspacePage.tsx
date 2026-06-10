import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Building2, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/AuthContext";
import { useAuthQueries } from "../hooks/api/useAuthQueries";


// ── Schema ────────────────────────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "URL must be at least 2 characters")
    .max(80, "URL too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Only lowercase letters, numbers, and hyphens"),
});
type FormValues = z.infer<typeof schema>;

// ── Slug helper — auto-generate from name ─────────────────────────────────────
const toSlug = (val: string) =>
  val.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

// ── Component ─────────────────────────────────────────────────────────────────
const CreateWorkspacePage: React.FC = () => {
  const { workspace,user, refetch } = useAuth();
  console.log(user,"create-worksapce")
   const navigate                   = useNavigate();
  useEffect(() => {
    if (workspace) {
      navigate(`/${workspace.slug}/admin`, { replace: true });
    }
  }, [navigate]);

  // still loading session — don't flash the form
  // if (isLoading) return (
  //   <div className="min-h-screen flex items-center justify-center">
  //     <Loader2 size={28} className="animate-spin text-indigo-500" />
  //   </div>
  // );
 

  const { createWorkspace }        = useAuthQueries();
  const [serverError, setServerError] = useState("");
  console.log(user)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const slugValue = watch("slug", "");

  const onSubmit = async (values: FormValues) => {
    setServerError("");
    try {
      const workspace = await createWorkspace.mutateAsync(values);

      // Update context — user is now an admin with a workspace
      // role is always "admin" at this point
      await refetch();
      // setAuth(
      //   user!,
      //   { id: workspace.id, name: workspace.name, slug: workspace.slug },
      //   "admin"
      // );

      navigate(`/${workspace.slug}/admin`, { replace: true });

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
                <Building2 size={16} className="text-white" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Set up your workspace
              </h1>
            </div>
            <p className="text-sm text-slate-400">
              This is your team's shared space. You can change this later.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-7 py-6 space-y-4">

            {/* Workspace name */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Workspace name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
                placeholder="Acme Corp"
                disabled={isSubmitting}
                className={inputCls(!!errors.name)}
                onChange={e => {
                  setValue("name", e.target.value);
                  // auto-fill slug from name
                  setValue("slug", toSlug(e.target.value), { shouldValidate: true });
                }}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Workspace URL <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-0 rounded-xl border border-slate-200 dark:border-slate-700 focus-within:border-indigo-400 overflow-hidden">
                <span className="px-3 py-2.5 text-sm text-slate-400 bg-slate-50 dark:bg-slate-800/80 border-r border-slate-200 dark:border-slate-700 whitespace-nowrap">
                  app.pms.io/
                </span>
                <input
                  {...register("slug")}
                  placeholder="acme-corp"
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>
              {slugValue && !errors.slug && (
                <p className="mt-1 text-xs text-slate-400">
                  Your URL: <span className="font-medium text-slate-600 dark:text-slate-300">app.pms.io/{slugValue}</span>
                </p>
              )}
              {errors.slug && (
                <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>
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
                ? <><Loader2 size={14} className="animate-spin" /> Creating workspace…</>
                : "Create workspace"
              }
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateWorkspacePage;