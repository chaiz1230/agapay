import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import PatientAppointmentsClientPage from "./PatientAppointmentsClientPage";

export default async function PatientAppointmentsPage() {
  const session = await auth();

  if (!session || session.user.role !== "PATIENT") {
    redirect("/login");
  }

  // Verify user exists in DB first to handle stale/wiped sessions gracefully
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!dbUser) {
    redirect("/api/auth/clear-stale-session");
  }

  // Fetch patient profile (automatically create on-the-fly if missing to ensure navigability)
  let patient = await prisma.patient.findUnique({
    where: { userId: session.user.id }
  });

  if (!patient) {
    patient = await prisma.patient.create({
      data: { userId: session.user.id }
    });
  }

  // Fetch all appointments for this patient
  const appointments = await prisma.appointment.findMany({
    where: { patientId: patient.id },
    include: {
      doctor: {
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    },
    orderBy: { dateTime: "desc" }
  });

  // Map to plain objects (to avoid Decimal or Date leaks)
  const plainAppointments = appointments.map((appt) => ({
    id: appt.id,
    patientId: appt.patientId,
    doctorId: appt.doctorId,
    dateTime: appt.dateTime.toISOString(),
    status: appt.status,
    notes: appt.notes || "",
    prescription: appt.prescription || "",
    cost: Number(appt.cost),
    createdAt: appt.createdAt.toISOString(),
    doctor: {
      id: appt.doctor.id,
      specialization: appt.doctor.specialization,
      consultFee: Number(appt.doctor.consultFee),
      licenseNumber: appt.doctor.licenseNumber,
      user: {
        name: appt.doctor.user.name,
        email: appt.doctor.user.email
      }
    }
  }));

  return <PatientAppointmentsClientPage appointments={plainAppointments} patientId={patient.id} />;
}
