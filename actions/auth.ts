"use server";

import { prisma } from "@/lib/db";
import { RegisterSchema, LoginSchema, type RegisterInput, type LoginInput } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function registerUser(values: RegisterInput) {
  const validated = RegisterSchema.safeParse(values);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || "Invalid fields" };
  }

  const { name, email, password, role, specialization, licenseNumber, experienceYears, consultFee } = validated.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email already in use." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
        },
      });

      if (role === "PATIENT") {
        await tx.patient.create({
          data: {
            userId: user.id,
          },
        });
      } else if (role === "DOCTOR") {
        if (!specialization || !licenseNumber || experienceYears === undefined || consultFee === undefined) {
          throw new Error("Missing doctor details");
        }

        const existingLicense = await tx.doctor.findUnique({
          where: { licenseNumber },
        });

        if (existingLicense) {
          throw new Error("License number already registered.");
        }

        await tx.doctor.create({
          data: {
            userId: user.id,
            specialization,
            licenseNumber,
            experienceYears,
            consultFee,
          },
        });
      }
    });

    return { success: "Account created successfully!" };
  } catch (error: any) {
    return { error: error.message || "Failed to create account." };
  }
}

export async function loginUser(values: LoginInput) {
  const validated = LoginSchema.safeParse(values);
  if (!validated.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validated.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    });

    return { success: true, role: user?.role };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong." };
      }
    }
    return { error: "An unexpected error occurred." };
  }
}
