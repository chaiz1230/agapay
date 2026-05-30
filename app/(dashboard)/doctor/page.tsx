import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import DoctorDashboardClient from "./DoctorDashboardClient";
import { getDoctorOrProvision } from "@/lib/doctor";

export default async function DoctorDashboard() {
  const session = await auth();

  if (!session || session.user.role !== "DOCTOR") {
    redirect("/login");
  }

  // Fetch doctor details
  const doctor = await getDoctorOrProvision(session.user.id, session.user.email);

  if (!doctor) {
    redirect("/api/auth/clear-stale-session");
  }

  // Fetch today's queue (CONFIRMED or COMPLETED appointments)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const queueAppointments = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
      dateTime: {
        gte: todayStart,
        lte: todayEnd,
      },
      status: {
        in: ["CONFIRMED", "COMPLETED"],
      }
    },
    include: {
      patient: {
        include: {
          user: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: {
      dateTime: "asc"
    }
  });

  // Fetch pending approvals
  const pendingAppointments = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
      status: "PENDING"
    },
    include: {
      patient: {
        include: {
          user: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: {
      dateTime: "asc"
    }
  });

  // Map to plain objects to prevent Decimal and Date serialization boundary errors
  const plainDoctor = {
    id: doctor.id,
    userId: doctor.userId,
    specialization: doctor.specialization,
    licenseNumber: doctor.licenseNumber,
    bio: doctor.bio || "",
    experienceYears: doctor.experienceYears,
    consultFee: Number(doctor.consultFee),
    user: {
      name: doctor.user.name,
      email: doctor.user.email,
    }
  };

  const plainQueue = queueAppointments.map((appt) => ({
    id: appt.id,
    patientId: appt.patientId,
    doctorId: appt.doctorId,
    dateTime: appt.dateTime.toISOString(),
    status: appt.status,
    notes: appt.notes || "",
    prescription: appt.prescription || "",
    cost: Number(appt.cost),
    createdAt: appt.createdAt.toISOString(),
    patient: appt.patient ? {
      id: appt.patient.id,
      bloodType: appt.patient.bloodType || "O+",
      gender: appt.patient.gender || "Male",
      dateOfBirth: appt.patient.dateOfBirth ? appt.patient.dateOfBirth.toISOString() : null,
      user: appt.patient.user ? {
        name: appt.patient.user.name
      } : null
    } : null
  }));

  const plainPending = pendingAppointments.map((appt) => ({
    id: appt.id,
    patientId: appt.patientId,
    doctorId: appt.doctorId,
    dateTime: appt.dateTime.toISOString(),
    status: appt.status,
    notes: appt.notes || "",
    prescription: appt.prescription || "",
    cost: Number(appt.cost),
    createdAt: appt.createdAt.toISOString(),
    patient: appt.patient ? {
      id: appt.patient.id,
      bloodType: appt.patient.bloodType || "O+",
      gender: appt.patient.gender || "Male",
      dateOfBirth: appt.patient.dateOfBirth ? appt.patient.dateOfBirth.toISOString() : null,
      user: appt.patient.user ? {
        name: appt.patient.user.name
      } : null
    } : null
  }));

  return (
    <DoctorDashboardClient 
      doctor={plainDoctor}
      queueAppointments={plainQueue}
      pendingAppointments={plainPending}
    />
  );
}