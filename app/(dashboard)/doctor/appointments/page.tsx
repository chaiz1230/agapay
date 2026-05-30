import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import DoctorAppointmentsClientPage from "./DoctorAppointmentsClientPage";
import { getDoctorOrProvision } from "@/lib/doctor";

export default async function DoctorAppointmentsPage() {
  const session = await auth();

  if (!session || session.user.role !== "DOCTOR") {
    redirect("/login");
  }

  // Fetch doctor profile
  const doctor = await getDoctorOrProvision(session.user.id, session.user.email);

  if (!doctor) {
    redirect("/api/auth/clear-stale-session");
  }

  // Fetch all appointments for this doctor
  const appointments = await prisma.appointment.findMany({
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
    orderBy: { dateTime: "desc" }
  });

  // Map to plain objects
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
    patient: appt.patient ? {
      id: appt.patient.id,
      bloodType: appt.patient.bloodType || "O+",
      gender: appt.patient.gender || "Male",
      dateOfBirth: appt.patient.dateOfBirth ? appt.patient.dateOfBirth.toISOString() : null,
      user: appt.patient.user ? {
        name: appt.patient.user.name,
        email: appt.patient.user.email
      } : null
    } : null
  }));

  return <DoctorAppointmentsClientPage appointments={plainAppointments} doctorId={doctor.id} />;
}
