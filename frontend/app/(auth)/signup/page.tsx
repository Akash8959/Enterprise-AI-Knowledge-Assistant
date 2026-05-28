"use client";

import { useState } from "react";

import AuthLayout from "@/layouts/AuthLayout";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { signupSchema } from "@/lib/validations/auth";

import { z } from "zod";

import Input from "@/components/ui/Input";

import api from "@/services/api";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setLoading(true);

      await api.post(
        "/auth/signup",
        data
      );

      toast.success(
        "Account created successfully"
      );

      router.push("/login");

    } catch (error) {

      toast.error(
        "Signup failed"
      );

      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      subtitle="Create your enterprise account"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        <div>
          <label className="block text-sm mb-2 text-foreground/70">
            Full Name
          </label>

          <Input
            type="text"
            placeholder="John Doe"
            {...register("full_name")}
          />

          {errors.full_name && (
            <p className="text-sm text-red-500 mt-1">
              {errors.full_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2 text-foreground/70">
            Email
          </label>

          <Input
            type="email"
            placeholder="you@company.com"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm text-red-500 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2 text-foreground/70">
            Password
          </label>

          <Input
            type="password"
            placeholder="Create password"
            {...register("password")}
          />

          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3 font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>

      </form>

      <div className="text-center mt-6 text-sm">

        <a
          href="/login"
          className="text-indigo-400 hover:text-indigo-300"
        >
          Already have an account? Sign In
        </a>

      </div>
    </AuthLayout>
  );
}