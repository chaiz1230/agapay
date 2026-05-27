import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import DoctorConsultationRoomClient from "./DoctorConsultationRoomClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DoctorConsultationPage({ params }: PageProps) {
  const session = await auth();

  if (!session || session.user.role !== "DOCTOR") {
    redirect("/login");
  }

  const resolvedParams = await params;
  const appointmentId = resolvedParams.id;

  let appointmentData: any = null;

  if (appointmentId.startsWith("mock-")) {
    appointmentData = {
      id: appointmentId,
      dateTime: new Date().toISOString(),
      cost: 500,
      notes: "Patient reports feeling mild chest discomfort and fatigue during physical activity.",
      patient: {
        id: "mock-patient-id",
        bloodType: "O+",
        gender: "Male",
        dateOfBirth: "1992-04-12T00:00:00.000Z",
        user: {
          name: "Mateo Sebastian"
        }
      }
    };
  } else {
    appointmentData = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!appointmentData) {
      redirect("/doctor");
    }
  }

  const plainAppointment = {
    id: appointmentData.id,
    dateTime: appointmentData.dateTime instanceof Date ? appointmentData.dateTime.toISOString() : appointmentData.dateTime,
    cost: Number(appointmentData.cost),
    notes: appointmentData.notes || "",
    patient: appointmentData.patient ? {
      id: appointmentData.patient.id,
      bloodType: appointmentData.patient.bloodType || "O+",
      gender: appointmentData.patient.gender || "Male",
      dateOfBirth: appointmentData.patient.dateOfBirth instanceof Date ? appointmentData.patient.dateOfBirth.toISOString() : appointmentData.patient.dateOfBirth,
      user: appointmentData.patient.user ? {
        name: appointmentData.patient.user.name
      } : null
    } : null
  };

  return (
    <DoctorConsultationRoomClient 
      appointment={plainAppointment} 
    />
  );
}
