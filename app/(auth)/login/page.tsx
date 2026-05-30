"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Users } from "lucide-react";

import { LoginSchema, type LoginInput } from "@/lib/validations/auth";
import { loginUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await loginUser(data);

      if (response?.error) {
        setServerError(response.error);
        setIsLoading(false);
        return;
      }

      if (response?.success) {
        // Redirect based on user role
        if (response.role === "DOCTOR") {
          router.push("/doctor");
        } else {
          router.push("/patient");
        }
        router.refresh();
      }
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Column - Hero Section (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-[#0a5c5f] text-white p-16 flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-100 via-teal-800 to-teal-950 pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="text-2xl font-bold tracking-wider">
            AGAPAY
          </Link>
          <div className="h-[2px] w-12 bg-teal-400 mt-2" />
        </div>

        <div className="my-auto space-y-8 relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold leading-tight">
            Better care,<br />together.
          </h1>
          <p className="text-teal-50 text-lg leading-relaxed font-light">
            Empowering healthcare providers and patients through a seamless, secure, and compassionate digital experience. Experience the Filipino standard of care—standing side-by-side with you.
          </p>

          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-800/50 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-teal-300" />
              </div>
              <span className="text-teal-100 font-medium">HIPAA & GDPR Compliant Security</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-800/50 rounded-lg">
                <Users className="h-6 w-6 text-teal-300" />
              </div>
              <span className="text-teal-100 font-medium">Join over 10,000+ providers nationwide</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-teal-200">
          © 2026 AGAPAY Telehealth Ecosystem. All rights reserved.
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="md:hidden text-center">
            <Link href="/" className="text-3xl font-bold text-[#0a5c5f] tracking-wide">
              AGAPAY
            </Link>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 font-light">
              Please enter your details to access your account.
            </p>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => alert("Google Sign-In is disabled in this MVP sandbox build. Please register and log in using your email credentials.")}
              variant="outline"
              type="button"
              className="flex items-center justify-center gap-2 border-slate-200 hover:bg-slate-100 text-slate-700 h-11 rounded-lg"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </Button>
            <Button
              onClick={() => alert("Apple ID Sign-In is disabled in this MVP sandbox build. Please register and log in using your email credentials.")}
              variant="outline"
              type="button"
              className="flex items-center justify-center gap-2 border-slate-200 hover:bg-slate-100 text-slate-700 h-11 rounded-lg"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.17.67-2.88 1.5-.62.72-1.16 1.86-1.01 2.97 1.12.09 2.22-.59 2.9-1.41z" />
              </svg>
              <span>Apple ID</span>
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-slate-50 px-4 text-xs uppercase text-slate-400 font-medium">
              or use email
            </span>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {serverError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
                  {serverError}
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="name@email.com"
                          className="pl-10 h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-lg"
                          type="email"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-slate-700 font-medium">Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-semibold text-[#0a5c5f] hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-lg"
                          disabled={isLoading}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 bg-[#0a5c5f] hover:bg-[#084a4c] text-white font-semibold rounded-lg shadow-sm transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-slate-500 font-light">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#0a5c5f] hover:underline"
            >
              Create Account
            </Link>
          </p>

          <div className="text-center text-xs text-slate-400 font-light pt-4 border-t border-slate-100 flex justify-center gap-3">
            <span>© 2026 AGAPAY Telehealth</span>
            <span>•</span>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </div>
    </div>
  );
}