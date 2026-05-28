import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import PatientRecordsClientPage from "./PatientRecordsClientPage";

export default async function PatientRecordsPage() {
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

  // Fetch medical records from DB
  const dbRecords = await prisma.medicalRecord.findMany({
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
    orderBy: { createdAt: "desc" }
  });

  // Fetch completed appointments to retrieve prescription
  const completedAppointments = await prisma.appointment.findMany({
    where: { 
      patientId: patient.id,
      status: "COMPLETED"
    },
    select: {
      dateTime: true,
      prescription: true,
      doctorId: true
    }
  });

  // Map to plain objects (to avoid Decimal boundary leaks) and link prescriptions
  const plainRecords = dbRecords.map((r) => {
    const matchingAppt = completedAppointments.find((appt) => {
      const isSameDoctor = appt.doctorId === r.doctorId;
      const timeDiff = Math.abs(new Date(appt.dateTime).getTime() - new Date(r.createdAt).getTime());
      const isCloseInTime = timeDiff < 24 * 60 * 60 * 1000;
      return isSameDoctor && isCloseInTime;
    });

    return {
      id: r.id,
      diagnosis: r.diagnosis,
      treatment: r.treatment,
      notes: r.notes || "",
      prescription: matchingAppt?.prescription || "",
      createdAt: r.createdAt.toISOString(),
      doctor: {
        id: r.doctor.id,
        specialization: r.doctor.specialization,
        user: {
          name: r.doctor.user.name
        }
      }
    };
  });

  return <PatientRecordsClientPage initialRecords={plainRecords} patientId={patient.id} />;
}
