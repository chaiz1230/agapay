import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import PatientDashboardClient from "./PatientDashboardClient";

export default async function PatientDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const firstName = session.user.name ? session.user.name.split(" ")[0] : "Patient";

  // Fetch patient profile
  const patient = await prisma.patient.findUnique({
    where: { userId: session.user.id }
  });

  // Fetch upcoming appointments
  const dbAppointments = patient ? await prisma.appointment.findMany({
    where: {
      patientId: patient.id,
      status: { in: ["PENDING", "CONFIRMED"] }
    },
    include: {
      doctor: {
        include: {
          user: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: { dateTime: "asc" }
  }) : [];

  // Fetch completed consultations for past history
  const dbRecords = patient ? await prisma.medicalRecord.findMany({
    where: { patientId: patient.id },
    include: {
      doctor: {
        include: {
          user: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 5
  }) : [];

  // Format to plain objects to avoid Decimal or Date leaks
  const plainAppointments = dbAppointments.map((appt) => ({
    id: appt.id,
    dateTime: appt.dateTime.toISOString(),
    status: appt.status,
    notes: appt.notes || "",
    cost: Number(appt.cost),
    doctor: {
      id: appt.doctor.id,
      specialization: appt.doctor.specialization,
      user: {
        name: appt.doctor.user.name
      }
    }
  }));

  const plainRecords = dbRecords.map((rec) => ({
    id: rec.id,
    diagnosis: rec.diagnosis,
    treatment: rec.treatment,
    notes: rec.notes || "",
    createdAt: rec.createdAt.toISOString(),
    doctor: {
      id: rec.doctor.id,
      specialization: rec.doctor.specialization,
      user: {
        name: rec.doctor.user.name
      }
    }
  }));

  return (
    <PatientDashboardClient 
      firstName={firstName}
      appointments={plainAppointments}
      records={plainRecords}
    />
  );
}