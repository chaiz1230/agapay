import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import DoctorProfileClientPage from "./DoctorProfileClientPage";

export default async function DoctorProfilePage() {
  const session = await auth();

  if (!session || session.user.role !== "DOCTOR") {
    redirect("/login");
  }

  // Fetch doctor profile
  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  });

  if (!doctor) {
    redirect("/api/auth/clear-stale-session");
  }

  // Fetch completed appointments for metrics
  const completedAppointments = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
      status: "COMPLETED"
    },
    select: {
      cost: true
    }
  });

  const computedConsultations = completedAppointments.length;
  const computedRevenue = completedAppointments.reduce((acc, appt) => acc + Number(appt.cost), 0);

  // Map to plain object
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

  return (
    <DoctorProfileClientPage 
      doctor={plainDoctor}
      computedRevenue={computedRevenue}
      computedConsultations={computedConsultations}
    />
  );
}
