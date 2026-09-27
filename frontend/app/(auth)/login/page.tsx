"use client";

import { useState, useEffect } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations/auth";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && token) {
      router.replace("/dashboard");
    }
  }, [token, isLoading, router]);

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

      const response = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const token = response.data.access_token;
      const returnedUser = response.data.user || {
        email: data.email,
        full_name: "User",
      };

      login(token, returnedUser);
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Invalid credentials");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Sign in to your enterprise workspace">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-foreground/70 mb-1">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="you@company.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-rose-500 font-medium mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground/70 mb-1">
            Password
          </label>
          <Input
            type="password"
            placeholder="Enter password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-rose-500 font-medium mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="flex items-center justify-between mt-6 text-xs font-medium">
        <Link
          href="/forgot-password"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Forgot Password?
        </Link>

        <Link
          href="/signup"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Create Account
        </Link>
      </div>
    </AuthLayout>
  );
}