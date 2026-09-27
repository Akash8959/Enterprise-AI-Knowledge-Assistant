"use client";

import AuthLayout from "@/layouts/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import toast from "react-hot-toast";
import { FormEvent } from "react";

export default function ForgotPasswordPage() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success("Password reset link sent to your email!");
  };

  return (
    <AuthLayout subtitle="Reset your account password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-foreground/70 mb-1">
            Email Address
          </label>
          <Input type="email" placeholder="you@company.com" required />
        </div>

        <Button type="submit" className="mt-2">
          Send Reset Link
        </Button>
      </form>

      <div className="text-center mt-6 text-xs font-medium">
        <Link
          href="/login"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
}