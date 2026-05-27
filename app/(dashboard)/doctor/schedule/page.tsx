import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import ScheduleClientPage from "./ScheduleClientPage";

export default async function DoctorSchedulePage() {
  const session = await auth();

  if (!session || session.user.role !== "DOCTOR") {
    redirect("/login");
  }

  // Fetch doctor details
  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id },
    include: { user: true }
  });

  if (!doctor) {
    redirect("/login");
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
