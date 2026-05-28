import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import PatientProfileClientPage from "./PatientProfileClientPage";

export default async function PatientProfilePage() {
  const session = await auth();

  if (!session || session.user.role !== "PATIENT") {
    redirect("/login");
  }

  // Fetch patient profile
  let patient = await prisma.patient.findUnique({
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

  if (!patient) {
    patient = await prisma.patient.create({
      data: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });
  }

  // Map to plain object
  const plainPatient = {
    id: patient.id,
    userId: patient.userId,
    dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.toISOString() : null,
    gender: patient.gender || "",
    bloodType: patient.bloodType || "",
    phone: patient.phone || "",
    address: patient.address || "",
    user: patient.user ? {
      name: patient.user.name,
      email: patient.user.email
    } : null
  };

  return <PatientProfileClientPage patient={plainPatient} />;
}
