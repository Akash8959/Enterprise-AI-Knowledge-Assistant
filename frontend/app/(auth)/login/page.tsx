import AuthLayout from "@/layouts/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Login"
      subtitle="Sign in to your enterprise workspace"
    >
      <form className="space-y-5">

        <div>
          <label className="block text-sm mb-2 text-foreground/70">
            Email
          </label>

          <input
            type="email"
            placeholder="you@company.com"
            className="w-full rounded-xl border border-[var(--border)] bg-background px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-foreground/70">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            className="w-full rounded-xl border border-[var(--border)] bg-background px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3 font-semibold hover:opacity-90 transition"
        >
          Sign In
        </button>

      </form>

      <div className="flex justify-between mt-6 text-sm">

        <a
          href="/forgot-password"
          className="text-indigo-400 hover:text-indigo-300"
        >
          Forgot Password?
        </a>

        <a
          href="/signup"
          className="text-indigo-400 hover:text-indigo-300"
        >
          Create Account
        </a>

      </div>
    </AuthLayout>
  );
}