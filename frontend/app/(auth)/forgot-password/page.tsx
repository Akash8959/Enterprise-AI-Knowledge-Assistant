import AuthLayout from "@/layouts/AuthLayout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      subtitle="Reset your account password"
    >
      <form className="space-y-5">

        <div>
          <label className="block text-sm mb-2 text-foreground/70">
            Email Address
          </label>

          <input
            type="email"
            placeholder="you@company.com"
            className="w-full rounded-xl border border-[var(--border)] bg-background px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3 font-semibold hover:opacity-90 transition"
        >
          Send Reset Link
        </button>

      </form>

      <div className="text-center mt-6 text-sm">

        <a
          href="/login"
          className="text-indigo-400 hover:text-indigo-300"
        >
          Back to Login
        </a>

      </div>
    </AuthLayout>
  );
}