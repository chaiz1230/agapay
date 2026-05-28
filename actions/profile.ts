"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function updatePatientProfile(data: {
  name: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  phone?: string;
  address?: string;
}) {
  const session = await auth();
  if (!session || session.user.role !== "PATIENT") {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Update User name
      await tx.user.update({
        where: { id: session.user.id },
        data: { name: data.name }
      });

      // Update Patient profile
      await tx.patient.update({
        where: { userId: session.user.id },
        data: {
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          gender: data.gender || null,
          bloodType: data.bloodType || null,
          phone: data.phone || null,
          address: data.address || null,
        }
      });
    });

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update profile" };
  }
}

export async function updateDoctorProfileDetails(data: {
  name: string;
  specialization: string;
  experienceYears: number;
  bio?: string;
  consultFee: number;
}) {
  const session = await auth();
  if (!session || session.user.role !== "DOCTOR") {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Update User name
      await tx.user.update({
        where: { id: session.user.id },
        data: { name: data.name }
      });

      // Update Doctor profile
      await tx.doctor.update({
        where: { userId: session.user.id },
        data: {
          specialization: data.specialization,
          experienceYears: Number(data.experienceYears),
          bio: data.bio || null,
          consultFee: Number(data.consultFee),
        }
      });
    });

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update profile" };
  }
}
