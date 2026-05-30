import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import ScheduleClientPage from "./ScheduleClientPage";
import { getDoctorOrProvision } from "@/lib/doctor";

export default async function DoctorSchedulePage() {
  const session = await auth();

  if (!session || session.user.role !== "DOCTOR") {
    redirect("/login");
  }

  // Fetch doctor details
  const doctor = await getDoctorOrProvision(session.user.id, session.user.email);

  if (!doctor) {
    redirect("/api/auth/clear-stale-session");
  }

  const plainDoctor = {
    id: doctor.id,
    userId: doctor.userId,
    specialization: doctor.specialization,
    licenseNumber: doctor.licenseNumber,
    bio: doctor.bio || "",
    experienceYears: doctor.experienceYears,
    consultFee: Number(doctor.consultFee),
    user: doctor.user ? {
      name: doctor.user.name,
      email: doctor.user.email
    } : null
  };

  return <ScheduleClientPage doctor={plainDoctor} />;
}
