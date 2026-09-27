"use client";

import { useState } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validations/auth";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      await api.post("/auth/signup", data);
      toast.success("Account created successfully! Please sign in.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Signup failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Create your enterprise account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-foreground/70 mb-1">
            Full Name
          </label>
          <Input type="text" placeholder="John Doe" {...register("full_name")} />
          {errors.full_name && (
            <p className="text-xs text-rose-500 font-medium mt-1">
              {errors.full_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground/70 mb-1">
            Email Address
          </label>
          <Input type="email" placeholder="you@company.com" {...register("email")} />
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
            placeholder="Create password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-rose-500 font-medium mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="text-center mt-6 text-xs font-medium">
        <Link
          href="/login"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Already have an account? Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}