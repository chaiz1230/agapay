import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import DoctorRecordsClientPage from "./DoctorRecordsClientPage";

export default async function DoctorRecordsPage() {
  const session = await auth();

  if (!session || session.user.role !== "DOCTOR") {
    redirect("/login");
  }

  // Fetch doctor profile
  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id }
  });

  if (!doctor) {
    redirect("/api/auth/clear-stale-session");
  }

  // Fetch all medical records logged by this doctor
  const records = await prisma.medicalRecord.findMany({
    where: { doctorId: doctor.id },
    include: {
      patient: {
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
    orderBy: { createdAt: "desc" }
  });

  // Fetch completed appointments to retrieve prescription
  const completedAppointments = await prisma.appointment.findMany({
    where: { 
      doctorId: doctor.id,
      status: "COMPLETED"
    },
    select: {
      dateTime: true,
      prescription: true,
      patientId: true
    }
  });

  // Map to plain objects and link prescriptions
  const plainRecords = records.map((r) => {
    const matchingAppt = completedAppointments.find((appt) => {
      const isSamePatient = appt.patientId === r.patientId;
      const timeDiff = Math.abs(new Date(appt.dateTime).getTime() - new Date(r.createdAt).getTime());
      const isCloseInTime = timeDiff < 24 * 60 * 60 * 1000;
      return isSamePatient && isCloseInTime;
    });

    return {
      id: r.id,
      patientId: r.patientId,
      doctorId: r.doctorId,
      diagnosis: r.diagnosis,
      treatment: r.treatment,
      notes: r.notes || "",
      prescription: matchingAppt?.prescription || "",
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      patient: r.patient ? {
        id: r.patient.id,
        bloodType: r.patient.bloodType || "O+",
        gender: r.patient.gender || "Male",
        dateOfBirth: r.patient.dateOfBirth ? r.patient.dateOfBirth.toISOString() : null,
        user: r.patient.user ? {
          name: r.patient.user.name,
          email: r.patient.user.email
        } : null
      } : null
    };
  });

  return <DoctorRecordsClientPage records={plainRecords} doctorId={doctor.id} />;
}
