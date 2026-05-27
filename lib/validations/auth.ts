import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["PATIENT", "DOCTOR"]),
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  experienceYears: z.coerce.number().min(0, "Experience must be a positive number").optional(),
  consultFee: z.coerce.number().min(0, "Consultation fee must be a positive number").optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
