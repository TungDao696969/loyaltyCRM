"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import axiosInstance from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/auth/login", data);

      const { user, token, refreshToken } = res.data;
      setAuth(user, token, refreshToken);

      toast.success("Login successful!");
      router.push("/");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900 selection:bg-indigo-500/30">
      {/* Left side - Branding / Decor (Hidden on smaller screens) */}
      <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-indigo-50 lg:flex">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f115_1px,transparent_1px),linear-gradient(to_bottom,#6366f115_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />

        {/* Abstract glowing shapes */}
        <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/20 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center p-12 text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl shadow-indigo-500/30">
            <Command className="h-12 w-12 text-white" />
          </div>
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-slate-900">
            Hoa Mai <span className="text-indigo-600">Mart</span>
          </h1>
          <p className="mx-auto max-w-md text-lg text-slate-600">
            The all-in-one centralized platform to manage your stores, reward
            your customers, and grow your business.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full items-center justify-center lg:w-1/2 p-8">
        <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 sm:p-10">
          <div className="mb-8 space-y-2 text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500">
              Enter your credentials to access your workspace
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-semibold text-slate-700"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 px-4 text-base shadow-sm transition-colors placeholder:text-slate-400 hover:border-indigo-300 focus-visible:border-indigo-500 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-indigo-500"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </Label>
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 px-4 text-base shadow-sm transition-colors placeholder:text-slate-400 hover:border-indigo-300 focus-visible:border-indigo-500 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-indigo-500"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Authenticating...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <a
              href="#"
              className="font-semibold text-indigo-600 hover:underline underline-offset-4"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
