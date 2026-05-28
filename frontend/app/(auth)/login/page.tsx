"use client";

import { useState } from "react";

import AuthLayout from "@/layouts/AuthLayout";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "@/lib/validations/auth";

import { z } from "zod";

import Input from "@/components/ui/Input";

import api from "@/services/api";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);

      const formData = new URLSearchParams();

      formData.append("username", data.email);

      formData.append("password", data.password);

      const response = await api.post(
        "/auth/login",
        formData,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

      login(response.data.access_token, {
        email: data.email,
        full_name: "User",
      });

      toast.success("Login successful");

      router.push("/dashboard");

    } catch (error) {

      toast.error("Invalid credentials");

      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      subtitle="Sign in to your enterprise workspace"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

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
            placeholder="Enter password"
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
          {loading ? "Signing In..." : "Sign In"}
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