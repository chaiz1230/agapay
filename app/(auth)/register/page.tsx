"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, Users, Stethoscope, FileText, Award, BadgeAlert, Sparkles } from "lucide-react";

import { RegisterSchema, type RegisterInput } from "@/lib/validations/auth";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "PATIENT",
      specialization: "",
      licenseNumber: "",
      experienceYears: 0,
      consultFee: 0,
    },
  });

  const selectedRole = form.watch("role");

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setServerError(null);
    setServerSuccess(null);

    // Clean up Doctor fields if Patient role is selected
    if (data.role === "PATIENT") {
      delete data.specialization;
      delete data.licenseNumber;
      delete data.experienceYears;
      delete data.consultFee;
    }

    try {
      const response = await registerUser(data);

      if (response?.error) {
        setServerError(response.error);
        setIsLoading(false);
        return;
      }

      if (response?.success) {
        setServerSuccess(response.success);
        // Automatically redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 1500);
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
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-100 via-teal-800 to-teal-950 pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="text-2xl font-bold tracking-wider">
            AGAPAY
          </Link>
          <div className="h-[2px] w-12 bg-teal-400 mt-2" />
        </div>

        <div className="my-auto space-y-8 relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold leading-tight">
            Start your healthcare journey.
          </h1>
          <p className="text-teal-50 text-lg leading-relaxed font-light font-sans">
            Create an account to join the premier digital health platform in the Philippines. Consult with specialized doctors and access your medical records in one secure hub.
          </p>

          <div className="space-y-4 pt-4">
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

      {/* Right Column - Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 overflow-y-auto max-h-screen">
        <div className="w-full max-w-md space-y-6 py-8">
          <div className="md:hidden text-center">
            <Link href="/" className="text-3xl font-bold text-[#0a5c5f] tracking-wide">
              AGAPAY
            </Link>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h2>
            <p className="text-slate-500 font-light">
              Join Agapay today to access modern, reliable medical services.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium flex items-start gap-2">
                  <BadgeAlert className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              {serverSuccess && (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-700 text-sm font-medium flex items-start gap-2">
                  <Sparkles className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{serverSuccess} Redirecting to login...</span>
                </div>
              )}

              {/* Role Selection Tabs */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-700 font-medium">Select Account Type</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => field.onChange("PATIENT")}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 border rounded-xl gap-2 transition-all text-center",
                            field.value === "PATIENT"
                              ? "border-[#0a5c5f] bg-[#0a5c5f]/5 text-[#0a5c5f] shadow-sm font-semibold"
                              : "border-slate-200 hover:bg-slate-50 text-slate-500"
                          )}
                        >
                          <Users className="h-6 w-6" />
                          <span>Patient</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange("DOCTOR")}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 border rounded-xl gap-2 transition-all text-center",
                            field.value === "DOCTOR"
                              ? "border-[#0a5c5f] bg-[#0a5c5f]/5 text-[#0a5c5f] shadow-sm font-semibold"
                              : "border-slate-200 hover:bg-slate-50 text-slate-500"
                          )}
                        >
                          <Stethoscope className="h-6 w-6" />
                          <span>Doctor</span>
                        </button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Juan dela Cruz"
                          className="pl-10 h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-lg"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
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
                          placeholder="juan@email.com"
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

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Password</FormLabel>
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
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditional Doctor Fields */}
              {selectedRole === "DOCTOR" && (
                <div className="space-y-4 pt-3 border-t border-slate-100 mt-4">
                  <h3 className="text-sm font-semibold text-slate-900">Doctor Professional Credentials</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">Specialization</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Stethoscope className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                              <Input
                                placeholder="e.g. Cardiology"
                                className="pl-10 h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-lg"
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
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">PRC License No.</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                              <Input
                                placeholder="e.g. 1234567"
                                className="pl-10 h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-lg"
                                disabled={isLoading}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="experienceYears"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">Years of Experience</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Award className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                              <Input
                                type="number"
                                placeholder="e.g. 5"
                                className="pl-10 h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-lg"
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
                      name="consultFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">Consultation Fee (₱)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3.5 top-3 text-slate-400 font-medium text-sm">₱</span>
                              <Input
                                type="number"
                                placeholder="e.g. 500"
                                className="pl-8 h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-lg"
                                disabled={isLoading}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-[#0a5c5f] hover:bg-[#084a4c] text-white font-semibold rounded-lg shadow-sm transition-all mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-slate-500 font-light">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#0a5c5f] hover:underline"
            >
              Sign In
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